import CanvasClient from './CanvasClient'
import { getInitialBlocks } from './initial-data'

export default async function CanvasPage({ params }: { params: { canvasId: string } }) {
  const initialBlocks = await getInitialBlocks()
  
  return <CanvasClient initialBlocks={initialBlocks} canvasId={params.canvasId} />
}
