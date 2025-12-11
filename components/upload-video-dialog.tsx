'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, Video as VideoIcon, Image as ImageIcon } from 'lucide-react'

export function UploadVideoDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const title = formData.get('title') as string
            const description = formData.get('description') as string
            const videoFile = (formData.get('video') as File)
            const thumbnailFile = (formData.get('thumbnail') as File)

            if (!videoFile || !thumbnailFile) {
                alert('Por favor selecciona un video y una portada')
                setIsLoading(false)
                return
            }

            // 1. Verificar usuario
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('Debes iniciar sesión para subir videos')
                setIsLoading(false)
                return
            }

            // 2. Subir Video
            const videoName = `${Date.now()}-${videoFile.name}`
            const { data: videoData, error: videoError } = await supabase.storage
                .from('videos')
                .upload(videoName, videoFile)

            if (videoError) throw videoError

            // 3. Subir Thumbnail
            const thumbName = `${Date.now()}-${thumbnailFile.name}`
            const { data: thumbData, error: thumbError } = await supabase.storage
                .from('thumbnails')
                .upload(thumbName, thumbnailFile)

            if (thumbError) throw thumbError

            // 4. Obtener URLs públicas
            const videoUrl = supabase.storage.from('videos').getPublicUrl(videoName).data.publicUrl
            const thumbUrl = supabase.storage.from('thumbnails').getPublicUrl(thumbName).data.publicUrl

            // 5. Guardar en Base de Datos
            const { error: dbError } = await supabase
                .from('videos')
                .insert({
                    title,
                    description,
                    video_url: videoUrl,
                    thumbnail_url: thumbUrl,
                    user_id: user.id
                })

            if (dbError) throw dbError

            // Éxito!
            setOpen(false)
            router.refresh() // Recargar la página para ver el nuevo video

        } catch (error: any) {
            console.error('Error uploading:', error)
            alert('Error al subir el video: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/25">
                    <Upload className="w-5 h-5" />
                    Subir Video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle>Subir Nuevo Video</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Comparte tu contenido con la comunidad.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título del Video</Label>
                        <Input id="title" name="title" required placeholder="Ej: Mi viaje épico" className="bg-slate-800 border-slate-700 focus:ring-indigo-500" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" name="description" placeholder="Cuéntanos de qué trata..." className="bg-slate-800 border-slate-700 focus:ring-indigo-500" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="video">Archivo de Video (MP4)</Label>
                        <div className="flex items-center gap-2 p-2 border border-dashed border-slate-700 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                            <VideoIcon className="w-5 h-5 text-indigo-400" />
                            <input type="file" id="video" name="video" accept="video/mp4,video/webm" required className="absolute inset-0 opacity-0 cursor-pointer" />
                            <span className="text-sm text-slate-400">Clic para seleccionar video...</span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Imagen de Portada</Label>
                        <div className="flex items-center gap-2 p-2 border border-dashed border-slate-700 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                            <ImageIcon className="w-5 h-5 text-purple-400" />
                            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer" />
                            <span className="text-sm text-slate-400">Clic para seleccionar imagen...</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo (esto puede tardar)...
                                </>
                            ) : (
                                'Publicar Video'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
