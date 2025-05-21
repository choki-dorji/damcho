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
    significantHealthIssues: string
    physicalConcerns: string
    lateSideEffectSymptoms: string
  }
  emotionalWellbeing: {
    mood: string
    supportSystem: string
    concerns: string | any
    currentEmotionalSymptoms: string[]
  }
  lifestyleGoals: {
    Excercise_frequently: string | any
    diet: string | any
    sleep: string | any
    goals: string | any
    smokingStatus: string
    alcoholUse: string
    sleepQuality: string
    excerciseFrequently: string
    dietQuality: string
    activityLevel: string
    socialSupport: string
    lifestyleChangeEffort: string
    riskStratification: string
    fearOfRecurrenceScore: string
    sleepDisruptionScore: string
    copingStyle: string
    fertilityConcern: string
    cardiovascularRisk: string
    Care_Coordination_Score: string
    Cognitive_Function_Score: string
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
      allergies: '',
      significantHealthIssues: '',
      physicalConcerns: '',
      lateSideEffectSymptoms: ''
    },
    emotionalWellbeing: {
      mood: '',
      supportSystem: '',
      concerns: '',
      currentEmotionalSymptoms: []
    },
    lifestyleGoals: {
      Excercise_frequently: '',
      diet: '',
      sleep: '',
      goals: '',
      smokingStatus: '',
      alcoholUse: '',
      sleepQuality: '',
      excerciseFrequently: '',
      dietQuality: '',
      activityLevel: '',
      socialSupport: '',
      lifestyleChangeEffort: '',
      riskStratification: '',
      fearOfRecurrenceScore: '',
      sleepDisruptionScore: '',
      copingStyle: '',
      fertilityConcern: '',
      cardiovascularRisk: '',
      Care_Coordination_Score: '',
      Cognitive_Function_Score: ''
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

  const userId = getAuthData()?.id
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      try {
        // Submit survey data
        const flatSurveyData = {
          ...flattenSurveyData(surveyData),
          userId: userId
        }
        
        // First submit to /api/survey
        // const surveyResponse = await fetch('/api/survey', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(flatSurveyData),
        // })

        // if (!surveyResponse.ok) {
        //   throw new Error('Failed to save survey')
        // }

        // Then submit to /api/predict with symptom data
        const predictData = {
          Age: String(calculateAge(surveyData.personalInfo.dob)),
          Gender: surveyData.personalInfo.gender,
          Cancer_type: surveyData.treatmentHistory.cancerType,
          Treatment_type: surveyData.treatmentHistory.treatments[0] || '',
          Smoking_status: surveyData.lifestyleGoals.smokingStatus,
          Alcohol_use: surveyData.lifestyleGoals.alcoholUse,
          Sleep_quality: surveyData.lifestyleGoals.sleepQuality,
          Excercise_frequently: surveyData.lifestyleGoals.excerciseFrequently,
          Diet_quality: surveyData.lifestyleGoals.dietQuality,
          Activity_level: surveyData.lifestyleGoals.activityLevel,
          Social_support: surveyData.lifestyleGoals.socialSupport,
          Fatigue: surveyData.physicalHealth.currentSymptoms.includes('fatigue') ? 'yes' : 'no',
          Nausea: surveyData.physicalHealth.currentSymptoms.includes('nausea') ? 'yes' : 'no',
          Pain: surveyData.physicalHealth.currentSymptoms.includes('pain') ? 'yes' : 'no',
          Skin_changes: surveyData.physicalHealth.currentSymptoms.includes('skin-change') ? 'yes' : 'no',
          Respiratory_issues: surveyData.physicalHealth.currentSymptoms.includes('respiratory-issues') ? 'yes' : 'no',
          Emotional_distress: surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('emotional distress') ? 'yes' : 'no',
          Other_symptoms: surveyData.physicalHealth.otherSymptoms || 'no',
          No_significant_issues: surveyData.physicalHealth.significantHealthIssues || 'no',
          Anxiety: surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('anxiety') ? 'yes' : 'no',
          Depression: surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('depression') ? 'yes' : 'no',
          Stress: surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('stress') ? 'yes' : 'no',
          Care_Coordination_Score: String(surveyData.lifestyleGoals.Care_Coordination_Score),
          Lifestyle_Change_Effort: String(surveyData.lifestyleGoals.lifestyleChangeEffort),
          Risk_Stratification: surveyData.lifestyleGoals.riskStratification,
          Fear_of_Recurrence_Score: String(surveyData.lifestyleGoals.fearOfRecurrenceScore),
          Sleep_Disruption_Score: String(surveyData.lifestyleGoals.sleepDisruptionScore),
          Coping_Style: surveyData.lifestyleGoals.copingStyle,
          PTSD_Flag: surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('ptsd') ? 'yes' : 'no',
          Fertility_Concern: surveyData.lifestyleGoals.fertilityConcern,
          Cardiovascular_Risk: surveyData.lifestyleGoals.cardiovascularRisk,
          Cognitive_Function_Score: String(surveyData.lifestyleGoals.Cognitive_Function_Score),
          Late_Effect_Symptoms: surveyData.physicalHealth.lateSideEffectSymptoms || 'no',
        }

        console.log('Sending prediction data:', predictData)

        const predictResponse = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(predictData),
        })

        if (!predictResponse.ok) {
          throw new Error('Failed to get prediction')
        }

        const predictionResult = await predictResponse.json()
        console.log('Prediction response:', predictionResult)

        // Show the prediction data in an alert
        alert(`Response: ${JSON.stringify(predictionResult, null, 2)}`)

        // router.push("/dashboard") // Commented out navigation
      } catch (error) {
        console.error('Error submitting survey:', error)
        alert('Error submitting survey: ' + (error instanceof Error ? error.message : 'Unknown error'))
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

  const isStepValid = (step: number, surveyData: SurveyData): boolean => {
    switch (step) {
      case 1:
        return (
          surveyData.personalInfo.firstName.trim() !== '' &&
          surveyData.personalInfo.lastName.trim() !== '' &&
          surveyData.personalInfo.email.trim() !== '' &&
          surveyData.personalInfo.dob.trim() !== '' &&
          surveyData.personalInfo.gender.trim() !== ''
        )
      case 2:
        return (
          surveyData.treatmentHistory.cancerType.trim() !== '' &&
          surveyData.treatmentHistory.diagnosisDate.trim() !== '' &&
          surveyData.treatmentHistory.treatmentEndDate.trim() !== '' &&
          surveyData.treatmentHistory.treatments.length > 0
        )
      case 3:
        return (
          (surveyData.physicalHealth.currentSymptoms.length > 0 ||
           surveyData.physicalHealth.otherSymptoms !== '' ||
           surveyData.physicalHealth.significantHealthIssues !== '' ||
           surveyData.physicalHealth.lateSideEffectSymptoms !== '') &&
          surveyData.physicalHealth.otherSymptoms !== '' &&
          surveyData.physicalHealth.significantHealthIssues !== '' &&
          surveyData.physicalHealth.lateSideEffectSymptoms !== ''
        )
      case 4:
        return true
      case 5:
        return true
      default:
        return false
    }
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

            <Button
              onClick={handleNext}
              className="bg-forest-green hover:bg-forest-green/90 text-white"
              disabled={!isStepValid(currentStep, surveyData)}
            >
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
            <Label htmlFor="typeOfCancer" className="block text-sm font-medium text-gray-700">
              Type of Cancer
            </Label>
            <select
              id="typeOfCancer"
              name="typeOfCancer"
              required
              value={surveyData.treatmentHistory.cancerType}
              onChange={e => updateSurveyData(2, { cancerType: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-forest-green focus:outline-none focus:ring-1 focus:ring-forest-green text-gray-900"
            >
              <option value="">Select type</option>
              <option value="Breast">Breast</option>
              <option value="Lung">Lung</option>
              <option value="Skin">Skin</option>
            </select>
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
            <Label htmlFor="treatmentType">Treatment Received</Label>
            <select
              id="treatmentType"
              name="treatmentType"
              value={surveyData.treatmentHistory.treatments[0] || ''}
              onChange={e => updateSurveyData(2, { treatments: [e.target.value] })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select treatment</option>
              <option value="surgery">Surgery</option>
              <option value="chemotherapy">Chemotherapy</option>
              <option value="radiation">Radiation Therapy</option>
              <option value="immunotherapy">Immunotherapy</option>
            </select>
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
              <CheckboxItem 
                id="fatigue" 
                label="Fatigue" 
                checked={surveyData.physicalHealth.currentSymptoms.includes('fatigue')}
                onCheckedChange={(checked) => {
                  const symptoms = checked
                    ? [...surveyData.physicalHealth.currentSymptoms, 'fatigue']
                    : surveyData.physicalHealth.currentSymptoms.filter(s => s !== 'fatigue')
                  updateSurveyData(3, { currentSymptoms: symptoms })
                }}
              />
              <CheckboxItem 
                id="pain" 
                label="Pain" 
                checked={surveyData.physicalHealth.currentSymptoms.includes('pain')}
                onCheckedChange={(checked) => {
                  const symptoms = checked
                    ? [...surveyData.physicalHealth.currentSymptoms, 'pain']
                    : surveyData.physicalHealth.currentSymptoms.filter(s => s !== 'pain')
                  updateSurveyData(3, { currentSymptoms: symptoms })
                }}
              />
              <CheckboxItem 
                id="skin-change" 
                label="Skin Change" 
                checked={surveyData.physicalHealth.currentSymptoms.includes('skin-change')}
                onCheckedChange={(checked) => {
                  const symptoms = checked
                    ? [...surveyData.physicalHealth.currentSymptoms, 'skin-change']
                    : surveyData.physicalHealth.currentSymptoms.filter(s => s !== 'skin-change')
                  updateSurveyData(3, { currentSymptoms: symptoms })
                }}
              />
              <CheckboxItem 
                id="respiratory-issues" 
                label="Respiratory Issues" 
                checked={surveyData.physicalHealth.currentSymptoms.includes('respiratory-issues')}
                onCheckedChange={(checked) => {
                  const symptoms = checked
                    ? [...surveyData.physicalHealth.currentSymptoms, 'respiratory-issues']
                    : surveyData.physicalHealth.currentSymptoms.filter(s => s !== 'respiratory-issues')
                  updateSurveyData(3, { currentSymptoms: symptoms })
                }}
              />
              <CheckboxItem 
                id="nausea" 
                label="Nausea" 
                checked={surveyData.physicalHealth.currentSymptoms.includes('nausea')}
                onCheckedChange={(checked) => {
                  const symptoms = checked
                    ? [...surveyData.physicalHealth.currentSymptoms, 'nausea']
                    : surveyData.physicalHealth.currentSymptoms.filter(s => s !== 'nausea')
                  updateSurveyData(3, { currentSymptoms: symptoms })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherSymptoms">Do you have any other symptoms?</Label>
            <select
              id="otherSymptoms"
              name="otherSymptoms"
              value={surveyData.physicalHealth.otherSymptoms}
              onChange={e => updateSurveyData(3, { otherSymptoms: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="significantHealthIssues">Do you have any significant health issues?</Label>
            <select
              id="significantHealthIssues"
              name="significantHealthIssues"
              value={surveyData.physicalHealth.significantHealthIssues}
              onChange={e => updateSurveyData(3, { significantHealthIssues: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
            <Textarea 
              id="physicalConcerns" 
              placeholder="Describe any physical concerns you'd like help with"
              value={surveyData.physicalHealth.physicalConcerns}
              onChange={(e) => updateSurveyData(3, { physicalConcerns: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateSideEffectSymptoms">Do you have any late side effect symptoms?</Label>
            <select
              id="lateSideEffectSymptoms"
              name="lateSideEffectSymptoms"
              value={surveyData.physicalHealth.lateSideEffectSymptoms}
              onChange={e => updateSurveyData(3, { lateSideEffectSymptoms: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
              <CheckboxItem
                id="anxiety"
                label="Anxiety"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('anxiety')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'anxiety']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'anxiety')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
              <CheckboxItem
                id="depression"
                label="Depression"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('depression')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'depression']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'depression')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
              <CheckboxItem
                id="fear"
                label="Fear of Recurrence"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('fear')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'fear']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'fear')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
              <CheckboxItem
                id="stress"
                label="stress"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('stress')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'stress']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'stress')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
              <CheckboxItem
                id="emotional distress"
                label="Emotional Distress of Isolation"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('emotional distress')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'emotional distress']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'emotional distress')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
              <CheckboxItem
                id="ptsd"
                label="PTSD diagonisis"
                checked={surveyData.emotionalWellbeing.currentEmotionalSymptoms.includes('ptsd')}
                onCheckedChange={checked => {
                  const symptoms = checked
                    ? [...surveyData.emotionalWellbeing.currentEmotionalSymptoms, 'ptsd']
                    : surveyData.emotionalWellbeing.currentEmotionalSymptoms.filter(s => s !== 'ptsd')
                  updateSurveyData(4, { currentEmotionalSymptoms: symptoms })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportSystem">Do you have a support system?</Label>
            <select
              id="supportSystem"
              name="supportSystem"
              value={surveyData.emotionalWellbeing.supportSystem}
              onChange={e => updateSurveyData(4, { supportSystem: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotionalConcerns">Any specific emotional concerns?</Label>
            <Textarea 
              id="emotionalConcerns" 
              placeholder="Describe any emotional concerns you'd like help with"
              value={surveyData.emotionalWellbeing.concerns}
              onChange={(e) => updateSurveyData(4, { concerns: e.target.value })}
            />
          </div>
        </div>
      )

    case 5:
      return (
        <div className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="sleepQuality">Sleep Quality</Label>
            <select
              id="sleepQuality"
              name="sleepQuality"
              value={surveyData.lifestyleGoals.sleepQuality}
              onChange={e => updateSurveyData(5, { sleepQuality: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select sleep quality</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleepDisruptionScore">How often is your sleep disrupted? (0 = never, 10 = always)</Label>
            <select
              id="sleepDisruptionScore"
              name="sleepDisruptionScore"
              value={surveyData.lifestyleGoals.sleepDisruptionScore}
              onChange={e => updateSurveyData(5, { sleepDisruptionScore: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">0-10</option>
              {[...Array(11).keys()].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smokingStatus">Smoking Status</Label>
            <select
              id="smokingStatus"
              name="smokingStatus"
              value={surveyData.lifestyleGoals.smokingStatus}
              onChange={e => updateSurveyData(5, { smokingStatus: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select smoking status</option>
              <option value="never">Never</option>
              <option value="former">Former</option>
              <option value="current">Current</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alcoholUse">Alcohol Use</Label>
            <select
              id="alcoholUse"
              name="alcoholUse"
              value={surveyData.lifestyleGoals.alcoholUse}
              onChange={e => updateSurveyData(5, { alcoholUse: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select alcohol use</option>
              <option value="never">Never</option>
              <option value="occasionally">Occasionally</option>
              <option value="regularly">Regularly</option>
            </select>
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="excerciseFrequently">Do you exercise frequently?</Label>
            <select
              id="excerciseFrequently"
              name="excerciseFrequently"
              value={surveyData.lifestyleGoals.excerciseFrequently}
              onChange={e => updateSurveyData(5, { excerciseFrequently: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietQuality">Diet Quality</Label>
            <select
              id="dietQuality"
              name="dietQuality"
              value={surveyData.lifestyleGoals.dietQuality}
              onChange={e => updateSurveyData(5, { dietQuality: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select diet quality</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={surveyData.lifestyleGoals.activityLevel}
              onChange={e => updateSurveyData(5, { activityLevel: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialSupport">Social Support</Label>
            <select
              id="socialSupport"
              name="socialSupport"
              value={surveyData.lifestyleGoals.socialSupport}
              onChange={e => updateSurveyData(5, { socialSupport: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select social support</option>
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifestyleChangeEffort">How much effort are you putting into lifestyle changes? (0 = none, 10 = maximum)</Label>
            <Input
              id="lifestyleChangeEffort"
              name="lifestyleChangeEffort"
              type="number"
              min={0}
              max={10}
              value={surveyData.lifestyleGoals.lifestyleChangeEffort}
              onChange={e => updateSurveyData(5, { lifestyleChangeEffort: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskStratification">How would you rate your current health risk?</Label>
            <select
              id="riskStratification"
              name="riskStratification"
              value={surveyData.lifestyleGoals.riskStratification}
              onChange={e => updateSurveyData(5, { riskStratification: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select risk level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fearOfRecurrenceScore">How much do you fear cancer recurrence? (0 = not at all, 10 = extreme)</Label>
            <select
              id="fearOfRecurrenceScore"
              name="fearOfRecurrenceScore"
              value={surveyData.lifestyleGoals.fearOfRecurrenceScore}
              onChange={e => updateSurveyData(5, { fearOfRecurrenceScore: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select level</option>
              {[...Array(11).keys()].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="copingStyle">What is your coping style?</Label>
            <select
              id="copingStyle"
              name="copingStyle"
              value={surveyData.lifestyleGoals.copingStyle}
              onChange={e => updateSurveyData(5, { copingStyle: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select coping style</option>
              <option value="adaptive">Adaptive</option>
              <option value="maladaptive">Maladaptive</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fertilityConcern">Do you have any fertility concerns?</Label>
            <select
              id="fertilityConcern"
              name="fertilityConcern"
              value={surveyData.lifestyleGoals.fertilityConcern}
              onChange={e => updateSurveyData(5, { fertilityConcern: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Fertility concern?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardiovascularRisk">How would you rate your cardiovascular risk?</Label>
            <select
              id="cardiovascularRisk"
              name="cardiovascularRisk"
              value={surveyData.lifestyleGoals.cardiovascularRisk}
              onChange={e => updateSurveyData(5, { cardiovascularRisk: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select risk</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="Care_Coordination_Score">Care Coordination Score (0 = poor, 10 = excellent)</Label>
            <select
              id="Care_Coordination_Score"
              name="Care_Coordination_Score"
              value={surveyData.lifestyleGoals.Care_Coordination_Score || ''}
              onChange={e => updateSurveyData(5, { Care_Coordination_Score: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select score</option>
              {[...Array(11).keys()].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="Cognitive_Function_Score">Cognitive Function Score (0 = poor, 10 = excellent)</Label>
            <select
              id="Cognitive_Function_Score"
              name="Cognitive_Function_Score"
              value={surveyData.lifestyleGoals.Cognitive_Function_Score || ''}
              onChange={e => updateSurveyData(5, { Cognitive_Function_Score: e.target.value })}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select score</option>
              {[...Array(11).keys()].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
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

function flattenSurveyData(surveyData: SurveyData) {
  return {
    // Personal Info
    firstName: surveyData.personalInfo.firstName,
    lastName: surveyData.personalInfo.lastName,
    email: surveyData.personalInfo.email,
    dateOfBirth: new Date(surveyData.personalInfo.dob),
    gender: surveyData.personalInfo.gender,

    // Treatment History
    typeOfCancer: surveyData.treatmentHistory.cancerType,
    dateOfDiagnosis: new Date(surveyData.treatmentHistory.diagnosisDate),
    dateTreatmentEnded: new Date(surveyData.treatmentHistory.treatmentEndDate),
    treatmentsReceived: surveyData.treatmentHistory.treatments,
    otherTreatments: surveyData.treatmentHistory.otherTreatments,

    // Physical Health
    symptoms: surveyData.physicalHealth.currentSymptoms,
    physicalConcerns: surveyData.physicalHealth.physicalConcerns,
    Late_Effect_Symptoms: surveyData.physicalHealth.lateSideEffectSymptoms,

    // Emotional Wellbeing
    emotionalWellbeing: surveyData.emotionalWellbeing.mood,
    emotionalSymptoms: Array.isArray(surveyData.emotionalWellbeing.concerns)
      ? surveyData.emotionalWellbeing.concerns
      : surveyData.emotionalWellbeing.concerns
        ? [surveyData.emotionalWellbeing.concerns]
        : [],
    supportSystem: surveyData.emotionalWellbeing.supportSystem,
    emotionalConcerns: surveyData.emotionalWellbeing.concerns,

    // Lifestyle & Goals
    diet: surveyData.lifestyleGoals.diet,
    sleepQuality: surveyData.lifestyleGoals.sleep,
    recoveryGoals: Array.isArray(surveyData.lifestyleGoals.goals)
      ? surveyData.lifestyleGoals.goals
      : surveyData.lifestyleGoals.goals
        ? [surveyData.lifestyleGoals.goals]
        : [],
    additionalInfo: surveyData.lifestyleGoals.goals,
  };
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  
  return age
}
