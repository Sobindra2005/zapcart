import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError, PrismaClientRustPanicError } from "@prisma/client/runtime/client"

import AppError from '@/utils/AppError';
import config from '@/config/env';

/**
 * MongoDB Cast Error interface
 */
interface MongoError {
  path: string;
  value: string;
  code?: number;
  errmsg?: string;
  name?: string;
  errors?: Record<string, { message: string }>;
}

/**
 * Handles CastError from MongoDB (invalid ObjectId format)
 */
const handleCastError = (err: MongoError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field errors from MongoDB
 */
const handleDuplicateFieldsError = (err: MongoError): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors from MongoDB/Mongoose
 */
const handleValidationError = (err: MongoError): AppError => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles Prisma unique constraint violation (P2002)
 */
const handlePrismaUniqueConstraintError = (err: PrismaClientKnownRequestError): AppError => {
  const target = err.meta?.target as string[] | undefined;
  const fields = target?.join(', ') || 'field';
  const message = `Duplicate value for ${fields}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handles Prisma record not found error (P2025)
 */
const handlePrismaNotFoundError = (): AppError => {
  const message = 'Record not found or operation failed';
  return new AppError(message, 404);
};

/**
 * Handles Prisma foreign key constraint error (P2003)
 */
const handlePrismaForeignKeyError = (err: PrismaClientKnownRequestError): AppError => {
  const field = err.meta?.field_name as string | undefined;
  const message = `Invalid reference: ${field || 'foreign key constraint failed'}`;
  return new AppError(message, 400);
};

/**
 * Handles Prisma validation errors (P2000, P2001, etc.)
 */
const handlePrismaValidationError = (err: PrismaClientKnownRequestError): AppError => {
  const message = err.message || 'Validation failed';
  return new AppError(message, 400);
};

/**
 * Handles Prisma connection errors
 */
const handlePrismaConnectionError = (): AppError => {
  const message = 'Database connection failed. Please try again later.';
  return new AppError(message, 503);
};

/**
 * Handles all Prisma errors based on error code
 */
const handlePrismaError = (err: unknown): AppError => {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return handlePrismaUniqueConstraintError(err);
      case 'P2025': // Record not found
        return handlePrismaNotFoundError();
      case 'P2003': // Foreign key constraint failed
        return handlePrismaForeignKeyError(err);
      case 'P2000': // Value too long
      case 'P2001': // Record not found
      case 'P2011': // Null constraint violation
      case 'P2012': // Missing required value
      case 'P2013': // Missing required argument
      case 'P2014': // Relation violation
        return handlePrismaValidationError(err);
      default:
        return new AppError(err.message, 400);
    }
  }

  if (err instanceof PrismaClientValidationError) {
    return new AppError('Invalid data provided', 400);
  }

  if (err instanceof PrismaClientInitializationError ||
    err instanceof PrismaClientRustPanicError) {
    return handlePrismaConnectionError();
  }

  // Generic Prisma error
  return new AppError('Database operation failed', 500);
};

/**
 * Sends error response in development mode with full details
 */
const sendErrorDev = (err: AppError, res: Response): void => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    statusCode,
    stack: err.stack,
    error: err,
  });
};

/**
 * Sends error response in production mode with limited details
 * Only operational errors show their message to the user
 * Programming errors show a generic message
 */
const sendErrorProd = (err: AppError, res: Response): void => {
  const statusCode = err.statusCode || 500;

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(statusCode).json({
      status: err.status || 'error',
      message: err.message,
    });
  }
  // Programming or unknown error: don't leak error details
  else {
    // Log error for debugging
    console.error('❌ ERROR:', err);

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};

/**
 * Global error handling middleware
 * Must be registered last in the middleware chain
 * Differentiates between operational and programming errors
 * Provides different responses for development and production
 */
const errorHandler = (
  err: Error & Partial<AppError> & Partial<MongoError>,
  _req: Request,
  res: Response,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const error = {
    ...err,
    statusCode: (err as AppError).statusCode || 500,
    status: (err as AppError).status || 'error',
    isOperational: (err as AppError).isOperational
  } as Error & AppError & MongoError;

  // Log all errors in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error occurred:');
    console.error('Message:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Stack:', error.stack);
  } else {
    // In production, only log programming errors
    if (!error.isOperational) {
      console.error('❌ PROGRAMMING ERROR:', error);
    }
  }

  // Handle errors based on environment
  if (config.nodeEnv === 'development') {
    sendErrorDev(error as AppError, res);
  } else {
    let processedError: AppError | (Error & AppError & MongoError) = { ...error };
    processedError.message = error.message;

    // Handle MongoDB/Mongoose errors
    if (error.name === 'CastError') processedError = handleCastError(processedError as MongoError);
    if (error.code === 11000) processedError = handleDuplicateFieldsError(processedError as MongoError);
    if (error.name === 'ValidationError') processedError = handleValidationError(processedError as MongoError);

    // Handle Prisma errors
    if (err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientValidationError ||
      err instanceof PrismaClientInitializationError ||
      err instanceof PrismaClientRustPanicError) {
      processedError = handlePrismaError(err);
    }

    sendErrorProd(processedError as AppError, res);
  }
};

export default errorHandler;