/** @format */

'use client'

import { useState, useCallback, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function CanvasClient({
    initialBlocks,
    canvasId,
}: {
    initialBlocks: Block[][]
    canvasId: string
}) {
    const [mounted, setMounted] = useState(false)
    const [columns, setColumns] = useState<Block[][]>(initialBlocks)
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

    const getInitialColumnCount = useCallback(() => {
        const nonEmptyColumns = initialBlocks.filter(col => col.length > 0)
        return Math.max(nonEmptyColumns.length || 1, 2) // Minimum 2 columns
    }, [initialBlocks])

    const [columnCount, setColumnCount] = useState(getInitialColumnCount())

    const handleColumnCountChange = (count: number) => {
        const allBlocks = columns.flat()
        const blocksPerColumn = Math.ceil(allBlocks.length / count)
        const newColumns: Block[][] = []

        for (let i = 0; i < count; i++) {
            newColumns.push(
                allBlocks.slice(i * blocksPerColumn, (i + 1) * blocksPerColumn)
            )
        }

        setColumns(newColumns)
        setColumnCount(count)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) {
            setActiveId(null)
            return
        }

        const allBlocks = columns.flat()
        const activeBlock = allBlocks.find((block) => block.id === active.id)
        if (!activeBlock) {
            setActiveId(null)
            return
        }

        const isColumn = typeof over.id === 'string' && over.id.startsWith('column-')
        const targetColumnId = isColumn
            ? Number(String(over.id).split('-')[1])
            : Number(String(over.data?.current?.columnId).split('-')[1])

        const sourceColumnIndex = columns.findIndex((column) =>
            column.some((block) => block.id === active.id)
        )

        if (sourceColumnIndex === -1) return

        setColumns((currentColumns) => {
            const newColumns = [...currentColumns]
            newColumns[sourceColumnIndex] = newColumns[sourceColumnIndex]
                .filter((block) => block.id !== activeBlock.id)

            if (isColumn) {
                newColumns[targetColumnId] = [
                    ...newColumns[targetColumnId],
                    activeBlock,
                ]
            } else {
                const overBlockId = over.id as string
                const targetColumn = newColumns[targetColumnId]
                const overIndex = targetColumn.findIndex(
                    (block) => block.id === overBlockId
                )
                newColumns[targetColumnId] = [
                    ...targetColumn.slice(0, overIndex),
                    activeBlock,
                    ...targetColumn.slice(overIndex),
                ]
            }

            return newColumns
        })

        // await saveBlocks()
        setActiveId(null)
        
    }

    const getBlockColumn = (blockId: string): string => {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].some((block) => block.id === blockId)) {
                return `column-${i}`
            }
        }
        console.warn('Block not found in any column:', blockId)
        return 'column-0'
    }

    const handleAddBlock = (templateBlock: Block) => {
        const newBlock = {
            ...templateBlock,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }

        const columnLengths = columns.map((col) => col.length)
        const minLength = Math.min(...columnLengths)
        const targetColumnIndex = columnLengths.indexOf(minLength)

        setColumns((currentColumns) => {
            const newColumns = [...currentColumns]
            newColumns[targetColumnIndex] = [
                ...newColumns[targetColumnIndex],
                newBlock,
            ]
            return newColumns
        })
    }

    const handleSaveBlock = (updatedBlock: Block) => {
        setColumns((currentColumns) =>
            currentColumns.map((column) =>
                column.map((block) =>
                    block.id === updatedBlock.id ? updatedBlock : block
                )
            )
        )
        setEditingBlock(null)
    }

    const handleDeleteBlock = async (blockId: string) => {
        setColumns(currentColumns => {
            // First filter out the block from all columns
            const columnsWithoutBlock = currentColumns.map(column =>
                column.filter(block => block.id !== blockId)
            )

            // Then remove any empty columns, but keep at least 2 columns
            const nonEmptyColumns = columnsWithoutBlock.filter(column => column.length > 0)
            const finalColumns = nonEmptyColumns.length >= 2 
                ? nonEmptyColumns 
                : [...nonEmptyColumns, ...Array(2 - nonEmptyColumns.length).fill([])]

            // Update column count if needed
            if (finalColumns.length !== currentColumns.length) {
                setColumnCount(finalColumns.length)
            }

            return finalColumns
        })
      
    }

    const showSidebarAsDrawer = columns.length > 2

    const saveBlocks = useCallback(async () => {
        console.log('Saving blocks for canvas:', canvasId)

        const currentBlockIds = new Set(columns.flat().map(block => block.id))
        const blocks = columns.flatMap((column, columnIndex) => 
            column.map((block, orderIndex) => ({
                columnIndex: columnIndex,
                orderIndex,
                id: block.id,
                type: block.type,
                data: block.data
            }))
        )
        try {
            const response = await fetch('/api/blocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    blocks,
                    canvasId,
                    currentBlockIds: Array.from(currentBlockIds)
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to save blocks')
            }

            const data = await response.json()
            const deletedCount = data.deletedBlocks?.length || 0
            toast.success(
                `Canvas saved successfully${deletedCount ? ` (${deletedCount} blocks cleaned up)` : ''}`
            )
        } catch (error) {
            console.error('Error saving blocks:', error)
            toast.error('Failed to save canvas')
        }
    }, [columns, canvasId])

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className='flex flex-col justify-center gap-2 py-2'>
            <div className='flex flex-row gap-1 justify-center'>
            {[1, 2, 3, ].map((count) => (
                <Button
                    key={count}
                    onClick={() => handleColumnCountChange(count)}
                    variant={columnCount === count ? 'default' : 'outline'}
                >
                    {count} Columns
                </Button>
            ))}
            <button onClick={saveBlocks}>save blocks</button>
            </div>
            
             <div className='flex flex-row gap-1 justify-center'>
            
            <DndContext
                sensors={sensors}
                onDragStart={({ active }) => setActiveId(active.id.toString())}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <main className='flex flex-col items-center p-2 bg-customeBG2 w-fit max-w-screen-2xl overflow-hidden overflow-x-scroll rounded-lg relative'>
                    <div className='flex gap-2 mb-4'></div>
                    <div className='flex w-full max-w-7xl gap-1'>
                        {columns.map((columnBlocks, index) => (
                            <Column
                                key={`column-${index}`}
                                id={`column-${index}`}
                                blocks={columnBlocks}
                                activeId={activeId}
                                onBlockClick={setEditingBlock}
                                onDeleteBlock={handleDeleteBlock}
                            />
                        ))}
                    </div>

                    {showSidebarAsDrawer && (
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button
                                    className='fixed bottom-4 right-4 h-14 w-14 rounded-full'
                                    size='icon'
                                >
                                    <Plus className='h-6 w-6' />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>pick a block</DrawerTitle>
                                </DrawerHeader>
                                <SideBar
                                    size='drawer'
                                    onAddBlock={handleAddBlock}
                                />
                            </DrawerContent>
                        </Drawer>
                    )}
                </main>

                <DragOverlay>
                    {activeId && (
                        <BlockWrapper
                            block={
                                columns
                                    .flat()
                                    .find((block) => block.id === activeId)!
                            }
                            isActive={true}
                            columnId={getBlockColumn(activeId)}
                            location='canvas'
                        />
                    )}
                </DragOverlay>
            </DndContext>

            {!showSidebarAsDrawer && (
                <SideBar size='sideBar' onAddBlock={handleAddBlock} />
            )}

            <EditBlockSheet
                block={editingBlock}
                isOpen={!!editingBlock}
                onClose={() => setEditingBlock(null)}
                onSave={handleSaveBlock}
            />
        </div>
        </div>
       
    )
}
