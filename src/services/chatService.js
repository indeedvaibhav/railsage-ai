// Chat service — REAL Claude API only. No mock responses.

const SYSTEM_PROMPT = `You are RailSage AI, a friendly railway assistant for Indian train passengers.
You speak in a warm, simple, conversational tone — like texting a helpful friend.
Never use technical railway jargon. Keep answers short and clear.
If you have train data in context, reference it specifically.
If data is missing or unavailable, say so honestly — never make up train info.`;

export async function sendMessage(messages, { trainContext = '', language = 'en' } = {}) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        systemPrompt: SYSTEM_PROMPT,
        trainContext,
        language,
      }),
    });
    const { content, error } = await res.json();
    if (error || !content) {
      console.warn('[chatService] API error:', error);
      return null;
    }
    return content;
  } catch (e) {
    console.warn('[chatService] fetch error:', e.message);
    return null;
  }
}

/* Create chat service placeholder */
