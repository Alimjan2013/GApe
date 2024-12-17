export enum BlockType {
  InfoBlock = 'InfoBlock',
  ProjectBlock = 'ProjectBlock',
  InfoBlock_L = 'InfoBlock_L',
  // Add more block types here as needed
}

export interface ProfileCardProps {
  name: string
  title: string
  description: string
  phone: string
  email: string
  location?: string
  imageUrl: string
  tags?: string[]
  github: string
  linkedin: string
  image: string
  x: string
  url: string
}

export interface EducationCardProps {
  institution: string
  location: string
  degree: string
  field: string
  gpa: string
  minor?: string
  dateRange: string
  description: string
  logoUrl: string
}

export interface ExperienceCardProps {
  company: string
  title: string
  location: string
  dateRange: string
  description: string
  logoUrl: string
  type?: string
}

export interface ProjectCardProps {
  project: string
  company: string
  role: string
  dateRange: string
  Heyperlink: string
  location: string
  description: string
  image: string
  type?: string
}

export interface PublicationCardProps {
  title: string
  authors: string
  year: string
  type: string
  description: string
  journal: string
}

export interface SkillsCardProps {
  categories: {
    name: string
    skills: string[]
  }[]
}

export interface InfoBlockProps {
  title: string
  description: string
  image: string
}

export interface Block {
  id: string
  type: BlockType
  data: ProfileCardProps | ProjectCardProps | InfoBlockProps | EducationCardProps | ExperienceCardProps | PublicationCardProps | SkillsCardProps
}

