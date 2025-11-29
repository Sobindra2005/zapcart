import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError ,PrismaClientValidationError,PrismaClientInitializationError,PrismaClientRustPanicError } from "@prisma/client/runtime/client"

import AppError from '@/utils/AppError';
import config from '@/config/env';

/**
 * Handles CastError from MongoDB (invalid ObjectId format)
 */
const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field errors from MongoDB
 */
const handleDuplicateFieldsError = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors from MongoDB/Mongoose
 */
const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
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
const handlePrismaNotFoundError = (_err: PrismaClientKnownRequestError): AppError => {
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
const handlePrismaError = (err: any): AppError => {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return handlePrismaUniqueConstraintError(err);
      case 'P2025': // Record not found
        return handlePrismaNotFoundError(err);
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
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log all errors in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error occurred:');
    console.error('Message:', err.message);
    console.error('Status Code:', err.statusCode);
    console.error('Stack:', err.stack);
  } else {
    // In production, only log programming errors
    if (!err.isOperational) {
      console.error('❌ PROGRAMMING ERROR:', err);
    }
  }

  // Handle errors based on environment
  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle MongoDB/Mongoose errors
    if (err.name === 'CastError') error = handleCastError(error);
    if (err.code === 11000) error = handleDuplicateFieldsError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);

    // Handle Prisma errors
    if (err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientValidationError ||
        err instanceof PrismaClientInitializationError ||
        err instanceof PrismaClientRustPanicError) {
      error = handlePrismaError(err);
    }

    sendErrorProd(error, res);
  }
};

export default errorHandler;