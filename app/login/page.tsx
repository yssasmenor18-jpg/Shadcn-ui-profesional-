'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, Loader2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { IsasmendiTitle } from '@/components/ui/isasmendi-title'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [acceptTerms, setAcceptTerms] = useState(false)
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
        if (!acceptTerms) {
            setError('Debes aceptar los términos y condiciones para registrarte.')
            return
        }
        setIsLoading(true)
        setError(null)
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        if (!acceptTerms) {
            setError('Por favor, acepta los términos antes de continuar con Google.')
            return
        }
        console.log('Iniciando flujo de Google OAuth...');
        setIsGoogleLoading(true)
        setError(null)
        try {
            const { error, data } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback?next=/welcome`,
                },
            })
            if (error) throw error
            console.log('Redirección de Google iniciada:', data);
        } catch (err: any) {
            console.error('Error en Google Login:', err);
            setError(err.message || 'Error al conectar con Google. Verifica que el proveedor esté activo.')
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050505] selection:bg-blue-500/30">
            {/* Ambient Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
                
                {/* Dynamic Orbs */}
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" 
                />
            </div>

            <div className="w-full max-w-[480px] relative z-10 flex flex-col items-center">
                {/* 3D Header Component */}
                <div className="mb-12 scale-90 md:scale-100">
                    <IsasmendiTitle />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full"
                >
                    <Card className="glass-dark border-white/10 shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden rounded-2xl relative">
                        {/* subtle edge light */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        
                        <CardHeader className="p-0 border-b border-white/5">
                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 rounded-none h-16 bg-white/[0.02] backdrop-blur-3xl p-0">
                                    <TabsTrigger 
                                        value="login" 
                                        className="data-[state=active]:bg-white/[0.05] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 transition-all gap-2 h-full text-white/50 text-sm font-medium"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Acceso Profesional
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="signup" 
                                        className="data-[state=active]:bg-white/[0.05] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 transition-all gap-2 h-full text-white/50 text-sm font-medium"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Registro Premium
                                    </TabsTrigger>
                                </TabsList>

                                <div className="p-8 space-y-8">
                                    {/* Google OAuth Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-6 w-1 bg-blue-500 rounded-full" />
                                            <h3 className="text-white text-sm font-medium tracking-tight">Acceso Instantáneo</h3>
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            className="w-full h-14 bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white transition-all duration-500 gap-4 group relative overflow-hidden rounded-xl"
                                            onClick={signInWithGoogle}
                                            disabled={isGoogleLoading || isLoading}
                                        >
                                            {isGoogleLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <svg className="w-6 h-6 transition-transform group-hover:scale-110 duration-500" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#EA4335" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z" />
                                                    <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                                </svg>
                                            )}
                                            <span className="font-semibold tracking-wide">Continuar con Google Workspace</span>
                                            
                                            {/* Shine effect */}
                                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-white/5" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                                                <span className="bg-[#0c0c0c] px-4 text-white/20">Credenciales</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Traditional Form Section */}
                                    <div className="space-y-6">
                                        <TabsContent value="login" className="space-y-5 m-0 border-none p-0 outline-none">
                                            <form action={handleLogin} className="space-y-5">
                                                <div className="space-y-3">
                                                    <Label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Correo Electrónico</Label>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        placeholder="tu@correo.com"
                                                        required
                                                        disabled={isLoading}
                                                        className="bg-white/[0.03] border-white/5 focus:bg-white/[0.06] focus:border-white/10 transition-all h-12 text-white placeholder:text-white/10 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Contraseña</Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="••••••••••••"
                                                        required
                                                        disabled={isLoading}
                                                        className="bg-white/[0.03] border-white/5 focus:bg-white/[0.06] focus:border-white/10 transition-all h-12 text-white placeholder:text-white/10 rounded-xl"
                                                    />
                                                </div>

                                                <AnimatePresence>
                                                    {error && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="bg-red-500/10 border border-red-500/20 text-red-500/80 p-4 rounded-xl text-xs flex items-center gap-3 backdrop-blur-md"
                                                        >
                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                            {error}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-500 font-black tracking-widest uppercase rounded-xl group"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="animate-spin text-black group-hover:text-white" />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            Ingresar al Portal
                                                            <LogIn className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </form>
                                        </TabsContent>

                                        <TabsContent value="signup" className="space-y-5 m-0 border-none p-0 outline-none">
                                            <form action={handleSignup} className="space-y-5">
                                                <div className="space-y-3">
                                                    <Label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Correo Electrónico</Label>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        placeholder="tu@correo.com"
                                                        required
                                                        disabled={isLoading}
                                                        className="bg-white/[0.03] border-white/5 focus:bg-white/[0.06] focus:border-white/10 transition-all h-12 text-white placeholder:text-white/10 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Contraseña</Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Mínimo 8 caracteres"
                                                        required
                                                        disabled={isLoading}
                                                        className="bg-white/[0.03] border-white/5 focus:bg-white/[0.06] focus:border-white/10 transition-all h-12 text-white placeholder:text-white/10 rounded-xl"
                                                    />
                                                </div>

                                                {/* Terms and Conditions Checkbox */}
                                                <div 
                                                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors group"
                                                    onClick={() => setAcceptTerms(!acceptTerms)}
                                                >
                                                    <div className={`mt-0.5 w-5 h-5 rounded border ${acceptTerms ? 'bg-indigo-600 border-indigo-500' : 'border-white/20 bg-white/5'} flex items-center justify-center transition-all duration-300`}>
                                                        {acceptTerms && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <p className="text-[10px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                                        Acepto los <span className="text-indigo-400 underline decoration-indigo-400/30">Acuerdos de Servicio</span> y la política de privacidad de la plataforma Isasmendi Visiones.
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-500 font-black tracking-widest uppercase rounded-xl shadow-[0_0_40px_rgba(79,70,229,0.2)]"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Solicitar Acceso'}
                                                </Button>
                                            </form>
                                        </TabsContent>
                                    </div>
                                </div>
                            </Tabs>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Footer Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] mb-4">
                        Powered by Isasmendi Ecosystem
                    </p>
                    <div className="flex gap-6 justify-center">
                        <Link href="/terms" className="text-[10px] text-white/10 hover:text-white/40 transition-colors uppercase tracking-widest">Legal</Link>
                        <Link href="/privacy" className="text-[10px] text-white/10 hover:text-white/40 transition-colors uppercase tracking-widest">Privacidad</Link>
                        <Link href="/support" className="text-[10px] text-white/10 hover:text-white/40 transition-colors uppercase tracking-widest">Soporte</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
