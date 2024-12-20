/** @format */

'use client'

import { useState } from 'react'
import CanvasClient from './CanvasClient'
import { Block } from '@/types'

export default function CanvasClientWrapper({
    canvasId,
}: {
    canvasId: string
}) {
    const [blocks, setBlocks] = useState<Block[]>([])

    return (
        <div className='h-full'>
            <CanvasClient initialBlocks={blocks} canvasId={canvasId} />
        </div>
    )
}
