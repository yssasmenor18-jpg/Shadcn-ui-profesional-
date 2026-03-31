'use client'

import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import * as motionModule from 'framer-motion'
const { motion, useScroll, useTransform } = motionModule
import { Volume2, VolumeX, ChevronDown, Move, Settings2, Check, X as CloseIcon } from 'lucide-react'
import { IsasmendiTitle } from '@/components/ui/isasmendi-title'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ManageVideoDialog, type VideoItem } from '@/app/dashboard/videos/manage-video-dialog'
import { toast } from 'sonner'

interface HeroVideoProps {
    video: VideoItem
}
export function HeroVideo({ video }: HeroVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [isEditingMode, setIsEditingMode] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [posY, setPosY] = useState(50)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setUser(currentUser)
        }
        checkUser()
    }, [])

    useEffect(() => {
        if (video?.video_url?.includes('#pos-')) {
            const match = video.video_url.match(/#pos-(\d+)/)
            if (match) setPosY(parseInt(match[1]))
        } else if (video?.video_url?.includes('#align-')) {
            const align = video.video_url.split('#align-')[1]
            if (align === 'top') setPosY(0)
            else if (align === 'bottom') setPosY(100)
            else setPosY(50)
        }
    }, [video])

    // Intersection Observer para pausar video SOLO cuando desaparece completamente
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch((e) => console.log("Autoplay blocked/pending:", e))
                        setIsPlaying(true)
                    } else {
                        videoRef.current?.pause()
                        setIsPlaying(false)
                    }
                })
            },
            { threshold: 0 }
        )

        if (videoRef.current) {
            observer.observe(videoRef.current)
        }

        if (videoRef.current) {
            videoRef.current.muted = false
            videoRef.current.play().catch((error) => {
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

    const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !isEditingMode) return
        
        const rect = videoRef.current?.parentElement?.getBoundingClientRect()
        if (!rect) return

        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
        const delta = clientY - rect.top
        const percentage = Math.max(0, Math.min(100, (delta / rect.height) * 100))
        setPosY(percentage)
    }

    const savePosition = async () => {
        try {
            const baseUrl = video.video_url.split('#')[0]
            const finalUrl = `${baseUrl}#pos-${Math.round(posY)}`
            
            const response = await fetch(`/api/videos/${video.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video_url: finalUrl }),
            })

            if (response.ok) {
                toast.success("Encuadre guardado")
                setIsEditingMode(false)
                // Usamos location.reload ya que router.refresh a veces tarda en propagar a server components 
                // en produccion para el Hero
                window.location.reload()
            }
        } catch (error) {
            toast.error("Error al guardar")
        }
    }

    return (
        <div 
            className={`relative w-full h-[70vh] overflow-hidden bg-black group transition-all duration-500 ${isEditingMode ? 'ring-4 ring-purple-500 ring-inset ring-offset-4 ring-offset-black rounded-lg scale-[0.98]' : ''}`}
            onMouseMove={handleDrag}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleDrag}
            onTouchEnd={() => setIsDragging(false)}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isEditingMode ? 'cursor-ns-resize opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                style={{ objectPosition: `center ${posY}%` }}
                onMouseDown={() => isEditingMode && setIsDragging(true)}
                onTouchStart={() => isEditingMode && setIsDragging(true)}
                src={video.video_url}
                playsInline
                loop
            />

            {/* Overlay Oscuro Base - Reducido sutilmente */}
            <div className={`absolute inset-0 bg-black/20 ${isEditingMode ? 'z-0 pointer-events-none' : 'z-10'}`} />

            {/* Gradiente Inferior - Más corto y suave */}
            <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/40 to-transparent ${isEditingMode ? 'z-0 pointer-events-none' : 'z-10'}`} />

            {/* Contenido Central */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 px-4 transition-opacity duration-300 ${isEditingMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            
            {/* UI de Edición Master (Icono discreto) */}
            {user && (
                <div className="absolute top-24 left-8 z-[60] flex flex-col gap-3">
                    {!isEditingMode ? (
                        <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditingMode(true)}
                            className="bg-black/20 hover:bg-white/20 text-white/50 hover:text-white backdrop-blur-sm rounded-full w-8 h-8 border border-white/10 shadow-lg transition-all"
                            title="Ajustar Encuadre"
                        >
                            <Move className="w-4 h-4" />
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-2 animate-in slide-in-from-left-4 duration-300">
                             <Button 
                                size="icon"
                                onClick={savePosition}
                                className="bg-green-600 hover:bg-green-500 text-white rounded-full w-10 h-10 shadow-xl border border-white/20"
                                title="Guardar Posición"
                            >
                                <Check className="w-5 h-5" />
                            </Button>
                            <Button 
                                size="icon"
                                onClick={() => setIsEditingMode(false)}
                                className="bg-red-600/80 hover:bg-red-600 text-white rounded-full w-10 h-10 shadow-xl border border-white/20"
                                title="Cancelar"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
            
            {isEditingMode && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/60 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-3xl pointer-events-none animate-pulse">
                    <p className="text-sm font-bold tracking-widest text-center">ARRASTRA EL VIDEO ARRIBA O ABAJO ↕️</p>
                </div>
            )}

            <ManageVideoDialog 
                video={video}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onVideoSaved={() => window.location.reload()}
            />

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
