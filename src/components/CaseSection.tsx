"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";
import { Reveal } from "./Reveal";

function FlowNode({
  children,
  tone,
  badge,
}: {
  children: React.ReactNode;
  tone: "bad" | "good" | "token" | "token1";
  badge?: string;
}) {
  const toneClass = {
    bad: "text-dim border-dashed",
    good: "text-txt",
    token: "text-muted",
    token1: "text-txt border-accent",
  }[tone];
  const badgeClass = tone === "token1" ? "text-accent" : "text-err";
  return (
    <div
      className={`flex items-center justify-between gap-3 border border-bord bg-bg px-[13px] py-[11px] font-mono text-[11.5px] tracking-[.04em] ${toneClass}`}
    >
      <span>{children}</span>
      {badge && (
        <span className={`text-[9.5px] tracking-[.16em] uppercase ${badgeClass}`}>{badge}</span>
      )}
    </div>
  );
}

function FlowEdge({ on }: { on?: boolean }) {
  return (
    <div
      className={`ml-3.5 h-4 w-px ${on ? "bg-gradient-to-b from-accent to-accent/25" : "bg-bord"}`}
    />
  );
}

export function CaseSection() {
  const { t } = useLanguage();

  return (
    <section id="case" data-stg="2.6" className="border-t border-bord px-5 py-[clamp(70px,14vh,170px)] sm:px-8">
      <p className="m-0 mb-[clamp(24px,4vh,48px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        04 — {t.featured}
      </p>

      <div className="mb-[clamp(40px,7vh,90px)] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-end gap-[clamp(24px,4vw,72px)]">
        <div>
          <Reveal>
            <h2 className="m-0 mb-4.5 max-w-[20ch] text-[clamp(32px,5.4vw,82px)] leading-[.98] font-bold tracking-[-.04em]">
              {t.caseTitle.replace(/\.$/, "")}
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <p className="m-0 font-mono text-[11.5px] tracking-[.16em] text-muted uppercase">
            CMEXX · Rio de Janeiro · {t.caseKind}
          </p>
        </div>
        <p className="m-0 max-w-[52ch] text-[clamp(14px,1.25vw,17px)] leading-[1.62] text-muted [text-wrap:pretty]">
          {t.featDesc}
        </p>
      </div>

      <div className="mb-[clamp(46px,8vh,96px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-bord bg-bord">
        <Reveal className="h-full">
          <div className="h-full bg-bg2 p-[clamp(24px,3vw,42px)]">
            <p className="m-0 mb-3.5 font-mono text-[10.5px] tracking-[.2em] text-muted uppercase">
              {t.caseBefore}
            </p>
            <div className="flex flex-col">
              <FlowNode tone="bad">{t.caseNodeInput}</FlowNode>
              <FlowEdge />
              <FlowNode tone="bad">{t.caseNodeN8n}</FlowNode>
              <FlowEdge />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <FlowNode tone="token" badge={t.caseToken}>
                    {t.caseNodeModel}
                  </FlowNode>
                  <FlowEdge />
                </div>
              ))}
              <FlowNode tone="bad">{t.caseOut1}</FlowNode>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120} className="h-full">
          <div className="h-full bg-bg2 p-[clamp(24px,3vw,42px)]">
            <p className="m-0 mb-3.5 font-mono text-[10.5px] tracking-[.2em] text-accent uppercase">
              {t.caseAfter}
            </p>
            <div className="flex flex-col">
              <FlowNode tone="good">{t.caseNodeInput}</FlowNode>
              <FlowEdge on />
              <FlowNode tone="good">{t.caseNodeIntent}</FlowNode>
              <FlowEdge on />
              <FlowNode tone="good">{t.caseNodeAuth}</FlowNode>
              <FlowEdge on />
              <FlowNode tone="good">{t.caseNodeMcp}</FlowNode>
              <FlowEdge on />
              <FlowNode tone="token1" badge={t.caseToken1x}>
                {t.caseNodeModel}
              </FlowNode>
              <FlowEdge on />
              <FlowNode tone="good">{t.caseOut2}</FlowNode>
            </div>
            <p className="m-0 mt-4 font-mono text-[11px] leading-[1.7] text-muted">
              {site.featuredCase.stack.join(" · ")}
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="border-t border-b border-bord py-[clamp(24px,4vh,56px)]">
          <p className="m-0 mb-[clamp(16px,3vh,34px)] text-[clamp(84px,17vw,260px)] leading-[.8] font-bold tracking-[-.06em] text-accent">
            −90%
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[clamp(14px,2.4vw,36px)]">
            {[t.featM1, t.featM2, t.featM3].map((m) => (
              <p
                key={m}
                className="m-0 border-t border-bord pt-3 font-mono text-[11.5px] leading-[1.8] tracking-[.16em] text-muted uppercase"
              >
                {m}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
