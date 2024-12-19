'use client'
import TempBlocks from '@/components/Temp-Blocks'
import { useState } from 'react'

export default function BlockTemp() {
    const [selectedSize, setSelectedSize] = useState('M')
    return <TempBlocks selectedSize={selectedSize} ChangeSize={(value:string)=>{setSelectedSize(value)}} />
}
