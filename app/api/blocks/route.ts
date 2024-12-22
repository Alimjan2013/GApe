import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { blocks, canvasId } = body

  console.log('Received request:', { blocks, canvasId })

  try {
    for (const block of blocks) {
      console.log('Processing block:', block)
      
      // Check if block exists by ID instead of column and order
      const { data: existingBlock, error: queryError } = await supabase
        .from('gape_blocks')
        .select('*')
        .eq('canvas_id', canvasId)
        .eq('id', block.id)
        .single()

      if (existingBlock) {
        // Update existing block with new position
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

    return NextResponse.json({ message: 'Blocks saved successfully' })
  } catch (error) {
    console.error('Error in blocks API:', error)
    return NextResponse.json({ error: 'Failed to save blocks' }, { status: 500 })
  }
} 