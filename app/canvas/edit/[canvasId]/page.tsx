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
import { Block, BlockType, ProfileCardProps, ProjectCardProps, EducationCardProps, PublicationCardProps, ExperienceCardProps } from '@/types'

const initialBlocks: Block[] = [
    {
        id: '1',
        type: BlockType.InfoBlock_M,
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
        type: BlockType.ProjectBlock_L,
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
        type: BlockType.ProjectBlock_M,
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
        id: '4',
        type: BlockType.ProjectBlock_L,
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
        id: '5',
        type: BlockType.EducationBlock_L,
        data: {
            institution: 'University of Example',
            location: 'Example City, EX',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            gpa: '3.8',
            minor: 'Mathematics',
            dateRange: 'August 2015 - May 2019',
            description: 'Studied various aspects of computer science including algorithms, data structures, and software engineering. Participated in multiple projects and internships.',
            logoUrl: 'https://example.com/logo.png'
        } as EducationCardProps,
    },
    {
        id: '6',
        type: BlockType.EducationBlock_M,
        data: {
            institution: 'University of Example',
            location: 'Example City, EX',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            gpa: '3.8',
            minor: 'Mathematics',
            dateRange: 'August 2015 - May 2019',
            description: 'Studied various aspects of computer science including algorithms, data structures, and software engineering. Participated in multiple projects and internships.',
            logoUrl: 'https://example.com/logo.png'
        } as EducationCardProps,
    },
    {
        id: '7',
        type: BlockType.PublicationBlock_L,
        data: {
            type: 'Journal Article',
            year: '2021',
            title: 'Example Publication',
            authors: 'John Doe, Jane Smith',
            journal: 'Journal of Educational Technology',
            description: 'This publication explores the impact of technology on modern education.'
        } as PublicationCardProps,
    },
    {
        id: '8',
        type: BlockType.PublicationBlock_M,
        data: {
            type: 'Journal Article',
            year: '2021',
            title: 'Example Publication',
            authors: 'John Doe, Jane Smith',
            journal: 'Journal of Educational Technology',
            description: 'This publication explores the impact of technology on modern education.'
        } as PublicationCardProps,
    },
    {
        id: '9',
        type: BlockType.ExperienceBlock_L,
        data: {
            type: 'Full-time',
            title: 'Software Engineer',
            company: 'Example Corp',
            logoUrl: 'https://example.com/logo.png',
            location: 'Example City, EX',
            dateRange: 'June 2019 - Present',
            description: 'Worked on developing and maintaining web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.'
        } as ExperienceCardProps,
    },
    {
        id: '10',
        type: BlockType.ExperienceBlock_M,
        data: {
            type: 'Full-time',
            title: 'Software Engineer',
            company: 'Example Corp',
            logoUrl: 'https://example.com/logo.png',
            location: 'Example City, EX',
            dateRange: 'June 2019 - Present',
            description: 'Worked on developing and maintaining web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.'
        } as ExperienceCardProps,
    },
    {
        id: '12',
        type: BlockType.InfoBlock,
        data: {
            type: 'Full-time',
            title: 'Software Engineer',
            company: 'Example Corp',
            logoUrl: 'https://example.com/logo.png',
            location: 'Example City, EX',
            dateRange: 'June 2019 - Present',
            description: 'Worked on developing and maintaining web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.'
        } as ExperienceCardProps,
    },


]

const createNewInfoBlock = (): Block => ({
    id: crypto.randomUUID(),
    type: BlockType.InfoBlock_M,
    data: {
        name: 'New User!',
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
})

const createNewEducationBlock = (): Block => ({
    id: crypto.randomUUID(),
    type: BlockType.EducationBlock_M,
    data: {
        institution: 'University of Example',
        location: 'Example City, EX',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        gpa: '3.8',
        minor: 'Mathematics',
        dateRange: 'August 2015 - May 2019',
        description: 'Studied various aspects of computer science including algorithms, data structures, and software engineering. Participated in multiple projects and internships.',
        logoUrl: 'https://example.com/logo.png'
    } as EducationCardProps,
})

const createNewPublicationBlock = (): Block => ({
    id: crypto.randomUUID(),
    type: BlockType.PublicationBlock_M,
    data: {
        type: 'Journal Article',
        year: '2021',
        title: 'Example Publication',
        authors: 'John Doe, Jane Smith',
        journal: 'Journal of Educational Technology',
        description: 'This publication explores the impact of technology on modern education.'
    } as PublicationCardProps,
})

const createNewExperienceBlock = (): Block => ({
    id: crypto.randomUUID(),
    type: BlockType.ExperienceBlock_M,
    data: {
        type: 'Full-time',
        title: 'Software Engineer',
        company: 'Example Corp',
        logoUrl: 'https://example.com/logo.png',
        location: 'Example City, EX',
        dateRange: 'June 2019 - Present',
        description: 'Worked on developing and maintaining web applications. Collaborated with cross-functional teams to deliver high-quality software solutions.'
    } as ExperienceCardProps,
})

export default function Home() {
    const [leftColumn, setLeftColumn] = useState<Block[]>(
        initialBlocks.slice(0, 2)
    )
    const [rightColumn, setRightColumn] = useState<Block[]>(
        initialBlocks.slice(2)
    )
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

        // Find which column the dragged item is from
        const activeItem = [...leftColumn, ...rightColumn].find(
            (item) => item.id === active.id
        )
        if (!activeItem) return

        // Check if dropping into an empty column
        if (over.id === 'left' || over.id === 'right') {
            const isFromLeft = leftColumn.find((item) => item.id === active.id)
            const sourceColumn = isFromLeft ? leftColumn : rightColumn
            const setSourceColumn = isFromLeft ? setLeftColumn : setRightColumn
            const setTargetColumn =
                over.id === 'left' ? setLeftColumn : setRightColumn

            // Remove from source
            const sourceItems = [...sourceColumn]
            const oldIndex = sourceItems.findIndex(
                (item) => item.id === active.id
            )
            const [movedItem] = sourceItems.splice(oldIndex, 1)

            // Add to target
            setSourceColumn(sourceItems)
            setTargetColumn((prev) => [...prev, movedItem])

            setActiveId(null)
            return
        }

        // Handle normal sorting within or between non-empty columns
        const isFromLeft = leftColumn.find((item) => item.id === active.id)
        const isToLeft = leftColumn.find((item) => item.id === over.id)

        const sourceColumn = isFromLeft ? leftColumn : rightColumn
        const targetColumn = isToLeft ? leftColumn : rightColumn
        const setSourceColumn = isFromLeft ? setLeftColumn : setRightColumn
        const setTargetColumn = isToLeft ? setLeftColumn : setRightColumn

        if (sourceColumn === targetColumn) {
            const items = [...sourceColumn]
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            const [movedItem] = items.splice(oldIndex, 1)
            items.splice(newIndex, 0, movedItem)
            setSourceColumn(items)
        } else {
            const sourceItems = [...sourceColumn]
            const targetItems = [...targetColumn]
            const oldIndex = sourceItems.findIndex(
                (item) => item.id === active.id
            )
            const newIndex = targetItems.findIndex(
                (item) => item.id === over.id
            )
            const [movedItem] = sourceItems.splice(oldIndex, 1)
            targetItems.splice(newIndex, 0, movedItem)

            setSourceColumn(sourceItems)
            setTargetColumn(targetItems)
        }

        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    const handleAddInfoBlock = () => {
        if (leftColumn.length <= rightColumn.length) {
            setLeftColumn([...leftColumn, createNewInfoBlock()])
        } else {
            setRightColumn([...rightColumn, createNewInfoBlock()])
        }
    }

    const handleAddEducationBlock = () => {
        if (leftColumn.length <= rightColumn.length) {
            setLeftColumn([...leftColumn, createNewEducationBlock()])
        } else {
            setRightColumn([...rightColumn, createNewEducationBlock()])
        }
    }

    const handleAddPublicationBlock = () => {
        if (leftColumn.length <= rightColumn.length) {
            setLeftColumn([...leftColumn, createNewPublicationBlock()])
        } else {
            setRightColumn([...rightColumn, createNewPublicationBlock()])
        }
    }

    const handleAddExperienceBlock = () => {
        if (leftColumn.length <= rightColumn.length) {
            setLeftColumn([...leftColumn, createNewExperienceBlock()])
        } else {
            setRightColumn([...rightColumn, createNewExperienceBlock()])
        }
    }

    const handleSizeChange = (blockId: string, newSize: string) => {
        setLeftColumn(prevBlocks => 
            prevBlocks.map(block => 
                block.id === blockId 
                    ? { ...block, size: newSize }
                    : block
            )
        )
        setRightColumn(prevBlocks => 
            prevBlocks.map(block => 
                block.id === blockId 
                    ? { ...block, size: newSize }
                    : block
            )
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 flex-wrap justify-center">
                <button
                    onClick={handleAddInfoBlock}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Add Info Block
                </button>
                <button
                    onClick={handleAddEducationBlock}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Add Education Block
                </button>
                <button
                    onClick={handleAddPublicationBlock}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                    Add Publication Block
                </button>
                <button
                    onClick={handleAddExperienceBlock}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                    Add Experience Block
                </button>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <main className='flex  flex-col items-center p-2 bg-customeBG2 w-fit m-auto rounded-lg'>
                    <div className='flex w-full max-w-7xl gap-1'>
                        <Column
                            id='left'
                            blocks={leftColumn}
                            activeId={activeId}
                            onBlockSizeChange={handleSizeChange}
                        />
                        <Column
                            id='right'
                            blocks={rightColumn}
                            activeId={activeId}
                            onBlockSizeChange={handleSizeChange}
                        />
                    </div>
                </main>
                <DragOverlay>
                    {activeId ? (
                        <BlockWrapper
                            block={
                                [...leftColumn, ...rightColumn].find(
                                    (block) => block.id === activeId
                                )!
                            }
                            isActive={true}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
