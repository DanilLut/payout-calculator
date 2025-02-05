import {
    Project,
    ProjectMember,
    ProjectType,
    ProjectRole,
    AppData,
} from '@/types/types'

export const handleExport = (
    projects: Project[],
    members: ProjectMember[],
    projectTypes: ProjectType[],
    projectRoles: ProjectRole[]
) => {
    const exportData: AppData = {
        projects,
        members,
        projectTypes,
        projectRoles,
    }

    const blob = new Blob([JSON.stringify(exportData)], {
        type: 'application/json',
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'data-export.json'
    a.click()
    URL.revokeObjectURL(url)
}

export const handleImport = (
    event: React.ChangeEvent<HTMLInputElement>,
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
    setMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>,
    setProjectTypes: React.Dispatch<React.SetStateAction<ProjectType[]>>,
    setProjectRoles: React.Dispatch<React.SetStateAction<ProjectRole[]>>
) => {
    const file = event.target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(
                    e.target?.result as string
                ) as AppData
                setProjects(importedData.projects)
                setMembers(importedData.members)
                setProjectTypes(importedData.projectTypes)
                setProjectRoles(importedData.projectRoles)
            } catch (error) {
                console.error('Error parsing JSON file:', error)
            }
        }
        reader.readAsText(file)
    }
}
