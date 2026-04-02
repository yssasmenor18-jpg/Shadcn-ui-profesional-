'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

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

    const signInWithGoogle = async () => {
        console.log('Iniciando flujo de Google OAuth...');
        setIsGoogleLoading(true)
        setError(null)
        try {
            const { error, data } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            })
            if (error) throw error
            console.log('Redirección de Google iniciada:', data);
        } catch (err: any) {
            console.error('Error en Google Login:', err);
            setError(err.message || 'Error al conectar con Google. Verifica que el proveedor esté activo en Supabase.')
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-black selection:bg-blue-500/30">
            {/* Decorative Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1] 
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" 
                />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                {/* Brand Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <div className="mb-4 inline-block">
                        <span className="text-white text-xs font-medium tracking-[0.3em] uppercase opacity-50 mb-2 block">
                            Platform
                        </span>
                        <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
                            ISASMENDI<span className="text-blue-500">.</span>
                        </h2>
                    </div>
                </motion.div>

                <Card className="glass-dark border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
                    <CardHeader className="p-0 border-b border-white/5">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-white/5 backdrop-blur-3xl p-0">
                                <TabsTrigger 
                                    value="login" 
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 transition-all gap-2 h-full"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Acceso
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="signup" 
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 transition-all gap-2 h-full"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Registro
                                </TabsTrigger>
                            </TabsList>

                            <div className="p-6 pt-8 space-y-6">
                                {/* Google Sign In */}
                                <div className="space-y-4">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 gap-3 group relative overflow-hidden"
                                        onClick={signInWithGoogle}
                                        disabled={isGoogleLoading || isLoading}
                                    >
                                        {isGoogleLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
                                                />
                                                <path
                                                    fill="#4285F4"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                                />
                                            </svg>
                                        )}
                                        <span className="font-medium">Continuar con Google</span>
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/5" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-transparent px-2 text-white/30 backdrop-blur-sm">O continuar con email</span>
                                        </div>
                                    </div>
                                </div>

                                <TabsContent value="login" className="space-y-4 m-0 border-none p-0 outline-none">
                                    <form action={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Email</Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                required
                                                disabled={isLoading}
                                                className="bg-white/5 border-white/5 focus:bg-white/10 transition-all border-none h-11 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Contraseña</Label>
                                            <Input
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                disabled={isLoading}
                                                className="bg-white/5 border-white/5 focus:bg-white/10 transition-all border-none h-11 text-white placeholder:text-white/20"
                                            />
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-white text-black hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold group"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin text-black" /> : 'Entrar'}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup" className="space-y-4 m-0 border-none p-0 outline-none">
                                    <form action={handleSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Email</Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                required
                                                disabled={isLoading}
                                                className="bg-white/5 border-white/5 focus:bg-white/10 transition-all border-none h-11 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Contraseña</Label>
                                            <Input
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                disabled={isLoading}
                                                className="bg-white/5 border-white/5 focus:bg-white/10 transition-all border-none h-11 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-white text-black hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardHeader>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-white/30 text-xs">
                        &copy; 2026 Isasmendi Visiones Platform. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    )
}
