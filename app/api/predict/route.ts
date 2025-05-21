import { NextResponse } from 'next/server';

const MODEL_API_URL = 'http://127.0.0.1:5001/predict';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Log the received data
    console.log('Received prediction data:', data);
    
    const response = await fetch(MODEL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const predictionData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: predictionData.error || 'Failed to get prediction' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data received successfully',
      receivedData: {
        // Physical symptoms
        fatigue: data.fatigue,
        nausea: data.nausea,
        pain: data.pain,
        skinChange: data.skinChange,
        respiratoryIssues: data.respiratoryIssues,
        age: data.age,
        
        // Cancer and treatment data
        cancerType: data.cancerType,
        treatments: data.treatments,
        diagnosisDate: data.diagnosisDate,
        treatmentEndDate: data.treatmentEndDate
      },
      prediction: predictionData
    });
  } catch (error) {
    console.error('Error in predict API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing prediction request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 