import React, { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Block } from '@/types'
import BlockWrapper from './BlockWrapper'
import { useDroppable } from '@dnd-kit/core'

interface ColumnProps {
  blocks: Block[]
  activeId: string | null
  id: string
  onBlockSizeChange?: (blockId: string, newSize: string) => void
}

export default function Column({ blocks, activeId, id, onBlockSizeChange }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className="flex-1">
      <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 p-1 bg-gray-100 rounded-lg">
          {blocks.map((block) => (
            <BlockWrapper 
              key={block.id} 
              block={block} 
              isActive={block.id === activeId}
              onSizeChange={onBlockSizeChange}
            />
          ))}
          {blocks.length === 0 && (
            <div ref={setNodeRef}  className="h-full min-h-[200px] min-w-[392px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              Drop items here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

