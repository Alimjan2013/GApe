/** @format */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserInfo } from './user-info'
import { CanvasList } from './canvas-list'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'
import { toast } from 'sonner'
import { addCanvas } from '@/app/canvas/actions'

export default function UserPage() {
    const supabase = createClient()

    const [user, setUser] = useState<User | null>(null)
    interface Canvas {
        id: string
        name: string
        userId: string
        create_at: string
    }

    const [canvases, setCanvases] = useState<Canvas[]>([])
    const [error, setError] = useState<string | null>(null)
    const [canvasName, setCanvasName] = useState<string>('')
    const [open, setOpen] = useState(false)

    async function fetchCanvases(id: string) {
        const { data: canvasData, error: canvasError } = await supabase
            .from('canvas')
            .select('*')
            .eq('userId', id)

        if (canvasError) {
            setError(canvasError.message)
            return
        }
        setCanvases(canvasData)
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error) {
                setError(error.message)
                return
            }
            setUser(data.user)
            fetchCanvases(data.user.id)
        }

        fetchData()
    }, [supabase])

    const createNewCanvas = async (id: string) => {
        const data = await addCanvas(id, canvasName)
        if (!data) {
            toast.error('Error creating canvas')
            return
        }
        toast.success('Canvas created successfully')
        setOpen(false) // Close the dialog after submitting the form

        setCanvases((prevCanvases) => [...prevCanvases, ...data])
    }

    async function deleteCanvas(id: string) {
        try {
            // Start a transaction


            // Delete related entries in blockColumn table
            const { error: blockColumnError } = await supabase
                .from('blockColumn')
                .delete()
                .eq('canvas_id', id)
            if (blockColumnError) throw blockColumnError

            // Delete the canvas
            const { error: canvasError } = await supabase
                .from('canvas')
                .delete()
                .eq('id', id)
            if (canvasError) throw canvasError

          

            user && fetchCanvases(user.id)
            toast.success('Canvas deleted successfully')
        } catch (error) {
            console.error(error)
            toast.error('Error deleting canvas')
            // Rollback the transaction in case of error
            await supabase.rpc('rollback_transaction')
        }
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className='bg-customeBG1 min-h-full'>
            <div className='container mx-auto p-4 space-y-8 '>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-bold text-customeText2'>
                        User Information
                    </h1>
                    <Link href='/'>
                        <Button variant='outline'>Back to Home</Button>
                    </Link>
                </div>
                <UserInfo user={user} />
                <div>
                    <div className='flex flex-row items-center justify-between'>
                        <h2 className='text-2xl font-bold mb-4 text-customeText2'>
                            Your Canvases
                        </h2>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant='link'>Create Canvas</Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle>Create New Canvas</DialogTitle>
                                    <DialogDescription>
                                        Enter the name for your new canvas and click confirm.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor='canvasName' className='text-right'>
                                            Title
                                        </Label>
                                        <Input
                                            id='canvasName'
                                            value={canvasName}
                                            onChange={(e) => setCanvasName(e.target.value)}
                                            className='col-span-3'
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => createNewCanvas(user.id)}>
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {canvases.length > 0 ? (
                        <CanvasList
                            canvases={canvases}
                            deleteCanvas={deleteCanvas}
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>
                            You have no canvases. Create your first canvas!

                            </p>
                            <Button variant='link' onClick={() => setOpen(true)}>
                                Create new
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
