import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block, BlockType } from '@/types'
import InfoBlock from './InfoBlock'
import ProjectBlock from './ProjectBlock'

interface BlockWrapperProps {
  block: Block
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block }) => {
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
  }

  const renderBlock = () => {
    switch (block.type) {
      case BlockType.InfoBlock:
        return <InfoBlock data={block.data} />
      case BlockType.ProjectBlock:
        return <ProjectBlock data={block.data} />
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
      className="mb-4 cursor-move"
    >
      {renderBlock()}
    </div>
  )
}

export default BlockWrapper

