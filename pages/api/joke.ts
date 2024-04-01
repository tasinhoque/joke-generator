import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_URL = "https://api.openai.com/v1/completions";

interface Body {
  count: number;
  tone: string;
  type: string;
  topic: string;
  creativity: string;
}

const creativity_converter: Record<string, number> = {
  Low: 0.3,
  Medium: 0.7,
  High: 1.1,
};

const EVALUATION_PROMPT = `\nEvaluate the jokes in terms of their humor, appropriateness, and potential to offend. Consider the structure, timing, and delivery of the joke as well as its content. Assess whether the joke:

1. Is genuinely funny and elicits laughter.
2. Contains language and themes suitable for people of all backgrounds.
3. Avoids stereotypes, derogatory language, and sensitive topics that could offend audiences.

Based on your evaluation, offer specific suggestions to improve the joke. Enhancements might include rewording for clarity, timing, or impact; adjusting content to increase its universal appeal; and ensuring it respects a diverse audience. Your goal is to maintain or enhance the humor while making the joke more inclusive and accessible to a wider audience."
`;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { count, tone, type, topic, creativity } = req.body as Body;
    const INSTRUCTIONS = `Your task is to write/find humorous jokes. Generate ${count} ${type} jokes about ${topic} that has a ${tone} tone.`;

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = process.env.API_URL || OPENAI_URL;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      temperature: creativity_converter[creativity],
      max_tokens: 2048,
      prompt: INSTRUCTIONS,
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

      const evalData = {
        temperature: 0.7,
        max_tokens: 2048,
        prompt: aiText + EVALUATION_PROMPT,
        model: "gpt-3.5-turbo-instruct",
      };

      const evalResponse = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(evalData),
      });

      const evalResponseData = await evalResponse.json();
      const evalAiText = evalResponseData.choices[0].text.trim();

      res.status(200).json({ message: aiText, evaluation: evalAiText });
    } catch (error) {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
