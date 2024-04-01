const DEFAULT_API_URL = "https://api.openai.com/v1/completions";
const MODEL = "gpt-3.5-turbo-instruct";
const MAX_TOKENS = 2048;

export async function fetchOpenAI(
  prompt: string,
  temperature: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = process.env.API_URL || DEFAULT_API_URL;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = JSON.stringify({
    model: MODEL,
    prompt,
    temperature,
    max_tokens: MAX_TOKENS,
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data.choices[0].text.trim();
}
