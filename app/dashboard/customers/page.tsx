import { supabase } from "@/lib/supabase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ManageCustomerDialog } from "./manage-customer-dialog"
import { CustomerActions } from "./customer-actions"

export default async function CustomersPage() {
    const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
                <ManageCustomerDialog />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="w-[70px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers?.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone || 'N/A'}</TableCell>
                                <TableCell>{customer.address || 'N/A'}</TableCell>
                                <TableCell>
                                    <CustomerActions customer={customer} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!customers || customers.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
