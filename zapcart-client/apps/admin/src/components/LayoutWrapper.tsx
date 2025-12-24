"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if (path === "/") return "Dashboard";
        const segments = path.split("/").filter(Boolean);
        if (segments.length === 0) return "Dashboard";

        const lastSegment = segments[segments.length - 1];
        return lastSegment
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const title = getPageTitle(pathname);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div
                className={cn(
                    "flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <Header title={title} />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
