import React from 'react'
import { ProfileCardProps } from '@/types'
import { Globe, Twitter, Github, Phone, Mail } from 'lucide-react'

const InfoBlock: React.FC<{ data: ProfileCardProps }> = ({ data }) => {
  return (
    <div className='w-full h-[236px] p-2 bg-white rounded-lg border border-slate-300 flex-col justify-start items-start gap-2 inline-flex'>
      <div className='flex flex-row gap-2 pb-2 border-b w-full'>
        <img src={data.image} className='w-28 h-36 rounded object-cover' alt={data.name} />
        <div className='flex flex-col flex-grow'>
          <div className='text-xl font-semibold flex items-center gap-1'>
            {data.name}
            <a className='text-sm' href={data.url}>
              <Globe className='w-4' />
            </a>
          </div>
          <p className='text-sm overflow-hidden' style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {data.description}
          </p>
          <div className='flex gap-2 mt-2'>
            {data.tags?.map((tag) => (
              <span key={tag} className='bg-green-300 text-xs px-2 py-1 rounded'>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-1 text-xs w-full px-2'>
        <div className='flex items-center gap-1'>
          <Phone className='w-4' />
          {data.phone}
        </div>
        <div className='flex items-center gap-1'>
          <Mail className='w-4' />
          {data.email}
        </div>
        <div className='flex items-center gap-1'>
          <Github className='w-4' />
          {data.github}
        </div>
        <div className='flex items-center gap-1'>
          <Twitter className='w-4' />
          {data.x}
        </div>
      </div>
    </div>
  )
}

export default InfoBlock

