"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import CustomAlert from "@/components/custom-alert";



export default function LoginPage() {
  const [alert, setAlert] = useState<null | { type: string; title: string; message: string }>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (!data.user) {
        throw new Error('No user data received')
      }

      setAlert({
        type: "success",
        title: "Login successful",
        message: "Welcome back!",
      })

      // Redirect immediately based on survey completion and care plan status
      if (!data.user.hasCompletedSurvey) {
        router.push("/survey")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Login failed",
        message: error instanceof Error ? error.message : "Invalid email or password",
      })
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="logo" className="mx-auto h-20 w-20" />
          <h2 className="mt-6 text-3xl font-bold text-forest-green">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your care plan</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-forest-green">Welcome Back</CardTitle>
              <CardDescription className="text-center">Sign in to your account</CardDescription>
            </CardHeader>
            {alert && (
              <CustomAlert
                type={alert.type as any}
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert(null)}
                duration={3000}
              />
            )}

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-forest-green hover:bg-forest-green/90" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-dusty-blue hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
