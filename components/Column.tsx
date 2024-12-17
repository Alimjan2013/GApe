import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Block } from '@/types'
import BlockWrapper from './BlockWrapper'

interface ColumnProps {
  blocks: (Block & { isActive: boolean })[]
}

const Column: React.FC<ColumnProps> = ({ blocks }) => {
  return (
    <div className="flex-1 bg-gray-100 p-4 rounded-lg">
      <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <BlockWrapper key={block.id} block={block} isActive={block.isActive} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column

