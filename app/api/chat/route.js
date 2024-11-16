import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt, parseTransactionDetails } from '@/config/openai';
import { generateLinkId } from '@/lib/contracts';
import { getQuote, sendTransaction } from '@/lib/transactions';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message },
      ],
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = parseTransactionDetails(response);

    // Directly ask for required parameters if transaction type is detected
    // Directly ask for required parameters if transaction type is detected
    if (parsedResponse.type === 'transfer') {
      const missingFields = [];
      if (!parsedResponse.network?.fromChain) missingFields.push('fromChain');
      if (!parsedResponse.network?.toChain) missingFields.push('toChain');
      if (!parsedResponse.token?.fromToken) missingFields.push('fromToken');
      if (!parsedResponse.token?.toToken) missingFields.push('toToken');
      if (!parsedResponse.amount) missingFields.push('amount');
      if (!parsedResponse.toAddress) missingFields.push('toAddress');

      if (missingFields.length > 0) {
        console.log("Missing: ", missingFields)
        return NextResponse.json({
          type: "clarification",
          message: `Please provide the following information for the transaction: ${missingFields.join(', ')}. Example: "Transfer 1000000 wei of USDT token from chain POL to USDT token in chain POL to address 0x1704e5Dc4Eff82c9218Ded9a5864B2080b6428be"`,
        });
      }
      else {
        return NextResponse.json(parsedResponse);
      }
    }

    if (parsedResponse.type === 'swap') {
      console.log("Swap transaction: ", parsedResponse);
      return NextResponse.json(parsedResponse);
    }
  
    // Handle clarification requests
    if (parsedResponse.type === 'clarification') {
      return NextResponse.json(parsedResponse);
    }

    // Handle different transaction types
    switch (parsedResponse.type) {
      case "link_create":
        console.log("Link create: ", parsedResponse);
        const linkId = generateLinkId();
        parsedResponse.linkId = linkId;
        parsedResponse.additionalInfo = `Share this link ID for redemption: ${linkId}`;
        break;

      case 'link_redeem':
        // No additional processing needed for redemption
        break;

        default:
        // Handle unknown type
        return NextResponse.json({
          type: 'unknown',
          message: parsedResponse.additionalInfo || 'Unknown transaction type.'
        });
    }

    // Return a response for known transaction types
    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ type: 'error', message: 'Failed to process request' });
  }
}