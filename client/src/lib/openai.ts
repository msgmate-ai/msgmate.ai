import { apiRequest } from "@/lib/queryClient";

// Function to generate replies
export const generateReplies = async (message: string, tone: string, intent?: string) => {
  try {
    const response = await apiRequest('POST', '/api/generate-replies', { 
      message, 
      tone,
      intent
    });
    const data = await response.json();
    return data.replies;
  } catch (error) {
    console.error('Error generating replies:', error);
    throw error;
  }
};

// Function to generate conversation starters
export const generateConversationStarters = async (profileContext: string, interests?: string) => {
  try {
    const response = await apiRequest('POST', '/api/conversation-starters', { 
      profileContext,
      interests
    });
    const data = await response.json();
    return data.starters;
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    throw error;
  }
};

// Function for message coaching
export const analyzeMessage = async (message: string) => {
  try {
    const response = await apiRequest('POST', '/api/message-coach', { 
      message
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing message:', error);
    throw error;
  }
};

// Function for message decoding
export const decodeMessage = async (message: string) => {
  try {
    const response = await apiRequest('POST', '/api/message-decoder', { 
      message
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error decoding message:', error);
    throw error;
  }
};
