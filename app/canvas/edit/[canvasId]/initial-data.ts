// import { supabase } from '@/utils/supabase'
import { Block, BlockType, ProfileCardProps, ProjectCardProps, EducationCardProps, PublicationCardProps, ExperienceCardProps } from '@/types'

export async function getInitialBlocks(): Promise<Block[]> {
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
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
             position: { x: 0, y: 0 },
             parentId: null
         },
    ];
    
    return initialBlocks;
}

