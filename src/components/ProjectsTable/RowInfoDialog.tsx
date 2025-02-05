import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Project } from '@/types/types'

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
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{row.id}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {row.selectedTimestamp && (
                        <div>
                            <p className="font-medium">Дата выполнения:</p>
                            <p>
                                {new Date(
                                    row.selectedTimestamp
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
