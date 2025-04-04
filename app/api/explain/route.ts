import { NextRequest } from "next/server";
import { config } from "dotenv";
import { OpenRouterCompletion } from "@/lib/open-router";

config();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question, answer } = body;

  if (!question || !answer) {
    return new Response(
      JSON.stringify({ error: "Missing question or answer" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const systemPrompt = `
You are an AI assistant that explains why a given answer is correct for a specific Wikipedia-style question.

Your explanation must:
- Clearly connect the answer to the question.
- Reference relevant factual or logical reasoning.
- Reflect Wikipedia's standards of accuracy, neutrality, and reliability.
- Avoid repeating the answer itself without elaboration.

Do not speculate or make assumptions beyond what's asked. Stay concise and informative.
`;

  const llm = await new OpenRouterCompletion().createCompletion(
    systemPrompt,
    `The question is:\n${question}\n\nThe answer is:\n${answer}\n\nExplain why this answer is correct.`
  );

  return new Response(JSON.stringify(llm), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
