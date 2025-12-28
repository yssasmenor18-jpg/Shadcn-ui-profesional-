import { createClient } from '@/lib/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ManageVideoDialog } from "./manage-video-dialog"
import { VideoActions } from "./video-actions"
import { Video as VideoIcon, Calendar, Tag, Link2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function VideosPage() {
    const supabase = await createClient()
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('is_hero', { ascending: false })
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Videos</h1>
                    <p className="text-muted-foreground text-sm">Manage your promotional and catalog videos here.</p>
                </div>
                <ManageVideoDialog />
            </div>

            {/* Stats/Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-2xl border-primary/5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <VideoIcon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Total Videos</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{videos?.length || 0}</p>
                </div>
            </div>

            {/* Content Table */}
            <div className="rounded-2xl border border-primary/5 bg-card shadow-xl overflow-hidden glass">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-primary/5">
                                <TableHead className="w-[300px] font-semibold">Video Details</TableHead>
                                <TableHead className="font-semibold text-center">Category</TableHead>
                                <TableHead className="font-semibold">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Date Added
                                    </span>
                                </TableHead>
                                <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {videos?.map((video) => (
                                <TableRow key={video.id} className="group hover:bg-primary/5 transition-colors border-primary/5">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-24 rounded-lg bg-muted overflow-hidden border border-primary/10 flex-shrink-0">
                                                {video.thumbnail_url ? (
                                                    <img
                                                        src={video.thumbnail_url}
                                                        alt={video.title}
                                                        className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-primary/5">
                                                        <VideoIcon className="h-6 w-6 text-primary/30" />
                                                    </div>
                                                )}
                                                {video.is_hero && (
                                                    <div className="absolute top-1 right-1 bg-amber-500 text-white p-1 rounded-full shadow-lg z-10">
                                                        <Star className="h-3 w-3 fill-current" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <Link2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{video.title}</span>
                                                    {video.is_hero && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] py-0 px-2 h-4">MAIN</Badge>}
                                                </div>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{video.description || "No description provided."}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 rounded-full px-3 py-0.5">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {video.category || "General"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {video.created_at ? new Date(video.created_at).toLocaleDateString('es-AR', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <VideoActions video={video} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!videos || videos.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-48">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="p-4 rounded-full bg-muted/50">
                                                <VideoIcon className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <p className="font-medium text-muted-foreground">No videos found</p>
                                            <p className="text-xs text-muted-foreground/60">Start by adding your first promotional video.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
