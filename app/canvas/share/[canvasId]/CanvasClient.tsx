/** @format */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

import Column from '@/components/Column'
import { Block } from '@/types'
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
}: {
    initialBlocks: Block[][]
    canvasId: string
}) {
    const [mounted, setMounted] = useState(false)
    const [columns, setColumns] = useState<Block[][]>(initialBlocks)
    const [activeId, setActiveId] = useState<string | null>(null)

    const columnCount = useAtomValue(columnCountAtom)

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

    useEffect(() => {
        setMounted(true)
    }, [])

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
            const allBlocks = columns.flat()
            const blocksPerColumn = Math.ceil(allBlocks.length / count)
            const newColumns: Block[][] = []

            for (let i = 0; i < count; i++) {
                newColumns.push(
                    allBlocks.slice(
                        i * blocksPerColumn,
                        (i + 1) * blocksPerColumn
                    )
                )
            }

            if (newColumns.length !== columns.length) {
                handleColumnChange(newColumns)
            }
        },
        [columns, handleColumnChange]
    )

    // Then use it in the effect
    useEffect(() => {
        if (!mounted) return
        redistributeColumns(columnCount)
    }, [columnCount, mounted, redistributeColumns])

    if (!mounted) {
        return null
    }

    return (
        <div className='flex flex-col justify-center gap-2 py-2'>
            <div className='flex flex-row gap-1 justify-center'>
                <main className='flex flex-col items-center p-2 bg-customeBG2 w-fit max-w-screen-2xl overflow-hidden overflow-x-scroll rounded-lg relative'>
                    <div className='flex gap-2 mb-4'></div>
                    <div className='flex w-full max-w-7xl gap-1'>
                        {columns.map((columnBlocks, index) => (
                            <Column
                                key={`column-${index}`}
                                id={`column-${index}`}
                                blocks={columnBlocks}
                                activeId={activeId}
                                isReviewing={true}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
