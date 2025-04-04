import OpenAI from "openai";
import { config } from "dotenv";

export class OpenRouterCompletion {
  client: OpenAI;
  constructor() {
    config();

    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  async createCompletion(
    sysMsg: string,
    llmQuery: string
  ): Promise<string | null> {
    const llmResponse = await this.client.chat.completions.create({
      model: "google/gemini-2.5-pro-exp-03-25:free",
      messages: [
        {
          role: "system",
          content: sysMsg,
        },
        {
          role: "user",
          content: llmQuery,
        },
      ],
      max_completion_tokens: 1000,
      temperature: 0,
    });

    return llmResponse.choices[0].message.content;
  }
}
