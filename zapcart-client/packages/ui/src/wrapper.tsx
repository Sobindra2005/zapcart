"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

const queryClient = new QueryClient();

interface ReactQueryWrapperProps {
    children: ReactNode;
}

export const ReactQueryWrapper: React.FC<ReactQueryWrapperProps> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);