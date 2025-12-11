'use client'

import React, { useState } from 'react'
import { FocusCards } from '@/components/ui/focus-cards'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'

// Definimos el tipo de Video basado en nuestra tabla DB
type Video = {
    id: string
    title: string
    description: string | null
    video_url: string
    thumbnail_url: string
    category?: string | null // Campo nuevo de la DB
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
        src: v.thumbnail_url,
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
                <DialogContent className="sm:max-w-4xl bg-slate-900 border-slate-800 p-0 overflow-hidden">
                    <DialogHeader className="p-4 absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-black/80 to-transparent">
                        <DialogTitle className="text-white flex justify-between items-center">
                            <span>{selectedVideo?.title}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="aspect-video w-full bg-black flex items-center justify-center relative group">
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
                            <div className="text-white">Cargando...</div>
                        )}
                    </div>

                    {selectedVideo?.description && (
                        <div className="p-6 bg-slate-900 text-slate-300">
                            <p>{selectedVideo.description}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
