/** @format */

'use client'

import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import Column from '@/components/Column'
import BlockWrapper from '@/components/BlockWrapper'
import { Block, BlockType, ProfileCardProps, ProjectCardProps } from '@/types'

const initialBlocks: Block[] = [
    {
        id: '1',
        type: BlockType.InfoBlock,
        data: {
            name: '1John Doe',
            title: 'Software Engineer',
            description:
                'Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.',
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
        } as ProfileCardProps,
    },
    {
        id: '2',
        type: BlockType.ProjectBlock,
        data: {
            project: '2NextGen Web App',
            company: 'Tech Innovators Inc.',
            role: 'Lead Developer',
            dateRange: 'Jan 2020 - Present',
            Heyperlink: 'https://techinnovators.com/projects/nextgen-web-app',
            location: 'Remote',
            description:
                'Led the development of a cutting-edge web application using modern technologies such as React, Node.js, and GraphQL. Improved performance and scalability, resulting in a 30% increase in user engagement.',
            image: 'https://example.com/images/nextgen-web-app.jpg',
            type: 'Full-time',
        } as ProjectCardProps,
    },
    {
        id: '3',
        type: BlockType.InfoBlock,
        data: {
            name: '3Alimjan Ablimit',
            title: 'UX Designer',
            description:
                'Creative UX designer with a keen eye for detail and a user-centered approach to design. Passionate about creating intuitive and engaging digital experiences.',
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
        } as ProfileCardProps,
    },
    {
        id: '4',
        type: BlockType.ProjectBlock,
        data: {
            project: '4AI-Powered Analytics Dashboard',
            company: 'Data Insights Co.',
            role: 'Senior Data Scientist',
            dateRange: 'Mar 2019 - Dec 2021',
            Heyperlink: 'https://datainsights.co/projects/ai-analytics',
            location: 'Boston, MA',
            description:
                'Developed an AI-powered analytics dashboard that provides real-time insights and predictive analytics for business decision-making. Implemented machine learning algorithms to improve data accuracy and forecast trends.',
            image: 'https://example.com/images/ai-analytics.jpg',
            type: 'Full-time',
        } as ProjectCardProps,
    },
]

export default function Home() {
    const [leftColumn, setLeftColumn] = useState<Block[]>(initialBlocks.slice(0, 2))
    const [rightColumn, setRightColumn] = useState<Block[]>(initialBlocks.slice(2))
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

        if (!over) return

        if (active.id !== over.id) {
            // Find which column the dragged item is from
            const activeItem = [...leftColumn, ...rightColumn].find(
                item => item.id === active.id
            )
            if (!activeItem) return

            // Determine source and target columns
            const isFromLeft = leftColumn.find(item => item.id === active.id)
            const isToLeft = leftColumn.find(item => item.id === over.id)
            
            const sourceColumn = isFromLeft ? leftColumn : rightColumn
            const targetColumn = isToLeft ? leftColumn : rightColumn
            const setSourceColumn = isFromLeft ? setLeftColumn : setRightColumn
            const setTargetColumn = isToLeft ? setLeftColumn : setRightColumn

            // If moving within the same column
            if (sourceColumn === targetColumn) {
                const items = [...sourceColumn]
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                const [movedItem] = items.splice(oldIndex, 1)
                items.splice(newIndex, 0, movedItem)
                setSourceColumn(items)
            } 
            // If moving between columns
            else {
                const sourceItems = [...sourceColumn]
                const targetItems = [...targetColumn]
                const oldIndex = sourceItems.findIndex(item => item.id === active.id)
                const newIndex = targetItems.findIndex(item => item.id === over.id)
                const [movedItem] = sourceItems.splice(oldIndex, 1)
                targetItems.splice(newIndex, 0, movedItem)
                
                setSourceColumn(sourceItems)
                setTargetColumn(targetItems)
            }
        }

        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <main className='flex min-h-screen flex-col items-center justify-between p-24'>
                <div className='flex w-full gap-4'>
                    <Column
                        blocks={leftColumn.map((block) => ({
                            ...block,
                            isActive: block.id === activeId,
                        }))}
                    />
                    <Column
                        blocks={rightColumn.map((block) => ({
                            ...block,
                            isActive: block.id === activeId,
                        }))}
                    />
                </div>
            </main>
            <DragOverlay>
                {activeId ? (
                    <BlockWrapper
                        block={[...leftColumn, ...rightColumn].find((block) => block.id === activeId)!}
                        isActive={true}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
