"use client"

import useShakeDetector from "./hooks/useShakeDetector";

export default function Home() {
  const { isShaking } = useShakeDetector()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className={`w-96 h-96 ${isShaking ? "bg-red-400": "bg-black"} `}/>
    </main>
  );
}
