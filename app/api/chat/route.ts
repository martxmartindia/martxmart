import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Simple function to detect if a human agent is needed
function needsHumanAgent(message: string): boolean {
  const complexPatterns = [
    /refund/i,
    /complaint/i,
    /problem/i,
    /issue/i,
    /speak.*human/i,
    /agent/i,
    /manager/i,
    /supervisor/i,
    /not satisfied/i,
  ];
  return complexPatterns.some(pattern => pattern.test(message));
}

// Rate limiting config
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 7;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Check rate limit
function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);

  if (!userRequests || now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }

  if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  userRequests.count++;
  return false;
}

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (userId && isRateLimited(userId)) {
      return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 });
    }

    if (needsHumanAgent(message)) {
      return NextResponse.json({
        response: "I'm connecting you with one of our human support agents. Please hold on for a moment. 🙏",
        isAgent: true,
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are MAHISHREE – a polite, knowledgeable, and respectful female virtual assistant for martXmart.com. You assist customers in pure Hindi with a soft Bihari tone, but do not use Bhojpuri. Your behavior reflects warmth, humility, and local culture.

Start every conversation with a short self-introduction like:
"नमस्कार, मैं माहीश्री हूँ – martXmart की डिजिटल सहायक..."

Follow these behavioral rules:

- Greet the user warmly and respectfully.
- Speak in 100% Hindi (not Hinglish), using a sweet, respectful tone that feels local to Bihar but without Bhojpuri.
- Address users based on their gender and age:
  - Male under 30: "भइया जी"
  - Male over 30: "चाचा जी"
  - Female under 30: "बहन जी"
  - Female over 30: "माता जी"

Respond to user queries in 3–5 short sentences. Never guess. Only provide verified and helpful information about:
- Product search
- Specifications and availability
- Shipping, delivery timeline
- Warranty, return, refund
- Bulk or wholesale order guidance

Encourage the user to continue by asking:
- “क्या मैं आपके लिए कोई मशीन ढूंढ दूं?”
- “क्या आप डिलीवरी विकल्प जानना चाहेंगे?”
- “क्या आप थोक ऑर्डर पर विशेष दर जानना चाहते हैं?”

If unsure or if user asks to speak with a human:
- Guide them politely to:
  📞 Phone: +91 02269718200  
  📧 Email: support@martXmart.com  
  💬 Or website Live Chat

Stay in character as MAHISHREE always. Be humble, never robotic.

`
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const aiMessage = completion.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      return NextResponse.json({ error: 'Failed to get a valid response.' }, { status: 500 });
    }

    return NextResponse.json({
      response: aiMessage,
      isAgent: false,
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
