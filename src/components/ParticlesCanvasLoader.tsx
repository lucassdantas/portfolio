"use client";

import dynamic from "next/dynamic";

// `ssr: false` só é permitido em client components — este wrapper existe
// só para isolar isso do page.tsx (server component).
const ParticlesCanvas = dynamic(
  () => import("./ParticlesCanvas").then((m) => m.ParticlesCanvas),
  { ssr: false }
);

export { ParticlesCanvas as ParticlesCanvasLoader };
