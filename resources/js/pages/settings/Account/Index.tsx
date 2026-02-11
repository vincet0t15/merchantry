import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from "react"

import { PaginatedDataResponse } from "@/types/pagination"
import { BranchProps } from "@/types/branch"

import Pagination from "@/components/paginationData"
import { User } from "@/types"
interface Props {
    users: PaginatedDataResponse<User>;
    filters: {
        search: string;
    };
}
export default function AccountIndex({ users, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickDelete = (user: User) => {
        setSelectedUser(user);
        setOpenDelete(true);
    }
    const handleClickEdit = (user: User) => {
        setSelectedUser(user);
        setOpenEdit(true);
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Account</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Button className="cursor-pointer " onClick={() => setOpenCreate(true)}>
                                <Plus className="size-4" />
                                <span className="rounded-sm lg:inline">Account</span>
                            </Button>

                            <div className="flex items-center gap-2">
                                <Input placeholder="Search..." />
                            </div>
                        </div>

                        <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="text-primary font-bold">Account Name</TableHead>
                                        <TableHead className="text-primary font-bold">Username</TableHead>
                                        <TableHead className="text-primary font-bold">Role</TableHead>
                                        <TableHead className="text-primary font-bold">Status</TableHead>
                                        <TableHead className="text-primary font-bold text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length > 0 ? (
                                        users.data.map((user, index) => (
                                            <TableRow key={index} className="text-sm">
                                                <TableCell className=" text-sm uppercase ">
                                                    <span>{user.name}</span>
                                                </TableCell>
                                                <TableCell className="text-sm ">
                                                    <span className="text-sm">{user.username}</span>
                                                </TableCell>
                                                <TableCell className="text-sm ">
                                                    <span className="text-sm">{user.role === true ? 'Admin' : 'User'}</span>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    <span className={user.is_active ? "text-green-500" : "text-red-500"}>
                                                        {user.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </TableCell>


                                                <TableCell className="text-sm gap-2 flex justify-end">
                                                    <span
                                                        className="cursor-pointer text-green-500 hover:text-orange-700 hover:underline"
                                                    >
                                                        Edit
                                                    </span>
                                                    <span
                                                        className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"

                                                    >
                                                        Delete
                                                    </span>

                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                                No data available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <Pagination data={users} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
