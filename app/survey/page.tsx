"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getAuthData } from "@/lib/token"

interface SurveyData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    dob: string
    gender: string
  }
  treatmentHistory: {
    cancerType: string
    diagnosisDate: string
    treatmentEndDate: string
    treatments: string[]
    otherTreatments: string
  }
  physicalHealth: {
    currentSymptoms: string[]
    otherSymptoms: string
    medications: string
    allergies: string
  }
  emotionalWellbeing: {
    mood: string
    supportSystem: string
    concerns: string
  }
  lifestyleGoals: {
    exercise: string
    diet: string
    sleep: string
    goals: string
  }
}

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<{ firstName: string; lastName: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: ''
    },
    treatmentHistory: {
      cancerType: '',
      diagnosisDate: '',
      treatmentEndDate: '',
      treatments: [],
      otherTreatments: ''
    },
    physicalHealth: {
      currentSymptoms: [],
      otherSymptoms: '',
      medications: '',
      allergies: ''
    },
    emotionalWellbeing: {
      mood: '',
      supportSystem: '',
      concerns: ''
    },
    lifestyleGoals: {
      exercise: '',
      diet: '',
      sleep: '',
      goals: ''
    }
  })
  const totalSteps = 5

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = getAuthData()
        if (!authData) {
          router.push('/auth/login')
          return
        }

        // Split the name into first and last name
        const [firstName, ...lastNameParts] = authData.name.split(' ')
        const lastName = lastNameParts.join(' ')

        setUserData({
          firstName,
          lastName
        })

        // Set initial survey data with user info
        setSurveyData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName,
            lastName,
            email: authData.email
          }
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      try {
        // Submit survey data
        const response = await fetch('/api/care-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(surveyData),
        })

        if (!response.ok) {
          throw new Error('Failed to save care plan')
        }

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error('Error submitting survey:', error)
        // Handle error (show error message to user)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateSurveyData = (step: number, data: any) => {
    setSurveyData(prev => {
      const newData = { ...prev }
      switch (step) {
        case 1:
          newData.personalInfo = { ...prev.personalInfo, ...data }
          break
        case 2:
          newData.treatmentHistory = { ...prev.treatmentHistory, ...data }
          break
        case 3:
          newData.physicalHealth = { ...prev.physicalHealth, ...data }
          break
        case 4:
          newData.emotionalWellbeing = { ...prev.emotionalWellbeing, ...data }
          break
        case 5:
          newData.lifestyleGoals = { ...prev.lifestyleGoals, ...data }
          break
      }
      return newData
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your information...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-parchment py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-forest-green mb-4">Your Health Profile</h1>
          <p className="text-gray-600 mb-6">
            Help us create your personalized care plan by sharing information about your health journey.
          </p>

          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="h-2 bg-gray-200 [&>div]:bg-dusty-blue"
          />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-dusty-blue/10 rounded-t-lg">
            <CardTitle className="text-2xl text-forest-green">{getStepTitle(currentStep)}</CardTitle>
            <CardDescription>{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {renderStepContent(currentStep, userData, surveyData, updateSurveyData)}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button onClick={handleNext} className="bg-forest-green hover:bg-forest-green/90 text-white">
              {currentStep === totalSteps ? "Complete Survey" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Personal Information"
    case 2:
      return "Cancer Treatment History"
    case 3:
      return "Physical Health"
    case 4:
      return "Emotional Wellbeing"
    case 5:
      return "Lifestyle & Goals"
    default:
      return ""
  }
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "Basic information to help us personalize your care plan"
    case 2:
      return "Details about your cancer diagnosis and treatments"
    case 3:
      return "Your current physical health status and symptoms"
    case 4:
      return "Information about your emotional and mental wellbeing"
    case 5:
      return "Your lifestyle habits and recovery goals"
    default:
      return ""
  }
}

function renderStepContent(step: number, userData: { firstName: string; lastName: string }, surveyData: SurveyData, updateSurveyData: (step: number, data: any) => void) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={userData.firstName} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={userData.lastName} 
                disabled 
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={surveyData.personalInfo.email}
              onChange={(e) => updateSurveyData(1, { email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={surveyData.personalInfo.dob}
              onChange={(e) => updateSurveyData(1, { dob: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup 
              value={surveyData.personalInfo.gender}
              onValueChange={(value) => updateSurveyData(1, { gender: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary">Non-binary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )

    case 2:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cancerType">Type of Cancer</Label>
            <Input 
              id="cancerType" 
              value={surveyData.treatmentHistory.cancerType}
              onChange={(e) => updateSurveyData(2, { cancerType: e.target.value })}
              placeholder="e.g., Breast, Lung, Colorectal" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosisDate">Date of Diagnosis</Label>
            <Input 
              id="diagnosisDate" 
              type="date" 
              value={surveyData.treatmentHistory.diagnosisDate}
              onChange={(e) => updateSurveyData(2, { diagnosisDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatmentEndDate">Date Treatment Ended</Label>
            <Input 
              id="treatmentEndDate" 
              type="date" 
              value={surveyData.treatmentHistory.treatmentEndDate}
              onChange={(e) => updateSurveyData(2, { treatmentEndDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Treatments Received (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxItem 
                id="surgery" 
                label="Surgery"
                checked={surveyData.treatmentHistory.treatments.includes('surgery')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'surgery']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'surgery')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="chemotherapy" 
                label="Chemotherapy"
                checked={surveyData.treatmentHistory.treatments.includes('chemotherapy')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'chemotherapy']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'chemotherapy')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="radiation" 
                label="Radiation Therapy"
                checked={surveyData.treatmentHistory.treatments.includes('radiation')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'radiation']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'radiation')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="immunotherapy" 
                label="Immunotherapy"
                checked={surveyData.treatmentHistory.treatments.includes('immunotherapy')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'immunotherapy']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'immunotherapy')
                  updateSurveyData(2, { treatments })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherTreatments">Other Treatments</Label>
            <Textarea 
              id="otherTreatments" 
              value={surveyData.treatmentHistory.otherTreatments}
              onChange={(e) => updateSurveyData(2, { otherTreatments: e.target.value })}
              placeholder="Please describe any other treatments you received" 
            />
          </div>
        </div>
      )

    case 3:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you rate your overall physical health?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Are you experiencing any of the following symptoms? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxItem id="fatigue" label="Fatigue" />
              <CheckboxItem id="pain" label="Pain" />
              <CheckboxItem id="nausea" label="Nausea" />
              <CheckboxItem id="sleep" label="Sleep Disturbances" />
              <CheckboxItem id="appetite" label="Loss of Appetite" />
              <CheckboxItem id="breathing" label="Difficulty Breathing" />
              <CheckboxItem id="mobility" label="Mobility Issues" />
              <CheckboxItem id="neuropathy" label="Neuropathy" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>How often do you engage in physical activity?</Label>
            <RadioGroup defaultValue="2-3-times">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-3-times" id="2-3-times" />
                <Label htmlFor="2-3-times">2-3 times per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="once" id="once" />
                <Label htmlFor="once">Once a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="rarely" />
                <Label htmlFor="rarely">Rarely or never</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalConcerns">Any specific physical concerns?</Label>
            <Textarea id="physicalConcerns" placeholder="Describe any physical concerns you'd like help with" />
          </div>
        </div>
      )

    case 4:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you rate your emotional wellbeing?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="emotional-excellent" />
                <Label htmlFor="emotional-excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="emotional-good" />
                <Label htmlFor="emotional-good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="emotional-fair" />
                <Label htmlFor="emotional-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="emotional-poor" />
                <Label htmlFor="emotional-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Are you experiencing any of the following? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxItem id="anxiety" label="Anxiety" />
              <CheckboxItem id="depression" label="Depression" />
              <CheckboxItem id="fear" label="Fear of Recurrence" />
              <CheckboxItem id="grief" label="Grief" />
              <CheckboxItem id="isolation" label="Feelings of Isolation" />
              <CheckboxItem id="relationship" label="Relationship Challenges" />
              <CheckboxItem id="body-image" label="Body Image Concerns" />
              <CheckboxItem id="identity" label="Identity Changes" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Do you have a support system?</Label>
            <RadioGroup defaultValue="yes-strong">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes-strong" id="yes-strong" />
                <Label htmlFor="yes-strong">Yes, strong support system</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes-limited" id="yes-limited" />
                <Label htmlFor="yes-limited">Yes, but limited</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No support system</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotionalConcerns">Any specific emotional concerns?</Label>
            <Textarea id="emotionalConcerns" placeholder="Describe any emotional concerns you'd like help with" />
          </div>
        </div>
      )

    case 5:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you describe your diet?</Label>
            <RadioGroup defaultValue="balanced">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced">Balanced and healthy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostly-healthy" id="mostly-healthy" />
                <Label htmlFor="mostly-healthy">Mostly healthy with occasional indulgences</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="needs-improvement" id="needs-improvement" />
                <Label htmlFor="needs-improvement">Needs improvement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="diet-poor" />
                <Label htmlFor="diet-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>How is your sleep quality?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="sleep-excellent" />
                <Label htmlFor="sleep-excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>What are your primary goals for recovery? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxItem id="physical-strength" label="Regain Physical Strength" />
              <CheckboxItem id="emotional-balance" label="Improve Emotional Balance" />
              <CheckboxItem id="nutrition" label="Better Nutrition" />
              <CheckboxItem id="sleep-improvement" label="Improve Sleep" />
              <CheckboxItem id="social-connections" label="Rebuild Social Connections" />
              <CheckboxItem id="work-return" label="Return to Work" />
              <CheckboxItem id="family-balance" label="Family Life Balance" />
              <CheckboxItem id="long-term-health" label="Long-term Health Management" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional information that might help us create your personalized care plan"
            />
          </div>
        </div>
      )

    default:
      return null
  }
}

interface CheckboxItemProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function CheckboxItem({ id, label, checked, onCheckedChange }: CheckboxItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
