import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Project } from '@/types/types'
import { Textarea } from '../ui/textarea'

interface EditProjectDialogProps {
    project: Project
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export const EditProjectDialog = ({
    project,
    isOpen,
    onOpenChange,
    setProjects,
}: EditProjectDialogProps) => {
    const [clientName, setClientName] = useState(project.clientFullName)
    const [notes, setNotes] = useState(project.notes || '')

    const handleSave = () => {
        setProjects((prev) =>
            prev.map((p) =>
                p.id === project.id
                    ? { ...p, clientFullName: clientName, notes: notes.trim() || undefined }
                    : p
            )
        )
        onOpenChange(false)
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setClientName(project.clientFullName)
            setNotes(project.notes || '')
        }
        onOpenChange(open)
    }

    useEffect(() => {
        if (isOpen) {
            setClientName(project.clientFullName)
            setNotes(project.notes || '')
        }
    }, [isOpen, project])

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>Modify client and notes details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="client" className="text-right">
                            Client
                        </label>
                        <Input
                            id="client"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="notes" className="text-right">
                            Notes
                        </label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3 border rounded-md p-2"
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}