import { ImageResponse } from "next/og";
import { site } from "@/data";

export const alt = "Lucas Dantas — Desenvolvedor Full Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/.exec(css);
  if (match) {
    const res = await fetch(match[1]);
    if (res.ok) return res.arrayBuffer();
  }
  throw new Error(`falha ao carregar fonte ${family}`);
}

export default async function Image() {
  const title = "Lucas Dantas";
  const subtitle = "// desenvolvedor full stack";
  const tagline = "Aplicações web, APIs, automações e sistemas críticos.";
  const prompt = "lucas@dantas:~$ whoami";
  const badge = "disponível para novos desafios";
  const handle = site.url.replace(/^https?:\/\//, "");
  const cta = "Ver portfólio →";

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] = [];
  try {
    const [grotesk, groteskBold, mono] = await Promise.all([
      loadGoogleFont("Space+Grotesk", 400, subtitle + tagline),
      loadGoogleFont("Space+Grotesk", 700, title),
      loadGoogleFont("JetBrains+Mono", 400, prompt + badge + handle + cta),
    ]);
    fonts.push(
      { name: "Space Grotesk", data: grotesk, weight: 400, style: "normal" },
      { name: "Space Grotesk", data: groteskBold, weight: 700, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" }
    );
  } catch {
    // sem internet no build: cai para a fonte padrão do satori
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #04080f 0%, #081120 55%, #0b1524 100%)",
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(29,148,227,0.35) 0%, rgba(29,148,227,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f56", display: "flex" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffbd2e", display: "flex" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#27c93f", display: "flex" }} />
          <div
            style={{
              marginLeft: 16,
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              color: "#8c98ab",
              display: "flex",
            }}
          >
            {prompt}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 700, color: "#e2e8f0", display: "flex" }}>{title}</div>
          <div style={{ fontSize: 34, color: "#1d94e3", display: "flex" }}>{subtitle}</div>
          <div style={{ fontSize: 26, color: "#8c98ab", maxWidth: 820, display: "flex" }}>{tagline}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #16233a",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, color: "#8c98ab", display: "flex" }}>
                {badge}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "#4e5d74", display: "flex" }}>
              {handle}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              fontWeight: 700,
              color: "#e2e8f0",
              background: "rgba(29,148,227,0.16)",
              border: "1px solid #1d94e3",
              borderRadius: 8,
              padding: "12px 22px",
            }}
          >
            {cta}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
