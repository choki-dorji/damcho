'use server'

import { registerUser, loginUser } from './auth-service'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleRegister(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  userType: 'patient' | 'admin'
}) {
  try {
    const result = await registerUser(data)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    // Set user session
    const cookieStore = await cookies()
    cookieStore.set('user_id', result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, userType: result.user.userType }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Failed to create account' }
  }
}

export async function handleLogin(data: { email: string; password: string }) {
  try {
    const result = await loginUser(data)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    // Set user session
    const cookieStore = await cookies()
    cookieStore.set('user_id', result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, userType: result.user.userType }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Failed to login' }
  }
}

export async function handleLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('userData')
  cookieStore.delete('session')
  redirect('/auth/login')
}

export async function setAuthCookies(userData) {
  const cookieStore = await cookies()
  cookieStore.set('userData', JSON.stringify(userData), {
    path: '/',
    maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
  })
} 

