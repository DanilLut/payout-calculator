import { TableRow, TableCell } from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Project, ProjectMember, ProjectType, ProjectRole } from '@/types/types'
import { UUID } from 'crypto'

interface RoleAssignmentRowsProps {
    project: Project
    projectType: ProjectType | undefined
    members: ProjectMember[]
    projectRoles: ProjectRole[]
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export const RoleAssignmentRows = ({
    project,
    projectType,
    members,
    projectRoles,
    setProjects,
}: RoleAssignmentRowsProps) => {
    let totalMembersPayout = 0
    let totalMiddlemanPayout = 0

    const rows = Object.entries(project.roleAssignments).map(
        ([roleId, memberId]) => {
            const role = projectRoles.find((r) => r.id === roleId)
            const member = members.find((m) => m.id === memberId)

            const rolePayoutPercentage =
                projectType?.payoutPercentages[roleId as UUID] || 0
            const basePayoutAmount =
                ((projectType?.price ?? 0) / 100) * rolePayoutPercentage

            const middlemanFeePercent = 10
            const middlemanFee = Math.ceil(
                (basePayoutAmount / 100) * middlemanFeePercent
            )
            const memberPayoutAmount = Math.ceil(
                basePayoutAmount - middlemanFee
            )

            totalMembersPayout += memberPayoutAmount
            totalMiddlemanPayout += middlemanFee

            return (
                <TableRow key={roleId}>
                    <TableCell>{role?.name || 'Unassigned Role'}</TableCell>
                    <TableCell>
                        <Select
                            value={memberId ?? 'unassigned'}
                            onValueChange={(newMemberId) => {
                                setProjects((prev) =>
                                    prev.map((p) => {
                                        if (p.id === project.id) {
                                            return {
                                                ...p,
                                                roleAssignments: {
                                                    ...p.roleAssignments,
                                                    [roleId]:
                                                        newMemberId ===
                                                        'unassigned'
                                                            ? null
                                                            : newMemberId,
                                                },
                                            }
                                        }
                                        return p
                                    })
                                )
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select member">
                                    {member?.fullName || '-'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">-</SelectItem>
                                {members.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.fullName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell className="text-right">
                        {memberPayoutAmount} грн.
                        {/* ${rolePayoutPercentage.toFixed(2)}%)` */}
                    </TableCell>
                    <TableCell className="text-right">
                        {middlemanFee} грн.
                    </TableCell>
                </TableRow>
            )
        }
    )

    const summaryRow = (
        <TableRow key="total" className="h-12">
            <TableCell colSpan={2} className="font-bold">
                Total
            </TableCell>
            <TableCell className="text-right font-bold">
                {totalMembersPayout} грн.
            </TableCell>
            <TableCell className="text-right font-bold">
                {totalMiddlemanPayout} грн.
            </TableCell>
        </TableRow>
    )

    return [...rows, summaryRow]
}
