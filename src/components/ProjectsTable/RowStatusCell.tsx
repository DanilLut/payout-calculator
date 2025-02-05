import { Checkbox } from '@/components/ui/checkbox'
import { Row } from '@tanstack/react-table'
import { Project } from '@/types/types'

interface RowStatusCellProps {
    row: Row<Project>
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export const RowStatusCell = ({ row, setProjects }: RowStatusCellProps) => {
    return (
        <Checkbox
            checked={row.original.selected}
            onCheckedChange={(checked) => {
                setProjects((prev) =>
                    prev.map((item) =>
                        item.id === row.original.id
                            ? {
                                  ...item,
                                  selected: !!checked,
                                  selectedTimestamp: checked
                                      ? Date.now()
                                      : null,
                              }
                            : item
                    )
                )
            }}
        />
    )
}
