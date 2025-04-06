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

  async createExplainCompletion(
    sysMsg: string,
    llmQuery: string,
    
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

  async createReasonCompletion(
    sysMsg: string,
    llmQuery: string,
  ): Promise<{ confidenceThreshold: number; reason: string } | null> {
    const llmResponse = await this.client.chat.completions.create({
      model: "google/gemini-2.5-pro-exp-03-25:free",
      messages: [
        {
          role: "system",
          content:
            sysMsg +
            `\n\nRespond only with a valid JSON object like: {"confidenceThreshold": 0.8, "reason": "Explanation here"}. Do not include anything else.`,
        },
        {
          role: "user",
          content: llmQuery,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    });
  
    const message = llmResponse.choices[0].message.content;
  
    try {
      const jsonStart = message?.indexOf("{");
      const jsonEnd = message?.lastIndexOf("}") ?? -1;
  
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = message!.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
  
        if (
          typeof parsed.confidenceThreshold === "number" &&
          typeof parsed.reason === "string"
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse LLM response:", error);
    }
  
    return null;
  }
  
}
