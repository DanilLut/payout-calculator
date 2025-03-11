import { useState } from 'react'
import { UUID } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { Project, ProjectType, ProjectTypeTitle } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RiAddLargeLine, RiUser3Line, RiFileListLine, RiNumbersLine } from '@remixicon/react'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

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
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState('')

    const selectedType = projectTypes.find(
        (pt) => pt.id === selectedProjectTypeId
    )

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProjectTypeId || !newClientName.trim() || !selectedType)
            return

        const newProject: Project = {
            id: uuidv4() as UUID,
            clientFullName: newClientName.trim(),
            projectTypeId: selectedProjectTypeId,
            roleAssignments: Object.keys(selectedType.payoutPercentages).reduce<
                Record<UUID, null>
            >((acc, roleId) => {
                acc[roleId as UUID] = null
                return acc
            }, {}),
            selected: false,
            selectedTimestamp: null,
            creationDate: Date.now(),
            ...(selectedType.title === ProjectTypeTitle.KKR && { quantity }),
            notes,
        }

        setProjects((prev) => [...prev, newProject])
        setNewClientName('')
        setSelectedProjectTypeId('')
        setQuantity(1)
        setNotes('')
    }

    return (
        <Card className="mb-8 shadow-md overflow-hidden border-none">
            {/* <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <RiAddLargeLine className="text-2xl" />
                    New Project
                </CardTitle>
            </CardHeader> */}
            {/* <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <RiAddLargeLine />
                    New Project
                </h2>
            </CardHeader> */}
            <CardContent className="pt-3">
                <form onSubmit={handleCreateProject} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="clientName" className="flex items-center gap-2 text-sm font-medium">
                                <RiUser3Line className="text-blue-600 dark:text-blue-400" />
                                Client Name
                            </Label>
                            <Input
                                id="clientName"
                                placeholder="Enter client's full name"
                                value={newClientName}
                                onChange={(e) => setNewClientName(e.target.value)}
                                required
                                className="transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="projectType" className="flex items-center gap-2 text-sm font-medium">
                                <RiFileListLine className="text-blue-600 dark:text-blue-400" />
                                Project Type
                            </Label>
                            <Select
                                value={selectedProjectTypeId}
                                onValueChange={(value) => {
                                    const id = value as UUID
                                    setSelectedProjectTypeId(id)
                                    const type = projectTypes.find((pt) => pt.id === id)
                                    setQuantity(
                                        type?.title === ProjectTypeTitle.KKR ? 1 : 1
                                    )
                                }}
                                required
                            >
                                <SelectTrigger id="projectType" className="w-full transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <SelectValue placeholder="Select a project type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projectTypes.map((pt) => (
                                        <SelectItem key={pt.id} value={pt.id} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900">
                                            {pt.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedType?.title === ProjectTypeTitle.KKR && (
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium">
                                    <RiNumbersLine className="text-blue-600 dark:text-blue-400" />
                                    Quantity
                                </Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(1, parseInt(e.target.value) || 1)
                                        )
                                    }
                                    placeholder="Enter quantity"
                                    className="transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        <div className={`space-y-2 ${selectedType?.title === ProjectTypeTitle.KKR ? '' : 'md:col-span-2'}`}>
                            <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium">
                                <RiFileListLine className="text-blue-600 dark:text-blue-400" />
                                Project Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any important details about this project..."
                                className="min-h-24 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all duration-200 shadow-sm hover:shadow"
                        >
                            Create Project
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}