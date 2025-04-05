"use client";
import { UserButton, useUser } from "@clerk/nextjs";
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

const formatNumber = (num: number): string => num.toString().padStart(2, "0");

export default function LoggedInDashboard() {
  const { user } = useUser();

  const [onThisDayData, setOnThisDayData] = useState<WikipediaEvent[] | null>(
    null
  );
  const [errorFact, setErrorFact] = useState<string | null>(null);
  const [isLoadingFact, setIsLoadingFact] = useState<boolean>(true);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.id);
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
    // Added type safety to JSX, no functional changes needed here unless Clerk types change
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex flex-col md:flex-row">
      {/* Sidebar with Info & Guidelines (Left) */}
      <div className="w-full md:w-1/4 bg-white rounded-xl p-4 md:p-6 shadow-md mb-6 md:mb-0 md:mr-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
          WikiChu Guidelines
        </h2>
        <p className="text-sm text-gray-600">
          Welcome to WikiChu! Here are a few guidelines to help you get started:
        </p>
        <ul className="list-disc pl-5 mt-3 md:mt-4 text-sm md:text-base text-gray-600 space-y-1">
          <li>Make sure your edits are accurate and well-researched.</li>
          <li>Follow community guidelines and respect other users.</li>
          <li>Use clear and concise language in your articles.</li>
          <li>Always cite your sources to ensure content credibility.</li>
        </ul>
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 md:mt-6">
          Getting Help
        </h3>
        <p className="text-sm text-gray-600 mt-1 md:mt-2">
          If you're unsure about any edits or need help, feel free to reach out
          to the community or visit our help center.
        </p>
      </div>
      {/* Main Content (Center) */}
      <div className="w-full md:w-3/4 bg-yellow-50 flex flex-col items-center">
        <nav className="w-full bg-[#F6CF57] p-3 md:p-4 rounded-xl flex justify-between max-w-6xl items-center mb-6 md:mb-8 shadow-md">
          <h1
            className="text-2xl md:text-4xl font-bold text-black"
            style={{ fontFamily: "Pokemon, sans-serif" }}
          >
            WikiChu
          </h1>
          <div className="flex items-center space-x-3 md:space-x-6">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                    md: { width: "3.5rem", height: "3.5rem" },
                  },
                },
              }}
            />
          </div>
        </nav>

        <div className="w-full bg-white rounded-xl max-w-6xl p-4 md:p-6 shadow-md mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {/* user object from Clerk usually has typed properties */}
                Welcome back, {user.fullName || user.firstName || "Editor"}!
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Continue your editing journey with WikiChu!
              </p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-6xl gap-4 mb-6 md:mb-8 text-black">
          <div className="bg-yellow-100 p-4 rounded-xl text-center">
            <div className="text-base md:text-lg font-bold text-gray-700">
              511 Coins
            </div>
            <div className="text-xs md:text-sm text-gray-500">Earned</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl text-center">
            <div className="text-base md:text-lg font-bold text-gray-700">
              7 Days
            </div>
            <div className="text-xs md:text-sm text-gray-500">Streak</div>
          </div>
        </div>

        <div className="w-full bg-yellow-100 rounded-xl max-w-6xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Your Learning Path
            </h2>
            <div className="text-xs md:text-sm text-gray-600">35% Complete</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-6">
            <div className="bg-yellow-400 h-3 md:h-4 rounded-full w-[35%]" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start space-y-6 md:space-y-0">
            {[
              {
                id: 1,
                label: "Lesson 1",
                subLabel: "Greetings",
                completed: true,
              },
              {
                id: 2,
                label: "Lesson 2",
                subLabel: "Basic Edits",
                completed: true,
              },
              {
                id: 3,
                label: "Lesson 3",
                subLabel: "Intermediate Edits",
                completed: false,
              },
              {
                id: 4,
                label: "Lesson 4",
                subLabel: "Advanced Edits",
                completed: false,
              },
              {
                id: 5,
                label: "Bonus Content",
                subLabel: "Extra Resources",
                completed: false,
              },
              {
                id: 6,
                label: "Final Test",
                subLabel: "Apply Your Skills",
                completed: false,
              },
            ].map(
              (
                node // Type for 'node' is inferred from the array literal
              ) => (
                <div
                  key={node.id}
                  className="flex flex-col items-center w-full md:w-auto"
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 ${
                      node.completed
                        ? "bg-yellow-300 border-yellow-400"
                        : "bg-gray-200 border-gray-300"
                    } shadow-md mb-2 md:mb-4`}
                  ></div>
                  <div className="text-center">
                    <div className="font-bold text-sm md:text-base text-gray-700">
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-500">{node.subLabel}</div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>{" "}
      {/* End Main Content */}
      {/* "On This Day" Section (Right) */}
      <div className="w-full md:w-1/4 bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 md:mt-0 md:ml-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
          On This Day ({currentDateStr || "Today"})
        </h2>

        {isLoadingFact && (
          <p className="text-sm text-gray-500">Loading events...</p>
        )}

        {errorFact && <p className="text-sm text-red-600">{errorFact}</p>}

        {/* Type guard: Check if onThisDayData is not null before accessing properties */}
        {!isLoadingFact && !errorFact && onThisDayData && (
          <>
            {/* FIX 4 Correction: .length is now accessible because onThisDayData is known to be an array here */}
            {onThisDayData.length === 0 ? (
              <p className="text-sm text-gray-600">
                No major events listed for today.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-gray-700">
                {/* FIX 5 Correction: .map is now accessible because onThisDayData is known to be an array */}
                {/* FIX 6 & 7: Types for 'event' and 'index' are inferred correctly from 'onThisDayData' which is WikipediaEvent[] */}
                {onThisDayData.map((event, index) => (
                  <li key={index}>
                    <span className="font-semibold">{event.year}:</span>{" "}
                    {event.text}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500 mt-4">Source: Wikipedia</p>
          </>
        )}
        {/* Fallback if data is null/undefined after loading and without specific error */}
        {!isLoadingFact && !errorFact && !onThisDayData && (
          <p className="text-sm text-gray-600">Could not retrieve events.</p>
        )}
      </div>
    </div>
  );
}
