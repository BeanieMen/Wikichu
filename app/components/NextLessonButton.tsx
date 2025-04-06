// app/components/NextLessonButton.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

interface NextLessonButtonProps {
  nextLink: string;
  isLastLesson: boolean;
}

export default function NextLessonButton({
  nextLink,
  isLastLesson,
}: NextLessonButtonProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleClick = async () => {
    // Add money for the current user
    if (user) {
      await fetch("/api/add-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50, userId: user.id }),
      });
    }
    // Navigate to the next lesson (or test)
    router.push(nextLink);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <button
        onClick={handleClick}
        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg shadow"
      >
        {isLastLesson ? "Go to Test" : "Next Lesson"} &rarr;
      </button>
    </div>
  );
}
