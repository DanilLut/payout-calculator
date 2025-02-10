import { useState } from 'react'
import { createContext, useContext, ReactNode } from 'react'
import { Project, ProjectMember, ProjectType, ProjectRole } from '@/types/types'

interface ProjectDataContextType {
    projects: Project[]
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
    members: ProjectMember[]
    setMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>
    projectTypes: ProjectType[]
    setProjectTypes: React.Dispatch<React.SetStateAction<ProjectType[]>>
    projectRoles: ProjectRole[]
    setProjectRoles: React.Dispatch<React.SetStateAction<ProjectRole[]>>
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(
    undefined
)

export function ProjectDataProvider({ children }: { children: ReactNode }) {
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

    return (
        <ProjectDataContext.Provider
            value={{
                projects,
                setProjects,
                members,
                setMembers,
                projectTypes,
                setProjectTypes,
                projectRoles,
                setProjectRoles,
            }}
        >
            {children}
        </ProjectDataContext.Provider>
    )
}

export const useProjectData = () => {
    const context = useContext(ProjectDataContext)
    if (!context) {
        throw new Error(
            'useProjectData must be used within a ProjectDataProvider'
        )
    }
    return context
}
