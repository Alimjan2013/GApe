/** @format */
import { createClient } from '@/utils/supabase/server'
import CanvasClient from './CanvasClient'
import { Block } from '@/types'

interface PageProps {
  params: {
    canvasId: string
  }
}

export default async function CanvasPage({ params }: PageProps) {
  const { canvasId } = params
  const supabase = await createClient()
  
  // Fetch initial blocks for this canvas
  const { data: blocks, error } = await supabase
    .from('gape_blocks')
    .select('*')
    .eq('canvas_id', canvasId)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching blocks:', error)
  }

  const initialBlocks: Block[] = blocks || []

  return (
    <div className="container mx-auto">
      <CanvasClient 
        initialBlocks={initialBlocks}
        canvasId={canvasId}  // Fixed: passing canvasId string instead of blocks array
      />
    </div>
  )
}
