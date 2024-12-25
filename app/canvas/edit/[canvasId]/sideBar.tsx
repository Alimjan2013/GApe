/** @format */

'use client'

import { Suspense, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Block, BlockType, BlockTemplate } from '@/types'
import Loading from './loading'
import BlockWrapper from '@/components/BlockWrapper'
import React from 'react'

function CanvasClientWrapper({ 
    onAddBlock,
    size,
    templates
}: { 
    onAddBlock: (block: Block) => void 
    size: 'sideBar' | 'drawer'
    templates: BlockTemplate[]
}) {
    const blocks: Block[] = templates.map((template: BlockTemplate) => ({
        id: `template-${template.type}-${template.order_index}`,
        type: template.type as BlockType,
        data: template.data,
        is_active: template.is_active,
        order_index: template.order_index,
        created_at: template.created_at || new Date(0).toISOString(),
        updated_at: template.updated_at || new Date(0).toISOString(),
    })).sort((a, b) => a.order_index - b.order_index)

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

    return (
        <div className="p-2 bg-customeBG2 rounded-lg">
            {renderBlocks()}
        </div>
    );
}

export default React.memo(function SideBar({ 
    onAddBlock,
    size,
    templates
}: { 
    onAddBlock: (block: Block) => void 
    size: 'sideBar' | 'drawer'
    templates: BlockTemplate[]
}) {
    return (
        <Suspense fallback={<Loading />}>
            <CanvasClientWrapper 
                size={size} 
                onAddBlock={onAddBlock} 
                templates={templates} 
            />
        </Suspense>
    )
})
