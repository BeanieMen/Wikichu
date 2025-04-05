"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WikipediaEvent {
  year: number;
  text: string;
  pages?: Array<{
    title?: string;
    thumbnail?: { source?: string };
    [key: string]: any;
  }>;
}

interface LessonNode {
  id: number;
  label: string;
  subLabel: string;
  completed: boolean;
  type: "learn" | "test";
}

const formatNumber = (num: number): string => num.toString().padStart(2, "0");

const generateSlug = (lesson: LessonNode): string => {
  const sanitizedSubLabel = lesson.subLabel
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (lesson.type === "learn") {
    return `/learn/lesson-${lesson.id}-${sanitizedSubLabel}`;
  } else if (lesson.type === "test") {
    return `/test/test-${lesson.id}-${sanitizedSubLabel}`;
  }
  return "#";
};

export default function LoggedInDashboard() {
  const { user } = useUser();

  const [onThisDayData, setOnThisDayData] = useState<WikipediaEvent[] | null>(
    null
  );
  const [errorFact, setErrorFact] = useState<string | null>(null);
  const [isLoadingFact, setIsLoadingFact] = useState<boolean>(true);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [userCoins, setUserCoins] = useState<number | null>(null);
  const [isLoadingCoins, setIsLoadingCoins] = useState<boolean>(true);

  // Define the lesson structure (4 learn lessons + 1 test lesson)
  const lessons: LessonNode[] = [
    {
      id: 1,
      label: "Lesson 1",
      subLabel: "Greetings",
      completed: true,
      type: "learn",
    },
    {
      id: 2,
      label: "Lesson 2",
      subLabel: "Basic Edits",
      completed: true,
      type: "learn",
    },
    {
      id: 3,
      label: "Lesson 3",
      subLabel: "Intermediate Edits",
      completed: false,
      type: "learn",
    },
    {
      id: 4,
      label: "Lesson 4",
      subLabel: "Advanced Edits",
      completed: false,
      type: "learn",
    },
    {
      id: 5,
      label: "Test 1",
      subLabel: "Check Your Knowledge",
      completed: false,
      type: "test",
    },
  ];

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const totalLessons = lessons.length;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);

  // Fetch user coins from the API
  useEffect(() => {
    const fetchUserCoins = async () => {
      setIsLoadingCoins(true);
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const coinsData = await response.json();
        setUserCoins(coinsData);
      } catch (error) {
        console.error("Failed to fetch user coins:", error);
        setUserCoins(null);
      } finally {
        setIsLoadingCoins(false);
      }
    };

    if (user) {
      fetchUserCoins();
    }
  }, [user]);

  useEffect(() => {
    const fetchOnThisDay = async () => {
      setIsLoadingFact(true);
      setErrorFact(null);

      const today = new Date();
      const month = formatNumber(today.getMonth() + 1);
      const day = formatNumber(today.getDate());
      const dateDisplay = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      setCurrentDateStr(dateDisplay);

      try {
        const response = await fetch(
          `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { events?: WikipediaEvent[] } = await response.json();

        if (data.events && data.events.length > 0) {
          setOnThisDayData(data.events.slice(0, 4));
        } else {
          setOnThisDayData([]);
        }
      } catch (error) {
        console.error("Failed to fetch Wikipedia 'On this day' data:", error);
        setErrorFact("Could not load historical events for today.");
        setOnThisDayData(null);
      } finally {
        setIsLoadingFact(false);
      }
    };

    fetchOnThisDay();
  }, []);

  if (!user) {
    return <div>Loading user data...</div>; // Or a better loading component
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex flex-col md:flex-row">
      {/* Sidebar with Info & Guidelines (Left) */}
      <div className="w-full md:w-1/4 bg-white rounded-xl p-4 md:p-6 shadow-md mb-6 md:mb-0 md:mr-8 flex-shrink-0">
        {/* Added flex-shrink-0 */}
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
          What is Wikipedia?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Wikipedia is a free, multilingual online encyclopedia written and
          maintained by a community of volunteers through open collaboration and
          a wiki-based editing system. It strives for neutrality and requires
          verifiable sources for its content.
        </p>
        {/* What is a Wikipedia Editor? */}
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
          Who are Wikipedia Editors?
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Wikipedia editors, also known as "Wikipedians," are volunteers from
          all over the world who create and improve articles. They are the
          individuals who:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
          <li>Write new articles and add information to existing ones.</li>
          <li>Correct errors, fix typos, and improve clarity.</li>
          <li>Add citations from reliable sources to verify facts.</li>
          <li>Format pages, translate articles, and combat vandalism.</li>
          <li>Discuss changes and build consensus on article talk pages.</li>
        </ul>
        <p className="text-sm text-gray-600 mb-4">
          Anyone can become an editor, contributing their knowledge while
          adhering to Wikipedia's core principles and guidelines.
        </p>
        {/* Existing WikiChu Guidelines */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 border-t pt-4 mt-4">
          {/* Added top border/padding */}
          WikiChu Guidelines
        </h2>
        <p className="text-sm text-gray-600">
          Welcome to WikiChu! Here are a few guidelines for editing here:
        </p>
        <ul className="list-disc pl-5 mt-3 md:mt-4 text-sm md:text-base text-gray-600 space-y-1">
          <li>Make sure your edits are accurate and well-researched.</li>
          <li>Follow community guidelines and respect other users.</li>
          <li>Use clear and concise language in your articles.</li>
          <li>Always cite your sources to ensure content credibility.</li>
        </ul>
        {/* Existing Getting Help Section */}
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 md:mt-6">
          Getting Help
        </h3>
        <p className="text-sm text-gray-600 mt-1 md:mt-2">
          If you're unsure about any edits or need help, feel free to reach out
          to the community or visit our help center.
        </p>
      </div>
      {/* Main Content (Center) */}
      <div className="w-full md:w-3/4 bg-yellow-50 flex flex-col items-center flex-grow">
        {/* Added flex-grow */}
        <nav className="w-full bg-[#F6CF57] p-3 md:p-4 rounded-xl flex justify-between max-w-6xl items-center mb-6 md:mb-8 shadow-md">
          <h1
            className="text-2xl md:text-4xl font-bold text-black"
            style={{ fontFamily: "Pokemon, sans-serif" }}
          >
            WikiChu
          </h1>
          <div className="flex items-center space-x-3 md:space-x-6 text-gray-600">
            <Link href={"/wikidex"} className="text-gray-700">
              WikiDex
            </Link>
            <Link href={"/marketplace"} className="text-gray-700">
              Marketplace
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 md:w-14 md:h-14", // Simplified Tailwind usage
                },
              }}
            />
          </div>
        </nav>
        <div className="w-full bg-white rounded-xl max-w-6xl p-4 md:p-6 shadow-md mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Welcome back, {user.fullName || user.firstName || "Editor"}!
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Continue your editing journey with WikiChu!
              </p>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-6xl gap-4 mb-6 md:mb-8 text-black">
          <div className="bg-yellow-100 p-4 rounded-xl text-center shadow">
            <div className="text-base md:text-lg font-bold text-gray-700">
              {isLoadingCoins ? (
                "Loading..."
              ) : userCoins !== null ? (
                `${userCoins} Coins`
              ) : (
                "0 Coins"
              )}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Earned</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl text-center shadow">
            <div className="text-base md:text-lg font-bold text-gray-700">
              7 Days {/* Replace with dynamic data if available */}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Streak</div>
          </div>
        </div>
        {/* Learning Path Section - UPDATED */}
        <div className="w-full bg-yellow-100 rounded-xl max-w-6xl p-4 md:p-6 mb-6 md:mb-8 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Your Learning Path
            </h2>
            <div className="text-xs md:text-sm text-gray-600">
              {completionPercentage}% Complete
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-6">
            <div
              className="bg-yellow-400 h-3 md:h-4 rounded-full"
              style={{ width: `${completionPercentage}%` }} // Dynamic width
            />
          </div>
          {/* Lesson Nodes */}
          <div className="flex flex-wrap justify-around items-start gap-y-6 md:gap-x-4">
            {lessons.map((node) => (
              <Link
                href={generateSlug(node)} // Use generated slug for navigation
                key={node.id}
                className="flex flex-col items-center w-1/3 md:w-auto group cursor-pointer" // Added group and cursor-pointer
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 ${
                    node.completed
                      ? "bg-yellow-300 border-yellow-400"
                      : "bg-gray-200 border-gray-300"
                  } shadow-md mb-2 md:mb-4 transition-transform duration-200 ease-in-out group-hover:scale-110`} // Added hover effect
                >
                  {/* Optional: Visual indicator for test lessons */}
                  {node.type === "test" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm md:text-base text-gray-700">
                    {node.label}
                  </div>
                  <div className="text-xs text-gray-500">{node.subLabel}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* End Main Content */}
      {/* "On This Day" Section (Right) */}
      <div className="w-full md:w-1/4 bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 md:mt-0 md:ml-8 flex-shrink-0">
        {/* Added flex-shrink-0 */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
          On This Day ({currentDateStr || "Today"})
        </h2>
        {isLoadingFact && (
          <p className="text-sm text-gray-500">Loading events...</p>
        )}
        {errorFact && <p className="text-sm text-red-600">{errorFact}</p>}
        {!isLoadingFact && !errorFact && onThisDayData && (
          <>
            {onThisDayData.length === 0 ? (
              <p className="text-sm text-gray-600">
                No major events listed for today.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-gray-700">
                {onThisDayData.map((event, index) => (
                  <li key={index}>
                    <span className="font-semibold">{event.year}:</span>
                    {event.text}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500 mt-4">Source: Wikipedia</p>
          </>
        )}
        {!isLoadingFact && !errorFact && !onThisDayData && (
          <p className="text-sm text-gray-600">Could not retrieve events.</p>
        )}
      </div>
    </div>
  );
}