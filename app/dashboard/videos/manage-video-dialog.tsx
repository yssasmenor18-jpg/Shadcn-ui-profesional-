"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import {
    Plus,
    Video as VideoIcon,
    Star,
    Upload,
    Image as ImageIcon,
    Loader2,
    X
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface VideoItem {
    id: string
    title: string
    description?: string
    video_url: string
    thumbnail_url?: string
    category: string
    is_hero?: boolean
    created_at?: string
}

interface ManageVideoDialogProps {
    onVideoSaved?: () => void
    video?: VideoItem
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function ManageVideoDialog({
    onVideoSaved,
    video,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    trigger
}: ManageVideoDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isHero, setIsHero] = useState(video?.is_hero || false)

    const router = useRouter()
    const supabase = createClient()
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const isEditing = !!video

    useEffect(() => {
        if (open) {
            setIsHero(video?.is_hero || false)
        }
    }, [open, video])

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const title = formData.get('title') as string
            const description = formData.get('description') as string
            const category = formData.get('category') as string
            const videoFile = formData.get('video') as File
            const thumbnailFile = formData.get('thumbnail') as File

            let videoUrl = video?.video_url || ""
            let thumbUrl = video?.thumbnail_url || ""

            // 1. Verificar usuario (opcional si es admin, pero bueno por seguridad)
            const { data: { user } } = await supabase.auth.getUser()

            // 2. Subir Video si hay archivo nuevo
            if (videoFile && videoFile.size > 0) {
                const videoName = `${Date.now()}-${videoFile.name}`
                const { error: videoError } = await supabase.storage
                    .from('videos')
                    .upload(videoName, videoFile)
                if (videoError) throw videoError
                videoUrl = supabase.storage.from('videos').getPublicUrl(videoName).data.publicUrl
            }

            // 3. Subir Thumbnail si hay archivo nuevo
            if (thumbnailFile && thumbnailFile.size > 0) {
                const thumbName = `${Date.now()}-${thumbnailFile.name}`
                const { error: thumbError } = await supabase.storage
                    .from('thumbnails')
                    .upload(thumbName, thumbnailFile)
                if (thumbError) throw thumbError
                thumbUrl = supabase.storage.from('thumbnails').getPublicUrl(thumbName).data.publicUrl
            }

            if (!videoUrl) {
                throw new Error("Se requiere un archivo de video")
            }

            // 4. Guardar en Base de Datos
            const url = isEditing ? `/api/videos/${video.id}` : '/api/videos'
            const method = isEditing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    video_url: videoUrl,
                    thumbnail_url: thumbUrl,
                    is_hero: isHero
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al guardar el video')
            }

            const savedVideo = await response.json()

            // 5. Es importante forzar el set-hero si está marcado
            if (isHero) {
                await fetch('/api/videos/set-hero', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: isEditing ? video.id : savedVideo.id }),
                })
            }

            toast.success(isEditing ? "Video actualizado" : "Video publicado", {
                description: `${title} se ha guardado correctamente.`
            })

            setOpen(false)
            if (onVideoSaved) onVideoSaved()
            router.refresh()

        } catch (error: any) {
            console.error('Error:', error)
            toast.error("Error", {
                description: error.message || "Algo salió mal. Inténtalo de nuevo."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                !isControlled && (
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" /> Add New Video
                        </Button>
                    </DialogTrigger>
                )
            )}
            <DialogContent className="sm:max-w-[480px] bg-[#0f172a] border-slate-800 text-white p-0 overflow-hidden rounded-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <DialogHeader className="mb-6 relative">
                        <DialogTitle className="text-2xl font-bold text-white">
                            {isEditing ? "Editar Video" : "Subir Nuevo Video"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {isEditing ? "Modifica los detalles de tu video." : "Comparte tu contenido con la comunidad."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpload} className="space-y-5">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="title" className="text-sm font-semibold text-slate-200">Título del Video</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={video?.title}
                                required
                                placeholder="Ej: Mi viaje épico"
                                className="bg-[#1e293b] border-slate-700 focus:ring-purple-500 text-white h-11"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="category" className="text-sm font-semibold text-slate-200">Categoría</Label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={video?.category || "Todos"}
                                className="flex h-11 w-full rounded-md border border-slate-700 bg-[#1e293b] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 text-white appearance-none"
                                required
                            >
                                <option value="Todos">Todos</option>
                                <option value="Remeras">Remeras</option>
                                <option value="Gorras">Gorras</option>
                                <option value="Buzos">Buzos</option>
                                <option value="Accesorios">Accesorios</option>
                            </select>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="description" className="text-sm font-semibold text-slate-200">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={video?.description}
                                placeholder="Cuéntanos de qué trata..."
                                className="bg-[#1e293b] border-slate-700 focus:ring-purple-500 text-white min-h-[80px] resize-none"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="video" className="text-sm font-semibold text-slate-200">Archivo de Video (MP4)</Label>
                            <div className="flex items-center gap-3 p-3 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors relative group">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                                    <VideoIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="file"
                                    id="video"
                                    name="video"
                                    accept="video/mp4,video/webm"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required={!isEditing}
                                />
                                <span className="text-sm text-slate-400">{isEditing ? "Click para cambiar video (opcional)..." : "Clic para seleccionar video..."}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="thumbnail" className="text-sm font-semibold text-slate-200">Imagen de Portada</Label>
                            <div className="flex items-center gap-3 p-3 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors relative group">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="file"
                                    id="thumbnail"
                                    name="thumbnail"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <span className="text-sm text-slate-400">{isEditing ? "Click para cambiar portada (opcional)..." : "Clic para seleccionar imagen..."}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <Star className={`h-5 w-5 ${isHero ? "text-amber-500 fill-amber-500" : "text-slate-500"}`} />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white leading-none">Video Principal (Hero)</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Aparecerá en el inicio de la web.</p>
                                </div>
                            </div>
                            <Switch
                                checked={isHero}
                                onCheckedChange={setIsHero}
                                className="data-[state=checked]:bg-amber-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {isEditing ? "Actualizando..." : "Publicando..."}
                                </>
                            ) : (
                                isEditing ? "Actualizar Video" : "Publicar Video"
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
