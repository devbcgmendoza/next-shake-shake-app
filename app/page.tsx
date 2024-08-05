"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useShakeDetector from "./hooks/useShakeDetector";

export default function Home() {
  const { isShaking, shakeIntensity } = useShakeDetector();
  const [showCombo, setShowCombo] = useState(false)
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10); // Start at 10 seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize createCoin to prevent unnecessary re-renders
  const createCoin = useCallback(() => {
    const coin = document.createElement("div");
    const container = document.getElementById("container");
    if (!container) return;
    coin.className = "coin";
    coin.style.left = Math.random() * 100 + "vw";
    container.appendChild(coin);

    setTimeout(() => {
      if (container.contains(coin)) {
        container.removeChild(coin);
      }
    }, 2000);
  }, []); // Dependencies array empty means this function doesn’t depend on any props or state

  // Memoize createCoins to prevent unnecessary re-renders
  const createCoins = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(createCoin, i * 100);
    }
  }, [createCoin]); // Dependency on createCoin to ensure createCoins has the correct version of createCoin

  useEffect(() => {
    if (isShaking && shakeIntensity >= 15) {
      setShowCombo(true);
      createCoins();

      // Clear the previous timeout if there is one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to increment the score after 1000ms
      timeoutRef.current = setTimeout(() => {
        setScore((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear the timeout if the shake stops
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isShaking, shakeIntensity, createCoins]); // Include createCoins as dependency

  useEffect(() => {
    if (timer <= 0) return; // Stop timer when it reaches 0

    const timerId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on unmount
  }, [timer]); // Timer should only start and stop based on its own value

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96 h-96 z-10 text-center" id="container">
        <p>score: {score}</p>
        <p>timer: {timer}</p>
        <p>Show combo: {showCombo ? "true" : "false"}</p>
      </div>
    </main>
  );
}
