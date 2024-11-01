import type { NextApiRequest, NextApiResponse } from "next";

if (!process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export type ChatGPTAgent = "user" | "system";

// ChatGPTMessage interface
interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

interface requestPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  max_tokens: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { englishText, momInput } = req.body;

  if (!englishText) {
    return res.status(400).json({ error: "No English text provided" });
  }

  const translateToMandarin = async (text: string) => {
    const payload: requestPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translator. Translate the following English text to Mandarin Chinese." },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 200,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generateReply = async (text: string, momInput: string) => {
    const payload: requestPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant helping to generate a personal, direct English reply from the perspective of a mother communicating with a client. First, interpret the mother's input in Mandarin, then generate a reply based on this interpretation. The tone should be friendly, personal, and straightforward. Avoid formal or overly professional language. Use 'I' instead of 'we' or 'us'. Generate only the body of the message, without salutations, closings, or any introductory phrases." },
        { role: "user", content: `Context (English text from client): ${text}\nMom's input, concerns, or instructions (in Mandarin): ${momInput}\nBased on the context and mom's input:\n1. Interpret mom's Mandarin input and explain its key points in English.\n2. Provide the interpretation of mom's input in Mandarin.\n3. Based on this interpretation, generate an appropriate English reply that addresses mom's concerns and follows her instructions. The reply should sound as if it's coming directly from mom, with a personal and friendly tone. Provide only the body of the message, without any introductions, salutations, or closings. Use 'I' instead of 'we' or 'us' throughout the reply.\n4. Provide the English reply in Mandarin.\n5. Explain the reply in Mandarin, highlighting how it addresses mom's input.` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  try {
    const mandarinTranslation = await translateToMandarin(englishText);
    const reply = momInput ? await generateReply(englishText, momInput) : null;

    return res.json({
      mandarinTranslation,
      reply,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

export default handler;
