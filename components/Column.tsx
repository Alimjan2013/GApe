import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Block } from '@/types'
import BlockWrapper from './BlockWrapper'
import { useDroppable } from '@dnd-kit/core'

interface ColumnProps {
  blocks: Block[]
  activeId: string | null
  id: string
  onBlockClick?: (block: Block) => void
  onDeleteBlock?: (blockId: string) => void
}

export default function Column({ blocks, activeId, id, onBlockClick, onDeleteBlock }: ColumnProps) {
  // console.log('Column rendering with blocks:', blocks.length)
  
  const handleBlockClick = (block: Block) => {
    console.log('Column handleBlockClick:', block.id)
    onBlockClick?.(block)
  }

  const handleBlockUpdate = (blockIndex: number, newData: any) => {
    // Update the block data in your state management system
    // This depends on how you're managing state in your application
    // For example, if using useState:
    const newBlocks = [...blocks]
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      data: newData
    }
    // Call your update function here
  }

  const { setNodeRef } = useDroppable({ 
    id,
    data: {
      type: 'column',
      columnId: id
    }
  })

  return (
    <div className="flex-1">
      <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 p-1 bg-gray-100 rounded-lg">
          {blocks.map((block, blockIndex) => (
            <BlockWrapper 
              key={block.id} 
              block={block} 
              isActive={block.id === activeId}
              columnId={id}
              onClick={() => handleBlockClick(block)}
              location="canvas"
              onUpdate={(newData) => handleBlockUpdate(blockIndex, newData)}
              onDelete={onDeleteBlock}
            />
          ))}
          {blocks.length === 0 && (
            <div className="h-full min-h-[200px] min-w-[392px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              Drop items here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

