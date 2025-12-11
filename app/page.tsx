import { createClient } from '@/lib/supabase/server'
import { VideoGallery } from '@/components/video-gallery'
import { UploadVideoDialog } from '@/components/upload-video-dialog'
import { HeroVideo } from '@/components/hero-video'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogIn, LayoutDashboard } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Datos de ejemplo para rellenar (Placeholders bonitos)
const PLACEHOLDER_VIDEOS = [
  {
    id: 'demo-1',
    title: "Explora la Naturaleza",
    description: "Un viaje visual por los paisajes más impresionantes del mundo.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2070&auto=format&fit=crop",
    category: "Naturaleza"
  },
  {
    id: 'demo-2',
    title: "Viajes de Aventura",
    description: "Descubre lo desconocido en esta serie de aventuras extremas.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2074&auto=format&fit=crop",
    category: "Aventura"
  },
  {
    id: 'demo-3',
    title: "Momentos Urbanos",
    description: null,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2156&auto=format&fit=crop",
    category: "Urbano"
  },
  {
    id: 'demo-4',
    title: "El Futuro Tecnológico",
    description: null,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    category: "Tecnología"
  },
  {
    id: 'demo-5',
    title: "Arte Abstracto",
    description: null,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2130&auto=format&fit=crop",
    category: "Arte"
  },
  {
    id: 'demo-6',
    title: "Música en Vivo",
    description: null,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop",
    category: "Música"
  }
]

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: realVideos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  // Combinar videos reales con placeholders
  const allVideos = [...(realVideos || []), ...PLACEHOLDER_VIDEOS]
  const uniqueVideos = allVideos.filter((video, index, self) =>
    index === self.findIndex((t) => (
      t.title === video.title
    ))
  )

  // Separar el Hero Video (el primero) del resto de la galería
  const heroVideo = uniqueVideos[0]
  const galleryVideos = uniqueVideos.slice(1) // El resto de videos

  return (
    <div className="min-h-screen w-full bg-black flex flex-col relative overflow-x-hidden">

      {/* Header flotante (Absolute para estar sobre el video) */}
      <div className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="font-bold text-xl text-white tracking-tighter hover:opacity-80 transition-opacity">
          ISASMENDI
        </Link>

        <div className="flex gap-4">
          {user ? (
            <>
              <UploadVideoDialog />
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-colors backdrop-blur-md">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary" className="gap-2 bg-white text-black hover:bg-gray-200">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="w-full">
        <HeroVideo video={heroVideo} />
      </section>

      {/* GALLERY SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Más Visiones
          </h2>
          <div className="h-[1px] flex-1 bg-white/10 ml-6 hidden md:block" />
        </div>

        {/* Grid de videos */}
        <VideoGallery videos={galleryVideos} />
      </section>

      {/* Footer simple */}
      <footer className="w-full py-6 text-center text-neutral-600 relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm mt-auto">
        <p>© 2025 StreamAI. All rights reserved.</p>
      </footer>

      {/* Background Ambient Effect (Solo en la parte inferior para no interferir con el video) */}
      <div className="fixed bottom-0 left-0 right-0 h-[50vh] z-0 pointer-events-none">
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>
    </div>
  )
}
