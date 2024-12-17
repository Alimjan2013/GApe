import React from 'react'
import { ProjectCardProps } from '@/types'
import { Globe, Link2 } from 'lucide-react'

const ProjectBlock: React.FC<{ data: ProjectCardProps }> = ({ data }) => {
  return (
    <div className='w-full h-[236px] p-2 bg-white rounded-lg border border-slate-300 flex-col justify-start items-start gap-2 inline-flex'>
      <div className='w-full'>
        <div className='flex items-center gap-2'>
          <div className='text-xl font-semibold'>{data.project}</div>
          <a href={data.Heyperlink}>
            <Link2 className='w-4' />
          </a>
        </div>
        <div className='flex gap-2 text-sm'>
          <span>{data.company}</span>
          <span>|</span>
          <span>{data.role}</span>
        </div>
      </div>
      <p className='text-sm overflow-hidden flex-grow' style={{
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {data.description}
      </p>
      <div className='flex justify-between items-center w-full text-xs'>
        <div className='flex gap-1 items-center'>
          <Globe className='w-4' />
          <span>{data.location}</span>
        </div>
        <div>{data.dateRange}</div>
      </div>
    </div>
  )
}

export default ProjectBlock

