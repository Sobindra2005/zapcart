"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { getQueryClient } from './get-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ReactQueryWrapperProps {
    children: ReactNode;
}

export const ReactQueryWrapper: React.FC<ReactQueryWrapperProps> = ({ children }) => (
    <QueryClientProvider client={getQueryClient()}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);