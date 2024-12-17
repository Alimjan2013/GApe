'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Column from '@/components/Column'
import BlockWrapper from '@/components/BlockWrapper'
import { Block, BlockType, ProfileCardProps, ProjectCardProps } from '@/types'

const initialBlocks: Block[] = [
  { 
    id: '1', 
    type: BlockType.InfoBlock, 
    data: {
      name: 'John Doe',
      title: 'Software Engineer',
      description: 'Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      location: 'San Francisco, CA',
      imageUrl: 'https://example.com/images/john-doe.jpg',
      tags: ['JavaScript', 'React', 'Node.js'],
      github: 'johndoe',
      linkedin: 'johndoe',
      image: 'https://example.com/images/john-doe.jpg',
      x: 'johndoe',
      url: 'https://johndoe.com',
    } as ProfileCardProps
  },
  { 
    id: '2', 
    type: BlockType.ProjectBlock, 
    data: {
      project: 'NextGen Web App',
      company: 'Tech Innovators Inc.',
      role: 'Lead Developer',
      dateRange: 'Jan 2020 - Present',
      Heyperlink: 'https://techinnovators.com/projects/nextgen-web-app',
      location: 'Remote',
      description: 'Led the development of a cutting-edge web application using modern technologies such as React, Node.js, and GraphQL. Improved performance and scalability, resulting in a 30% increase in user engagement.',
      image: 'https://example.com/images/nextgen-web-app.jpg',
      type: 'Full-time',
    } as ProjectCardProps
  },
  { 
    id: '3', 
    type: BlockType.InfoBlock, 
    data: {
      name: 'Jane Smith',
      title: 'UX Designer',
      description: 'Creative UX designer with a keen eye for detail and a user-centered approach to design. Passionate about creating intuitive and engaging digital experiences.',
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@example.com',
      location: 'New York, NY',
      imageUrl: 'https://example.com/images/jane-smith.jpg',
      tags: ['UX Design', 'Figma', 'User Research'],
      github: 'janesmith',
      linkedin: 'janesmith',
      image: 'https://example.com/images/jane-smith.jpg',
      x: 'janesmith',
      url: 'https://janesmith.com',
    } as ProfileCardProps
  },
  { 
    id: '4', 
    type: BlockType.ProjectBlock, 
    data: {
      project: 'AI-Powered Analytics Dashboard',
      company: 'Data Insights Co.',
      role: 'Senior Data Scientist',
      dateRange: 'Mar 2019 - Dec 2021',
      Heyperlink: 'https://datainsights.co/projects/ai-analytics',
      location: 'Boston, MA',
      description: 'Developed an AI-powered analytics dashboard that provides real-time insights and predictive analytics for business decision-making. Implemented machine learning algorithms to improve data accuracy and forecast trends.',
      image: 'https://example.com/images/ai-analytics.jpg',
      type: 'Full-time',
    } as ProjectCardProps
  },
]

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setBlocks((items) => {
        const activeIndex = items.findIndex((item) => item.id === active.id)
        const overIndex = items.findIndex((item) => item.id === over.id)

        const updatedItems = [...items]
        const [movedItem] = updatedItems.splice(activeIndex, 1)
        updatedItems.splice(overIndex, 0, movedItem)

        return updatedItems
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const leftColumnBlocks = blocks.filter((_, index) => index % 2 === 0)
  const rightColumnBlocks = blocks.filter((_, index) => index % 2 !== 0)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex w-full gap-4">
          <Column blocks={leftColumnBlocks} />
          <Column blocks={rightColumnBlocks} />
        </div>
      </main>
      <DragOverlay>
        {activeId ? <BlockWrapper block={blocks.find(block => block.id === activeId)!} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

