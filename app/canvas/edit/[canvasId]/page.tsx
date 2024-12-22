/** @format */
import { createClient } from '@/utils/supabase/server'
import CanvasClient from './CanvasClient'
import { Block } from '@/types'

interface PageProps {
  params: Promise<{
    canvasId: string
  }>
}

export default async function CanvasPage(props: PageProps) {
  const params = await props.params;
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

  // Transform blocks into column-based structure
  const transformedBlocks = blocks?.reduce<Block[][]>((acc, block) => {
    // Ensure the column array exists
    if (!acc[block.column_number]) {
      acc[block.column_number] = []
    }
    
    // Add block to its column array with all required properties
    acc[block.column_number].push({
      id: block.id,
      type: block.type,
      data: block.data,
      is_active: block.is_active,
      order_index: block.order_index,
      column_number: block.column_number
    } as Block)
    
    return acc
  }, []) || []

  // Filter out any empty columns and ensure we have at least 2 columns
  const initialBlocks = transformedBlocks.filter(column => column?.length > 0)
  if (initialBlocks.length === 0) {
    initialBlocks.push([], []) // Initialize with two empty columns
  } else if (initialBlocks.length === 1) {
    initialBlocks.push([]) // Add a second empty column
  }

  return (
    <div className="container mx-auto">
      <CanvasClient 
        initialBlocks={initialBlocks}
        canvasId={canvasId}
      />
      
    </div>
  )
}
