import { UUID } from 'crypto'

export enum ProjectTypeTitle {
    COURSEWORK = 'Курсовая',
    DIPLOMA = 'Дипломная',
    COMPANY_PRACTICE = 'Практика на предприятии',
    CPP_PRACTICE = 'Практическая С++',
}

export interface ProjectRole {
    id: UUID
    name: string
    isDeleted?: boolean
}

export interface ProjectType {
    id: UUID
    title: ProjectTypeTitle
    price: number
    payoutPercentages: Record<UUID, number>
    isDeleted?: boolean
}

export interface ProjectMember {
    id: UUID
    fullName: string
}

export interface Project {
    id: UUID
    clientFullName: string
    projectTypeId: UUID
    roleAssignments: Record<UUID, UUID | null>
    selected: boolean
    selectedTimestamp: number | null
    date: string | undefined
}

export interface AppData {
    projects: Project[]
    members: ProjectMember[]
    projectTypes: ProjectType[]
    projectRoles: ProjectRole[]
}
