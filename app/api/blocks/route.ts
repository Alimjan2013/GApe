import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { blocks, canvasId, currentBlockIds } = body

  console.log('Received request:', { blocks, canvasId, currentBlockIds })

  try {
    // First, get all existing blocks for this canvas
    const { data: existingBlocks, error: fetchError } = await supabase
      .from('gape_blocks')
      .select('id')
      .eq('canvas_id', canvasId)

    if (fetchError) throw fetchError

    // Find blocks that need to be deleted (exist in DB but not in current canvas)
    const blocksToDelete = existingBlocks
      ?.filter(block => !currentBlockIds.includes(block.id))
      .map(block => block.id) || []

    // Delete removed blocks if any exist
    if (blocksToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('gape_blocks')
        .delete()
        .in('id', blocksToDelete)
        .eq('canvas_id', canvasId)

      if (deleteError) throw deleteError
      console.log('Deleted blocks:', blocksToDelete)
    }

    // Update or insert remaining blocks
    for (const block of blocks) {
      console.log('Processing block:', block)
      
      // Check if block exists
      const { data: existingBlock, error: queryError } = await supabase
        .from('gape_blocks')
        .select('*')
        .eq('canvas_id', canvasId)
        .eq('id', block.id)
        .single()

      if (existingBlock) {
        // Update existing block
        const { error: updateError } = await supabase
          .from('gape_blocks')
          .update({
            column_number: block.columnIndex,
            order_index: block.orderIndex,
            type: block.type,
            data: block.data,
            updated_at: new Date().toISOString()
          })
          .eq('id', block.id)
          
        if (updateError) throw updateError
      } else {
        // Insert new block
        const { error: insertError } = await supabase
          .from('gape_blocks')
          .insert({
            id: block.id,
            canvas_id: canvasId,
            column_number: block.columnIndex,
            type: block.type,
            data: block.data,
            order_index: block.orderIndex,
            is_active: true
          })
          
        if (insertError) throw insertError
      }
    }

    return NextResponse.json({ 
      message: 'Blocks saved successfully',
      deletedBlocks: blocksToDelete
    })
  } catch (error) {
    console.error('Error in blocks API:', error)
    return NextResponse.json({ error: 'Failed to save blocks' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const body = await request.json()
    const { blockId, canvasId } = body

    try {
        const { error } = await supabase
            .from('gape_blocks')
            .delete()
            .eq('id', blockId)
            .eq('canvas_id', canvasId)

        if (error) throw error

        return NextResponse.json({ message: 'Block deleted successfully' })
    } catch (error) {
        console.error('Error deleting block:', error)
        return NextResponse.json(
            { error: 'Failed to delete block' },
            { status: 500 }
        )
    }
} 