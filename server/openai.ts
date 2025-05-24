import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate replies based on received message, tone, and optional intent
export async function generateMessageReplies(message: string, tone: string, intent?: string): Promise<Array<{ text: string }>> {
  try {
    // Special handling for authentic tone to provide more substantive replies
    const isAuthenticTone = tone === 'authentic';
    
    let instructions = `
Provide the responses in JSON format as an array of objects with a 'text' property for each reply option.
Each reply should be between 1-3 sentences, natural sounding, and appropriate for the tone requested.
Use UK English spelling (e.g., "favourite" instead of "favorite") and phrasing that feels natural to British users.
The tone should be subtly British without relying on stereotypes, forced slang, or exaggerated regionalisms.
`;

    // Enhanced instructions for authentic tone
    if (isAuthenticTone) {
      instructions += `
Since the 'authentic' tone was selected, create replies that:
- Show genuine thoughtfulness and deeper engagement with the message content
- Include personal insights or values where appropriate
- Demonstrate self-awareness and emotional intelligence
- Are slightly longer and more substantive than other tones (2-4 sentences)
- Balance honesty with tactfulness in a dating context
`;
    }
    
    const prompt = `Generate 3 different reply options to the following message in a ${tone} tone.
    
Message: "${message}"
${intent ? `My intent for the reply is: "${intent}"` : ''}

${instructions}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps people craft perfect message replies for dating apps and WhatsApp conversations. Your suggestions should use natural UK English spelling and phrasing with subtly British communication styles. Aim for a tone that feels authentically British without stereotypes or forced slang. Focus on creating responses that would resonate with UK users while maintaining the requested tone. Avoid exaggerated Britishness or regional clichés."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedData = JSON.parse(content);
    return parsedData.replies || [];
  } catch (error: any) {
    console.error("OpenAI error generating replies:", error);
    throw new Error(`Failed to generate replies: ${error.message}`);
  }
}

// Generate conversation starters based on profile context and optional user interests
export async function generateConversationStarters(profileContext: string, interests?: string): Promise<Array<{ text: string }>> {
  try {
    const prompt = `Generate 3 engaging conversation starters based on the following profile information:
    
Profile Context: "${profileContext}"
${interests ? `My interests: "${interests}"` : ''}

Provide the starters in JSON format as an array of objects with a 'text' property for each starter.
Each starter should be 1-2 sentences, feel natural, and be likely to spark an engaging conversation.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps people start conversations based on profile information and shared interests."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedData = JSON.parse(content);
    return parsedData.starters || [];
  } catch (error: any) {
    console.error("OpenAI error generating conversation starters:", error);
    throw new Error(`Failed to generate conversation starters: ${error.message}`);
  }
}

// Analyze a drafted message for the Message Coach feature
export async function analyzeMessage(message: string) {
  try {
    const prompt = `Analyze the following drafted message and provide feedback:
    
Message: "${message}"

Provide the analysis in JSON format with the following structure:
{
  "toneAnalysis": {
    "overall": "Brief tone description",
    "description": "Detailed description of the tone",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "clarity": {
    "score": 0-10 score,
    "feedback": "Detailed feedback on clarity and structure"
  },
  "emotionalImpact": {
    "tags": ["emotion1", "emotion2"],
    "description": "Description of emotional impact"
  },
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "improvedVersion": "An improved version of the message"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI messaging coach that provides detailed feedback and improvements for drafted messages."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI error analyzing message:", error);
    throw new Error(`Failed to analyze message: ${error.message}`);
  }
}

// Decode a received message for the Message Decoder feature
export async function decodeMessage(message: string) {
  try {
    const prompt = `Decode and analyze the following received message:
    
Message: "${message}"

Provide the analysis in JSON format with the following structure:
{
  "interpretation": "Overall interpretation of the message",
  "tone": ["tone1", "tone2", "tone3"],
  "intent": "Likely intent behind the message",
  "subtext": ["subtextual meaning 1", "subtextual meaning 2", "subtextual meaning 3"],
  "responseStrategy": "General advice on how to respond",
  "suggestedResponse": "A specific suggested response strategy"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI message decoder that helps people understand the intent, tone, and subtext behind messages they receive."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI error decoding message:", error);
    throw new Error(`Failed to decode message: ${error.message}`);
  }
}
