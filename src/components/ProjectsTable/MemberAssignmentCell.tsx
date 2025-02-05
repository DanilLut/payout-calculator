import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'
import { ProjectMember } from '@/types/types'

interface MemberAssignmentCellProps {
    memberId: string | null
    onValueChange: (value: string | null) => void
    members: ProjectMember[]
}

const isValidMember = (id: string | null, members: ProjectMember[]) =>
    id === null || members.some((m) => m.id === id)

export const MemberAssignmentCell = ({
    memberId,
    onValueChange,
    members,
}: MemberAssignmentCellProps) => {
    useEffect(() => {
        if (memberId && !isValidMember(memberId, members)) {
            onValueChange(null)
        }
    }, [members, memberId, onValueChange])

    const selectedName = members.find((n) => n.id === memberId)?.fullName ?? '-'

    return (
        <Select
            value={memberId ?? '-'}
            onValueChange={(newId) => {
                onValueChange(newId === '-' ? null : newId)
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="-">{selectedName}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="-">-</SelectItem>
                {members.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.fullName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
