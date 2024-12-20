import * as z from "zod"
import { BlockType } from "@/types"

export type FieldConfig = {
    type: 'text' | 'email' | 'url' | 'textarea' | 'date' | 'number'
    label: string
    placeholder?: string
    validation?: {
        required?: boolean
        min?: number
        max?: number
        url?: boolean
        email?: boolean
    }
}

const infoBlockConfig: Record<string, FieldConfig> = {
    name: {
        type: 'text',
        label: 'Name',
        validation: { required: true, min: 2 }
    },
    title: {
        type: 'text',
        label: 'Title',
        validation: { required: true }
    },
    description: {
        type: 'textarea',
        label: 'Description'
    },
    phone: {
        type: 'text',
        label: 'Phone'
    },
    email: {
        type: 'email',
        label: 'Email',
        validation: { required: true, email: true }
    },
    location: {
        type: 'text',
        label: 'Location'
    },
    imageUrl: {
        type: 'url',
        label: 'Profile Image URL',
        validation: { required: true, url: true }
    },
    github: {
        type: 'url',
        label: 'GitHub URL',
        validation: { url: true }
    },
    linkedin: {
        type: 'url',
        label: 'LinkedIn URL',
        validation: { url: true }
    },
    x: {
        type: 'url',
        label: 'X/Twitter URL',
        validation: { url: true }
    },
    url: {
        type: 'url',
        label: 'Website URL',
        validation: { url: true }
    }
}

const projectBlockConfig: Record<string, FieldConfig> = {
    project: {
        type: 'text',
        label: 'Project Name',
        validation: { required: true }
    },
    company: {
        type: 'text',
        label: 'Company'
    },
    role: {
        type: 'text',
        label: 'Role'
    },
    dateRange: {
        type: 'text',
        label: 'Date Range'
    },
    Heyperlink: {
        type: 'url',
        label: 'Project URL',
        validation: { url: true }
    },
    location: {
        type: 'text',
        label: 'Location'
    },
    description: {
        type: 'textarea',
        label: 'Description'
    },
    image: {
        type: 'url',
        label: 'Project Image URL',
        validation: { url: true }
    }
}

const educationBlockConfig: Record<string, FieldConfig> = {
    institution: {
        type: 'text',
        label: 'Institution',
        validation: { required: true }
    },
    location: {
        type: 'text',
        label: 'Location'
    },
    degree: {
        type: 'text',
        label: 'Degree',
        validation: { required: true }
    },
    field: {
        type: 'text',
        label: 'Field of Study',
        validation: { required: true }
    },
    gpa: {
        type: 'text',
        label: 'GPA'
    },
    minor: {
        type: 'text',
        label: 'Minor'
    },
    dateRange: {
        type: 'text',
        label: 'Date Range'
    },
    description: {
        type: 'textarea',
        label: 'Description'
    },
    logoUrl: {
        type: 'url',
        label: 'Institution Logo URL'
    }
}

const publicationBlockConfig: Record<string, FieldConfig> = {
    title: {
        type: 'text',
        label: 'Publication Title',
        validation: { required: true }
    },
    authors: {
        type: 'text',
        label: 'Authors',
        validation: { required: true }
    },
    year: {
        type: 'text',
        label: 'Year'
    },
    type: {
        type: 'text',
        label: 'Publication Type'
    },
    description: {
        type: 'textarea',
        label: 'Description'
    },
    journal: {
        type: 'text',
        label: 'Journal/Conference'
    }
}

const experienceBlockConfig: Record<string, FieldConfig> = {
    company: {
        type: 'text',
        label: 'Company',
        validation: { required: true }
    },
    title: {
        type: 'text',
        label: 'Title',
        validation: { required: true }
    },
    location: {
        type: 'text',
        label: 'Location'
    },
    dateRange: {
        type: 'text',
        label: 'Date Range'
    },
    description: {
        type: 'textarea',
        label: 'Description'
    },
    logoUrl: {
        type: 'url',
        label: 'Company Logo URL'
    },
    type: {
        type: 'text',
        label: 'Employment Type'
    }
}

export const blockFormConfigs: Partial<Record<BlockType, Record<string, FieldConfig>>> = {
    [BlockType.InfoBlock_L]: infoBlockConfig,
    [BlockType.InfoBlock_M]: infoBlockConfig,
    [BlockType.ProjectBlock_L]: projectBlockConfig,
    [BlockType.ProjectBlock_M]: projectBlockConfig,
    [BlockType.EducationBlock_L]: educationBlockConfig,
    [BlockType.EducationBlock_M]: educationBlockConfig,
    [BlockType.PublicationBlock_L]: publicationBlockConfig,
    [BlockType.PublicationBlock_M]: publicationBlockConfig,
    [BlockType.ExperienceBlock_L]: experienceBlockConfig,
    [BlockType.ExperienceBlock_M]: experienceBlockConfig
} 