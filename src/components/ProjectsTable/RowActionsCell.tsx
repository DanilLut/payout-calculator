import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Project } from '@/types/types'
import { RowInfoDialog } from '@/components/ProjectsTable/RowInfoDialog'
import { EditProjectDialog } from './EditProjectDialog'

interface RowActionsCellProps {
    row: Row<Project>
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export const RowActionsCell = ({ row, setProjects }: RowActionsCellProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = () => {
        console.log(row.original.id)
        setProjects((prev) => prev.filter((p) => p.id != row.original.id))
    }

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setIsDialogOpen(true)
                        }}
                    >
                        Show Info
                    </DropdownMenuItem>
                    <DropdownMenuItem
                onClick={() => setIsEditDialogOpen(true)}
            >
                Edit
            </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={handleDelete}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditProjectDialog
                project={row.original}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                setProjects={setProjects}
            />
            <RowInfoDialog
                row={row.original}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
