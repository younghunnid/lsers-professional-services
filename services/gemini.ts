// Reworked: remove server-only SDK usage and call local backend proxy instead.

export async function callGeminiProxy(prompt: string) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Proxy request failed: ${res.status} ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function getAiRecommendation(query: string) {
  const prompt = `You are a helpful assistant for LSERS Professional Services. The user is looking for help with: "${query}". 
Based on this query, recommend which service category they should look for from the following list: electrician, plumber, handyman, cleaner, painter, computer-repair, software-dev, phone-repair, graphics-design, photography, tutor, driver, delivery, barber, hairstylist, chef, security-guard, gardener, event-planner.

Return the answer in JSON format with two fields:
- categoryId: the exact string from the list above.
- reason: a short explanation of why this matches.`;
  const data = await callGeminiProxy(prompt);
  // Try to extract text content from common response shapes
  const text =
    data?.candidates?.[0]?.content ||
    data?.candidates?.[0]?.message?.content ||
    data?.output?.[0]?.content ||
    data?.text ||
    (typeof data === 'string' ? data : null);

  if (typeof text === 'string') {
    try { return JSON.parse(text); } catch { return { raw: text }; }
  }
  return data;
}

export async function getProviderReply(providerName: string, providerCategory: string, chatHistory: { sender: string, text: string }[]) {
  const historyText = chatHistory.map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `You are a professional service provider named ${providerName}, specializing as a ${providerCategory}.
You are chatting with a potential customer on the LSERS app.
Keep your responses brief (1-2 sentences), professional, and helpful. Do not be overly conversational.

Here is the recent chat history:
${historyText}

Based on this, provide a suitable response as ${providerName}. Only return your response text, no extra formatting.`;
  const data = await callGeminiProxy(prompt);
  return data?.candidates?.[0]?.content || data?.text || JSON.stringify(data);
}

export async function transcribeAudio(base64Data: string, mimeType: string) {
  const prompt = `Transcribe the following audio data. Return only the transcription text.

Audio (base64,mime=${mimeType}):
${base64Data}`;
  const data = await callGeminiProxy(prompt);
  return data?.text || data?.candidates?.[0]?.content || null;
}

// startServiceChat shim for frontend components that expect a session-like API.
// It proxies messages through /api/gemini and returns { text } responses.
export async function startServiceChat() {
  return {
    sendMessage: async ({ message }: { message: string }) => {
      try {
        const prompt = `System: You are LSERS AI assistant.\nUser: ${message}`;
        const data: any = await callGeminiProxy(prompt);
        const text =
          data?.candidates?.[0]?.content ||
          data?.candidates?.[0]?.message?.content ||
          data?.output?.[0]?.content ||
          data?.text ||
          (typeof data === 'string' ? data : JSON.stringify(data));
        return { text };
      } catch (err: any) {
        console.error('startServiceChat.sendMessage error', err);
        return { text: "Error connecting to AI service." };
      }
    }
  };
}
