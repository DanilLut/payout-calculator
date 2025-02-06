import { useState } from 'react'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible'

import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react'

interface CollapsibleSectionProps {
    children: React.ReactNode
}

const CollapsibleSection = ({ children }: CollapsibleSectionProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
            <div>
                <CollapsibleTrigger className="w-full h-10 flex items-center justify-end">
                    {isOpen ? (
                        <span className="flex items-center text-nowrap text-zinc-400">
                            Hide <RiArrowUpSLine />
                        </span>
                    ) : (
                        <span className="flex items-center text-nowrap text-zinc-400">
                            Show all <RiArrowDownSLine />
                        </span>
                    )}
                </CollapsibleTrigger>
                <CollapsibleContent>{children}</CollapsibleContent>
            </div>
        </Collapsible>
    )
}

export default CollapsibleSection
