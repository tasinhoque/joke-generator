import { NextApiRequest, NextApiResponse } from "next";

interface Body {
  count: number;
  tone: string;
  type: string;
  topic: string;
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("Breakpoint 21");
  if (req.method === "POST") {
    const { count, tone, type, topic } = req.body as Body;
    const prompt = `Count: ${count}\nTone: ${tone}\nType: ${type}\nTopic: ${topic}\n`;
    const INSTRUCTIONS = `Your task is to write/find humorous jokes.\n`;

    const OPENAI_URL = "https://api.openai.com/v1/completions";
    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = OPENAI_URL;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      temperature: 0.7,
      max_tokens: 2048,
      prompt: INSTRUCTIONS + prompt,
      model: "gpt-3.5-turbo-instruct",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const aiText = responseData.choices[0].text.trim();

      res.status(200).json({ message: aiText });
    } catch (error) {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
