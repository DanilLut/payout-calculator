import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import {
    Project,
    ProjectMember,
    ProjectType,
    ProjectRole,
    ProjectTypeTitle,
} from '@/types/types'

import { RowStatusCell } from '@/components/ProjectsTable/RowStatusCell'
import { RowActionsCell } from '@/components/ProjectsTable/RowActionsCell'

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { RoleAssignmentRows } from '../RoleAssinmentRows'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UUID } from 'crypto'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import CollapsibleSection from '../ProjectMembersCollapsible'

export const useProjectsColumns = (
    members: ProjectMember[],
    projectTypes: ProjectType[],
    projectRoles: ProjectRole[],
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
    const columns: ColumnDef<Project>[] = useMemo(
        () => [
            {
                id: 'select',
                header: 'Статус',
                cell: ({ row }) => (
                    <RowStatusCell row={row} setProjects={setProjects} />
                ),
            },

            {
                accessorKey: 'clientFullName',
                header: 'Client',
            },

            {
                header: 'Project Type',
                cell: ({ row }) => {
                    const project = row.original
                    const currentProjectType = projectTypes.find(
                        (pt) => pt.id === project.projectTypeId
                    )

                    return (
                        <Select
                            value={currentProjectType?.title ?? ''}
                            onValueChange={(selectedTitle) => {
                                const newProjectType = projectTypes.find(
                                    (pt) =>
                                        pt.title ===
                                        (selectedTitle as ProjectTypeTitle)
                                )
                                if (newProjectType) {
                                    setProjects((prev) =>
                                        prev.map((p) => {
                                            if (p.id === project.id) {
                                                const newRoleAssignments =
                                                    Object.keys(
                                                        newProjectType.payoutPercentages
                                                    ).reduce<
                                                        Record<UUID, null>
                                                    >((acc, roleId) => {
                                                        acc[roleId as UUID] =
                                                            null
                                                        return acc
                                                    }, {})

                                                return {
                                                    ...p,
                                                    projectTypeId:
                                                        newProjectType.id,
                                                    roleAssignments:
                                                        newRoleAssignments,
                                                }
                                            }
                                            return p
                                        })
                                    )
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ProjectTypeTitle).map(
                                    (title) => (
                                        <SelectItem key={title} value={title}>
                                            {title}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    )
                },
            },

            {
                header: 'Project Members',
                cell: ({ row }) => {
                    const project = row.original
                    const projectType = projectTypes.find(
                        (pt) => pt.id === project.projectTypeId
                    )

                    return (
                        <CollapsibleSection>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Role Name</TableHead>
                                        <TableHead>Assigned Member</TableHead>
                                        <TableHead className="text-right">
                                            Выплата, грн.
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Богдану Л.
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <RoleAssignmentRows
                                        project={project}
                                        projectType={projectType}
                                        members={members}
                                        projectRoles={projectRoles}
                                        setProjects={setProjects}
                                    />
                                </TableBody>
                            </Table>
                        </CollapsibleSection>
                    )
                },
            },
            {
                header: 'Цена проекта',
                cell: ({ row }) => {
                    const projectType = projectTypes.find(
                        (pt) => pt.id === row.original.projectTypeId
                    )
                    return projectType?.price ?? 'N/A'
                },
            },

            {
                id: 'actions',
                cell: ({ row }) => (
                    <RowActionsCell row={row} setProjects={setProjects} />
                ),
            },
        ],
        [members, projectTypes, projectRoles, setProjects]
    )

    return columns
}
