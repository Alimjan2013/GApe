'use client'

import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import Column from '@/components/Column'
import BlockWrapper from '@/components/BlockWrapper'
import { Block } from '@/types'
import SideBar from './sideBar'
import { EditBlockSheet } from '@/components/EditBlockSheet'

export default function CanvasClient({ 
    initialBlocks,
    canvasId 
}: { 
    initialBlocks: Block[]
    canvasId: string 
}) {
    const [leftColumn, setLeftColumn] = useState<Block[]>(initialBlocks.slice(0, 2))
    const [rightColumn, setRightColumn] = useState<Block[]>(initialBlocks.slice(2))
    const [activeId, setActiveId] = useState<string | null>(null)
    const [editingBlock, setEditingBlock] = useState<Block | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeBlock = [...leftColumn, ...rightColumn].find(
            block => block.id === active.id
        )
        if (!activeBlock) return

        // Check if dropping on a column or block
        const isColumn = over.id === 'left' || over.id === 'right'
        const targetColumnId = isColumn ? over.id as 'left' | 'right' : 
            (over.data?.current?.columnId as 'left' | 'right')

        const sourceColumn = leftColumn.includes(activeBlock) ? leftColumn : rightColumn
        const targetColumn = targetColumnId === 'left' ? leftColumn : rightColumn
        
        const setSourceColumn = leftColumn.includes(activeBlock) ? setLeftColumn : setRightColumn
        const setTargetColumn = targetColumnId === 'left' ? setLeftColumn : setRightColumn

        // If dropping into a different column
        if (sourceColumn !== targetColumn) {
            setSourceColumn(blocks => blocks.filter(block => block.id !== activeBlock.id))
            
            if (isColumn) {
                // Add to the end of the column
                setTargetColumn(blocks => [...blocks, activeBlock])
            } else {
                // Insert at specific position
                const overBlockId = over.id as string
                setTargetColumn(blocks => {
                    const overIndex = blocks.findIndex(block => block.id === overBlockId)
                    const newBlocks = [...blocks]
                    newBlocks.splice(overIndex, 0, activeBlock)
                    return newBlocks
                })
            }
        } else {
            // Reordering within the same column
            if (!isColumn) {
                setSourceColumn(blocks => {
                    const oldIndex = blocks.findIndex(block => block.id === active.id)
                    const newIndex = blocks.findIndex(block => block.id === over.id)
                    const newBlocks = [...blocks]
                    newBlocks.splice(oldIndex, 1)
                    newBlocks.splice(newIndex, 0, activeBlock)
                    return newBlocks
                })
            }
        }

        setActiveId(null)
    }

    const getBlockColumn = (blockId: string): 'left' | 'right' => {
        if (leftColumn.some(block => block.id === blockId)) {
            return 'left'
        }
        if (rightColumn.some(block => block.id === blockId)) {
            return 'right'
        }
        // Fallback to prevent undefined - though this should never happen
        console.warn('Block not found in either column:', blockId)
        return 'left'
    }

    const handleAddBlock = (templateBlock: Block) => {
        // Create a new block with a unique ID
        const newBlock = {
            ...templateBlock,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        
        // Add to the left column if it has fewer blocks, otherwise to the right
        if (leftColumn.length <= rightColumn.length) {
            setLeftColumn(blocks => [...blocks, newBlock])
        } else {
            setRightColumn(blocks => [...blocks, newBlock])
        }
    }

    const handleBlockClick = (block: Block) => {
        console.log('Block clicked:', block)
        setEditingBlock(block)
    }

    const handleSaveBlock = (updatedBlock: Block) => {
        const updateBlockInColumn = (blocks: Block[], blockToUpdate: Block) => {
            return blocks.map(block => 
                block.id === blockToUpdate.id ? blockToUpdate : block
            )
        }

        if (leftColumn.some(block => block.id === updatedBlock.id)) {
            setLeftColumn(blocks => updateBlockInColumn(blocks, updatedBlock))
        } else {
            setRightColumn(blocks => updateBlockInColumn(blocks, updatedBlock))
        }

        setEditingBlock(null)
    }

    return (
        <div className="flex flex-row  gap-1 justify-center">
           
            <DndContext
                sensors={sensors}
                onDragStart={({ active }) => setActiveId(active.id.toString())}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <main className='flex flex-col items-center p-2 bg-customeBG2 w-fit  rounded-lg'>
                    <div className='flex w-full max-w-7xl gap-1'>
                        <Column id='left' blocks={leftColumn} activeId={activeId} onBlockClick={handleBlockClick} />
                        <Column id='right' blocks={rightColumn} activeId={activeId} onBlockClick={handleBlockClick} />
                    </div>
                </main>

                <DragOverlay>
                    {activeId && (
                        <BlockWrapper
                            block={[...leftColumn, ...rightColumn].find(
                                block => block.id === activeId
                            )!}
                            isActive={true}
                            columnId={getBlockColumn(activeId)}
                            location='canvas'
                        />
                    )}
                </DragOverlay>
            </DndContext>
            <SideBar onAddBlock={handleAddBlock} />
            
            <EditBlockSheet
                block={editingBlock}
                isOpen={!!editingBlock}
                onClose={() => setEditingBlock(null)}
                onSave={handleSaveBlock}
            />
        </div>
    )
} 