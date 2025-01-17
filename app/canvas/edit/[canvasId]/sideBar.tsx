/** @format */

'use client'

import { Suspense, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Block, BlockType, BlockTemplate } from '@/types'
import Loading from './loading'
import BlockWrapper from '@/components/BlockWrapper'

export default function SideBar({ 
    onAddBlock,
    size
}: { 
    onAddBlock: (block: Block) => void 
    size: 'sideBar' | 'drawer'
}) {
    return (
        <Suspense fallback={<Loading />}>
            <CanvasClientWrapper size={size} onAddBlock={onAddBlock} />
        </Suspense>
    )
}

function CanvasClientWrapper({ 
    onAddBlock,
    size
}: { 
    onAddBlock: (block: Block) => void 
    size: 'sideBar' | 'drawer'
}) {
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
                    id: `template-${template.type}-${template.order_index}`,
                    type: template.type as BlockType,
                    data: template.data,
                    is_active: template.is_active,
                    order_index: template.order_index,
                    created_at: template.created_at || new Date(0).toISOString(),
                    updated_at: template.updated_at || new Date(0).toISOString(),
                }))
                .sort((a, b) => a.order_index - b.order_index) // Add this line to sort by order_index

                setBlocks(newBlocks)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlocks()
    }, []) // Only re-run if canvasId changes

    const handleBlockClick = (block: Block) => {
        onAddBlock(block)
    }

    const renderBlocks = () => {
        if (size === 'drawer') {
            // Split blocks into three columns
            const columnCount = 3;
            const columns: Block[][] = Array.from({ length: columnCount }, () => []);
            
            blocks.forEach((block, index) => {
                const columnIndex = index % columnCount;
                columns[columnIndex].push(block);
            });

            return (
                <div className="flex  w-full max-h-[60vh] overflow-y-auto justify-center">
                    {columns.map((columnBlocks, columnIndex) => (
                        <div key={columnIndex} className="flex-1 flex flex-col gap-2 items-center">
                            {columnBlocks.map((block) => (
                                <div 
                                    key={block.id}
                                    onClick={() => handleBlockClick(block)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <BlockWrapper 
                                        block={block} 
                                        location='sideBar'
                                        onAdd={() => onAddBlock(block)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }

        // Sidebar mode - single column
        return (
            <div className="flex flex-col items-center gap-2">
                {blocks.map((block) => (
                    <div 
                        key={block.id}
                        onClick={() => handleBlockClick(block)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <BlockWrapper 
                            block={block} 
                            location='sideBar'
                            onAdd={() => onAddBlock(block)}
                        />
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) return <Loading />
    if (error) return <div>Error loading canvas: {error}</div>

    return (
        <div className="p-2 bg-customeBG2 rounded-lg">
            {renderBlocks()}
        </div>
    );
}
