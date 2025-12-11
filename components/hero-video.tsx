'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { IsasmendiTitle } from '@/components/ui/isasmendi-title'
import { Button } from '@/components/ui/button'

type Video = {
    video_url: string
    title: string
    description?: string | null
}

export function HeroVideo({ video }: { video: Video }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isMuted, setIsMuted] = useState(false) // Intentamos arrancar con sonido (false)
    const [isPlaying, setIsPlaying] = useState(true)

    // Intersection Observer para pausar video SOLO cuando desaparece completamente
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Si el video todavía está en pantalla (aunque sea un borde), se reproduce.
                    // Solo se pausa si ya NO está intersectando el viewport.
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch((e) => console.log("Autoplay blocked/pending:", e))
                        setIsPlaying(true)
                    } else {
                        videoRef.current?.pause()
                        setIsPlaying(false)
                    }
                })
            },
            { threshold: 0 } // 0 = Pausar solo cuando ya no se ve NADA del video
        )

        if (videoRef.current) {
            observer.observe(videoRef.current)
        }

        // Intento de arranque CON SONIDO
        // Nota: Los navegadores modernos bloquean esto sin interacción del usuario.
        if (videoRef.current) {
            videoRef.current.muted = false // Aseguramos que el tag no esté mudo

            videoRef.current.play().catch((error) => {
                console.warn("Autoplay with sound failed (Browser Policy). Fallback to muted.", error);
                // Si falla, lo ponemos en mute para que al menos se vea el video
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    setIsMuted(true);
                    videoRef.current.play().catch(e => console.error("Autoplay muted failed too", e));
                }
            });
        }

        return () => observer.disconnect()
    }, [])

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(videoRef.current.muted)
        }
    }

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight * 0.7, // 70vh
            behavior: 'smooth'
        })
    }

    return (
        <div className="relative w-full h-[70vh] overflow-hidden bg-black group">
            {/* Video Background */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                src={video.video_url}
                // Quitamos 'autoPlay' nativo y 'muted' del tag para controlarlo manualmente por JS
                // para intentar forzar el sonido, aunque dejamos playsInline para móviles.
                playsInline
                loop
            />

            {/* Overlay Oscuro Base */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Gradiente Inferior (Fade to Black) */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

            {/* Contenido Central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
                <div className="scale-75 md:scale-100 transition-transform duration-500 hover:scale-105">
                    <IsasmendiTitle />
                </div>

                {/* Descripción corta opcional */}
                {video.description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-6 text-neutral-300 max-w-xl text-center text-sm md:text-lg font-light drop-shadow-md hidden md:block"
                    >
                        {video.description}
                    </motion.p>
                )}
            </div>

            {/* Fallback para activar sonido si el navegador lo bloqueó */}
            {isMuted && (
                <div className="absolute top-4 right-4 md:top-auto md:bottom-24 md:right-8 z-40 animate-pulse">
                    <Button
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.muted = false;
                                videoRef.current.play(); // Asegurar reproducción
                                setIsMuted(false);
                            }
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 rounded-full px-6 py-2 flex items-center gap-2 transition-all group-hover:bg-white/40"
                    >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">ACTIVAR SONIDO</span>
                    </Button>
                </div>
            )}

            {/* Controles UI (mute manual) */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={scrollToContent}
                    className="rounded-full text-white/50 hover:text-white hover:bg-transparent"
                >
                    <ChevronDown className="w-8 h-8" />
                </Button>
            </div>
        </div>
    )
}
