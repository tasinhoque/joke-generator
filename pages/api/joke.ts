import { NextApiRequest, NextApiResponse } from "next";
import { fetchOpenAI } from "../../helpers/openai";

interface Body {
  count: number;
  tone: string;
  type: string;
  topic: string;
  creativity: string;
}

const creativityConverter: Record<string, number> = {
  Low: 0.3,
  Medium: 0.7,
  High: 1.1,
};

const EVALUATION_PROMPT = `
Evaluate the jokes in terms of their humor, appropriateness, and potential to offend. Consider the structure, timing, and delivery of the joke as well as its content. Assess whether the joke:

1. Is genuinely funny and elicits laughter.
2. Contains language and themes suitable for all backgrounds.
3. Avoids stereotypes, derogatory language, and sensitive topics that could offend audiences.

Based on your evaluation, offer specific suggestions to improve the joke. Enhancements might include rewording for clarity, timing, or impact; adjusting content to increase its universal appeal; and ensuring it respects a diverse audience. Your goal is to maintain or enhance the humor while making the joke more inclusive and accessible to a wider audience.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { count, tone, type, topic, creativity } = req.body as Body;
  const instructions = `Your task is to write/find humorous jokes. Generate ${count} ${type} jokes about ${topic} that has a ${tone} tone.`;

  try {
    const response = await fetchOpenAI(
      instructions,
      creativityConverter[creativity]
    );
    const evaluation = await fetchOpenAI(response + EVALUATION_PROMPT, 0.7);

    res.status(200).json({ message: response, evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unknown error occurred." });
  }
}
