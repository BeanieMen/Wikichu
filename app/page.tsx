'use client'
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);

  return (
    <div>
      <nav className="w-full max-w-6xl bg-[#F6CF57] mt-5 py-3 rounded-4xl mx-auto flex justify-between items-center px-5">
        <div>
          <p
            className="text-3xl text-white"
            style={{ fontFamily: "Pokemon", fontSize: "2.5rem" }}
          >
            WikiChu
          </p>
        </div>
        <div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "3rem",
                  height: "3rem",
                },
              },
            }}
          />
        </div>
      </nav>
    </div>
  );
}
