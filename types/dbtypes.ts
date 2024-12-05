/** @format */

import { ReactNode } from 'react'

export interface blockColumn {
    id: string
    canvas_id: string
    column: number
    blocks: string[]
    create_at: string
}

export interface ItemType {
    id: string
    component: ReactNode
}

export interface Template {
    id: string
    create_at: string
    name: string
    content: string
    description: string
    cover: string
}

//map for canvas_id:block[]
export type BlockMap = Map<string, Block[]>

export interface Canvas {
    id: string
    userId: string
    create_at: string
    name: string
}

export interface Block {
    id: string
    user_id: string
    create_at: string
    canvas_id: string
    template_id: string
    content: InfoBlockData | EduBlockData
    column: number
    template_name: string
    isBig: boolean
}

export interface InfoBlockData {
    id: string
    type: string
    name: string
    description: string
    image: string
    url: string
    phone: string
    email: string
    github: string
    linkedin: string
    x: string
    tags: string[]
}

export interface EduBlockData {
    id: string
    type: string
    institutionName: string
    location: string
    degree: string
    startDate: string
    endDate: string
    major: string
    minor?: string
    gpa?: string
    description: string
    tags: string[]
    image: string
    url: string
}
