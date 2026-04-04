'use client'

import React, { useState } from 'react'
import { FocusCards } from '@/components/ui/focus-cards'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

// Definimos el tipo de Video basado en nuestra tabla DB
type Video = {
    id: string
    title: string
    description: string | null
    video_url: string
    thumbnail_url: string
    category?: string | null
    camera?: string | null
    lens?: string | null
    lighting?: string | null
    render_engine?: string | null
}

export function VideoGallery({ videos }: { videos: Video[] }) {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
    const [activeCategory, setActiveCategory] = useState('Todos')

    // Extraer categorías únicas de los videos
    const uniqueCategories = Array.from(new Set(videos.map(v => v.category || 'General')))
    const categories = ['Todos', ...uniqueCategories]

    // Adaptamos el formato de videos para FocusCards
    const cards = videos.map((v) => ({
        title: v.title,
        src: v.thumbnail_url || 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2000&auto=format&fit=crop', // Imagen de video genérica
        original: v,
        category: v.category || 'General'
    }))

    const filteredCards = activeCategory === 'Todos'
        ? cards
        : cards.filter(c => c.category === activeCategory)

    return (
        <div className="space-y-8">
            {/* 
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                            ? 'bg-white text-black scale-105 shadow-lg'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            */}

            <FocusCards
                cards={filteredCards}
                onCardClick={(card: any) => {
                    console.log('Card clicked!', card)
                    setSelectedVideo(card.original)
                }}
            />

            <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                <DialogContent className="sm:max-w-5xl bg-black/90 border-white/5 p-0 overflow-hidden backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,1)]">
                    {/* Header sutil */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-center px-6 pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
                             Sala de Proyección // 
                        </span>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80">REC</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col md:flex-row max-h-[85vh]">
                        {/* Area de Video (Principal) */}
                        <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-full">
                            {selectedVideo ? (
                                <video
                                    src={selectedVideo.video_url}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                    poster={selectedVideo.thumbnail_url}
                                >
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            ) : (
                                <div className="text-white/20 animate-pulse uppercase tracking-widest text-[10px]">Cargando Vision...</div>
                            )}
                        </div>

                        {/* Lateral de Información (Editorial Premium Look) */}
                        <div className="w-full md:w-[450px] bg-[#050505] border-l border-white/5 overflow-y-auto custom-scrollbar">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="space-y-10 p-8 md:p-10 flex flex-col min-h-full justify-center"
                            >
                                {/* Header del Proyecto */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-snug text-white text-balance">
                                        {selectedVideo?.title}
                                    </h2>
                                    <div className="inline-flex items-center gap-2">
                                        <div className="h-[1px] w-8 bg-blue-500/50" />
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400/80 font-bold">
                                            {selectedVideo?.category || 'General'}
                                        </span>
                                    </div>
                                </div>

                                {/* INTENCIÓN CORE (EL OBJETIVO) */}
                                {selectedVideo?.description && (
                                    <div className="space-y-4">
                                        <h3 className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">
                                            La Visión // Objetivo y Setup
                                        </h3>
                                        <p className="text-sm md:text-base leading-relaxed font-light text-white/80 text-pretty">
                                            {selectedVideo.description}
                                        </p>
                                    </div>
                                )}

                                {/* TECNISMO APLICADO (LA EJECUCIÓN) */}
                                {(selectedVideo?.camera || selectedVideo?.lens || selectedVideo?.lighting || selectedVideo?.render_engine) && (
                                    <div className="space-y-6 pt-6 border-t border-white/5 shrink-0">
                                        <h3 className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">
                                            Data Técnica //
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                                            {selectedVideo?.camera && (
                                                <div className="flex flex-col gap-1.5 group">
                                                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Cámara</span>
                                                    <span className="text-white/90 text-sm tracking-wide font-medium group-hover:text-white transition-colors">{selectedVideo.camera}</span>
                                                </div>
                                            )}
                                            {selectedVideo?.lens && (
                                                <div className="flex flex-col gap-1.5 group">
                                                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Óptica</span>
                                                    <span className="text-white/90 text-sm tracking-wide font-medium group-hover:text-white transition-colors">{selectedVideo.lens}</span>
                                                </div>
                                            )}
                                            {selectedVideo?.lighting && (
                                                <div className="flex flex-col gap-1.5 group">
                                                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Iluminación</span>
                                                    <span className="text-white/90 text-sm tracking-wide font-medium group-hover:text-white transition-colors">{selectedVideo.lighting}</span>
                                                </div>
                                            )}
                                            {selectedVideo?.render_engine && (
                                                <div className="flex flex-col gap-1.5 group">
                                                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Motor / IA</span>
                                                    <span className="text-blue-400 text-sm tracking-wide font-medium">{selectedVideo.render_engine}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
