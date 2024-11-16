import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt, parseTransactionDetails } from '@/config/openai';
import { generateLinkId } from '@/lib/contracts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const response = completion.choices[0].message.content;
    // const response = JSON.stringify({
    //   type: "link_create",
    //   network: "Ethereum",
    //   token: "USDC",
    //   amount: 1,
    //   linkId: "1",
    //   additionalInfo: "",
    //   thoughtProcess: ""
    // });
    const parsedResponse = parseTransactionDetails(response);

    // Handle link creation
    if (parsedResponse.type === 'link_create') {
      const linkId = generateLinkId();
      parsedResponse.linkId = linkId;
      parsedResponse.additionalInfo = `Share this link ID for redemption: ${linkId}`;
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 