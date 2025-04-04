import { NextRequest } from "next/server";
import { config } from "dotenv";
import { OpenRouterCompletion } from "@/lib/open-router";

config();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question, answer } = body;

  if (!question || !answer) {
    return new Response(JSON.stringify({ error: "Missing question or answer" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const systemPrompt = `
You are an AI designed to evaluate answers to Wikipedia-specific questions based on four key criteria:

1. **Accuracy** – Does the answer correctly reflect Wikipedia’s content and guidelines?
2. **Neutrality** – Is the answer unbiased, fact-based, and aligned with Wikipedia's standards?
3. **Completeness** – Does the answer fully address all aspects of the question?
4. **Conciseness** – Is the answer clear and to the point without unnecessary details?

Your evaluation must include:
- **confidenceThreshold (0 to 1)**:
  - **1.0** – Fully correct and complete.
  - **0.5** – Partially correct but missing key details.
  - **0.0** – Incorrect or misleading.
- **reason**: A clear explanation of the rating, highlighting missing or incorrect elements.

Strictly follow Wikipedia’s Five Pillars and its principles of accuracy, neutrality, and reliability.
`;

  const llm = await new OpenRouterCompletion().createCompletion(
    systemPrompt,
    `The question is:\n${question}\n\nThe answer is:\n${answer}`
  );

  return new Response(JSON.stringify(llm), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
