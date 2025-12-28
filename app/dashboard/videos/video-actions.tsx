"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Trash, ExternalLink, Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ManageVideoDialog, VideoItem } from "./manage-video-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface VideoActionsProps {
    video: VideoItem
}

export function VideoActions({ video }: VideoActionsProps) {
    const router = useRouter()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onDelete() {
        try {
            setLoading(true)
            const response = await fetch(`/api/videos/${video.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete video')
            }

            toast.success("Video deleted", {
                description: `${video.title} has been removed from your gallery.`,
            })

            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Error", {
                description: "Failed to delete video. Please try again.",
            })
        } finally {
            setLoading(false)
            setIsDeleteDialogOpen(false)
        }
    }

    async function onSetHero() {
        try {
            setLoading(true)
            const response = await fetch(`/api/videos/set-hero`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: video.id }),
            })

            if (!response.ok) {
                throw new Error('Failed to set hero video')
            }

            toast.success("Hero video updated", {
                description: `${video.title} is now the main video.`,
            })

            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Error", {
                description: "Failed to update main video.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-primary/5 transition-colors text-foreground">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl glass border-primary/10 shadow-xl p-1 z-[100]">
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg"
                        onClick={() => window.open(video.video_url, '_blank')}
                    >
                        <ExternalLink className="h-4 w-4 text-primary/70" />
                        <span>View Video</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg text-amber-500 focus:text-amber-600 focus:bg-amber-50"
                        onClick={onSetHero}
                        disabled={loading}
                    >
                        <Star className="h-4 w-4" />
                        <span>Set as Main Video</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Pencil className="h-4 w-4 text-primary/70" />
                        <span>Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                        <span>Delete Video</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ManageVideoDialog
                video={video}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-primary/10 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete
                            <strong className="text-foreground ml-1">{video.title}</strong> and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="rounded-xl border-primary/10 text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                onDelete()
                            }}
                            disabled={loading}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
                        >
                            {loading ? "Deleting..." : "Delete Video"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
