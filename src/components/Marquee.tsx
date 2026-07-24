"use client";

import { marquee } from "@/data";

function MarqueeSet() {
  return (
    <div className="flex shrink-0 gap-12 whitespace-nowrap pr-12 font-mono text-[15px] text-muted">
      {marquee.map((mi, i) => (
        <span key={i}>
          {mi} <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-bord bg-bg2 py-4">
      <div className="flex w-max animate-[marquee_36s_linear_infinite]">
        <MarqueeSet />
        <MarqueeSet />
      </div>
    </div>
  );
}
