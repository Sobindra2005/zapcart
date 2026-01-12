import React from "react";
import { cn } from "@repo/lib/utils";

interface EmptySectionProps {
    message: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
    minHeight?: string;
}

export function EmptySection({
    message,
    description,
    icon,
    className,
    minHeight = "400px"
}: EmptySectionProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center w-full",
                className
            )}
            style={{ minHeight }}
        >
            {icon && (
                <div className="mb-4 text-muted-foreground/40">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {message}
            </h3>
            {description && (
                <p className="text-sm text-muted-foreground text-center max-w-md">
                    {description}
                </p>
            )}
        </div>
    );
}
