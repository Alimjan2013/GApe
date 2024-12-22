import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { blocks, canvasId } = body

  console.log('Received request:', { blocks, canvasId })
  
  if (!canvasId) {
    return NextResponse.json({ error: 'Canvas ID is required' }, { status: 400 })
  }

  try {
    for (const block of blocks) {
      console.log('Processing block:', block)
      
      // Generate a UUID for new blocks
      const blockId = crypto.randomUUID()
      
      const { data: existingBlock, error: queryError } = await supabase
        .from('gape_blocks')
        .select('*')
        .eq('canvas_id', canvasId)
        .eq('column_number', block.columnIndex)
        .eq('order_index', block.orderIndex)
        .single()

      if (existingBlock) {
        const { error: updateError } = await supabase
          .from('gape_blocks')
          .update({
            type: block.type,
            data: block.data,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBlock.id)
          
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('gape_blocks')
          .insert({
            id: blockId,  // Add generated UUID
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