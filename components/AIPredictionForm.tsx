'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

interface PredictionResponse {
  care_plan: string;
  confidence?: number;
  status: string;
  error?: string;
}

const steps = [
  'Personal Info',
  'Cancer Treatment History',
  'Physical Health',
  'Emotional Wellbeing',
  'Lifestyle and Goals',
];

const FEATURE_ORDER = [
  'Age', 'Gender', 'Cancer_type', 'Treatment_type', 'Smoking_status', 'Alcohol_use', 'Sleep_quality', 'Excercise_frequently', 'Diet_quality', 'Activity_level', 'Social_support', 'Fatigue', 'Nausea', 'Pain', 'Skin_changes', 'Respiratory_issues', 'Emotional_distress', 'Other_symptoms', 'No_significant_issues', 'Anxiety', 'Depression', 'Stress', 'Care_Coordination_Score', 'Lifestyle_Change_Effort', 'Risk_Stratification', 'Fear_of_Recurrence_Score', 'Sleep_Disruption_Score', 'Coping_Style', 'PTSD_Flag', 'Fertility_Concern', 'Cardiovascular_Risk', 'Cognitive_Function_Score', 'Late_Effect_Symptoms'
];

export function AIPredictionForm() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      // Build the payload in the correct order
      const orderedPayload: Record<string, any> = {};
      FEATURE_ORDER.forEach(key => {
        orderedPayload[key] = formData[key] || "";
      });
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedPayload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to get prediction');
      setPrediction(result);
      // Navigate to dashboard after successful prediction
      // router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!prediction) return;
    const content = `Your Personalized Care Plan:\n\n${prediction.care_plan}\n\n${prediction.confidence ? `Confidence: ${(prediction.confidence * 100).toFixed(1)}%` : ""}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "care-plan.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Step content components
  const StepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Age">What is your age?</Label>
              <Input id="Age" name="Age" type="number" required value={formData.Age || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Gender">What is your gender?</Label>
              <select name="Gender" required value={formData.Gender || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Cancer_type">What type of cancer were you diagnosed with?</Label>
              <Input id="Cancer_type" name="Cancer_type" required value={formData.Cancer_type || ''} onChange={handleChange} placeholder="e.g. Breast, Prostate, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Treatment_type">What type of treatment did you receive?</Label>
              <Input id="Treatment_type" name="Treatment_type" required value={formData.Treatment_type || ''} onChange={handleChange} placeholder="e.g. Chemotherapy, Surgery, etc." />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Fatigue">Do you experience fatigue?</Label>
              <select name="Fatigue" required value={formData.Fatigue || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Fatigue</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Pain">Do you experience pain?</Label>
              <select name="Pain" required value={formData.Pain || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Pain</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Skin_changes">Have you noticed any skin changes?</Label>
              <select name="Skin_changes" required value={formData.Skin_changes || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Skin Changes</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Respiratory_issues">Do you have any respiratory issues?</Label>
              <select
                name="Respiratory_issues"
                required
                value={formData.Respiratory_issues || ''}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
              >
                <option value="" disabled>Select Respiratory Issues</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Other_symptoms">Are you experiencing any other symptoms?</Label>
              <select name="Other_symptoms" required value={formData.Other_symptoms || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Other Symptoms</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="No_significant_issues">Do you have no significant health issues?</Label>
              <select name="No_significant_issues" required value={formData.No_significant_issues || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select No Significant Issues</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Care_Coordination_Score">How well is your care coordinated? (0 = not at all, 10 = excellent)</Label>
              <Input id="Care_Coordination_Score" name="Care_Coordination_Score" type="number" required min={0} max={10} value={formData.Care_Coordination_Score || ''} onChange={handleChange} placeholder="0-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Cognitive_Function_Score">How would you rate your cognitive function? (0 = poor, 10 = excellent)</Label>
              <Input id="Cognitive_Function_Score" name="Cognitive_Function_Score" type="number" required min={0} max={10} value={formData.Cognitive_Function_Score || ''} onChange={handleChange} placeholder="0-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Late_Effect_Symptoms">Are you experiencing any late effect symptoms?</Label>
              <select name="Late_Effect_Symptoms" required value={formData.Late_Effect_Symptoms || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Late effect symptoms?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Nausea">Do you experience nausea?</Label>
              <select name="Nausea" required value={formData.Nausea || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Nausea</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Anxiety">Do you feel anxious?</Label>
              <select name="Anxiety" required value={formData.Anxiety || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Anxiety</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Depression">Do you feel depressed?</Label>
              <select name="Depression" required value={formData.Depression || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Depression</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Stress">Do you feel stressed?</Label>
              <select name="Stress" required value={formData.Stress || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Stress</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Emotional_distress">Do you experience emotional distress?</Label>
              <select name="Emotional_distress" required value={formData.Emotional_distress || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select Emotional Distress</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="PTSD_Flag">Have you been diagnosed with PTSD?</Label>
              <select name="PTSD_Flag" required value={formData.PTSD_Flag || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>PTSD diagnosis?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Smoking_status">What is your smoking status?</Label>
              <select name="Smoking_status" required value={formData.Smoking_status || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select smoking status</option>
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Alcohol_use">How often do you consume alcohol?</Label>
              <select name="Alcohol_use" required value={formData.Alcohol_use || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select alcohol use</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Diet_quality">How would you rate your diet quality?</Label>
              <select name="Diet_quality" required value={formData.Diet_quality || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select diet quality</option>
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Excercise_frequently">Do you exercise frequently?</Label>
              <select name="Excercise_frequently" required value={formData.Excercise_frequently || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Do you exercise frequently?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Activity_level">What is your typical activity level?</Label>
              <select name="Activity_level" required value={formData.Activity_level || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Social_support">How would you rate your social support?</Label>
              <select name="Social_support" required value={formData.Social_support || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select social support</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Lifestyle_Change_Effort">How much effort are you putting into lifestyle changes? (0 = none, 10 = maximum)</Label>
              <Input id="Lifestyle_Change_Effort" name="Lifestyle_Change_Effort" type="number" required min={0} max={10} value={formData.Lifestyle_Change_Effort || ''} onChange={handleChange} placeholder="0-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Risk_Stratification">How would you rate your current health risk?</Label>
              <select name="Risk_Stratification" required value={formData.Risk_Stratification || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Fear_of_Recurrence_Score">How much do you fear cancer recurrence? (0 = not at all, 10 = extreme)</Label>
              <Input id="Fear_of_Recurrence_Score" name="Fear_of_Recurrence_Score" type="number" required min={0} max={10} value={formData.Fear_of_Recurrence_Score || ''} onChange={handleChange} placeholder="0-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Sleep_quality">How would you rate your sleep quality?</Label>
              <select name="Sleep_quality" required value={formData.Sleep_quality || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select sleep quality</option>
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Sleep_Disruption_Score">How often is your sleep disrupted? (0 = never, 10 = always)</Label>
              <Input id="Sleep_Disruption_Score" name="Sleep_Disruption_Score" type="number" required min={0} max={10} value={formData.Sleep_Disruption_Score || ''} onChange={handleChange} placeholder="0-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Coping_Style">What is your coping style?</Label>
              <select name="Coping_Style" required value={formData.Coping_Style || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select coping style</option>
                <option value="adaptive">Adaptive</option>
                <option value="maladaptive">Maladaptive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Fertility_Concern">Do you have any fertility concerns?</Label>
              <select name="Fertility_Concern" required value={formData.Fertility_Concern || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Fertility concern?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Cardiovascular_Risk">How would you rate your cardiovascular risk?</Label>
              <select name="Cardiovascular_Risk" required value={formData.Cardiovascular_Risk || ''} onChange={handleChange} className="w-full border rounded px-2 py-2">
                <option value="" disabled>Select risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Progress bar calculation
  const progress = Math.round(((step + 1) / steps.length) * 100);

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
              Step {step + 1} of {steps.length}
            </span>
            <span>{progress}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-dusty-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Cancer Survivorship Survey</CardTitle>
            <CardDescription>
              Step {step + 1} of {steps.length}: <b>{steps[step]}</b>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
              <div key={step}>
                <StepContent />
              </div>
              <div className="flex justify-between mt-6">
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Care Plan...
                      </>
                    ) : (
                      'Complete Survey'
                    )}
                  </Button>
                )}
              </div>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {prediction && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold text-green-800">Your Personalized Care Plan</h3>
                <p className="text-green-700">{prediction.care_plan}</p>
                {prediction.confidence && (
                  <p className="text-sm text-green-600 mt-2">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                )}
                <Button type="button" className="mt-4" onClick={handleDownload}>
                  Download Care Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 