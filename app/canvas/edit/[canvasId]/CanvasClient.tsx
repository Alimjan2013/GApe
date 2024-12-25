/** @format */

'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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
import { Block, BlockTemplate } from '@/types'
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
import { useAtom, useSetAtom, useAtomValue } from 'jotai'
import {
    saveFunctionAtom,
    hasUnsavedChangesAtom,
    columnCountAtom,
} from '@/store/canvasAtoms'

export default function CanvasClient({
    initialBlocks,
    canvasId,
    blockTemplates,
}: {
    initialBlocks: Block[][]
    canvasId: string
    blockTemplates: BlockTemplate[]
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
        const nonEmptyColumns = initialBlocks.filter((col) => col.length > 0)
        return Math.max(nonEmptyColumns.length || 1, 2) // Minimum 2 columns
    }, [initialBlocks])

    const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom)

    const handleColumnChange = useCallback(
        (newColumns: Block[][]) => {
            if (JSON.stringify(newColumns) !== JSON.stringify(columns)) {
                setColumns(newColumns)
                setHasUnsavedChanges(true)
            }
        },
        [setHasUnsavedChanges, columns]
    )

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

        const newColumns = [...columns]
        newColumns[sourceColumnIndex] = newColumns[sourceColumnIndex].filter(
            (block) => block.id !== activeBlock.id
        )

        if (isColumn) {
            newColumns[targetColumnId] = [...newColumns[targetColumnId], activeBlock]
        } else {
            const overBlockId = over.id as string
            const targetColumn = newColumns[targetColumnId]
            const overIndex = targetColumn.findIndex(
                (block) => block.id === overBlockId
            )
            
            const overData = over.data?.current
            const insertIndex = overData?.sortable?.index ?? overIndex
            
            newColumns[targetColumnId] = [
                ...targetColumn.slice(0, insertIndex),
                activeBlock,
                ...targetColumn.slice(insertIndex)
            ]
        }

        handleColumnChange(newColumns)
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

    const generateUniqueBlockId = useCallback((existingBlocks: Block[][]): string => {
        const existingIds = new Set(existingBlocks.flat().map(block => block.id))
        let newId: string
        do {
            newId = `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        } while (existingIds.has(newId))
        return newId
    }, []);

    const memoizedHandleAddBlock = useCallback((templateBlock: Block) => {
        setColumns(currentColumns => {
            const newBlock = {
                ...templateBlock,
                id: generateUniqueBlockId(currentColumns),
            }

            let targetColumnIndex = 0;
            let minLength = currentColumns[0].length;
            
            for (let i = 1; i < currentColumns.length; i++) {
                if (currentColumns[i].length < minLength) {
                    minLength = currentColumns[i].length;
                    targetColumnIndex = i;
                }
            }

            const newColumns = currentColumns.map((col, index) => 
                index === targetColumnIndex ? [...col, newBlock] : [...col]
            );

            setHasUnsavedChanges(true);
            return newColumns;
        });

        toast.success('Block added to canvas');
    }, [generateUniqueBlockId, setHasUnsavedChanges]);

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
        setColumns((currentColumns) => {
            // First filter out the block from all columns
            const columnsWithoutBlock = currentColumns.map((column) =>
                column.filter((block) => block.id !== blockId)
            )

            // Then remove any empty columns, but keep at least 2 columns
            const nonEmptyColumns = columnsWithoutBlock.filter(
                (column) => column.length > 0
            )
            const finalColumns =
                nonEmptyColumns.length >= 2
                    ? nonEmptyColumns
                    : [
                          ...nonEmptyColumns,
                          ...Array(2 - nonEmptyColumns.length).fill([]),
                      ]

            handleColumnChange(finalColumns)
            return finalColumns
        })
    }

    const showSidebarAsDrawer = columns.length > 2

    const columnsRef = useRef<Block[][]>([])

    useEffect(() => {
        columnsRef.current = columns
    }, [columns])

    const saveBlocks = useCallback(async () => {
        console.log('Saving blocks for canvas:', canvasId)

        const currentBlockIds = new Set(
            columnsRef.current.flat().map((block) => block.id)
        )
        const blocks = columnsRef.current.flatMap((column, columnIndex) =>
            column.map((block, orderIndex) => ({
                columnIndex: columnIndex,
                orderIndex,
                id: block.id,
                type: block.type,
                data: block.data,
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
                    currentBlockIds: Array.from(currentBlockIds),
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
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error('Error saving blocks:', error)
            toast.error('Failed to save canvas')
        }
    }, [canvasId, setHasUnsavedChanges])

    const [_, setSaveFunction] = useAtom(saveFunctionAtom)

    const columnCount = useAtomValue(columnCountAtom)

    const setColumnCount = useSetAtom(columnCountAtom)

    useEffect(() => {
        setMounted(true)
        setColumnCount(initialBlocks.length)
    }, [initialBlocks.length, setColumnCount])

    useEffect(() => {
        const saveFn = async () => {
            await saveBlocks()
        }
        setSaveFunction(() => saveFn)

        return () => {
            setSaveFunction(null)
        }
    }, [saveBlocks, setSaveFunction])

    // First, memoize the column redistribution function
    const redistributeColumns = useCallback(
        (count: number) => {
            // Skip if count matches current column count
            if (count === columns.length) return;
            
            // Skip if there are no blocks to redistribute
            const allBlocks = columns.flat();
            if (allBlocks.length === 0) {
                // Just create empty columns
                const emptyColumns = Array(count).fill([]).map(() => []);
                handleColumnChange(emptyColumns);
                return;
            }

            const blocksPerColumn = Math.ceil(allBlocks.length / count);
            const newColumns: Block[][] = Array(count).fill([]).map(() => []);

            // Distribute blocks across columns
            allBlocks.forEach((block, index) => {
                const columnIndex = Math.floor(index / blocksPerColumn);
                if (columnIndex < count) {
                    newColumns[columnIndex] = [...newColumns[columnIndex], block];
                }
            });

            handleColumnChange(newColumns);
        },
        [columns, handleColumnChange]
    );

    // Then use it in the effect
    useEffect(() => {
        if (!mounted) return;
        
        const currentColumnCount = columns.length;
        if (columnCount !== currentColumnCount) {
            redistributeColumns(columnCount);
        }
    }, [columnCount, mounted, redistributeColumns, columns.length]);

    if (!mounted) {
        return null
    }

    return (
        <div className='flex flex-col justify-center gap-2 py-2'>
            <div className='flex flex-row gap-1 justify-center'>
                <DndContext
                    sensors={sensors}
                    onDragStart={({ active }) =>
                        setActiveId(active.id.toString())
                    }
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
                                    isEditing={true}
                                />
                            ))}
                        </div>
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
                    <SideBar
                        size='sideBar'
                        onAddBlock={memoizedHandleAddBlock}
                        templates={blockTemplates}
                    />
                )}

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
                                <DrawerTitle>Pick a block</DrawerTitle>
                                <DrawerDescription>
                                    Select a block to add to your canvas
                                </DrawerDescription>
                            </DrawerHeader>
                            <SideBar
                                size='drawer'
                                onAddBlock={memoizedHandleAddBlock}
                                templates={blockTemplates}
                            />
                        </DrawerContent>
                    </Drawer>
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
