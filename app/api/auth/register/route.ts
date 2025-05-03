import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, userType } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['patient', 'admin'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
      userType
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.user

    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 