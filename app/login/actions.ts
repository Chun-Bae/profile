'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function authenticate(prevState: any, formData: FormData) {
  const password = formData.get('password')
  
  const sitePassword = process.env.SITE_PASSWORD || '1234'
  
  if (password === sitePassword) {
    const cookieStore = await cookies()
    cookieStore.set('site_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    redirect('/')
  }
  
  return { error: 'Invalid password' }
}
