/** @format */

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function emailLogin(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true, message: 'User has successfully logged in.' }
}

export async function emailSignup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const credentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // const { data, error } = await supabase.auth.signUp(credentials)


    const { data, error } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options:{
            emailRedirectTo:'https://gape.is-ali.tech/authentication/login'
        }
         
      });

    if (error) {
        return { success: false, message: error.message, data: null }
    }

    return {
        success: true,
        message: 'User has successfully signed up.',
        data: data,
    }
}

export async function signout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.log(error)
        redirect('/authentication/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
