"use client"

import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after showing the animation for a while
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500); // 1.5 seconds to enjoy the animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Clock Icon */}
        <div className="relative">
          {/* Subtle glow ring */}
          <div className="absolute inset-0 rounded-full bg-foreground/10 blur-xl opacity-50 animate-pulse"></div>
          
          {/* Clock container */}
          <div className="relative bg-foreground/5 backdrop-blur-sm rounded-full p-8 border border-foreground/10 shadow-lg animate-bounce">
            {/* Clock face */}
            <div className="w-20 h-20 rounded-full border-2 border-foreground/30 relative flex items-center justify-center">
              {/* Clock center dot */}
              <div className="absolute w-2 h-2 bg-foreground/60 rounded-full z-10"></div>
              
              {/* Hour hand */}
              <div 
                className="absolute w-1 h-6 bg-foreground/60 rounded-full origin-bottom"
                style={{
                  transform: "translateY(-50%) rotate(45deg)",
                  animation: "spin 4s linear infinite"
                }}
              ></div>
              
              {/* Minute hand */}
              <div 
                className="absolute w-0.5 h-8 bg-foreground/50 rounded-full origin-bottom"
                style={{
                  transform: "translateY(-50%) rotate(90deg)",
                  animation: "spin 2s linear infinite"
                }}
              ></div>
              
              {/* Clock marks */}
              <div className="absolute top-0.5 left-1/2 w-0.5 h-1.5 bg-foreground/40 -translate-x-1/2"></div>
              <div className="absolute bottom-0.5 left-1/2 w-0.5 h-1.5 bg-foreground/40 -translate-x-1/2"></div>
              <div className="absolute left-0.5 top-1/2 w-1.5 h-0.5 bg-foreground/40 -translate-y-1/2"></div>
              <div className="absolute right-0.5 top-1/2 w-1.5 h-0.5 bg-foreground/40 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-medium text-foreground/80 animate-pulse">
            جاري التحميل...
          </h2>
          
          {/* Loading dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: translateY(-50%) rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
