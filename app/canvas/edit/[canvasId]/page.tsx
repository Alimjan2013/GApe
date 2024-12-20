/** @format */

'use client'

import { Suspense, use, useState, useEffect } from 'react'
import CanvasClient from './CanvasClient'
import { createClient } from '@/utils/supabase/client'
import { Block, BlockType, BlockTemplate } from '@/types'
import Loading from './loading'

interface PageProps {
    params: Promise<{ canvasId: string }>
}

export default function CanvasPage({ params }: PageProps) {
    const resolvedParams = use(params)
    
    return (
        <Suspense fallback={<Loading />}>
            <CanvasClientWrapper canvasId={resolvedParams.canvasId} />
        </Suspense>
    )
}

function CanvasClientWrapper({ canvasId }: { canvasId: string }) {
    const [blocks, setBlocks] = useState<Block[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBlocks() {
            try {
                const supabase = createClient()
                const { data: block_templates, error } = await supabase
                    .from('block_templates')
                    .select('*')

                if (error) {
                    throw new Error(`Failed to fetch block templates: ${error.message}`)
                }

                if (!block_templates || block_templates.length === 0) {
                    setBlocks([])
                    return
                }

                const newBlocks: Block[] = block_templates.map((template: BlockTemplate) => ({
                    id: `${canvasId}-${template.type}-${template.order_index}`,
                    type: template.type as BlockType,
                    data: template.data,
                    is_active: template.is_active,
                    order_index: template.order_index,
                    created_at: template.created_at || new Date(0).toISOString(),
                    updated_at: template.updated_at || new Date(0).toISOString(),
                }))

                setBlocks(newBlocks)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlocks()
    }, [canvasId]) // Only re-run if canvasId changes

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <div>Error loading canvas: {error}</div>
    }

    return (
        <div>
            <CanvasClient
                initialBlocks={blocks}
                canvasId={canvasId}
            />
        </div>
    )
}
