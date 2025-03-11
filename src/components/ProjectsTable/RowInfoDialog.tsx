import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Project } from '@/types/types'
import { useProjectData } from '@/contexts/ProjectDataContext'

interface RowInfoDialogProps {
    row: Project
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export const RowInfoDialog = ({
    row,
    isOpen,
    onOpenChange,
}: RowInfoDialogProps) => {
    const { projectTypes } = useProjectData()
    const projectType = projectTypes.find((pt) => pt.id === row.projectTypeId)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {projectType?.title || row.projectTypeId}
                    </DialogTitle>
                    <DialogDescription>Project Details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <p className="font-medium">Client Name:</p>
                        <p>{row.clientFullName}</p>
                    </div>
                    <div>
                        <p className="font-medium">Project Type:</p>
                        <p>{projectType?.title || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Project Price:</p>
                        <p>
                            {projectType?.price
                                ? `${projectType.price} грн.`
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Creation Date:</p>
                        <p>
                            {new Date(row.creationDate).toLocaleString(
                                undefined,
                                {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                }
                            )}
                        </p>
                    </div>
                    {row.selectedTimestamp && (
                        <div>
                            <p className="font-medium">Completion Date:</p>
                            <p>
                                {new Date(row.selectedTimestamp).toLocaleString(
                                    undefined,
                                    {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    }
                                )}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="font-medium">Notes:</p>
                        <p className="whitespace-pre-wrap">
                            {row.notes || 'No notes'}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
