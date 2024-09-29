'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/utils/supabase/server'

export async function login(email: string, password: string) {
	const supabase = createClient()

	const formData = {
		email: email,
		password: password
	}

	const { data, error } = await supabase.auth.signInWithPassword(formData)

	console.log(data)

	if (error) {
		return { error }
	}

	return { data }
}

export async function signup(email: string, password: string) {
	const supabase = createClient()

	const data = {
		email: email,
		password: password
	}

	const { error } = await supabase.auth.signUp(data)

	if (error) {
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/')
}
