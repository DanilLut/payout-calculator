import { useState, useEffect } from 'react'
import { useProjectsColumns } from '@/components/ProjectsTable/hooks/useProjectsColumns'
import { useWindowSize } from 'usehooks-ts'

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
    RiMenuLine,
} from '@remixicon/react'
import { ThemeToggle } from './ThemeToggle'

export function Dashboard() {
    const [showMenu, setShowMenu] = useState(false)

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

    const totalUnselected = unselectedData.reduce((acc, project) => {
        const projectType = projectTypes.find(pt => pt.id === project.projectTypeId)
        return acc + (projectType?.price || 0)
    }, 0)

    const totalSelected = selectedData.reduce((acc, project) => {
        const projectType = projectTypes.find(pt => pt.id === project.projectTypeId)
        return acc + (projectType?.price || 0)
    }, 0)

    return (
        <div className="container mx-auto pb-10 md:px-16">
            <div className="flex justify-between mb-8">
                <ThemeToggle />

                {useWindowSize().width < 768 ? (
                    <Button
                        variant={'outline'}
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <RiMenuLine />
                    </Button>
                ) : null}
            </div>

            {useWindowSize().width > 768 || showMenu ? (
                <>
                    <div className="flex gap-4 mb-8 flex-col md:flex-row w-full justify-end">
                        <MembersManager
                            members={members}
                            setMembers={setMembers}
                        />
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
                </>
            ) : null}

            <div className="mt-8 w-full">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RiListCheck2 />
                    Projects
                </h2>
                <DataTable columns={columns} data={unselectedData} total={totalUnselected} />
            </div>

            <div className="mt-8 w-full">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RiHistoryLine /> History
                </h2>
                <DataTable columns={columns} data={selectedData} total={totalSelected} />
            </div>
        </div>
    )
}
