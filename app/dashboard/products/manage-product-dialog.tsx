"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    is_dtf: boolean
    created_at?: string
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, {
        message: "Price must be a positive number.",
    }),
    stock: z.coerce.number().int().min(0).default(0),
    is_dtf: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface ManageProductDialogProps {
    onProductSaved?: () => void
    product?: Product
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function ManageProductDialog({
    onProductSaved,
    product,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    trigger
}: ManageProductDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const isEditing = !!product

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price || 0,
            stock: product?.stock || 0,
            is_dtf: product?.is_dtf || false,
        },
    })

    // Update form values when product prop changes
    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description || "",
                price: product.price,
                stock: product.stock,
                is_dtf: product.is_dtf,
            })
        } else {
            form.reset({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                is_dtf: false,
            })
        }
    }, [product, form])

    async function onSubmit(values: FormValues) {
        try {
            const url = isEditing
                ? `/api/products/${product.id}`
                : '/api/products'

            const method = isEditing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update product' : 'Failed to create product')
            }

            toast.success(isEditing ? "Product updated" : "Product created", {
                description: isEditing
                    ? `${values.name} has been updated.`
                    : `${values.name} has been added to your catalog.`,
            })

            setOpen(false)
            if (!isEditing) {
                form.reset()
            }

            if (onProductSaved) {
                onProductSaved()
            }

            // Reload page to reflect changes
            window.location.reload();

        } catch (error) {
            console.error(error)
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            ) : (
                !isControlled && (
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New Product
                        </Button>
                    </DialogTrigger>
                )
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Make changes to your product here. Click save when you're done."
                            : "Create a new product for your catalog. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description (optional)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_dtf"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>DTF Product</FormLabel>
                                        <FormDescription>
                                            Is this a DTF transfer sheet?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Product"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
