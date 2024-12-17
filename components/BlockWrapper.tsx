import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block, BlockType } from '@/types'
import InfoBlock from './InfoBlock'
import ProjectBlock from './ProjectBlock'
import { ProfileCardProps } from '@/types'
import { ProjectCardProps } from '@/types'
import { InfoBlock_L } from './blocks/v2/profile/info-block'

interface BlockWrapperProps {
  block: Block
  isActive: boolean // Add this line
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, isActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0.5 : 1, // Add this line
  }

  const renderBlock = () => {
    switch (block.type) {
      case BlockType.InfoBlock:
        return <InfoBlock data={block.data as ProfileCardProps} />
      case BlockType.ProjectBlock:
        return <ProjectBlock data={block.data as ProjectCardProps} />
      case BlockType.InfoBlock_L:
        return <InfoBlock_L blockData={block.data as ProfileCardProps} onClick={() => {}}/>
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

