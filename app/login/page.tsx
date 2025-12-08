'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, Loader2, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    const handleSignup = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 mb-4 shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Bienvenido
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Inicia sesión o crea una cuenta para continuar
                    </p>
                </div>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-800/50 shadow-2xl shadow-black/10 dark:shadow-black/50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    <CardHeader className="space-y-1">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="login" className="gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Iniciar Sesión
                                </TabsTrigger>
                                <TabsTrigger value="signup" className="gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Registrarse
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                                    <CardDescription>
                                        Ingresa tu email y contraseña para acceder
                                    </CardDescription>
                                </div>

                                <form action={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            Email
                                        </Label>
                                        <Input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            required
                                            disabled={isLoading}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password" className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            disabled={isLoading}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                        />
                                        <div className="flex justify-end">
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4" />
                                                Iniciar Sesión
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                                    <CardDescription>
                                        Ingresa tus datos para crear una nueva cuenta
                                    </CardDescription>
                                </div>

                                <form action={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            Email
                                        </Label>
                                        <Input
                                            id="signup-email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            required
                                            disabled={isLoading}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password" className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="signup-password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            disabled={isLoading}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                            minLength={6}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Mínimo 6 caracteres
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creando cuenta...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4" />
                                                Crear Cuenta
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardHeader>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                    <p>Protegido por Supabase Auth</p>
                </div>
            </div>
        </div>
    )
}
