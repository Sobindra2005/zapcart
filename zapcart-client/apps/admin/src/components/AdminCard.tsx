import React from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    hoverable?: boolean;
}

export function AdminCard({
    children,
    className,
    noPadding = false,
    hoverable = false,
}: AdminCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-gray-100 shadow-sm transition-all",
                !noPadding && "p-6",
                hoverable && "hover:shadow-md",
                className
            )}
        >
            {children}
        </div>
    );
}
