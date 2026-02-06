
import { GoogleGenAI, Type, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiRecommendation(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful assistant for LSERS Professional Services. The user is looking for help with: "${query}". 
      Based on this query, recommend which service category they should look for from the following list: electrician, plumber, handyman, cleaner, painter, computer-repair, software-dev, phone-repair, graphics-design, photography, tutor, driver, delivery, barber, hairstylist, chef, security-guard, gardener, event-planner.
      
      Return the answer in JSON format with two fields:
      - categoryId: the exact string from the list above.
      - reason: a short explanation of why this matches.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryId: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["categoryId", "reason"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return null;
  }
}

export async function startServiceChat() {
  const chat: Chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are LSERS AI, a friendly and professional assistant for LSERS Professional Services, Liberia\'s premier marketplace. You help users find verified professionals for home, tech, and creative services. You answer questions about how the platform works, service categories (electricians, plumbers, etc.), rewards points (25 pts per booking), and provider registration. Keep answers concise, helpful, and focused on LSERS.',
    },
  });
  return chat;
}

export async function getProviderReply(providerName: string, providerCategory: string, chatHistory: { sender: string, text: string }[]) {
  try {
    const historyText = chatHistory.map(m => `${m.sender}: ${m.text}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional service provider named ${providerName}, specializing as a ${providerCategory}.
      You are chatting with a potential customer on the LSERS app.
      Keep your responses brief (1-2 sentences), professional, and helpful. Do not be overly conversational.
      
      Here is the recent chat history:
      ${historyText}
      
      Based on this, provide a suitable response as ${providerName}. Only return your response text, no extra formatting or quotation marks.`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Provider Reply failed:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}


export async function transcribeAudio(base64Data: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: "Please transcribe this audio input accurately. Provide only the text of the transcription, with no additional commentary." },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Transcription failed:", error);
    return null;
  }
}
