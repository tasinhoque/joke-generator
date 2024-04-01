import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const INSTRUCTIONS = `Your task is to write/find humorous jokes. When the user gives you a total count, only output such number of jokes. If the user specifies a joke type or a tone, make sure your jokes follow those specifications. The user may also give you a topic, and restrict your jokes to only be from that topic.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const prompt = messages[messages.length - 1]["content"];
  console.log(prompt);

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    max_tokens: 2048,
    stream: true,
    prompt: INSTRUCTIONS + prompt,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
