// app/learn/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown"; // Import the Markdown renderer
import remarkGfm from "remark-gfm"; // Import GFM plugin
import NextLessonButton from "@/app/components/NextLessonButton"; // Import the client component
import React, { Usable } from "react";

// Define the structure for learning content
interface LearnMaterial {
  title: string;
  content: string; // Markdown content
}

// Define the learning materials mapped by slug
// Content generated from Wikimedia Policies.txt (from previous step)
const learnContent: Record<string, LearnMaterial> = {
  "lesson-1-greetings": {
    title: "Lesson 1: Welcome & Core Principles",
    content: `
# Welcome to WikiChu Editing!

This first lesson introduces you to the community and some fundamental principles.

## Community Interaction
* **Civility:** Always be polite and respectful when interacting with other editors, even if you disagree. Avoid hostile or rude language. Instead of saying "Your changes are stupid", try "I disagree with some of your changes. Can we discuss how we might improve this section together?".

## Core Content Principles (Introduction)
These guide how articles should be written:
* **Neutral Point of View (NPOV):** Write articles without bias. Present all significant viewpoints fairly. Avoid favoring one perspective. For example, instead of "The policy is a disaster", write "The policy has mixed reviews; some find it helpful, others see problems".
* **Verifiability:** Information must be checkable through reliable, published sources. Readers need to be able to verify the facts.

We'll explore these principles more in later lessons!
    `,
  },
  "lesson-2-basic-edits": {
    title: "Lesson 2: Basic Edits & Foundational Policies",
    content: `
# Making Basic Edits

Simple edits like fixing typos or grammar help improve WikiChu. When making edits, keep these policies in mind:

## Verifiability
* All information you add or correct must be verifiable through reliable, published sources.
* Avoid vague statements like "The city is very dangerous". Instead, use specific, sourced information: "According to the 2022 police report, the city’s crime rate increased by 10%".

## Neutral Point of View (NPOV)
* Ensure your edits maintain a neutral tone and don't introduce bias. Present different viewpoints fairly.

## Edit Summaries & Preview
* **Edit Summary:** (While not explicitly in the document, this is standard wiki practice) Always explain *what* you changed and *why* in the edit summary box. This helps others understand your edits and relates to collaborative principles like Civility.
* **Preview:** (Standard practice) Use the 'Show preview' button before publishing to catch mistakes.

## No Original Research (Briefly)
* Don't add your own ideas or analyses. Stick to what reliable sources say. We'll cover this more next lesson.
    `,
  },
  "lesson-3-intermediate-edits": {
    title: "Lesson 3: Adding Content & Key Content Policies",
    content: `
# Adding Content Responsibly

Adding information requires careful attention to several key content policies:

## Verifiability (Again!)
* This is essential when adding content. All information *must* be attributable to a reliable, published source. Readers must be able to check your facts.

## No Original Research (NOR)
* You cannot add your own unpublished ideas, opinions, theories, or analyses to articles. Wikipedia reports on what reliable sources have already published, it's not a place for original thought.
* **Bad:** "I believe that the book proves the war was a mistake". This is a personal opinion.
* **Good:** "Historian Jane Doe argues in her book that the war was a mistake". This reports what a published source says.

## Neutral Point of View (NPOV)
* When adding content, especially on topics with differing views, present all significant viewpoints fairly and proportionately. Don't give undue weight to minority opinions or favor one side.

## Copyrights
* Respect copyright laws. Do not copy large amounts of text directly from copyrighted sources.
* Use short excerpts only where necessary and allowed (e.g., public domain, fair use), and always attribute properly.

## Biographies of Living Persons (BLP)
* Be extremely careful when writing about living people.
* Content must be neutral, verifiable, and respectful of privacy.
* Remove any controversial claims that are unsourced or poorly sourced immediately. Avoid harmful language. Use reliable sources for claims, e.g., "According to a report from a reputable news source, Mary has faced criticism...".
    `,
  },
  "lesson-4-advanced-edits": {
    title: "Lesson 4: Collaboration, Disputes & Advanced Policies",
    content: `
# Advanced Topics and Community Interaction

Beyond basic editing, understanding collaboration, dispute resolution, and other policies is key.

## Collaboration & Consensus
* **Consensus:** Decisions on WikiChu are made through discussion and agreement, not just voting. Seek compromise. Don't just impose your preferred version; discuss changes on talk pages to reach agreement.
* **Ownership:** No one "owns" an article. Be open to others editing your work. Avoid saying "Don't change anything I wrote".

## Handling Disagreements
* **Civility & No Personal Attacks:** Even in disputes, remain polite and focus criticism on content, not editors. Avoid insults like "You are an idiot"; instead, say "I think the edits might not align with guidelines. Could we review them?".
* **Edit Warring:** Do **not** repeatedly undo another editor's changes. This is disruptive. If you disagree, discuss the issue on the article's talk page to reach consensus.

## Disruptive Editing
* **Vandalism:** Do not deliberately damage Wikipedia by adding false info, deleting content, or defacing pages. This is strictly prohibited.
* **Sock Puppetry:** Do not use multiple accounts to deceive others, manipulate discussions, or create a false sense of support. Use only one account for your edits.

## Creating New Articles
* **Notability Guideline:** Topics for new articles must have significant coverage in reliable, independent sources. A local cafe blogged about by friends isn't usually notable, but an international festival covered by major news outlets likely is. Articles lacking notability may be deleted.

## Other Important Policies
* **Harassment:** Do not harass, threaten, or intimidate others.
* **Paid Editing:** If you are paid to edit, you must disclose this.
    `,
  },
};

// Define the order of the learning lessons
const lessonOrder: string[] = [
  "lesson-1-greetings",
  "lesson-2-basic-edits",
  "lesson-3-intermediate-edits",
  "lesson-4-advanced-edits",
];

// Define the path to the test module that follows the last lesson
// (Assuming the test slug from earlier examples)
const testPath: string = "/test/test-5-check-your-knowledge";

// The Page component
export default function LearnLessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = React.use<{
    slug: string;
  }>(
    params as unknown as Usable<{
      slug: string;
    }>
  );
  const lesson = learnContent[slug]; // Look up the content using the slug

  // If the slug doesn't match any defined content, show a 404 page
  if (!lesson) {
    notFound();
  }

  // Determine the link for the "Next" button
  let nextLink: string | null = null;
  const currentIndex = lessonOrder.indexOf(slug);

  if (currentIndex !== -1) {
    // Check if the current slug is in our defined order
    if (currentIndex < lessonOrder.length - 1) {
      // Not the last lesson, link to the next lesson in the order
      nextLink = `/learn/${lessonOrder[currentIndex + 1]}`;
    } else {
      // This is the last lesson, link to the test module
      nextLink = testPath;
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 md:p-8 shadow-md">
        {/* Back Link */}
        <Link
          href="/"
          className="text-yellow-600 hover:text-yellow-800 mb-6 inline-block text-sm"
        >
          &larr; Back to Dashboard
        </Link>

        {/* Lesson Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
          {lesson.title}
        </h1>

        {/* Lesson Content - Rendered using ReactMarkdown with increased spacing */}
        {/* Added prose-p:mb-5, prose-ul:mb-5, prose-ol:mb-5, prose-headings:mb-4 */}
        <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-800 prose-headings:mb-4 prose-a:text-yellow-600 hover:prose-a:text-yellow-800 prose-strong:text-gray-700 prose-p:mb-5 prose-ul:mb-5 prose-ol:mb-5 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Navigation Button */}
        {nextLink && (
          <div className="mt-8 flex items-center justify-between">
            <span className="text-green-600 font-semibold">
              🎉 You earned 50 coins!
            </span>
            <NextLessonButton
              nextLink={nextLink}
              isLastLesson={currentIndex === lessonOrder.length - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
