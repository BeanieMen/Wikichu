"use client";
import { SignInButton } from "@clerk/nextjs";

export default function HeroLanding() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-green-300 overflow-hidden">
      <nav className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl bg-[#F6CF57] p-4 -px-5 rounded-xl shadow-md">
        <div className="flex justify-center">
          <p
            className="text-4xl font-bold text-gray-600"
            style={{ fontFamily: "Pokemon", fontWeight: 600 }}
          >
            WikiChu
          </p>
        </div>
      </nav>

      <main className="flex items-center justify-center text-center px-5 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6">
            Enhance Your Editing
            <br />
            <span className="text-yellow-300">Master Wikipedia Skills</span>
          </h1>
          <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
            Transform your experience as a Wikipedia editor. Complete exciting
            challenges and master the art of editing in a fun, interactive way.
            Track your progress and become a skilled Wikipedia editor!
          </p>
          <div className="flex space-x-4 justify-center">
            <SignInButton>
              <button className="bg-white text-blue-500 px-8 py-4 rounded-full font-bold shadow-lg p hover:bg-gray-100 transition">
                Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </main>
    </div>
  );
}
