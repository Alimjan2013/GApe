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

  // Fetch both blocks and templates in parallel
  const [blocksResponse, templatesResponse] = await Promise.all([
    supabase
      .from('gape_blocks')
      .select('*')
      .eq('canvas_id', canvasId)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('block_templates')
      .select('*')
  ])

  if (blocksResponse.error) {
    console.error('Error fetching blocks:', blocksResponse.error)
  }

  // Transform blocks into column-based structure
  const transformedBlocks = blocksResponse.data?.reduce<Block[][]>((acc, block) => {
    // Ensure the column array exists
    if (!acc[block.column_number]) {
      acc[block.column_number] = []
    }
    
    // Add block to its column array
    acc[block.column_number].push({
      id: block.id,
      type: block.type,
      data: block.data,
      is_active: block.is_active,
      order_index: block.order_index
    } as Block)
    
    return acc
  }, []) || []

  // Filter out any empty columns and ensure we have at least 2 columns
  const initialBlocks = transformedBlocks.filter(column => column?.length > 0)
  if (initialBlocks.length === 0) {
    initialBlocks.push([]) // Initialize with two empty columns
} 

  return (
    <div className="container mx-auto">
      <CanvasClient 
        initialBlocks={initialBlocks}
        canvasId={canvasId}
        blockTemplates={templatesResponse.data || []}
      />
      
    </div>
  )
}
