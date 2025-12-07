import { supabase } from "@/lib/supabase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CreateProductDialog } from "./create-product-dialog"

export default async function ProductsPage() {
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <CreateProductDialog />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.is_dtf ? 'DTF' : 'Tote Bag'}</TableCell>
                            </TableRow>
                        ))}
                        {products?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
