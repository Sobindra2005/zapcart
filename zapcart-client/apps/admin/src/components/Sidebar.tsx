"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Tag,
    BarChart3,
    Users,
    Settings,
    LogOut,
    ChevronDown,
    Bell,
    ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
        name: "Products",
        icon: ShoppingBag,
        href: "/products",
        subItems: [
            { name: "Product List", href: "/products/list" },
            { name: "Categories", href: "/products/categories" }
        ]
    },
    { name: "Sales", icon: Tag, href: "/sales" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

import { useSidebar } from "@/lib/SidebarContext";

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();
    const [openMenus, setOpenMenus] = useState<string[]>(["Products"]);

    const toggleMenu = (name: string) => {
        if (isCollapsed) return; // Don't allow expanding submenus when collapsed
        setOpenMenus(prev =>
            prev.includes(name)
                ? prev.filter(m => m !== name)
                : [...prev, name]
        );
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-full flex-col py-6">
                {/* Logo */}
                <div className={cn(
                    "flex items-center gap-2 px-6 mb-10 transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : ""
                )}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-primary">
                            <path d="M12 12c.5-2.5 3.5-3.5 4.5-1s-3 4.5-4.5 4.5S7.5 13.5 8.5 11s4-1.5 4.5 1z" />
                            <path d="M12 12c-2.5.5-3.5 3.5-1 4.5s4.5-3 4.5-4.5S13.5 7.5 11 8.5s-1.5 4 1 4.5z" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-xl font-bold tracking-tight text-gray-900 transition-opacity duration-300">Spodut</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
                        const isOpen = openMenus.includes(item.name) && !isCollapsed;

                        return (
                            <div key={item.name}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            title={isCollapsed ? item.name : ""}
                                            className={cn(
                                                "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-all duration-200",
                                                isCollapsed ? "justify-center px-0" : "justify-between px-3",
                                                isActive ? "text-gray-900 bg-gray-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-gray-400")} />
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </div>
                                            {!isCollapsed && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                                        </button>
                                        {isOpen && !isCollapsed && (
                                            <div className="mt-1 ml-4 space-y-1">
                                                {item.subItems.map((sub) => {
                                                    const isSubActive = pathname === sub.href || (sub.name === "Product List" && (pathname === "/" || pathname === "/products/list"));
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={cn(
                                                                "block rounded-lg px-9 py-2 text-sm font-medium transition-all duration-200",
                                                                isSubActive ? "text-primary bg-primary/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        title={isCollapsed ? item.name : ""}
                                        className={cn(
                                            "flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-200",
                                            isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                                            isActive ? "text-gray-900 bg-gray-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-gray-400")} />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="mt-auto pt-4 border-t border-gray-100 px-4">
                    <button
                        title={isCollapsed ? "Log out" : ""}
                        className={cn(
                            "flex w-full items-center rounded-lg py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-gray-900 hover:bg-gray-50",
                            isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                        )}
                    >
                        <LogOut className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        {!isCollapsed && <span>Log out</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
