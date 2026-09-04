// Shader do campo de partículas de fundo (#ld-gl no protótipo).
// Portado literalmente do protótipo hi-fi — mesma matemática, mesmos
// nomes de uniform/attribute. Cinco "formações" (caos → retícula → código
// → sistema → produção) interpoladas conforme a seção ativa (uStage).

export const VERTEX_SRC = [
  "precision highp float;",
  "attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4;",
  "attribute float aSeed;",
  "uniform mat4 uProj; uniform mat4 uView; uniform float uStage; uniform float uTime;",
  "uniform vec2 uMouse; uniform float uAspect; uniform float uSize; uniform float uOrder;",
  "varying float vD; varying float vM; varying float vS;",
  "void main(){",
  "  vec3 p = aP0;",
  "  p = mix(p, aP1, clamp(uStage-0.0,0.0,1.0));",
  "  p = mix(p, aP2, clamp(uStage-1.0,0.0,1.0));",
  "  p = mix(p, aP3, clamp(uStage-2.0,0.0,1.0));",
  "  p = mix(p, aP4, clamp(uStage-3.0,0.0,1.0));",
  "  float drift = (1.0 - uOrder*0.82);",
  "  p.x += sin(uTime*0.42 + aSeed*31.4) * 0.13 * drift;",
  "  p.y += cos(uTime*0.37 + aSeed*17.7) * 0.13 * drift;",
  "  p.z += sin(uTime*0.29 + aSeed*23.1) * 0.13 * drift;",
  "  vec4 mv = uView * vec4(p,1.0);",
  "  vec4 cp = uProj * mv;",
  "  vec2 ndc = cp.xy / cp.w;",
  "  vec2 d = ndc - uMouse; d.x *= uAspect;",
  "  float r = length(d);",
  "  float force = exp(-r*r*7.0) * 0.30;",
  "  ndc += normalize(d + vec2(0.0001)) * force;",
  "  cp.xy = ndc * cp.w;",
  "  gl_Position = cp;",
  "  vD = -mv.z;",
  "  vM = force * 3.2;",
  "  vS = aSeed;",
  "  gl_PointSize = clamp(uSize * (7.5 / max(vD, 0.35)), 1.0, 16.0) * (0.6 + aSeed*0.85);",
  "}",
].join("\n");

export const FRAGMENT_SRC = [
  "precision highp float;",
  "uniform vec3 uColA; uniform vec3 uColB; uniform vec3 uColC; uniform float uOrder;",
  "varying float vD; varying float vM; varying float vS;",
  "void main(){",
  "  vec2 c = gl_PointCoord - 0.5;",
  "  float d = length(c);",
  "  float a = smoothstep(0.5, 0.02, d); a *= a;",
  "  float fog = clamp(1.0 - (vD - 2.5) / 10.0, 0.08, 1.0);",
  "  vec3 col = mix(uColA, uColB, clamp(fog*1.25 - 0.25, 0.0, 1.0));",
  "  col = mix(col, uColC, clamp(vM, 0.0, 1.0) * 0.85);",
  "  col = mix(col, uColB, step(0.965, vS) * 0.9);",
  "  float al = a * fog * fog * (0.62 + 0.38*uOrder) * (0.42 + vS*0.95);",
  "  gl_FragColor = vec4(col * al, al);",
  "}",
].join("\n");

/** Constrói as 5 formações (Float32Array de N*3 posições cada). */
export function buildFormations(N: number): Float32Array[] {
  const A = () => new Float32Array(N * 3);
  const chaos = A();
  const lattice = A();
  const code = A();
  const system = A();
  const prod = A();
  const R = Math.random;

  // filamentos: o caos tem massa e direção, não é poeira uniforme
  const STR = 120;
  const strands: { o: number[]; d: number[]; c: number[] }[] = [];
  for (let s = 0; s < STR; s++) {
    const a = R() * Math.PI * 2;
    const b = Math.acos(2 * R() - 1);
    const rad = 0.5 + Math.pow(R(), 0.7) * 2.4;
    strands.push({
      o: [Math.sin(b) * Math.cos(a) * rad, Math.cos(b) * rad * 0.8, Math.sin(b) * Math.sin(a) * rad],
      d: [(R() - 0.5) * 2.4, (R() - 0.5) * 1.8, (R() - 0.5) * 2.4],
      c: [(R() - 0.5) * 3.2, (R() - 0.5) * 2.6, (R() - 0.5) * 3.2],
    });
  }

  for (let i = 0; i < N; i++) {
    const k = i * 3;
    // 0 — caos: filamentos entrelaçados
    const st = strands[i % STR];
    const u = R();
    const iu = 1 - u;
    const m0 = iu * iu;
    const m1 = 2 * iu * u;
    const m2 = u * u;
    const jt = 0.1 + R() * 0.16;
    chaos[k] = m0 * st.o[0] + m1 * st.c[0] + m2 * (st.o[0] + st.d[0]) + (R() - 0.5) * jt * 2.2;
    chaos[k + 1] = m0 * st.o[1] + m1 * st.c[1] + m2 * (st.o[1] + st.d[1]) + (R() - 0.5) * jt * 2.2;
    chaos[k + 2] = m0 * st.o[2] + m1 * st.c[2] + m2 * (st.o[2] + st.d[2]) + (R() - 0.5) * jt * 2.2;

    // 1 — estrutura: retícula ortogonal (arestas de células)
    const G = 7;
    const step = 4.6 / G;
    const gx = Math.floor(R() * (G + 1));
    const gy = Math.floor(R() * (G + 1));
    const gz = Math.floor(R() * (G + 1));
    const axis = Math.floor(R() * 3);
    const tt = R();
    let lx = gx * step - 2.3;
    let ly = gy * step - 2.3;
    let lz = gz * step - 2.3;
    if (axis === 0) lx += tt * step;
    else if (axis === 1) ly += tt * step;
    else lz += tt * step;
    lattice[k] = lx;
    lattice[k + 1] = ly;
    lattice[k + 2] = lz;

    // 2 — código: linhas de texto com indentação
    const rows = 30;
    const row = Math.floor(R() * rows);
    const indent = row % 7 === 0 ? 0 : row % 3 === 0 ? 0.42 : 0.22;
    const len = 1.4 + ((row * 37) % 11) / 11 * 3.0;
    code[k] = -2.5 + indent + R() * len;
    code[k + 1] = 2.3 - row * (4.6 / rows) + (R() - 0.5) * 0.045;
    code[k + 2] = (R() - 0.5) * 0.5;

    // 3 — sistema: nós em anel + arestas
    const K = 8;
    const ci = Math.floor(R() * K);
    const ca = (ci / K) * Math.PI * 2;
    const cxp = Math.cos(ca) * 2.5;
    const czp = Math.sin(ca) * 2.5;
    const cyp = ((ci % 3) - 1) * 0.95;
    if (R() < 0.55) {
      const s = 0.42;
      system[k] = cxp + (R() - 0.5) * s;
      system[k + 1] = cyp + (R() - 0.5) * s;
      system[k + 2] = czp + (R() - 0.5) * s;
    } else {
      const cj = (ci + 1 + Math.floor(R() * 3)) % K;
      const cb = (cj / K) * Math.PI * 2;
      const bx = Math.cos(cb) * 2.5;
      const bz = Math.sin(cb) * 2.5;
      const by = ((cj % 3) - 1) * 0.95;
      const uu = R();
      system[k] = cxp + (bx - cxp) * uu + (R() - 0.5) * 0.05;
      system[k + 1] = cyp + (by - cyp) * uu + (R() - 0.5) * 0.05;
      system[k + 2] = czp + (bz - czp) * uu + (R() - 0.5) * 0.05;
    }

    // 4 — produção: laje/horizonte estável
    const px = (R() - 0.5) * 9.2;
    const pz = (R() - 0.5) * 6.2;
    prod[k] = px;
    prod[k + 1] = Math.sin(px * 0.5) * 0.14 + Math.cos(pz * 0.6) * 0.1 + (R() - 0.5) * 0.06;
    prod[k + 2] = pz;
  }

  return [chaos, lattice, code, system, prod];
}

export function makeProgram(
  gl: WebGLRenderingContext,
  vsrc: string,
  fsrc: string
): WebGLProgram | null {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const v = sh(gl.VERTEX_SHADER, vsrc);
  const f = sh(gl.FRAGMENT_SHADER, fsrc);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

export function perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

export function lookAt(eye: number[], center: number[], up: number[]): Float32Array {
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const norm = (a: number[]) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const cross = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const z = norm(sub(eye, center));
  const x = norm(cross(up, z));
  const y = cross(z, x);
  // prettier-ignore
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
  ]);
}

/** Lê `[data-stg]` no DOM e calcula o estágio contínuo de scroll (0..stageCount-1). */
export function computeStage(stageCount: number): number {
  const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-stg]"));
  if (secs.length === 0) return 0;
  const mid = window.innerHeight * 0.45;
  let s = 0;
  secs.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= mid) s = parseFloat(el.dataset.stg || "0");
  });
  let next = s;
  secs.forEach((el) => {
    const r = el.getBoundingClientRect();
    const v = parseFloat(el.dataset.stg || "0");
    if (r.top > mid && v > s && (next === s || v < next)) next = v;
  });
  let f = 0;
  if (next > s) {
    const cur = secs.find((e) => parseFloat(e.dataset.stg || "0") === next);
    if (cur) {
      const r = cur.getBoundingClientRect();
      f = Math.min(1, Math.max(0, 1 - (r.top - mid) / (window.innerHeight * 0.9)));
    }
  }
  return Math.min(stageCount - 1, s + f * (next - s));
}
