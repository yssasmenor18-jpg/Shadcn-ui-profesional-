'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Activity,
    Video,
    Globe
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Videos', href: '/dashboard/videos', icon: Video },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Activity },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300",
                            isActive
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="nav-active"
                                className="absolute inset-0 bg-primary/10 rounded-lg -z-10 bg-gradient-to-r from-primary/10 to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <item.icon className={cn(
                            "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span>{item.name}</span>
                        {isActive && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute left-0 w-1 h-4 bg-primary rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            />
                        )}
                    </Link>
                )
            })}
            <div className="mt-4 pt-4 border-t border-primary/5">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5"
                >
                    <Globe className="h-4 w-4" />
                    <span>Volver a la Web</span>
                </Link>
            </div>
        </nav>
    )
}

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 mb-4"
            >
                <Package className="h-6 w-6 text-primary" />
                <span className="isasmendi-3d text-xl">Isasmendi</span>
            </Link>
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-4 rounded-xl px-3 py-2 transition-all",
                            isActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                )
            })}
            <div className="mt-4 pt-4 border-t border-primary/5">
                <Link
                    href="/"
                    className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <Globe className="h-5 w-5" />
                    Volver a la Web
                </Link>
            </div>
        </nav>
    )
}
