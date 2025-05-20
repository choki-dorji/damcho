import { NextResponse } from 'next/server';

const MODEL_API_URL = 'http://127.0.0.1:5001/predict';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(MODEL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to get prediction' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 