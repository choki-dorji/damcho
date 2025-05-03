"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SendHorizontal, Bot, User } from "lucide-react"

type Message = {
  role: "assistant" | "user"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI support companion. How can I help you with your cancer recovery journey today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage = {
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // This is a mock implementation since we don't have actual API access in this environment
      // In a real implementation, you would use the AI SDK to generate a response
      const mockResponse = await mockAIResponse(input)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: mockResponse,
        },
      ])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Mock AI response function - in a real implementation, this would use the AI SDK
  const mockAIResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple response logic based on keywords
    const input = userInput.toLowerCase()

    if (input.includes("anxious") || input.includes("anxiety") || input.includes("worried")) {
      return "It's completely normal to feel anxious after cancer treatment. Many survivors experience this. Have you tried any relaxation techniques like deep breathing or mindfulness meditation? These can be helpful for managing anxiety. I can also connect you with support resources if you'd like."
    } else if (input.includes("tired") || input.includes("fatigue") || input.includes("exhausted")) {
      return "Fatigue is one of the most common issues cancer survivors face. Make sure you're balancing activity with rest. Short walks followed by rest periods can help build stamina gradually. Have you discussed this with your healthcare provider? They might want to check for other causes like anemia."
    } else if (input.includes("pain") || input.includes("ache") || input.includes("hurts")) {
      return "I'm sorry you're experiencing pain. It's important to keep track of when it occurs and its severity. This information will be valuable for your healthcare team. In the meantime, have you tried any of the pain management techniques in your care plan? If the pain is severe or new, please contact your healthcare provider right away."
    } else if (
      input.includes("eat") ||
      input.includes("food") ||
      input.includes("appetite") ||
      input.includes("nutrition")
    ) {
      return "Nutrition is crucial during recovery. Try eating smaller, more frequent meals if your appetite is low. Foods high in protein can help rebuild strength. Your care plan includes specific nutritional recommendations based on your treatment history. Would you like me to highlight those for you?"
    } else if (input.includes("sleep") || input.includes("insomnia") || input.includes("awake")) {
      return "Sleep disturbances are common after cancer treatment. Establishing a regular sleep routine can help. Try to go to bed and wake up at the same time each day, and limit screen time before bed. Relaxation techniques before bedtime might also improve your sleep quality. If the problem persists, it's worth discussing with your healthcare provider."
    } else {
      return "Thank you for sharing that. As your support companion, I'm here to help you navigate your recovery journey. Is there a specific aspect of your care plan you'd like to discuss, or would you like some general wellness tips today?"
    }
  }

  return (
    <Card className="border-none shadow-md h-[600px] flex flex-col">
      <CardHeader className="bg-dusty-blue/10 rounded-t-lg">
        <CardTitle className="text-xl text-forest-green">Support Companion</CardTitle>
        <CardDescription>
          I'm here to provide emotional support and answer questions about your recovery journey
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`flex ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"} max-w-[80%] items-start gap-2`}
              >
                <Avatar
                  className={`h-8 w-8 ${message.role === "assistant" ? "bg-dusty-blue/20" : "bg-forest-green/20"}`}
                >
                  <AvatarFallback>
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-dusty-blue" />
                    ) : (
                      <User className="h-4 w-4 text-forest-green" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-white border border-gray-200 text-gray-700"
                      : "bg-forest-green text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%] items-start gap-2">
                <Avatar className="h-8 w-8 bg-dusty-blue/20">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-dusty-blue" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-forest-green hover:bg-forest-green/90"
            disabled={isLoading || input.trim() === ""}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
