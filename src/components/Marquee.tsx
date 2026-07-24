"use client";

import { marquee } from "@/data";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="overflow-hidden border-y border-bord bg-bg2 py-4">
      <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-12 whitespace-nowrap font-mono text-[15px] text-muted">
        {items.map((mi, i) => (
          <span key={i}>
            {mi} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
