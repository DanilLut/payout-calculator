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
    RiCloseLine,
    RiCalendarLine,
} from '@remixicon/react'
import { ThemeToggle } from './ThemeToggle'

import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { UUID } from 'crypto'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface ProjectFilters {
    client: string
    projectType: UUID | null
    dateRange: DateRange | undefined
}

export function Dashboard() {
    const [showMenu, setShowMenu] = useState(false)

    const [projects, setProjects] = useState<Project[]>(() =>
        JSON.parse(localStorage.getItem('projectsData') || '[]')
    )
    const [members, setMembers] = useState<ProjectMember[]>(() =>
        JSON.parse(localStorage.getItem('membersData') || '[]')
    )
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>(() =>
        JSON.parse(localStorage.getItem('projectTypesData') || '[]')
    )
    const [projectRoles, setProjectRoles] = useState<ProjectRole[]>(() =>
        JSON.parse(localStorage.getItem('projectRolesData') || '[]')
    )

    const [unselectedFilters, setUnselectedFilters] = useState<ProjectFilters>({
        client: '',
        projectType: null,
        dateRange: undefined,
    })

    const [selectedFilters, setSelectedFilters] = useState<ProjectFilters>({
        client: '',
        projectType: null,
        dateRange: undefined,
    })

    const filterProjects = (projects: Project[], filters: ProjectFilters) => {
        return projects.filter((project) => {
            const projectDate = new Date(project.creationDate)
            const start = filters.dateRange?.from
            const end = filters.dateRange?.to
                ? addDays(filters.dateRange.to, 1)
                : filters.dateRange?.from

            const dateMatch =
                !start || !end
                    ? true
                    : projectDate >= start && projectDate <= end
            const clientMatch = project.clientFullName
                .toLowerCase()
                .includes(filters.client.toLowerCase())
            const typeMatch = filters.projectType
                ? project.projectTypeId === filters.projectType
                : true

            return dateMatch && clientMatch && typeMatch
        })
    }

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

    const clearSelectedProjects = () => {
        setProjects((prev) => prev.filter((project) => !project.selected))
    }

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

    const filteredUnselectedData = filterProjects(
        unselectedData,
        unselectedFilters
    )
    const filteredSelectedData = filterProjects(selectedData, selectedFilters)

    const totalUnselected = filteredUnselectedData.reduce(
        (acc, project) =>
            acc +
            (projectTypes.find((pt) => pt.id === project.projectTypeId)
                ?.price || 0),
        0
    )

    const totalSelected = filteredSelectedData.reduce(
        (acc, project) =>
            acc +
            (projectTypes.find((pt) => pt.id === project.projectTypeId)
                ?.price || 0),
        0
    )

    return (
        <div className="container mx-auto pb-10 md:px-16">
            <div className="flex justify-between mb-8">
                <ThemeToggle />
                {useWindowSize().width < 768 && (
                    <Button
                        variant="outline"
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <RiMenuLine />
                    </Button>
                )}
            </div>

            {(useWindowSize().width > 768 || showMenu) && (
                <>
                    <div className="flex gap-4 mb-8 flex-col md:flex-row w-full justify-end">
                        <MembersManager
                            members={members}
                            setMembers={setMembers}
                        />
                        <Button
                            onClick={() =>
                                handleExport(
                                    projects,
                                    members,
                                    projectTypes,
                                    projectRoles
                                )
                            }
                        >
                            <RiUploadLine /> Export Data
                        </Button>
                        <Button asChild>
                            <label className="cursor-pointer">
                                <RiDownloadLine /> Import Data
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={(e) =>
                                        handleImport(
                                            e,
                                            setProjects,
                                            setMembers,
                                            setProjectTypes,
                                            setProjectRoles
                                        )
                                    }
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
            )}

            <div className="mt-8 w-full">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RiListCheck2 /> Projects
                </h2>
                <FilterBar
                    filters={unselectedFilters}
                    setFilters={setUnselectedFilters}
                    projectTypes={projectTypes}
                />
                <DataTable
                    columns={columns}
                    data={filteredUnselectedData}
                    total={totalUnselected}
                />
            </div>

            <div className="mt-8 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <RiHistoryLine /> History
                    </h2>
                    <Button
                        variant="ghost"
                        onClick={clearSelectedProjects}
                        disabled={selectedData.length === 0}
                    >
                        <RiCloseLine className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>
                </div>
                <FilterBar
                    filters={selectedFilters}
                    setFilters={setSelectedFilters}
                    projectTypes={projectTypes}
                />
                <DataTable
                    columns={columns}
                    data={filteredSelectedData}
                    total={totalSelected}
                />
            </div>
        </div>
    )
}

interface FilterBarProps {
    filters: ProjectFilters
    setFilters: React.Dispatch<React.SetStateAction<ProjectFilters>>
    projectTypes: ProjectType[]
}

function FilterBar({
    filters,
    setFilters,
    projectTypes,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'md:w-[240px] w-full justify-start text-left font-normal',
                            !filters.dateRange && 'text-muted-foreground'
                        )}
                    >
                        <RiCalendarLine className="mr-2 h-4 w-4" />
                        {filters.dateRange?.from ? (
                            filters.dateRange.to ? (
                                <>
                                    {format(filters.dateRange.from, 'LLL dd')} -{' '}
                                    {format(filters.dateRange.to, 'LLL dd')}
                                </>
                            ) : (
                                format(filters.dateRange.from, 'LLL dd')
                            )
                        ) : (
                            <span>Sort by date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={filters.dateRange}
                        onSelect={(dateRange) =>
                            setFilters((prev) => ({ ...prev, dateRange }))
                        }
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Input
                placeholder="Filter by client..."
                value={filters.client}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, client: e.target.value }))
                }
                className="md:max-w-[200px]"
            />

            <Select
                value={filters.projectType || 'all'}
                onValueChange={(value) =>
                    setFilters((prev) => ({
                        ...prev,
                        projectType: value === 'all' ? null : (value as UUID),
                    }))
                }
            >
                <SelectTrigger className="md:w-[180px]">
                    <SelectValue placeholder="All project types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Filter by Types</SelectItem>
                    {projectTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                            {type.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
