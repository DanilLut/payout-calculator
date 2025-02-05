import { useState, useEffect } from 'react'
import { useProjectsColumns } from '@/components/ProjectsTable/hooks/useProjectsColumns'

import { handleExport, handleImport } from '@/utils/data-utils'

import { Project, ProjectMember, ProjectType, ProjectRole } from '@/types/types'

import { DataTable } from '@/components/DataTable'
import { MembersManager } from '@/components/MembersManager'
import { NewProjectForm } from './NewProjectForm'

import { Button } from '@/components/ui/button'
import {
    RiUploadLine,
    RiDownloadLine,
    RiHistoryLine,
    RiListCheck2,
} from '@remixicon/react'

export function Dashboard() {
    const [projects, setProjects] = useState<Project[]>(() => {
        const savedData = localStorage.getItem('projectsData')
        return savedData ? (JSON.parse(savedData) as Project[]) : []
    })

    const [members, setMembers] = useState<ProjectMember[]>(() => {
        const savedMembers = localStorage.getItem('membersData')
        return savedMembers ? (JSON.parse(savedMembers) as ProjectMember[]) : []
    })

    const [projectTypes, setProjectTypes] = useState<ProjectType[]>(() => {
        const savedProjectTypes = localStorage.getItem('projectTypesData')
        return savedProjectTypes
            ? (JSON.parse(savedProjectTypes) as ProjectType[])
            : []
    })

    const [projectRoles, setProjectRoles] = useState<ProjectRole[]>(() => {
        const savedProjectRoles = localStorage.getItem('projectRolesData')
        return savedProjectRoles
            ? (JSON.parse(savedProjectRoles) as ProjectRole[])
            : []
    })

    useEffect(() => {
        localStorage.setItem('projectsData', JSON.stringify(projects))
    }, [projects])

    useEffect(() => {
        localStorage.setItem('membersData', JSON.stringify(members))

        setProjects((prevData) =>
            prevData.map((project) => ({
                ...project,
                roleAssignments: Object.fromEntries(
                    Object.entries(project.roleAssignments).map(
                        ([roleId, memberId]) => [
                            roleId,
                            members.some((m) => m.id === memberId)
                                ? memberId
                                : null,
                        ]
                    )
                ),
            }))
        )
    }, [members])

    useEffect(() => {
        localStorage.setItem('projectTypesData', JSON.stringify(projectTypes))
    }, [projectTypes])

    useEffect(() => {
        localStorage.setItem('projectRolesData', JSON.stringify(projectRoles))
    }, [projectRoles])

    const columns = useProjectsColumns(
        members,
        projectTypes,
        projectRoles,
        setProjects
    )

    const selectedData = projects
        .filter((item) => item.selected)
        .sort((a, b) => (b.selectedTimestamp ?? 0) - (a.selectedTimestamp ?? 0))

    const unselectedData = projects.filter((item) => !item.selected)

    return (
        <div className="container mx-auto py-10 grid">
            <div className="ml-auto flex gap-4 mb-8">
                <MembersManager members={members} setMembers={setMembers} />
                <Button
                    onClick={() => {
                        handleExport(
                            projects,
                            members,
                            projectTypes,
                            projectRoles
                        )
                    }}
                >
                    <RiUploadLine />
                    Export Data
                </Button>
                <Button asChild>
                    <label className="cursor-pointer">
                        <RiDownloadLine />
                        Import Data
                        <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                                handleImport(
                                    e,
                                    setProjects,
                                    setMembers,
                                    setProjectTypes,
                                    setProjectRoles
                                )
                            }}
                            className="hidden"
                        />
                    </label>
                </Button>
            </div>

            <NewProjectForm
                setProjects={setProjects}
                projectTypes={projectTypes}
            />

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RiListCheck2 />
                    Projects
                </h2>
                <DataTable columns={columns} data={unselectedData} />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RiHistoryLine /> History
                </h2>
                <DataTable columns={columns} data={selectedData} />
            </div>
        </div>
    )
}
