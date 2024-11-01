import type { NextApiRequest, NextApiResponse } from "next";

if (!process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { englishText, momInput } = req.body;

    if (!englishText) {
      return res.status(400).json({ error: "No English text provided" });
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ englishText, momInput }),
    });

    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

export default handler;
