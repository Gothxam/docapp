"use client"

import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/8 border border-white/10 shadow-purple">
          <svg className="w-10 h-10 animate-spin text-amethyst" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Loading…</p>
        </div>
      </div>
    </div>
  );
}
