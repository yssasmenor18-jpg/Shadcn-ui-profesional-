'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { sanitizeFilename } from '@/lib/utils'
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
import { Loader2, Upload, Video as VideoIcon, Image as ImageIcon, Star } from 'lucide-react'

export function UploadVideoDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [categories, setCategories] = useState<string[]>([])
    const [isNewCategory, setIsNewCategory] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const title = formData.get('title') as string
            const description = formData.get('description') as string
            const videoFile = (formData.get('video') as File)
            const thumbnailFile = (formData.get('thumbnail') as File)
            const category = isNewCategory
                ? (formData.get('custom-category') as string)
                : (formData.get('category') as string)
            const isHero = formData.get('is_hero') === 'on'

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
            const sanitizedVideoName = sanitizeFilename(videoFile.name)
            const videoName = `${Date.now()}-${sanitizedVideoName}`
            const { data: videoData, error: videoError } = await supabase.storage
                .from('videos')
                .upload(videoName, videoFile)

            if (videoError) throw videoError

            // 3. Subir Thumbnail
            const sanitizedThumbName = sanitizeFilename(thumbnailFile.name)
            const thumbName = `${Date.now()}-${sanitizedThumbName}`
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
                    category,
                    video_url: videoUrl,
                    thumbnail_url: thumbUrl,
                    user_id: user.id,
                    is_hero: isHero
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
                        <Label htmlFor="category">Categoría</Label>
                        {isNewCategory ? (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                <Input
                                    id="custom-category"
                                    name="custom-category"
                                    placeholder="Escribe la nueva categoría..."
                                    className="bg-slate-800 border-slate-700 focus:ring-indigo-500"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsNewCategory(false)}
                                    className="border-slate-700 hover:bg-slate-800"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        ) : (
                            <select
                                id="category"
                                name="category"
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => {
                                    if (e.target.value === 'new') setIsNewCategory(true);
                                }}
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Selecciona una categoría...</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="new" className="text-indigo-400 font-semibold">+ Crear Nueva Categoría</option>
                            </select>
                        )}
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

                    <div className="flex items-center space-x-2 py-2 px-1 rounded-lg hover:bg-white/5 transition-colors group">
                        <input
                            type="checkbox"
                            id="is_hero"
                            name="is_hero"
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
                        />
                        <Label htmlFor="is_hero" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20 group-hover:fill-yellow-400/40 transition-all" />
                            Usar como video principal (Hero)
                        </Label>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-xl shadow-purple-500/20">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 h-4 animate-spin" />
                                    Publicando visión...
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
