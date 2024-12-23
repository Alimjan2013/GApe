import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block, BlockType } from '@/types'
import { ProfileCardProps,ProjectCardProps,EducationCardProps,ExperienceCardProps,PublicationCardProps } from '@/types'
import { InfoBlock_L,InfoBlock_M } from './blocks/v2/profile/info-block'
import { ProjectBlock_L,ProjectBlock_M } from './blocks/v2/profile/ProjectCard'
import { EduBlock_L,EduBlock_M } from './blocks/v2/profile/EducationCard'
import { PublicationBlock_L,PublicationBlock_M } from './blocks/v2/profile/PublicationCard'
import { WorkBlock_L,WorkBlock_M } from './blocks/v2/profile/ExperienceCard'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlockWrapperProps {
  block: Block
  isActive?: boolean
  columnId?: string
  onClick?: () => void
  location: 'canvas' | 'sideBar'
  onUpdate?: (newData: any) => void
  onAdd?: () => void
  onDelete?: (blockId: string) => void
}

const BlockWrapper = ({ block, isActive, columnId ,location, onClick, onUpdate, onAdd, onDelete}: BlockWrapperProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: block.id,
    data: {
      type: 'block',
      block,
      columnId,
      location
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0.5 : 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-trigger') || 
        (e.target as HTMLElement).closest('.edit-trigger')) {
      return;
    }

    console.log('BlockWrapper click', { transform, location, blockId: block.id })
    e.stopPropagation()

    if (location === 'sideBar') {
      onAdd?.()
    }
  }

  const renderBlock = () => {
    switch (block.type) {
      case BlockType.InfoBlock_L:
        return <InfoBlock_L blockData={block.data as ProfileCardProps} onClick={() => {}}/>
      case BlockType.InfoBlock_M:
        return <InfoBlock_M blockData={block.data as ProfileCardProps} onClick={() => {}}/>
      case BlockType.ProjectBlock_L:
        return <ProjectBlock_L blockData={block.data as ProjectCardProps} onClick={() => {}}/>
      case BlockType.ProjectBlock_M:
        return <ProjectBlock_M blockData={block.data as ProjectCardProps} onClick={() => {}}/>
      case BlockType.EducationBlock_L:
        return <EduBlock_L blockData={block.data as EducationCardProps} onClick={() => {}}/>
      case BlockType.EducationBlock_M:
        return <EduBlock_M blockData={block.data as EducationCardProps} onClick={() => {}}/>
      case BlockType.PublicationBlock_L:
        return <PublicationBlock_L blockData={block.data as PublicationCardProps} onClick={() => {}}/>
      case BlockType.PublicationBlock_M:
        return <PublicationBlock_M blockData={block.data as PublicationCardProps} onClick={() => {}}/>
      case BlockType.ExperienceBlock_L:
        return <WorkBlock_L blockData={block.data as ExperienceCardProps} onClick={() => {}}/>
      case BlockType.ExperienceBlock_M:
        return <WorkBlock_M blockData={block.data as ExperienceCardProps} onClick={() => {}}/>
      // Add more cases for other block types here
      default:
        return <div>Unknown block type</div>
    }
  }

  const wrapperClasses = `
    ${location === 'sideBar' ? 'cursor-pointer hover:opacity-75' : ''}
    ${location === 'canvas' ? 'cursor-move' : ''}
    relative
    group
  `

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(location === 'canvas' ? { ...attributes, ...listeners } : {})}
      className={wrapperClasses}
      onClick={handleClick}
    >
      {location === 'canvas' && (
        <div className="absolute -top-2 -right-2 flex flex-col gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="edit-trigger h-6 w-6 border border-customeBorder"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="delete-trigger h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={e => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the block.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(block.id);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {renderBlock()}
    </div>
  )
}

export default BlockWrapper

