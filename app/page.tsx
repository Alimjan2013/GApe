/** @format */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { set } from 'zod'

export default function Layout() {
    const [userId, setUserId] = useState<string | null>(null)
    const [userUrl, setUserUrl] = useState<string >('#')
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()
            if (data?.user?.id) {
                setUserId(data.user.id)
                setUserUrl(`/user/${data.user.id}`)

            }
        }
        fetchUser()
    }, [])


    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='h-screen w-full flex items-center justify-center py-10'>
                {/* <header>This is header</header> */}
                <Card className='shadow-md rounded-3xl h-fit w-fit bg-slate-50 p-5 border-hidden min-w-[400px]'>
                    <CardHeader>
                        <HoverCard openDelay={100}>
                            <HoverCardTrigger asChild className='mt-5 mb-0'>
                                <Button
                                    asChild
                                    variant={'link'}
                                    className='text-xl text-secondary-foreground font-bold'
                                >
                                    <Link href='https://github.com/Alimjan2013/GApe'>
                                        @GApe
                                    </Link>
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent side='top'>
                                <div className='flex justify-between space-x-4'>
                                    <div className='space-y-1'>
                                        <h4 className='text-xl font-semibold'>
                                            @GApe
                                        </h4>
                                        <p className='text-sm'>
                                            An Interactive Tool for generating
                                            One-Page Content
                                        </p>
                                        <div className='flex items-center pt-2'>
                                            <span className='text-xs text-muted-foreground'>
                                                Joined October 2024
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-row item-center justify-center'>
                            {userId ? (
                                <Button
                                    className='mx-5 border border-solid border-secondary-foreground'
                                    onClick={() => {
                                        console.log(userUrl)
                                        router.push(userUrl)
                                    }}
                                >
                                    Go to Canvas List
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className='mx-5 border border-solid border-secondary-foreground'
                                        onClick={() => {
                                            console.log('/authentication/login')
                                            router.push('/authentication/login')
                                        }}
                                    >
                                        Login
                                    </Button>

                                    <Button
                                        className='mx-5 border border-solid border-secondary-foreground'
                                        variant={'outline'}
                                        onClick={() => {
                                            console.log('/authentication/register')
                                            router.push('/authentication/register')
                                        }}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className='flex flex-row content-center justify-center mx-5'>
                        <a href='#intro' className='text-muted-foreground'>
                            About
                        </a>
                        {/* <p className='text-muted-foreground'>About</p> */}
                    </CardFooter>
                </Card>
            </div>
            <div className='h-screen w-full flex flex-col items-center justify-center bg-customeBG1'>
                <h1 id='intro' className='text-customeText2'>
                    Introduction
                </h1>
                <p className='text-customeText1 lg:mx-28 md:mx-10 mx-4'>
                GApe (Get A Page Easily), an interactive design tool for creating one-page content such as a curriculum vitae or leaflets for both personal and commercial use.
                </p>
            </div>
        </div>
    )
}
