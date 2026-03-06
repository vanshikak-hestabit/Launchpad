import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

export async function generateGroqResponse(messages) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: messages,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}