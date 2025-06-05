import OpenAI from "openai";

// Using GPT-4 Turbo for improved tone handling, emotional clarity, and natural language quality
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AI_MODEL = "gpt-4-turbo";

// Generate replies based on received message, tone, and optional intent
export async function generateMessageReplies(message: string, tone: string, intent?: string, mode?: string): Promise<Array<{ text: string }>> {
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
    
    let prompt: string;
    
    if (mode === "say_it_better") {
      // For say_it_better mode, the message already contains the full structured prompt
      prompt = `${message}

${instructions}

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "replies": [
    {"text": "First improved version here"},
    {"text": "Second improved version here"},
    {"text": "Third improved version here"}
  ]
}
`;
    } else {
      prompt = `Someone received this message:

"${message}"

Generate 1-3 possible replies in the tone of: ${tone}.
Keep them natural, emotionally appropriate, and context-aware.
${intent ? `My intent for the reply is: "${intent}"` : ''}

${instructions}

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "replies": [
    {"text": "First reply option here"},
    {"text": "Second reply option here"},
    {"text": "Third reply option here"}
  ]
}
`;
    }

    let systemPrompt: string;
    
    if (mode === "say_it_better") {
      systemPrompt = "You're a dating communication coach helping someone improve a message they want to send. Your job is to create 3 emotionally distinct rewrites that keep the core meaning but offer different vibes - from clean polish to confident warmth to creative reimagining. Each version should feel human, emotionally aware, and easy to send in real dating conversations. Use proper UK English spelling (colour, favourite, realise) and British phrasing. Avoid American slang, expressions, or informal words. Keep language natural but distinctly British.";
    } else {
      systemPrompt = "You are an AI assistant that helps people craft perfect message replies for dating apps and WhatsApp conversations. Your suggestions should use proper UK English spelling (colour, favourite, realise) and British phrasing throughout. Avoid American slang words, expressions, or informal language. Use natural British communication styles that feel authentic to UK users. Focus on creating responses that sound distinctly British without exaggerated regionalisms or forced expressions.";
    }

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: mode === "say_it_better" ? 0.9 : 0.7,
      max_tokens: mode === "say_it_better" ? 350 : 200,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    try {
      const parsedData = JSON.parse(content);
      
      // Validate the response format
      if (!parsedData.replies || !Array.isArray(parsedData.replies)) {
        console.warn("OpenAI returned unexpected format:", content);
        // Create a default format with the raw content as fallback
        return [{ text: "Sorry, I couldn't generate proper replies. Please try again." }];
      }
      
      // Ensure we have at least one reply
      if (parsedData.replies.length === 0) {
        return [{ text: "I need a bit more context to generate a good reply. Could you provide more details?" }];
      }
      
      return parsedData.replies;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", content);
      // Try to extract something useful from the raw content
      return [{ text: "Sorry, I couldn't generate proper replies. Please try again." }];
    }
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

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "starters": [
    {"text": "First conversation starter here"},
    {"text": "Second conversation starter here"},
    {"text": "Third conversation starter here"}
  ]
}

Each starter should be 1-2 sentences, feel natural, and be likely to spark an engaging conversation in a UK dating context.
`;

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps people start conversations based on profile information and shared interests. You always return exactly 3 conversation starters in the requested format."
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

    try {
      const parsedData = JSON.parse(content);
      
      // Validate the response format
      if (!parsedData.starters || !Array.isArray(parsedData.starters)) {
        console.warn("OpenAI returned unexpected format:", content);
        // Create a default format with fallback starters
        return [
          { text: "I noticed something interesting in your profile. What inspired you to include that?" },
          { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
          { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
        ];
      }
      
      // Ensure we have at least one starter
      if (parsedData.starters.length === 0) {
        return [
          { text: "I noticed something interesting in your profile. What inspired you to include that?" },
          { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
          { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
        ];
      }
      
      return parsedData.starters;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", content);
      // Return fallback starters
      return [
        { text: "I noticed something interesting in your profile. What inspired you to include that?" },
        { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
        { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
      ];
    }
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
      model: AI_MODEL,
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
      model: AI_MODEL,
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
