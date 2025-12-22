"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div
                className={cn(
                    "flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
