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
interface BlockWrapperProps {
  block: Block
  isActive: boolean
  columnId: string
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, isActive, columnId }) => {
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
      columnId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0.5 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      {renderBlock()}
    </div>
  )
}

export default BlockWrapper

