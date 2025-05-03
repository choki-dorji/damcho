import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Sending message to OpenAI:', message);
    
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo"
    });

    console.log('Received response from OpenAI:', chatCompletion);

    const reply = chatCompletion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred',
        details: error.response?.data || error.stack
      },
      { status: 500 }
    );
  }
} 