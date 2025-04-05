"use client";
import { useUser } from "@clerk/nextjs";
import LoggedInDashboard from "./components/LoggedInDashboard";
import HeroLanding from "./components/HeroLanding";
export default function HomePage() {
  const { user } = useUser();

  return user ? <LoggedInDashboard /> : <HeroLanding />;
}
