'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Block, BlockType } from "@/types"
import { DynamicBlockForm } from "./forms/DynamicBlockForm"

interface EditBlockSheetProps {
    block: Block | null
    isOpen: boolean
    onClose: () => void
    onSave: (updatedBlock: Block) => void
}

export function EditBlockSheet({ block, isOpen, onClose, onSave }: EditBlockSheetProps) {
    console.log('EditBlockSheet render:', { block, isOpen })
    
    if (!block) return null

    const getFormTitle = () => {
        switch (block.type) {
            case BlockType.InfoBlock_L:
            case BlockType.InfoBlock_M:
                return "Edit Profile"
            case BlockType.ProjectBlock_L:
            case BlockType.ProjectBlock_M:
                return "Edit Project"
            case BlockType.EducationBlock_L:
            case BlockType.EducationBlock_M:
                return "Edit Education"
            case BlockType.PublicationBlock_L:
            case BlockType.PublicationBlock_M:
                return "Edit Publication"
            case BlockType.ExperienceBlock_L:
            case BlockType.ExperienceBlock_M:
                return "Edit Experience"
            default:
                return "Edit Block"
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{getFormTitle()}</SheetTitle>
                </SheetHeader>
                <DynamicBlockForm block={block} onSave={onSave} />
            </SheetContent>
        </Sheet>
    )
} 