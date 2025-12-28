import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    LogOut,
    Package,
    Search,
    Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { DatePickerConPopover } from "@/components/date-picker-con-popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from '../login/actions'
import { DashboardNav, MobileNav } from '@/components/dashboard-nav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
            {/* Animated background elements (consistent with Login) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
                {/* Sidebar - Desktop */}
                <aside className="hidden border-r bg-muted/20 md:block sticky top-0 h-screen overflow-y-auto">
                    <div className="flex h-full flex-col gap-4">
                        <div className="flex h-16 items-center border-b px-4 lg:px-6 shrink-0 bg-background/50 backdrop-blur-sm">
                            <Link href="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 duration-300">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                                    <Package className="h-6 w-6" />
                                </div>
                                <span className="isasmendi-3d text-2xl tracking-tighter">Isasmendi</span>
                            </Link>
                        </div>
                        <div className="flex-1 py-4">
                            <DashboardNav />
                        </div>
                        <div className="p-4 mt-auto border-t bg-muted/10">
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-card border shadow-sm">
                                <Avatar className="h-8 w-8 border-2 border-primary/10">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-semibold truncate leading-none uppercase tracking-wider text-muted-foreground">Admin</span>
                                    <span className="text-[10px] truncate opacity-60 leading-tight">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b px-4 lg:px-6 glass shadow-sm">
                        <div className="flex md:hidden items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 rounded-full hover:bg-primary/5"
                                    >
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle navigation menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="flex flex-col w-[280px] p-6">
                                    <MobileNav />
                                </SheetContent>
                            </Sheet>
                            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                                <span className="isasmendi-3d text-xl">Isasmendi</span>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full flex-1 md:max-w-md lg:max-w-lg">
                            <form>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="search"
                                        placeholder="Search everything..."
                                        className="w-full bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 pl-10 rounded-xl transition-all duration-300"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <div className="hidden sm:block">
                                <DatePickerConPopover />
                            </div>
                            <ModeToggle />
                            <div className="h-6 w-[1px] bg-border mx-1" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="user" />
                                            <AvatarFallback className="bg-primary/5 text-primary">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl glass border-primary/10 shadow-xl" sideOffset={8}>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                                            <p className="text-xs leading-none text-muted-foreground mt-1">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="opacity-50" />
                                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg m-1">Settings</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg m-1">Support</DropdownMenuItem>
                                    <DropdownMenuSeparator className="opacity-50" />
                                    <form action={signOut} className="w-full">
                                        <button className="w-full">
                                            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg m-1 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                <LogOut className="h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </button>
                                    </form>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-x-hidden">
                        <div className="h-full p-4 lg:p-8 animate-in">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

