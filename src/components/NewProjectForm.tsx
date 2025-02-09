import { useState } from 'react'

import { UUID } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { Project, ProjectType } from '@/types/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { RiAddLargeLine } from '@remixicon/react'

interface NewProjectFormProps {
    projectTypes: ProjectType[]
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export const NewProjectForm = ({
    projectTypes,
    setProjects,
}: NewProjectFormProps) => {
    const [newClientName, setNewClientName] = useState('')
    const [selectedProjectTypeId, setSelectedProjectTypeId] = useState<
        UUID | ''
    >('')

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProjectTypeId || !newClientName.trim()) return

        const projectType = projectTypes.find(
            (pt) => pt.id === selectedProjectTypeId
        )
        if (!projectType) return

        const newProject: Project = {
            id: uuidv4() as UUID,
            clientFullName: newClientName.trim(),
            projectTypeId: selectedProjectTypeId,
            roleAssignments: Object.keys(projectType.payoutPercentages).reduce<
                Record<UUID, null>
            >((acc, roleId) => {
                acc[roleId as UUID] = null
                return acc
            }, {}),
            selected: false,
            selectedTimestamp: null,
            creationDate: Date.now(),
        }

        setProjects((prev) => [...prev, newProject])
        setNewClientName('')
        setSelectedProjectTypeId('')
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4  flex items-center gap-2">
                <RiAddLargeLine />
                New Project
            </h2>
            <form
                onSubmit={handleCreateProject}
                className="flex gap-4 flex-col md:flex-row"
            >
                <div className="flex-1">
                    <Input
                        placeholder="Client Full Name"
                        value={newClientName}
                        onChange={(e) => {
                            setNewClientName(e.target.value)
                        }}
                        required
                    />
                </div>
                <div>
                    <Select
                        value={selectedProjectTypeId}
                        onValueChange={(value) => {
                            setSelectedProjectTypeId(value as UUID)
                        }}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Project Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {projectTypes.map((pt) => (
                                <SelectItem key={pt.id} value={pt.id}>
                                    {pt.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit">Create Project</Button>
            </form>
        </div>
    )
}
