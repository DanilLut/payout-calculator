import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ProjectMember } from '@/types/types'
import { UUID } from 'crypto'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { RiGroupLine } from '@remixicon/react'

interface MembersManagerProps {
    members: ProjectMember[]
    setMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>
}

interface MemberFormState {
    currentName: string
    editingId: string | null
}

export const MembersManager = ({
    members,
    setMembers,
}: MembersManagerProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formState, setFormState] = useState<MemberFormState>({
        currentName: '',
        editingId: null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formState.currentName.trim()) return

        const { editingId, currentName } = formState
        const trimmedName = currentName.trim()

        setMembers((prevMembers) =>
            editingId
                ? prevMembers.map((member) =>
                      member.id === editingId
                          ? { ...member, fullName: trimmedName }
                          : member
                  )
                : [
                      ...prevMembers,
                      { id: uuidv4() as UUID, fullName: trimmedName },
                  ]
        )

        setFormState({ currentName: '', editingId: null })
    }

    const handleEdit = (member: ProjectMember) => {
        setFormState({ currentName: member.fullName, editingId: member.id })
    }

    const handleDelete = (id: string) => {
        setMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== id)
        )
    }

    const handleCancel = () => {
        setFormState({ currentName: '', editingId: null })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <RiGroupLine />
                    Manage Members
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            value={formState.currentName}
                            onChange={(e) => {
                                setFormState((prev) => ({
                                    ...prev,
                                    currentName: e.target.value,
                                }))
                            }}
                            placeholder="Enter member name"
                            aria-label="Member name"
                        />
                        <Button type="submit">
                            {formState.editingId
                                ? 'Update Member'
                                : 'Add Member'}
                        </Button>
                    </div>

                    <MemberList
                        members={members}
                        editingId={formState.editingId}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCancel={handleCancel}
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface MemberListProps {
    members: ProjectMember[]
    editingId: string | null
    onEdit: (member: ProjectMember) => void
    onDelete: (id: string) => void
    onCancel: () => void
}

const MemberList = ({
    members,
    editingId,
    onEdit,
    onDelete,
    onCancel,
}: MemberListProps) => (
    <ul className="space-y-3">
        {members.map((member) => (
            <li key={member.id} className="flex justify-between items-center">
                <span className="font-medium">{member.fullName}</span>
                <div className="space-x-2">
                    {member.id === editingId ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            aria-label="Cancel editing"
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onEdit(member)
                            }}
                            aria-label={`Edit ${member.fullName}`}
                        >
                            Edit
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            onDelete(member.id)
                        }}
                        aria-label={`Delete ${member.fullName}`}
                    >
                        Delete
                    </Button>
                </div>
            </li>
        ))}
    </ul>
)
