/** @format */

'use client'
import { Block } from '@/types'
import { useState, useEffect } from 'react'
import Column from '@/components/Column'

export default function CanvasClient({
    initialBlocks,
}: {
    initialBlocks: Block[][]
}) {
    const [columns, setColumns] = useState<Block[][]>(initialBlocks)

  

    return (
        <main className='flex flex-col items-center p-2 bg-customeBG2 w-fit max-w-screen-2xl overflow-hidden overflow-x-scroll rounded-lg relative m-2'>
            <div className='flex w-full max-w-7xl gap-1'>
                {columns.map((columnBlocks, index) => (
                    <Column
                        key={`column-${index}`}
                        id={`column-${index}`}
                        blocks={columnBlocks}
                        isEditing={false}
                    />
                ))}
            </div>
        </main>
    )
}