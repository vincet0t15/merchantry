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
import BranchCreate from "./create"
export default function Page() {
    const [openCreate, setOpenCreate] = useState(false);
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
                                    <BreadcrumbPage>Branches</BreadcrumbPage>
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
                                <span className="rounded-sm lg:inline">Branch</span>
                            </Button>

                            <div className="flex items-center gap-2">
                                <Input placeholder="Search..." />
                            </div>
                        </div>

                        <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="text-primary font-bold">Course Name</TableHead>
                                        <TableHead className="text-primary font-bold">Course Code</TableHead>
                                        <TableHead className="text-primary font-bold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* {courses.data.length > 0 ? (
                                        courses.data.map((course, index) => (
                                            <TableRow key={index} className="text-sm">
                                                <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                                    <span onClick={() => handleClickName(course)}>{course.course_name}</span>
                                                </TableCell>
                                                <TableCell className="text-sm uppercase">{course.course_code}</TableCell>
                                                <TableCell className="text-sm gap-2 flex">
                                                    <span
                                                        className="cursor-pointer text-green-500 hover:text-orange-700 hover:underline"
                                                        onClick={() => handleClickEdit(course)}
                                                    >
                                                        Edit
                                                    </span>
                                                    <span
                                                        className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                        onClick={() => handleClickDelete(course)}
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
                                    )} */}
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            {/* <Pagination data={courses} /> */}
                        </div>



                        {openCreate && <BranchCreate open={openCreate} setOpen={setOpenCreate} />}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
