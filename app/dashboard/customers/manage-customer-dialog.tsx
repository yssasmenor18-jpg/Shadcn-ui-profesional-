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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface Customer {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    created_at?: string
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    address: z.string().optional(),
})

interface ManageCustomerDialogProps {
    onCustomerSaved?: () => void
    customer?: Customer
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function ManageCustomerDialog({
    onCustomerSaved,
    customer,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    trigger
}: ManageCustomerDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const isEditing = !!customer

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: customer?.name || "",
            email: customer?.email || "",
            phone: customer?.phone || "",
            address: customer?.address || "",
        },
    })

    // Update form values when customer prop changes
    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || "",
                address: customer.address || "",
            })
        } else {
            form.reset({
                name: "",
                email: "",
                phone: "",
                address: "",
            })
        }
    }, [customer, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const url = isEditing
                ? `/api/customers/${customer.id}`
                : '/api/customers'

            const method = isEditing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update customer' : 'Failed to create customer')
            }

            toast.success(isEditing ? "Customer updated" : "Customer created", {
                description: isEditing
                    ? `${values.name} has been updated.`
                    : `${values.name} has been added to your customers.`,
            })

            setOpen(false)
            if (!isEditing) {
                form.reset()
            }

            if (onCustomerSaved) {
                onCustomerSaved()
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
                            <Plus className="mr-2 h-4 w-4" /> Add New Customer
                        </Button>
                    </DialogTrigger>
                )
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Make changes to your customer here. Click save when you're done."
                            : "Create a new customer. Click save when you're done."}
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
                                        <Input placeholder="Customer name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="customer@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 (555) 000-0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St, City, State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Customer"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
