/** @format */
'use client'
import { Save, Printer, Laptop, Touchpad, Smartphone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import Share from '@/components/ui/sharing'
import { toast } from 'sonner'
import { PreviewButton } from './previewButton'
import { useAtomValue, useAtom } from 'jotai'
import { saveFunctionAtom, hasUnsavedChangesAtom, columnCountAtom } from '@/store/canvasAtoms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface HeaderMenuProps {
    children?: React.ReactNode
}

function ToolBar({ isCanvasPage }: { isCanvasPage: boolean }) {
    const saveFunction = useAtomValue(saveFunctionAtom)
    const hasUnsavedChanges = useAtomValue(hasUnsavedChangesAtom)
    const [columnCount, setColumnCount] = useAtom(columnCountAtom)

    console.log('Save function in HeaderMenu:', !!saveFunction)

    const handleSave = async () => {
        if (saveFunction) {
            await saveFunction()
        } else {
            toast.error('Save function not available')
        }
    }

    const handleDeviceChange = (value: string) => {
        switch (value) {
            case 'pc':
                setColumnCount(3)
                break
            case 'pad':
                setColumnCount(2)
                break
            case 'phone':
                setColumnCount(1)
                break
        }
    }

    return (
        <div className='flex justify-between w-full items-center'>
            <div className='flex flex-row justify-between'>
                <Button
                    onClick={handleSave}
                    variant={hasUnsavedChanges ? 'default' : 'secondary'}
                    size='icon'
                    disabled={!saveFunction}
                >
                    <Save
                        className={`h-4 w-4 ${hasUnsavedChanges ? 'text-primary' : ''}`}
                    />
                </Button>
            </div>
            {isCanvasPage && (
                <Tabs defaultValue="pc" onValueChange={handleDeviceChange}>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='pc'>
                            <Laptop className='h-4 w-4' />
                        </TabsTrigger>
                        <TabsTrigger value='pad'>
                            <Touchpad className='h-4 w-4' />
                        </TabsTrigger>
                        <TabsTrigger value='phone'>
                            <Smartphone className='h-4 w-4' />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            )}
            <div className='flex justify-between gap-2 items-center'>
                <Button
                    variant={'secondary'}
                    size='icon'
                    onClick={() => window.print()}
                >
                    <Printer className='h-4 w-4' />
                </Button>
                <Share />
                <PreviewButton></PreviewButton>
            </div>
        </div>
    )
}

export default function HeaderMenu({ children }: HeaderMenuProps) {
    const pathname = usePathname()
    const isCanvasPage =
        pathname === '/canvas' ||
        pathname.startsWith('/canvas/edit') ||
        pathname.startsWith('/blocks')
    const isSharePage = pathname.startsWith('/canvas/share')
    const hasUnsavedChanges = useAtomValue(hasUnsavedChangesAtom)

    useEffect(() => {
        if (isCanvasPage) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                if (hasUnsavedChanges) {
                    e.preventDefault()
                    const message = 'Changes you made may not be saved.'
                    e.preventDefault()
                    return message
                }
            }
    
            window.addEventListener('beforeunload', handleBeforeUnload)
            return () =>
                window.removeEventListener('beforeunload', handleBeforeUnload)
        }
        else {
            window.removeEventListener('beforeunload', () => {})
        }
        
    }, [hasUnsavedChanges])

    return (
        <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur border-b border-customeBorder supports-[backdrop-filter]:bg-background/70 print:hidden  flex justify-center'>
            <div className=' container flex h-14 items-center '>
                <div className='mx-4 gap-4  flex items-center justify-between w-full'>
                    <div className=' h-full pl-9 pr-9 flex flex-col justify-center items-center '>
                        <div className='text-customeText1 text-2xl font-inter font-semibold break-words'>
                            <a href='/'>GApe</a>
                        </div>
                    </div>
                    {isCanvasPage && <ToolBar isCanvasPage={isCanvasPage} />}
                    {isSharePage && (
                        <div className='flex w-full justify-end'>
                            <Share />
                        </div>
                    )}

                    <div className='w-10 h-10 flex justify-center mr-8'>
                        {children}
                    </div>
                </div>
            </div>
        </header>
    )
}
