"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VERTEX_SRC, buildAstronautSrc } from "@/shaders/astronaut";
import type { ambient as AmbientEngine } from "@/lib/ambient";

/** Janela de rolagem (0..1) em que cada frase aparece; fora dela, some. */
const CAPTIONS: [number, number][] = [
  [0.1, 0.34],
  [0.78, 0.95],
];
/** Onde ficam as transições do shader (marcas na barra de progresso). */
const MARKS = [0.4, 0.72];

const fade = (p: number, [a, b]: [number, number]) => {
  const w = 0.05;
  return Math.max(0, Math.min(1, (p - a) / w, (b - p) / w));
};

/**
 * Interlúdio rolável antes do contato: um astronauta raymarched
 * (`src/shaders/astronaut.ts`) cuja coreografia inteira — três tomadas e duas
 * transições — é conduzida pela rolagem. A seção tem ~4,5 telas de altura e o
 * palco fica preso (sticky); uma barra embaixo mostra o progresso e onde
 * estão as transições.
 *
 * Desempenho: o WebGL só é criado quando a seção chega perto da tela (não
 * pesa o carregamento), só desenha com ela visível e ajusta a resolução sozinho
 * se o quadro ficar lento.
 *
 * - Canvas transparente nas pontas: o céu entra e sai por cima das
 *   partículas do site, sem corte.
 * - Sem WebGL: canvas escondido, frases sempre visíveis.
 * - Arrastar gira o astronauta (no toque, só na horizontal: `touch-action: pan-y`).
 * - `prefers-reduced-motion`: o tempo do shader para; a rolagem continua
 *   conduzindo a cena (o movimento é da própria pessoa).
 */
export function OrbitSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);
  // false enquanto o shader compila: a pílula do HUD avisa "preparando a cena"
  const [sceneReady, setSceneReady] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let cleanup: (() => void) | null = null;
    let started = false;

    // Trabalho pesado síncrono (criar o contexto, aquecer a GPU, enviar texturas)
    // só roda quando a rolagem para por um instante — é quando ninguém percebe.
    // Se a seção chegar perto antes disso, roda de qualquer jeito.
    const calmQueue: (() => void)[] = [];
    let calmTimer = 0;
    let queuedAt = performance.now();
    let lastScrollAt = performance.now();
    const noteScroll = () => {
      lastScrollAt = performance.now();
    };
    window.addEventListener("scroll", noteScroll, { passive: true });
    const pumpCalm = () => {
      calmTimer = 0;
      if (!calmQueue.length) return;
      const now = performance.now();
      const urgent = section.getBoundingClientRect().top < window.innerHeight * 1.5 || now - queuedAt > 2500;
      if (urgent || now - lastScrollAt > 220) {
        calmQueue.shift()!();
        queuedAt = now;
      }
      calmTimer = window.setTimeout(pumpCalm, 100);
    };
    const whenCalm = (fn: () => void) => {
      calmQueue.push(fn);
      if (!calmTimer) calmTimer = window.setTimeout(pumpCalm, 0);
    };

    const showStatic = () => {
      setSceneReady(true);
      canvas.style.display = "none";
      capRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    };

    // criar o contexto custa dezenas de ms: só quando a seção se aproxima (start).
    // Aqui, só a pergunta barata "este navegador tem WebGL?"
    let gl: WebGLRenderingContext | null = null;
    if (!("WebGLRenderingContext" in window)) {
      showStatic();
      return;
    }

    // a trilha (se tocando) sobe de intensidade com a cena; o módulo vem sob demanda
    let amb: typeof AmbientEngine | null = null;
    void import("@/lib/ambient").then((m) => {
      amb = m.ambient;
    });

    // A compilação do shader leva segundos em PC comum (≈9s neste, via ANGLE/D3D):
    // começa na primeira rolagem, com a página inteira pela frente. Texturas,
    // buffers e o laço (`begin`) esperam a seção se aproximar (`near`).
    let nearSeen = false;
    let compiled: WebGLProgram | null = null;
    const onCompiled = (prog: WebGLProgram) => {
      compiled = prog;
      if (nearSeen) begin(prog);
      else whenCalm(() => prepare(prog));
    };

    // Buffers, uniforms e um desenho de 2×2 px: faz o driver terminar o pipeline
    // (dezenas de ms) logo depois da compilação, ainda longe da seção.
    let prepared: { U: Record<string, WebGLUniformLocation | null> } | null = null;
    const prepare = (prog: WebGLProgram) => {
      if (prepared || !gl) return;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aP");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U: Record<string, WebGLUniformLocation | null> = {};
      (["uRes", "uTime", "uProg", "uRot", "uMouse"] as const).forEach((k) => {
        U[k] = gl!.getUniformLocation(prog, k);
      });
      prepared = { U };
      gl.viewport(0, 0, 2, 2);
      gl.uniform2f(U.uRes, 2, 2);
      gl.uniform1f(U.uTime, 0);
      gl.uniform1f(U.uProg, 0);
      gl.uniform2f(U.uRot, 0, 0);
      gl.uniform2f(U.uMouse, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const start = () => {
      started = true;
      whenCalm(() => {
        const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
        try {
          gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
        } catch {
          gl = null;
        }
        if (!gl) return showStatic();
        // compila sem travar a página: com KHR_parallel_shader_compile o navegador
        // compila em paralelo e aqui só se pergunta "terminou?" a cada quadro. Sem a
        // extensão a primeira pergunta bloqueia — mas a seção ainda está a duas
        // telas de distância (rootMargin do `near`)
        const prog = gl.createProgram();
        const vs = gl.createShader(gl.VERTEX_SHADER);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        if (!prog || !vs || !fs) return showStatic();
        gl.shaderSource(vs, VERTEX_SRC);
        gl.shaderSource(fs, buildAstronautSrc(isTouch ? 64 : 88));
        gl.compileShader(vs);
        gl.compileShader(fs);
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        const par = gl.getExtension("KHR_parallel_shader_compile") as { COMPLETION_STATUS_KHR: number } | null;
        let pollId = 0;
        const poll = () => {
          if (par && !gl!.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) {
            pollId = window.setTimeout(poll, 120);
            return;
          }
          if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
            console.warn(gl!.getProgramInfoLog(prog));
            showStatic();
            return;
          }
          onCompiled(prog);
        };
        pollId = window.setTimeout(poll, 120);
        cleanup = () => clearTimeout(pollId);
      });
    };

    const begin = (prog: WebGLProgram) => {
      if (!gl) return showStatic();
      const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
      prepare(prog);
      gl.useProgram(prog);
      const U = prepared!.U;

      // texturas da Terra (NASA, domínio público — /public/assets/space): carregam
      // só aqui, quando a seção se aproxima; até chegarem, o shader usa o planeta
      // procedural. Uma textura por vez e uma única decodificação por arquivo
      // (blob → ImageBitmap, fora da thread principal): decodificar os três JPEGs
      // de 2048px juntos ocupava todos os núcleos e travava a rolagem por ~80ms.
      // O envio à GPU vai em 4 fatias, cada uma numa pausa da rolagem.
      const texUnits = { uDay: 0, uNight: 1, uClouds: 2 } as const;
      const texFiles = { uDay: "earth-day.jpg", uNight: "earth-night.jpg", uClouds: "earth-clouds.jpg" };
      const aniso = gl.getExtension("EXT_texture_filter_anisotropic") as { TEXTURE_MAX_ANISOTROPY_EXT: number } | null;
      let texLoaded = 0;
      const SLICES = 4;
      const calm = () => new Promise<void>((ok) => whenCalm(ok));
      const loadTex = async (name: keyof typeof texUnits) => {
        const blob = await (await fetch(`/assets/space/${texFiles[name]}`)).blob();
        const full = await createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none" });
        const w = full.width;
        const h = full.height;
        const sh = Math.floor(h / SLICES);
        // recortes do bitmap já decodificado: cópia barata, sem nova decodificação
        const slices = await Promise.all(Array.from({ length: SLICES }, (_, k) => createImageBitmap(full, 0, sh * k, w, sh)));
        full.close();
        if (!gl) return;
        const tex = gl.createTexture();
        await calm();
        if (!gl) return;
        gl.activeTexture(gl.TEXTURE0 + texUnits[name]);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        for (let k = 0; k < SLICES; k++) {
          await calm();
          if (!gl) return;
          gl.activeTexture(gl.TEXTURE0 + texUnits[name]);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, sh * k, gl.RGBA, gl.UNSIGNED_BYTE, slices[k]);
          slices[k].close();
        }
        await calm();
        if (!gl) return;
        gl.useProgram(prog);
        gl.activeTexture(gl.TEXTURE0 + texUnits[name]);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4);
        gl.uniform1i(gl.getUniformLocation(prog, name), texUnits[name]);
        if (++texLoaded === 3) gl.uniform1f(gl.getUniformLocation(prog, "uHasTex"), 1);
      };
      void (async () => {
        for (const name of Object.keys(texUnits) as (keyof typeof texUnits)[]) {
          try {
            await calm();
            await loadTex(name);
          } catch {
            /* sem textura: fica o planeta procedural */
          }
        }
      })();

      const maxScale = isTouch ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.25);
      // começa abaixo do teto e só sobe se os quadros forem rápidos
      let adaptive = maxScale * 0.8;
      let scale = adaptive;
      const resize = () => {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(r.width * scale));
        canvas.height = Math.max(1, Math.floor(r.height * scale));
        gl!.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      if (!isTouch) window.addEventListener("pointermove", onMove);

      const rot = { x: 0, y: 0, vx: 0, vy: 0 };
      let drag: { x: number; y: number } | null = null;
      const stage = canvas.parentElement!;
      const onDown = (e: PointerEvent) => {
        drag = { x: e.clientX, y: e.clientY };
      };
      const onDrag = (e: PointerEvent) => {
        if (!drag) return;
        rot.vx = (e.clientX - drag.x) * 0.006;
        rot.vy = e.pointerType === "touch" ? 0 : (e.clientY - drag.y) * 0.004;
        drag = { x: e.clientX, y: e.clientY };
        rot.x += rot.vx;
        rot.y = Math.max(-0.6, Math.min(0.6, rot.y + rot.vy));
      };
      const onUp = () => {
        drag = null;
      };
      stage.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onDrag);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);

      let inView = true;
      const io = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      });
      io.observe(section);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t0 = performance.now();
      let last = t0;
      let slow = 0;
      let fast = 0;
      let prog01 = 0;
      let raf = 0;
      let drewOnce = false;
      let lastScale = scale;
      let geoTop = 0;
      let geoH = 0;
      let geoStamp = 0;

      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);
        if (!inView) {
          last = now;
          amb?.setIntensity(0);
          return;
        }
        // mede o quadro e ajusta a resolução: 2 quadros lentos seguidos já baixam,
        // e ela só volta a subir depois de ~2s de quadros rápidos
        const dt = now - last;
        last = now;
        if (dt > 34) slow++;
        else {
          slow = 0;
          if (dt < 14) fast++;
        }
        if (slow >= 2 && adaptive > 0.4) {
          adaptive = Math.max(0.4, adaptive * 0.8);
          slow = fast = 0;
        } else if (fast > 120 && adaptive < maxScale) {
          adaptive = Math.min(maxScale, adaptive * 1.1);
          slow = fast = 0;
        }

        // posição da seção em cache (relida a cada 250ms): sem forçar layout por quadro
        if (now - geoStamp > 250) {
          const rr = section.getBoundingClientRect();
          geoTop = rr.top + window.scrollY;
          geoH = rr.height;
          geoStamp = now;
        }
        const rTop = geoTop - window.scrollY;
        const vh = window.innerHeight;
        // enquanto a seção ainda está chegando (palco não fixou) desenha em
        // resolução menor: o que aparece é só a borda do céu, e a GPU não
        // disputa com a rolagem
        scale = rTop > 1 ? adaptive * 0.6 : adaptive;
        if (scale !== lastScale) {
          lastScale = scale;
          resize();
        }

        const target = Math.min(1, Math.max(0, -rTop / Math.max(1, geoH - vh)));
        // segue a rolagem, mas no máximo ~0,3 da cena por segundo (no toque, onde
        // não dá para frear a página, um pouco mais) — rolada rápida não atravessa
        // a coreografia num piscar; parar de rolar para a cena
        // dt limitado a 34ms: quadro longo (compilação, aba em segundo plano) não
        // vira salto — num quadro lento a cena só anda devagar
        const maxRate = ((isTouch ? 0.5 : 0.3) * Math.min(34, Math.max(0, dt))) / 1000;
        const want = reduced ? target - prog01 : (target - prog01) * 0.1;
        prog01 = Math.min(1, Math.max(0, prog01 + Math.max(-maxRate, Math.min(maxRate, want))));

        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        if (!drag) {
          rot.x += rot.vx;
          rot.y = Math.max(-0.6, Math.min(0.6, rot.y + rot.vy));
          rot.vx *= 0.95;
          rot.vy *= 0.92;
          rot.y *= 0.985;
        }

        CAPTIONS.forEach((win, i) => {
          const el = capRefs.current[i];
          if (!el) return;
          const o = fade(prog01, win);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 28}px)`;
          el.style.filter = `blur(${(1 - o) * 8}px)`;
        });
        if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - prog01 * 14));
        if (barRef.current) barRef.current.style.transform = `scaleX(${prog01})`;
        // trilha: sobe ao entrar na cena, no auge durante as tomadas, volta ao calmo no fim
        amb?.setIntensity(Math.min(1, prog01 * 6) * (1 - Math.max(0, (prog01 - 0.85) / 0.15)));
        if (hudRef.current) hudRef.current.style.opacity = prog01 > 0.995 ? "0" : "1";

        gl!.uniform2f(U.uRes, canvas.width, canvas.height);
        gl!.uniform1f(U.uTime, reduced ? 12 : (now - t0) / 1000);
        gl!.uniform1f(U.uProg, prog01);
        gl!.uniform2f(U.uRot, rot.x, rot.y);
        gl!.uniform2f(U.uMouse, mouse.x, mouse.y);
        gl!.clearColor(0, 0, 0, 0);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
        if (!drewOnce) {
          drewOnce = true;
          setSceneReady(true);
        }
      };
      raf = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        if (!isTouch) window.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onDrag);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    };

    // começa a preparar quando a seção está a ~3 telas de distância
    const near = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          near.disconnect();
          nearSeen = true;
          if (!started) start();
          else if (compiled) begin(compiled);
        }
      },
      { rootMargin: "300% 0px" }
    );
    near.observe(section);

    // primeira rolagem de verdade (quem só mede a página, como o Lighthouse, não rola)
    const onFirstScroll = () => {
      if (window.scrollY < 200) return;
      window.removeEventListener("scroll", onFirstScroll);
      if (!started) start();
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });

    return () => {
      near.disconnect();
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("scroll", noteScroll);
      clearTimeout(calmTimer);
      cleanup?.();
    };
  }, []);

  const capCls =
    "pointer-events-none absolute block max-w-[14ch] text-[clamp(40px,6.6vw,112px)] leading-[.95] font-bold tracking-[-.045em] opacity-0 will-change-transform";
  const glow = { textShadow: "0 0 40px rgba(4,10,24,.9), 0 0 12px rgba(4,10,24,.8)" };

  return (
    <section ref={sectionRef} id="orbita" className="relative h-[460svh] max-md:h-[340svh]">
      <div className="sticky top-0 h-[100svh] touch-pan-y overflow-hidden select-none min-[1100px]:-mr-12">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />
        <h2 className="m-0">
          <span
            ref={(el) => {
              capRefs.current[0] = el;
            }}
            className={`${capCls} top-[18%] left-5 text-[#9CCBF0] sm:left-8`}
            style={glow}
          >
            {t.orbitA}
          </span>{" "}
          <span
            ref={(el) => {
              capRefs.current[1] = el;
            }}
            className={`${capCls} bottom-[18%] left-5 text-[#F5F2ED] sm:left-8`}
            style={glow}
          >
            {t.orbitB}
          </span>
        </h2>

        {/* HUD: dica de rolagem + barra de progresso com as marcas das transições */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(22px,5vh,48px)] flex flex-col items-center gap-4 px-6 transition-opacity duration-500 max-md:bottom-[96px]"
        >
          <p
            ref={hintRef}
            className="m-0 flex items-center gap-3 rounded-full border border-accent/40 bg-[#040A18]/70 px-4 py-2 font-mono text-[11.5px] tracking-[.18em] text-txt uppercase backdrop-blur-[6px]"
          >
            {sceneReady ? (
              <span className="inline-block animate-bounce text-accent">↓</span>
            ) : (
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            )}
            {sceneReady ? t.orbitHint : t.orbitLoading}
          </p>
          <div className="relative h-[3px] w-[min(560px,72vw)] overflow-hidden rounded-full bg-white/12">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent to-[#66D9FF]"
              style={{ transform: "scaleX(0)" }}
            />
            {MARKS.map((m) => (
              <span key={m} className="absolute top-0 h-full w-[2px] bg-[#040A18]" style={{ left: `${m * 100}%` }} />
            ))}
          </div>
          <p className="m-0 font-mono text-[9.5px] tracking-[.16em] text-muted uppercase">{t.orbitCredit}</p>
        </div>
      </div>
    </section>
  );
}
