import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Block } from '@/types'
import BlockWrapper from './BlockWrapper'
import { useDroppable } from '@dnd-kit/core'

interface ColumnProps {
  blocks: Block[]
  activeId?: string | null
  id: string
  onBlockClick?: (block: Block) => void
  onDeleteBlock?: (blockId: string) => void
  isEditing: boolean
}

export default function Column({ blocks, activeId, id, onBlockClick, onDeleteBlock, isEditing }: ColumnProps) {
  const { setNodeRef } = useDroppable({ 
    id: isEditing ? id : `template-${id}`,
    data: {
      type: 'column',
      columnId: id
    },
    disabled: !isEditing
  })

  const handleBlockUpdate = (blockIndex: number, newData: any) => {
    const newBlocks = [...blocks]
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      data: newData
    }
  }

  const content = (
    <div 
      ref={isEditing ? setNodeRef : undefined} 
      className={`flex flex-col gap-2 p-1 ${isEditing ? 'bg-gray-100 rounded-lg' : ''}`}
    >
      {blocks.map((block, blockIndex) => (
        <BlockWrapper 
          key={block.id} 
          block={block} 
          isActive={isEditing ? block.id === activeId : false}
          columnId={id}
          onClick={() => onBlockClick?.(block)}
          location={isEditing ? 'canvas' : 'sideBar'}
          onUpdate={(newData) => handleBlockUpdate(blockIndex, newData)}
          onDelete={onDeleteBlock}
        />
      ))}
      {isEditing && blocks.length === 0 && (
        <div className="h-full min-h-[200px] min-w-[392px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          Drop items here
        </div>
      )}
    </div>
  )

  return (
    <div className="flex-1">
      {isEditing ? (
        <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
          {content}
        </SortableContext>
      ) : (
        content
      )}
    </div>
  )
}

