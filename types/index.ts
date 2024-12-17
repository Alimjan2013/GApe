export enum BlockType {
  InfoBlock = 'InfoBlock',
  ProjectBlock = 'ProjectBlock',
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

export interface Block {
  id: string
  type: BlockType
  data: ProfileCardProps | ProjectCardProps
}

