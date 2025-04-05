"use client";

import React, { useState, useEffect, Usable } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BaseQuestion {
  id: number;
  questionText: string;
}
interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}
interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  options: ["True", "False"];
  correctAnswer: boolean;
}
interface TextInputQuestion extends BaseQuestion {
  type: "text-input";
  correctAnswer: string | string[];
  placeholder?: string;
}
type Question = MultipleChoiceQuestion | TrueFalseQuestion | TextInputQuestion;
interface TestMaterial {
  title: string;
  questions: Question[];
}

const testContent: Record<string, TestMaterial> = {
  "test-5-check-your-knowledge": {
    title: "Test 1: Check Your Knowledge (Lessons 1-4)",
    questions: [
      {
        id: 1,
        type: "true-false",
        questionText: "You should always preview your edits before saving.",
        options: ["True", "False"],
        correctAnswer: true,
      },
      {
        id: 2,
        type: "multiple-choice",
        questionText:
          'Which syntax creates an internal link to an article named "Pikachu"?',
        options: ["[[Pikachu]]", "{{Pikachu}}", "[Pikachu]", "<<Pikachu>>"],
        correctAnswer: "[[Pikachu]]",
      },
      {
        id: 3,
        type: "multiple-choice",
        questionText:
          "What should you include when adding new information to an article?",
        options: [
          "Your personal opinion",
          "A citation to a verifiable source",
          "A link to a blog post",
          "No extra information needed",
        ],
        correctAnswer: "A citation to a verifiable source",
      },
      {
        id: 4,
        type: "true-false",
        questionText:
          "Creating a new page does not require adherence to notability guidelines.",
        options: ["True", "False"],
        correctAnswer: false,
      },
      {
        id: 5,
        type: "text-input",
        questionText: "What is the standard wiki markup to make text bold?",
        correctAnswer: "'''bold text'''",
        placeholder: "Enter wiki markup here",
      },
    ],
  },
};

export default function CarouselTestPage({
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
  const test = testContent[slug];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [results, setResults] = useState<Record<
    number,
    "correct" | "incorrect" | null
  > | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsTestFinished(false);
    setResults(null);
    setScore(0);
  }, [slug]);

  if (!test) {
    notFound();
  }

  const totalQuestions = test.questions.length;
  const currentQuestion =
    currentQuestionIndex < totalQuestions
      ? test.questions[currentQuestionIndex]
      : null;

  const handleChange = (questionId: number, value: string) => {
    if (!currentQuestion || questionId !== currentQuestion.id) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    if (isTestFinished) return;

    let correctCount = 0;
    const calculatedResults: Record<number, "correct" | "incorrect" | null> =
      {};

    test.questions.forEach((q) => {
      const userAnswer = userAnswers[q.id];
      let isCorrect = false;

      if (
        userAnswer !== undefined &&
        userAnswer !== null &&
        userAnswer.trim() !== ""
      ) {
        switch (q.type) {
          case "true-false":
            isCorrect = (userAnswer === "True") === q.correctAnswer;
            break;
          case "multiple-choice":
            isCorrect = userAnswer === q.correctAnswer;
            break;
          case "text-input":
            const expected = q.correctAnswer;
            if (typeof expected === "string")
              isCorrect =
                userAnswer.trim().toLowerCase() ===
                expected.trim().toLowerCase();
            else
              isCorrect = expected
                .map((e) => e.trim().toLowerCase())
                .includes(userAnswer.trim().toLowerCase());
            break;
        }
        calculatedResults[q.id] = isCorrect ? "correct" : "incorrect";
        if (isCorrect) correctCount++;
      } else {
        calculatedResults[q.id] = null; 
      }
    });

    setResults(calculatedResults);
    setScore(correctCount);
    setIsTestFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col p-4 md:p-8">
      
      <div className="w-full max-w-4xl mx-auto mb-6">
        <Link
          href="/"
          className="text-yellow-600 hover:text-yellow-800 mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        {/* Progress Bar */}
        {!isTestFinished && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-yellow-400 h-2.5 rounded-full transition-width duration-300 ease-out"
              style={{
                width:
                  totalQuestions > 0
                    ? `${(currentQuestionIndex / totalQuestions) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl p-6 md:p-8 shadow-md">
          {/* Final Results View */}
          {isTestFinished ? (
            // ... (Final results JSX remains the same) ...
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Test Complete!
              </h1>
              <p className="text-xl font-semibold mb-6">{test.title}</p>
              <p
                className={`text-3xl font-bold mb-8 ${
                  totalQuestions > 0 && score / totalQuestions >= 0.7
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Score: {score} / {totalQuestions}
              </p>
              <div className="text-left space-y-4 mb-8 -mt-5 max-h-60 overflow-y-auto p-3 border rounded bg-gray-50">
                {test.questions.map((q, index) => (
                  <div key={q.id} className="border-b pb-2">
                    <p className="text-sm font-medium text-gray-800">
                      Q{index + 1}. {q.questionText}
                    </p>
                    <p className="text-xs text-gray-600">
                      Your answer: {userAnswers[q.id] || "(Skipped)"}
                    </p>
                    {results && results[q.id] === "incorrect" && (
                      <p className="text-xs text-green-700">
                        Correct:
                        {q.type === "true-false"
                          ? q.correctAnswer
                            ? "True"
                            : "False"
                          : Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join(" or ")
                          : q.correctAnswer}
                      </p>
                    )}
                    <p
                      className={`text-xs font-semibold ${
                        results && results[q.id] === "correct"
                          ? "text-green-600"
                          : results && results[q.id] === "incorrect"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {results && results[q.id]
                        ? results[q.id] === "correct"
                          ? "✓ Correct"
                          : "✗ Incorrect"
                        : "(Skipped)"}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : /* Question View */
          currentQuestion ? (
            <div>
              <p className="font-semibold text-xl md:text-2xl mb-6 text-gray-800 text-center">
                ({currentQuestionIndex + 1}/{totalQuestions})
                {currentQuestion.questionText}
              </p>
              <div className="space-y-3 mb-8 min-h-[150px] text-black">
                {(currentQuestion.type === "multiple-choice" ||
                  currentQuestion.type === "true-false") &&
                  currentQuestion.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-3 p-3 rounded cursor-pointer border border-gray-200 hover:bg-yellow-50 has-[:checked]:bg-yellow-100 has-[:checked]:border-yellow-300 transition-colors duration-150"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={userAnswers[currentQuestion.id] === option}
                        onChange={(e) =>
                          handleChange(currentQuestion.id, e.target.value)
                        }
                        className="form-radio h-5 w-5 text-yellow-600 focus:ring-yellow-500 shrink-0"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                {currentQuestion.type === "text-input" && (
                  <input
                    type="text"
                    name={`question-${currentQuestion.id}`}
                    value={userAnswers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleChange(currentQuestion.id, e.target.value)
                    }
                    placeholder={
                      currentQuestion.placeholder || "Type your answer"
                    }
                    className="w-full p-3 border rounded-md focus:outline-none border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                )}
              </div>
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  
                  Previous
                </button>
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-8 rounded-lg transition duration-200 text-lg"
                  >
                    
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg transition duration-200 text-lg"
                  >
                    
                    Finish Test
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Loading test questions...</p>
          )}
        </div>
      </div>
    </div>
  );
}
