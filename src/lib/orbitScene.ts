// Cena 3D da OrbitSection (three.js), carregada só quando a seção se aproxima.
//
// - Astronauta: traje EMU da NASA (NASA 3D Resources, domínio público; a
//   insígnia da NASA e o patch de missão foram apagados da textura — o uso da
//   insígnia é restrito). `public/assets/space/emu.glb` (malha em pose T + cor
//   base) e mapas derivados: relevo (bump) e rugosidade (ORM).
// - O modelo vem sem esqueleto: `autoRig` cria um aqui (16 ossos com juntas
//   medidas na malha, pesos por cápsula com mistura suave) e `pose()` move
//   braços e pernas a cada quadro — pose por tomada, flutuação contínua e
//   transições suaves. O visor é a segunda primitiva do modelo e vira uma malha
//   própria com material espelhado, refletindo um mapa cúbico renderizado pelo
//   próprio shader de fundo (céu com a Terra, ou a treliça).
// - Fundo: shader `src/shaders/space.ts` num triângulo de tela cheia, que lê a
//   câmera do three (inversa de view-projection) — serve para a tela e para o
//   cubo de reflexo.
// - Coreografia: `choreo()` calcula câmera, posição/rotação do traje,
//   materialização (`mat`) e jatos a partir do progresso da rolagem.
// - Materialização: `onBeforeCompile` no material do traje descarta fragmentos
//   por ruído 3D (borda ciano). Poeira em volta: nuvem de pontos aditivos.
//   Brilho de lente no visor: sprite aditivo no ponto de reflexo do sol.
// - Compilação: `renderer.compileAsync` (paralela) e um desenho de aquecimento
//   de 4×4 px antes da cena aparecer. Sem mapa de ambiente PBR de propósito: o
//   PMREM do three compila um shader pesado de forma síncrona (~400ms travados).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "meshoptimizer";
import { NOISE_GLSL, SPACE_VERTEX_SRC, buildSpaceSrc } from "@/shaders/space";

export type OrbitFrameInput = {
  /** progresso da rolagem 0..1 */
  prog: number;
  /** segundos (congelado com reduced-motion) */
  time: number;
  /** arraste (radianos) */
  rot: { x: number; y: number };
  /** parallax do mouse, -1..1 */
  mouse: { x: number; y: number };
};

/** Executa a continuação numa pausa da rolagem (fila da OrbitSection). */
export type Calm = () => Promise<void>;

export type OrbitScene = {
  /** Modelo, mapas e texturas da Terra; resolve quando o traje pode ser desenhado. */
  load(calm: Calm): Promise<void>;
  /** Compila os shaders em paralelo, renderiza os reflexos e faz um desenho de aquecimento. */
  warm(calm: Calm): Promise<void>;
  /** Tamanho do buffer em pixels do dispositivo (o CSS continua 100%). */
  setSize(w: number, h: number): void;
  render(f: OrbitFrameInput): void;
  dispose(): void;
};

const ASSETS = "/assets/space/";
const SUIT_HEIGHT = 2.05;
const UP = new THREE.Vector3(0, 1, 0);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// matrizes com a MESMA convenção do shader antigo (construtor column-major do GLSL):
// q_local = rotZ(a) * rotX(b) * rotY(c) * (p - aPos)
const rotY = (a: number) => {
  const s = Math.sin(a), c = Math.cos(a);
  return new THREE.Matrix3().set(c, 0, s, 0, 1, 0, -s, 0, c);
};
const rotX = (a: number) => {
  const s = Math.sin(a), c = Math.cos(a);
  return new THREE.Matrix3().set(1, 0, 0, 0, c, s, 0, -s, c);
};
const rotZ = (a: number) => {
  const s = Math.sin(a), c = Math.cos(a);
  return new THREE.Matrix3().set(c, s, 0, -s, c, 0, 0, 0, 1);
};

type Choreo = {
  aPos: THREE.Vector3;
  /** matriz mundo→local (como no shader antigo); o modelo usa a transposta */
  aRot: THREE.Matrix3;
  mat: number;
  jet: number;
  shotB: number;
  ro: THREE.Vector3;
  fw: THREE.Vector3;
  rt: THREE.Vector3;
  up: THREE.Vector3;
};

function choreo(f: OrbitFrameInput, aspect: number, helmLocal: THREE.Vector3, out: Choreo): Choreo {
  const p = f.prog;
  const t = f.time;
  const wide = smoothstep(0.9, 1.5, aspect);
  const w1 = smoothstep(0.34, 0.4, p) * (1 - smoothstep(0.4, 0.46, p));
  const w2 = smoothstep(0.68, 0.72, p) * (1 - smoothstep(0.72, 0.76, p));
  let mat: number;
  let close = 0;
  let camD: number, camA: number, camH: number;
  const target = new THREE.Vector3();
  out.jet = 0;
  out.shotB = 0;
  if (p < 0.4) {
    const lp = p / 0.4;
    mat = smoothstep(0.03, 0.55, lp);
    out.aPos.set(0, Math.sin(t * 0.6) * 0.05, 0);
    out.aRot
      .copy(rotZ(Math.sin(t * 0.23) * 0.08))
      .multiply(rotX(f.rot.y + Math.sin(t * 0.31) * 0.06))
      .multiply(rotY(mix(2.4, 0.1, smoothstep(0.05, 0.8, lp)) + f.rot.x));
    camD = mix(8.0, 3.9, smoothstep(0, 0.85, lp)) * (1 + 0.55 * (1 - wide));
    camA = mix(-0.55, 0.15, lp);
    camH = mix(0.9, 0.15, lp);
    target.set(-0.72 * wide, 0.1 + 0.35 * (1 - wide), 0);
  } else if (p < 0.72) {
    const lp = (p - 0.4) / 0.32;
    mat = smoothstep(0.08, 0.3, lp);
    out.shotB = 1;
    out.aPos.set(0, Math.sin(t * 0.5) * 0.04, 0);
    out.aRot
      .copy(rotZ(2.8 + lp * 0.9))
      .multiply(rotX(0.5 - lp * 0.3 + f.rot.y))
      .multiply(rotY(-0.8 + lp * 1.6 + f.rot.x));
    close = smoothstep(0.55, 0.95, lp);
    camD = mix(4.4, 1.45, close);
    camA = 0.18 * Math.sin(lp * 3);
    camH = mix(0.25, 0.1, lp);
    target.set(0, 0, 0);
  } else {
    const lp = (p - 0.72) / 0.28;
    mat = smoothstep(0.02, 0.18, lp);
    out.jet = smoothstep(0.05, 0.2, lp);
    const k = smoothstep(0.08, 1, lp);
    out.aPos.set(mix(-1.6, 2.6, k), mix(-0.5, 1.7, k), mix(-0.4, -4.6, k));
    camD = 5.2;
    camA = -0.2;
    camH = 0.5;
    target.set(0, 0.2, -1);
    // voo: a cabeça aponta para onde ele vai e o peito encara a câmera (base da
    // câmera sem o parallax do mouse), com um rolamento lento pelo caminho
    const dir = new THREE.Vector3(4.2, 2.2, -4.2).normalize();
    const cam0 = new THREE.Vector3(target.x + Math.sin(camA) * camD, target.y + camH, target.z + Math.cos(camA) * camD);
    const toCam = cam0.sub(out.aPos).normalize();
    const fwd = toCam.addScaledVector(dir, -toCam.dot(dir)).normalize();
    const roll = -0.35 + lp * 0.5 + Math.sin(t * 0.4) * 0.05 + f.rot.x * 0.5;
    const cr = Math.cos(roll), sr = Math.sin(roll);
    const rt = new THREE.Vector3().crossVectors(dir, fwd).normalize();
    const fwdR = fwd.clone().multiplyScalar(cr).addScaledVector(rt, sr);
    const rtR = new THREE.Vector3().crossVectors(dir, fwdR).normalize();
    // aRot é mundo→local (linhas = eixos locais no mundo)
    out.aRot.set(rtR.x, rtR.y, rtR.z, dir.x, dir.y, dir.z, fwdR.x, fwdR.y, fwdR.z);
  }
  out.mat = mat * (1 - Math.max(w1, w2));
  // capacete no mundo: aPos + transposta(aRot) * helmLocal
  const helmW = helmLocal.clone().applyMatrix3(out.aRot.clone().transpose()).add(out.aPos);
  target.lerp(helmW, close);
  camA += f.mouse.x * 0.08;
  camH += f.mouse.y * 0.06;
  out.ro.set(target.x + Math.sin(camA) * camD, target.y + camH, target.z + Math.cos(camA) * camD);
  out.fw.copy(target).sub(out.ro).normalize();
  out.rt.crossVectors(out.fw, UP).normalize();
  out.up.crossVectors(out.rt, out.fw);
  return out;
}

async function loadBitmap(url: string): Promise<ImageBitmap> {
  const blob = await (await fetch(url)).blob();
  return createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none", imageOrientation: "none" });
}

function bitmapTexture(bmp: ImageBitmap, srgb: boolean): THREE.Texture {
  const tex = new THREE.Texture(bmp);
  tex.flipY = false;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Textura do brilho de lente: núcleo, raio horizontal longo, vertical curto e duas diagonais. */
function glintTexture(): THREE.CanvasTexture {
  const w = 512, h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "lighter";
  const ray = (len: number, thick: number, ang: number, alpha: number) => {
    g.save();
    g.translate(w / 2, h / 2);
    g.rotate(ang);
    const grad = g.createLinearGradient(-len, 0, len, 0);
    grad.addColorStop(0, "rgba(140,190,255,0)");
    grad.addColorStop(0.5, `rgba(235,245,255,${alpha})`);
    grad.addColorStop(1, "rgba(140,190,255,0)");
    g.fillStyle = grad;
    g.fillRect(-len, -thick / 2, len * 2, thick);
    g.restore();
  };
  ray(250, 2, 0, 0.95);
  ray(250, 9, 0, 0.2);
  ray(80, 1.8, Math.PI / 2, 0.75);
  ray(110, 1.5, Math.PI / 4, 0.4);
  ray(110, 1.5, -Math.PI / 4, 0.4);
  const core = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 30);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(0.18, "rgba(230,242,255,0.75)");
  core.addColorStop(0.5, "rgba(120,180,255,0.18)");
  core.addColorStop(1, "rgba(60,120,255,0)");
  g.fillStyle = core;
  g.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------- esqueleto
// Juntas medidas na malha do EMU em pose T (x, altura a partir dos pés, frente),
// em metros (1,93 m de altura). Lado esquerdo = x > 0; o direito é espelho.
type JointDef = { name: string; parent: string | null; p: [number, number, number]; end: [number, number, number]; r: number; kind: "torso" | "head" | "arm" | "leg" };
const J: JointDef[] = [
  { name: "hips", parent: null, p: [0, 1.0, -0.02], end: [0, 1.12, -0.02], r: 0.3, kind: "torso" },
  { name: "spine", parent: "hips", p: [0, 1.12, -0.02], end: [0, 1.3, -0.02], r: 0.3, kind: "torso" },
  { name: "chest", parent: "spine", p: [0, 1.3, -0.02], end: [0, 1.55, -0.02], r: 0.32, kind: "torso" },
  { name: "head", parent: "chest", p: [0, 1.55, 0], end: [0, 1.93, 0.02], r: 0.3, kind: "head" },
  { name: "upperArmL", parent: "chest", p: [0.34, 1.36, 0], end: [0.57, 1.345, 0], r: 0.12, kind: "arm" },
  { name: "foreArmL", parent: "upperArmL", p: [0.57, 1.345, 0], end: [0.75, 1.33, 0], r: 0.105, kind: "arm" },
  { name: "handL", parent: "foreArmL", p: [0.75, 1.33, 0], end: [0.9, 1.31, 0], r: 0.09, kind: "arm" },
  { name: "upperArmR", parent: "chest", p: [-0.34, 1.36, 0], end: [-0.57, 1.345, 0], r: 0.12, kind: "arm" },
  { name: "foreArmR", parent: "upperArmR", p: [-0.57, 1.345, 0], end: [-0.75, 1.33, 0], r: 0.105, kind: "arm" },
  { name: "handR", parent: "foreArmR", p: [-0.75, 1.33, 0], end: [-0.9, 1.31, 0], r: 0.09, kind: "arm" },
  { name: "thighL", parent: "hips", p: [0.17, 0.95, 0], end: [0.2, 0.57, 0], r: 0.145, kind: "leg" },
  { name: "shinL", parent: "thighL", p: [0.2, 0.57, 0], end: [0.21, 0.18, 0], r: 0.13, kind: "leg" },
  { name: "footL", parent: "shinL", p: [0.21, 0.18, 0], end: [0.22, 0.04, 0.22], r: 0.13, kind: "leg" },
  { name: "thighR", parent: "hips", p: [-0.17, 0.95, 0], end: [-0.2, 0.57, 0], r: 0.145, kind: "leg" },
  { name: "shinR", parent: "thighR", p: [-0.2, 0.57, 0], end: [-0.21, 0.18, 0], r: 0.13, kind: "leg" },
  { name: "footR", parent: "shinR", p: [-0.21, 0.18, 0], end: [-0.22, 0.04, 0.22], r: 0.13, kind: "leg" },
];

type Rig = { bones: THREE.Bone[]; byName: Record<string, THREE.Bone>; skeleton: THREE.Skeleton; restDir: Record<string, THREE.Vector3> };

/**
 * Cria ossos e pesos de pele. A geometria já está centrada e na escala da cena;
 * `center`/`scaleToMeters` levam cada vértice de volta aos metros do modelo
 * original (pés em y≈0), onde as juntas foram medidas.
 */
async function autoRig(geo: THREE.BufferGeometry, scaleToMeters: number, center: THREE.Vector3, pause: Calm): Promise<Rig> {
  const NB = J.length;
  const idx = new Map(J.map((j, i) => [j.name, i]));
  const pos = geo.getAttribute("position");
  const n = pos.count;
  const dense = new Float32Array(n * NB);
  const v = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), ab = new THREE.Vector3(), av = new THREE.Vector3();
  const bi = (name: string) => idx.get(name)!;
  // posição ao longo de uma cadeia de juntas (ombro→cotovelo→pulso→ponta): o vértice
  // recebe o osso do trecho onde cai, com faixa curta de mistura nas juntas
  const chainPos = (p: THREE.Vector3, pts: [number, number, number][]) => {
    let best = Infinity, sAt = 0, acc = 0;
    for (let s = 0; s < pts.length - 1; s++) {
      a.set(...pts[s]);
      b.set(...pts[s + 1]);
      ab.subVectors(b, a);
      av.subVectors(p, a);
      const len = ab.length();
      const t = clamp01(av.dot(ab) / Math.max(1e-6, ab.lengthSq()));
      const d = av.sub(ab.multiplyScalar(t)).length();
      if (d < best) {
        best = d;
        sAt = acc + t * len;
      }
      acc += len;
    }
    return sAt;
  };
  const band = (d: number, w = 0.09) => smoothstep(-w, w, d);
  // distância (m) à cadeia de um membro, já descontado o raio de cada osso
  const chainDist = (p: THREE.Vector3, names: [string, string, string]) => {
    let best = Infinity;
    for (const nm of names) {
      const j = J[bi(nm)];
      a.set(...j.p);
      b.set(...j.end);
      ab.subVectors(b, a);
      av.subVectors(p, a);
      const t = clamp01(av.dot(ab) / Math.max(1e-6, ab.lengthSq()));
      best = Math.min(best, av.sub(ab.multiplyScalar(t)).length() - j.r);
    }
    return best;
  };
  // tronco: cilindro elíptico (meia-largura 0,34; da mochila atrás à frente do peito)
  const torsoDist = (p: THREE.Vector3) => {
    const dx = p.x / 0.34, dz = (p.z + 0.07) / 0.3;
    const radial = (Math.sqrt(dx * dx + dz * dz) - 1) * 0.3;
    const dy = p.y < 0.95 ? 0.95 - p.y : p.y > 1.56 ? p.y - 1.56 : 0;
    return Math.max(radial, dy);
  };
  const limb = (p: THREE.Vector3, names: [string, string, string], row: number, blendRoot: string, w: number) => {
    const j0 = J[bi(names[0])], j1 = J[bi(names[1])], j2 = J[bi(names[2])];
    const pts: [number, number, number][] = [j0.p, j1.p, j2.p, j2.end];
    const s = chainPos(p, pts);
    const l0 = Math.hypot(j1.p[0] - j0.p[0], j1.p[1] - j0.p[1], j1.p[2] - j0.p[2]);
    const l1 = l0 + Math.hypot(j2.p[0] - j1.p[0], j2.p[1] - j1.p[1], j2.p[2] - j1.p[2]);
    const past1 = band(s - l0), past2 = band(s - l1);
    // perto da junta de origem, mistura com o osso-raiz (ombro→peito, quadril→bacia)
    const rootMix = 1 - smoothstep(0.0, 0.12, s);
    dense[row + bi(blendRoot)] += w * rootMix;
    const own = w * (1 - rootMix);
    dense[row + bi(names[0])] += own * (1 - past1);
    dense[row + bi(names[1])] += own * past1 * (1 - past2);
    dense[row + bi(names[2])] += own * past2;
  };
  const ARM_L: [string, string, string] = ["upperArmL", "foreArmL", "handL"], ARM_R: [string, string, string] = ["upperArmR", "foreArmR", "handR"];
  const LEG_L: [string, string, string] = ["thighL", "shinL", "footL"], LEG_R: [string, string, string] = ["thighR", "shinR", "footR"];
  const SOFT = 0.03; // metros: largura da mistura entre tronco e membros
  for (let i = 0; i < n; i++) {
    if ((i & 4095) === 4095) await pause();
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).multiplyScalar(1 / scaleToMeters).add(center);
    const row = i * NB;
    // pontuação por "o quão dentro" de cada parte o vértice está; mistura suave na fronteira
    const dT = torsoDist(v);
    const dAL = chainDist(v, ARM_L), dAR = chainDist(v, ARM_R);
    const dLL = chainDist(v, LEG_L), dLR = chainDist(v, LEG_R);
    // o mancal do ombro (acima de ~1,47 m) é do tronco: braço girando ali vira "asa"
    const shoulderGate = 1 - smoothstep(1.46, 1.54, v.y);
    const sc = (d: number) => Math.exp(-Math.max(d, 0) / SOFT);
    let wT = sc(dT), wAL = sc(dAL) * shoulderGate, wAR = sc(dAR) * shoulderGate, wLL = sc(dLL), wLR = sc(dLR);
    const sum = wT + wAL + wAR + wLL + wLR || 1;
    wT /= sum; wAL /= sum; wAR /= sum; wLL /= sum; wLR /= sum;
    if (wAL > 1e-3) limb(v, ARM_L, row, "chest", wAL);
    if (wAR > 1e-3) limb(v, ARM_R, row, "chest", wAR);
    if (wLL > 1e-3) limb(v, LEG_L, row, "hips", wLL);
    if (wLR > 1e-3) limb(v, LEG_R, row, "hips", wLR);
    if (wT > 1e-3) {
      // tronco por faixas de altura, com mistura curta entre elas
      const s1 = band(v.y - 1.0, 0.08), s2 = band(v.y - 1.3, 0.08), s3 = band(v.y - 1.62, 0.06);
      dense[row + bi("hips")] += wT * (1 - s1);
      dense[row + bi("spine")] += wT * s1 * (1 - s2);
      dense[row + bi("chest")] += wT * s2 * (1 - s3);
      dense[row + bi("head")] += wT * s3;
    }
  }
  // uma passada de suavização pelos vizinhos: tira degraus na fronteira tronco/braço
  const index = geo.getIndex();
  if (index) {
    const nb: number[][] = Array.from({ length: n }, () => []);
    const ia = index.array;
    for (let t = 0; t < ia.length; t += 3) {
      const p0 = ia[t], p1 = ia[t + 1], p2 = ia[t + 2];
      nb[p0].push(p1, p2);
      nb[p1].push(p0, p2);
      nb[p2].push(p0, p1);
    }
    // normaliza antes de suavizar
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let k = 0; k < NB; k++) s += dense[i * NB + k];
      for (let k = 0; k < NB; k++) dense[i * NB + k] /= s || 1;
    }
    let cur = dense;
    for (let pass = 0; pass < 0; pass++) {
      const next = new Float32Array(n * NB);
      for (let i = 0; i < n; i++) {
        const ns = nb[i];
        for (let k = 0; k < NB; k++) {
          let acc = 0;
          for (let q = 0; q < ns.length; q++) acc += cur[ns[q] * NB + k];
          next[i * NB + k] = ns.length ? 0.5 * cur[i * NB + k] + (0.5 * acc) / ns.length : cur[i * NB + k];
        }
      }
      cur = next;
    }
    dense.set(cur);
  }
  const skinIndex = new Uint16Array(n * 4);
  const skinWeight = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    if ((i & 4095) === 4095) await pause();
    const order = Array.from({ length: NB }, (_, k) => k).sort((x, y) => dense[i * NB + y] - dense[i * NB + x]);
    let s = 0;
    for (let q = 0; q < 4; q++) s += dense[i * NB + order[q]];
    for (let q = 0; q < 4; q++) {
      skinIndex[i * 4 + q] = order[q];
      skinWeight[i * 4 + q] = dense[i * NB + order[q]] / (s || 1);
    }
  }
  geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndex, 4));
  geo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeight, 4));

  const bones: THREE.Bone[] = [];
  const byName: Record<string, THREE.Bone> = {};
  const restDir: Record<string, THREE.Vector3> = {};
  for (const j of J) {
    const bone = new THREE.Bone();
    bone.name = j.name;
    const pj = j.parent ? J[idx.get(j.parent)!] : null;
    // raiz em relação ao centro do modelo; filhos em relação ao pai
    const base = pj ? pj.p : [center.x, center.y, center.z];
    bone.position.set((j.p[0] - base[0]) * scaleToMeters, (j.p[1] - base[1]) * scaleToMeters, (j.p[2] - base[2]) * scaleToMeters);
    if (pj) byName[pj.name].add(bone);
    bones.push(bone);
    byName[j.name] = bone;
    restDir[j.name] = new THREE.Vector3(j.end[0] - j.p[0], j.end[1] - j.p[1], j.end[2] - j.p[2]).normalize();
  }
  return { bones, byName, skeleton: new THREE.Skeleton(bones), restDir };
}

// Poses (direções-alvo dos ossos do lado esquerdo, no espaço do modelo: x direita, y cima, z frente).
// O lado direito é espelho em x. A: "oi" como quem flutua de frente; B: cambalhota na treliça; C: voando.
type Pose = Record<"upperArm" | "foreArm" | "hand" | "thigh" | "shin", [number, number, number]>;
// braço para a frente (flexão, como o mancal do ombro permite) em vez de aberto de lado: a axila não vira membrana
// braços para os lados e um pouco abaixo da horizontal, antebraços subindo, mãos na altura do visor
const POSE_A: Pose = { upperArm: [0.75, -0.58, 0.32], foreArm: [0.05, 0.88, 0.47], hand: [0.0, 0.84, 0.54], thigh: [0.14, -0.97, 0.2], shin: [0.02, -0.9, -0.42] };
// braços a ~55° (abrir mais que isso estica o mancal do ombro desta malha)
const POSE_B: Pose = { upperArm: [0.72, -0.52, 0.46], foreArm: [0.55, 0.32, 0.77], hand: [0.55, 0.32, 0.77], thigh: [0.25, -0.85, 0.45], shin: [0.1, -0.55, -0.82] };
// voo: braços à frente (na direção do movimento, o +y do modelo), pernas esticadas atrás
const POSE_C: Pose = { upperArm: [0.3, 0.9, 0.3], foreArm: [0.12, 0.96, 0.22], hand: [0.1, 0.96, 0.24], thigh: [0.07, -0.99, -0.08], shin: [0.03, -0.99, -0.12] };

export function createOrbitScene(canvas: HTMLCanvasElement, opts: { isTouch: boolean }): OrbitScene | null {
  const DEBUG = typeof location !== "undefined" && location.search.includes("ld-debug");
  const lap = (label: string, t0: number) => {
    if (DEBUG) console.debug(`[ld] ${label} ${(performance.now() - t0).toFixed(0)}ms`);
  };
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      // MSAA também no celular: em GPU de tile sai quase de graça e tira o serrilhado do traje
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      stencil: false,
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(1);
  // sem checagem de erro de shader em produção: `getProgramInfoLog` espera o link
  // terminar e travava a thread principal por centenas de ms
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = false;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(2 * Math.atan(0.5 / 1.6) * (180 / Math.PI), 1, 0.05, 120);

  // fundo: triângulo de tela cheia, desenhado primeiro, misturado por cima do canvas transparente
  const bgUniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uProg: { value: 0 },
    uEnv: { value: 0 },
    uInvVP: { value: new THREE.Matrix4() },
    uCamPos: { value: new THREE.Vector3() },
    uDay: { value: null as THREE.Texture | null },
    uNight: { value: null as THREE.Texture | null },
    uClouds: { value: null as THREE.Texture | null },
    uHasTex: { value: 0 },
  };
  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const bgMat = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    vertexShader: SPACE_VERTEX_SRC,
    fragmentShader: buildSpaceSrc(),
    depthTest: false,
    depthWrite: false,
    transparent: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    toneMapped: false,
  });
  const bg = new THREE.Mesh(bgGeo, bgMat);
  bg.frustumCulled = false;
  bg.renderOrder = -10;
  const sizeTmp = new THREE.Vector2();
  bg.onBeforeRender = (r, _s, cam) => {
    const rt = r.getRenderTarget();
    if (rt) bgUniforms.uRes.value.set(rt.width, rt.height);
    else {
      r.getDrawingBufferSize(sizeTmp);
      bgUniforms.uRes.value.copy(sizeTmp);
    }
    bgUniforms.uInvVP.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse);
    cam.getWorldPosition(bgUniforms.uCamPos.value);
  };
  scene.add(bg);

  // luzes: sol quente (com sombra), brilho azul da Terra por baixo, contraluz
  // fria forte (recorta o traje do fundo) e um hemisfério céu/Terra
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.position.set(6, 7, 5);
  const fill = new THREE.DirectionalLight(0x3f9cff, 0.9);
  fill.position.set(0.5, -8, 3);
  const rim = new THREE.DirectionalLight(0xcfe9ff, 2.0);
  rim.position.set(-4, 2, -8);
  const hemi = new THREE.HemisphereLight(0x2a3f66, 0x2f86d9, 0.9);
  scene.add(sun, fill, rim, hemi);

  // o traje: grupo posicionado pela coreografia; o modelo entra dentro, centrado e na escala certa
  const root = new THREE.Group();
  scene.add(root);
  sun.target = root;
  fill.target = root;
  rim.target = root;

  // materialização: limiar compartilhado pelos materiais do traje, poeira e jatos
  const uMat = { value: 1 };

  // mapas cúbicos de reflexo do visor, pintados pelo shader de fundo (céu e treliça)
  const envSky = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const envLat = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const cubeCam = new THREE.CubeCamera(0.1, 100, envSky);

  // poeira ciano em volta do traje enquanto ele se forma
  const DUST = 700;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const r = 0.45 + Math.pow(Math.random(), 0.6) * 1.1;
    dustPos[i * 3] = Math.sin(b) * Math.cos(a) * r;
    dustPos[i * 3 + 1] = Math.cos(b) * r * 1.4;
    dustPos[i * 3 + 2] = Math.sin(b) * Math.sin(a) * r;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: new THREE.Color(0.4, 0.85, 1.0),
    size: 0.035,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  root.add(dust);

  // jatos (tomada C): duas plumas — planos que giram em torno do próprio eixo
  // para encarar a câmera, com brilho suave na largura e ao longo, e estrias animadas
  const jetMat = new THREE.ShaderMaterial({
    uniforms: { uJet: { value: 0 }, uT: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform float uJet; uniform float uT; varying vec2 vUv;\n" +
      "void main(){ float x = vUv.x*2.0-1.0; float t = vUv.y;\n" +
      "  float across = exp(-x*x*3.2); float along = pow(t, 1.7);\n" +
      "  float streak = 0.78 + 0.22*sin(x*14.0 + uT*9.0)*sin(t*34.0 - uT*26.0);\n" +
      "  float core = exp(-x*x*18.0) * pow(t, 2.6) * 1.2;\n" +
      "  float a = uJet * (across*along*streak + core) * 0.75;\n" +
      "  vec3 col = mix(vec3(0.114,0.58,0.89), vec3(0.78,0.95,1.0), clamp(core*0.7 + 0.15*t, 0.0, 1.0));\n" +
      "  gl_FragColor = vec4(col*a, a); }",
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    side: THREE.DoubleSide,
  });
  const jetGeo = new THREE.PlaneGeometry(0.62, 1.9, 1, 1);
  jetGeo.translate(0, -0.95, 0); // bocal em y=0, pluma para -y
  const jets: { mesh: THREE.Mesh; o: THREE.Vector3; d: THREE.Vector3 }[] = [];
  for (const sx of [-1, 1]) {
    const mesh = new THREE.Mesh(jetGeo, jetMat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 5;
    scene.add(mesh);
    // bocais embaixo da mochila (PLSS), pluma para trás do movimento (-y local)
    jets.push({ mesh, o: new THREE.Vector3(0.14 * sx, -0.27, -0.3), d: new THREE.Vector3(0.05 * sx, -0.97, -0.2).normalize() });
  }

  // brilho de lente no visor
  const glint = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glintTexture(), blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true, opacity: 0 })
  );
  glint.renderOrder = 20;
  glint.scale.set(0.9, 0.45, 1);
  scene.add(glint);

  const helmLocal = new THREE.Vector3(0, 0.62, 0.02); // centro do capacete no espaço do grupo
  const VISOR_R = 0.2;
  const ch: Choreo = {
    aPos: new THREE.Vector3(),
    aRot: new THREE.Matrix3(),
    mat: 1,
    jet: 0,
    shotB: 0,
    ro: new THREE.Vector3(0, 0, 8),
    fw: new THREE.Vector3(0, 0, -1),
    rt: new THREE.Vector3(1, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
  };
  const m4 = new THREE.Matrix4();
  let aspect = 16 / 9;
  let lastW = -1;
  let lastH = -1;
  let rig: Rig | null = null;
  const suitMats: THREE.Material[] = [];
  let visorMat: THREE.MeshPhongMaterial | null = null;

  const configureSuit = async (gltf: THREE.Group, maps: { bump: THREE.Texture; orm: THREE.Texture }, pause: Calm) => {
    gltf.updateMatrixWorld(true);
    // o GLB tem duas primitivas: o traje (textura 1024) e o visor (a menor)
    const meshes: THREE.Mesh[] = [];
    gltf.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    if (!meshes.length) return;
    meshes.sort((a, b) => b.geometry.getAttribute("position").count - a.geometry.getAttribute("position").count);
    const suitSrc = meshes[0];
    const visorSrc = meshes[1] ?? null;
    // 1ª passada: caixa no espaço do arquivo já com a transformação dos nós (o nó
    // raiz do arquivo põe o modelo em pé: Y para cima, frente +Z)
    const v = new THREE.Vector3();
    const srcBox = new THREE.Box3();
    for (const m of meshes) {
      const pa = m.geometry.getAttribute("position");
      for (let i = 0; i < pa.count; i++) srcBox.expandByPoint(v.set(pa.getX(i), pa.getY(i), pa.getZ(i)).applyMatrix4(m.matrixWorld));
    }
    const U = 1.93 / Math.max(1e-3, srcBox.max.y - srcBox.min.y); // metros por unidade do arquivo
    const minY = srcBox.min.y;
    // 2ª passada: assa cada malha em metros, pés em 0; concatena
    let total = 0;
    for (const m of meshes) total += m.geometry.getAttribute("position").count;
    const P = new Float32Array(total * 3), Nn = new Float32Array(total * 3), UV = new Float32Array(total * 2);
    const index: number[] = [];
    const ranges: { start: number; count: number }[] = [];
    let base = 0;
    for (const m of meshes) {
      const pa = m.geometry.getAttribute("position"), na = m.geometry.getAttribute("normal"), ua = m.geometry.getAttribute("uv");
      const nm = new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
      for (let i = 0; i < pa.count; i++) {
        v.set(pa.getX(i), pa.getY(i), pa.getZ(i)).applyMatrix4(m.matrixWorld);
        const o = (base + i) * 3;
        P[o] = v.x * U;
        P[o + 1] = (v.y - minY) * U;
        P[o + 2] = v.z * U;
        v.set(na.getX(i), na.getY(i), na.getZ(i)).applyMatrix3(nm).normalize();
        Nn[o] = v.x;
        Nn[o + 1] = v.y;
        Nn[o + 2] = v.z;
        UV[(base + i) * 2] = ua.getX(i);
        UV[(base + i) * 2 + 1] = ua.getY(i);
      }
      const ia = m.geometry.getIndex();
      const start = index.length;
      if (ia) for (let t = 0; t < ia.count; t++) index.push(ia.getX(t) + base);
      else for (let t = 0; t < pa.count; t++) index.push(t + base);
      ranges.push({ start, count: index.length - start });
      base += pa.count;
    }
    const n = total;
    // caixa, centro e escala (tudo em P antes de criar os atributos — eles copiam o array)
    const box = new THREE.Box3();
    for (let i = 0; i < n; i++) box.expandByPoint(v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]));
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = SUIT_HEIGHT / Math.max(size.y, 1e-3);
    for (let i = 0; i < n; i++) {
      P[i * 3] = (P[i * 3] - center.x) * k;
      P[i * 3 + 1] = (P[i * 3 + 1] - center.y) * k;
      P[i * 3 + 2] = (P[i * 3 + 2] - center.z) * k;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(P, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(Nn, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(UV, 2));
    geo.setIndex(index);
    geo.computeBoundingBox();
    const tRig = performance.now();
    await pause();
    rig = await autoRig(geo, k, center, pause);
    lap("autoRig (em fatias)", tRig);
    await pause();
    // centro do capacete: centroide do visor, recuado para dentro da esfera
    const vr = ranges[1] ?? ranges[0];
    const hc = new THREE.Vector3();
    let hn = 0;
    for (let t = vr.start; t < vr.start + vr.count; t++) {
      const i = index[t];
      hc.x += P[i * 3];
      hc.y += P[i * 3 + 1];
      hc.z += P[i * 3 + 2];
      hn++;
    }
    hc.multiplyScalar(1 / Math.max(1, hn));
    helmLocal.set(0, hc.y, hc.z - 0.12);

    const suitIdx = index.slice(ranges[0].start, ranges[0].start + ranges[0].count);
    const visorIdx = visorSrc ? index.slice(ranges[1].start, ranges[1].start + ranges[1].count) : [];
    const mk = (indices: number[]) => {
      const g = new THREE.BufferGeometry();
      for (const name of ["position", "normal", "uv", "skinIndex", "skinWeight"]) g.setAttribute(name, geo.getAttribute(name));
      g.setIndex(indices);
      return g;
    };

    const suitMat = new THREE.MeshPhysicalMaterial({
      map: (suitSrc.material as THREE.MeshStandardMaterial).map,
      color: 0xe6e3dd,
      roughness: 1,
      metalness: 1,
      roughnessMap: maps.orm,
      metalnessMap: maps.orm,
      bumpMap: maps.bump,
      bumpScale: 1.6,
      specularIntensity: 0.5,
      sheen: 0.2,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
    });
    if (suitMat.map) suitMat.map.anisotropy = 4;
    suitMat.onBeforeCompile = (shader) => {
      shader.uniforms.uMat = uMat;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vLdLocal; varying mat3 vLdNM;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLdLocal = position;")
        // leva um vetor do espaço local (antes da pele) para o espaço da vista
        .replace("#include <skinnormal_vertex>", "#include <skinnormal_vertex>\nvLdNM = normalMatrix * mat3(skinMatrix);");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>\nvarying vec3 vLdLocal; varying mat3 vLdNM; uniform float uMat;\n${NOISE_GLSL}`)
        .replace(
          "#include <clipping_planes_fragment>",
          "#include <clipping_planes_fragment>\n float ldDn = ldNoise(vLdLocal*8.5+3.0)*0.75 + ldNoise(vLdLocal*22.0)*0.25; float ldTh = uMat*1.1; if (ldDn > ldTh) discard; float ldEdge = smoothstep(ldTh-0.09, ldTh, ldDn);"
        )
        .replace(
          "#include <normal_fragment_maps>",
          // dobras de tecido por ruído 3D na posição local (independe do atlas UV) + trama fina
          "#include <normal_fragment_maps>\n { vec3 lp = vLdLocal * 16.0; float e = 0.05; float n0 = ldNoise(lp) * 0.7 + ldNoise(lp * 2.7 + 9.0) * 0.3; float nx = ldNoise(lp + vec3(e, 0.0, 0.0)) * 0.7 + ldNoise((lp + vec3(e, 0.0, 0.0)) * 2.7 + 9.0) * 0.3; float ny = ldNoise(lp + vec3(0.0, e, 0.0)) * 0.7 + ldNoise((lp + vec3(0.0, e, 0.0)) * 2.7 + 9.0) * 0.3; float nz = ldNoise(lp + vec3(0.0, 0.0, e)) * 0.7 + ldNoise((lp + vec3(0.0, 0.0, e)) * 2.7 + 9.0) * 0.3; vec3 g = vLdNM * ((vec3(nx, ny, nz) - n0) / e); normal = normalize(normal - (g - normal * dot(g, normal)) * 0.08); vec2 wuv = vBumpMapUv * 700.0; float wf = max(fwidth(wuv.x), fwidth(wuv.y)); float wa = clamp(1.0 - (wf - 0.5) / 0.7, 0.0, 1.0) * 0.04; vec3 wn = vec3(sin(wuv.x), sin(wuv.y), 0.0) * wa; normal = normalize(normal + wn.x * normalize(dFdx(vViewPosition)) + wn.y * normalize(dFdy(vViewPosition))); }"
        )
        .replace("#include <dithering_fragment>", "#include <dithering_fragment>\n gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.4,0.85,1.0)*2.2, ldEdge);");
    };
    suitMat.customProgramCacheKey = () => "ld-suit";
    // o visor se materializa e se desfaz junto com o traje
    const materialize = (m: THREE.Material, key: string) => {
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uMat = uMat;
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vLdLocal;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLdLocal = position;");
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", `#include <common>\nvarying vec3 vLdLocal; uniform float uMat;\n${NOISE_GLSL}`)
          .replace(
            "#include <clipping_planes_fragment>",
            "#include <clipping_planes_fragment>\n float ldDn = ldNoise(vLdLocal*8.5+3.0)*0.75 + ldNoise(vLdLocal*22.0)*0.25; float ldTh = uMat*1.1; if (ldDn > ldTh) discard; float ldEdge = smoothstep(ldTh-0.09, ldTh, ldDn);"
          )
          .replace("#include <dithering_fragment>", "#include <dithering_fragment>\n gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.4,0.85,1.0)*2.2, ldEdge);");
      };
      m.customProgramCacheKey = () => key;
    };
    visorMat = new THREE.MeshPhongMaterial({ color: 0x05070b, specular: 0xffffff, shininess: 300, envMap: envSky.texture, reflectivity: 0.72, combine: THREE.MixOperation });
    materialize(visorMat, "ld-visor");
    const skinned = (g: THREE.BufferGeometry, m: THREE.Material) => {
      const sm = new THREE.SkinnedMesh(g, m);
      sm.frustumCulled = false;
      return sm;
    };
    const suit = skinned(mk(suitIdx), suitMat);
    const visor = skinned(mk(visorIdx), visorMat);
    suit.add(rig.bones[0]);
    root.add(suit, visor);
    root.updateMatrixWorld(true);
    suit.bind(rig.skeleton);
    visor.bind(rig.skeleton, suit.bindMatrix);
    suitMats.push(suitMat, visorMat);
    for (const m of meshes) {
      (m.material as THREE.Material).dispose();
      m.geometry.dispose();
    }
    if (typeof location !== "undefined" && location.search.includes("ld-debug")) {
      const bb = geo.boundingBox!;
      console.debug("[ld] U", U.toFixed(4), "center", center.toArray().map((x) => x.toFixed(3)), "k", k.toFixed(3), "bbox pós", bb.min.toArray().map((x) => x.toFixed(2)), bb.max.toArray().map((x) => x.toFixed(2)));
      console.debug("[ld] capacete local", helmLocal.toArray().map((x) => x.toFixed(3)), "tris visor/traje", visorIdx.length / 3, suitIdx.length / 3);
    }
  };

  // pose por quadro: direções-alvo dos ossos, misturadas por tomada, com flutuação
  const qTmp = new THREE.Quaternion(), qAcc: Record<string, THREE.Quaternion> = {};
  const tgt = new THREE.Vector3(), rest = new THREE.Vector3();
  const pose = (p: number, t: number) => {
    if (!rig) return;
    const wB = smoothstep(0.36, 0.42, p) * (1 - smoothstep(0.7, 0.75, p));
    const wC = smoothstep(0.7, 0.75, p);
    const wA = 1 - wB - wC;
    const blend = (key: keyof Pose, side: 1 | -1, ph: number, amp: number) => {
      tgt.set(0, 0, 0);
      for (const [P, w] of [[POSE_A, wA], [POSE_B, wB], [POSE_C, wC]] as [Pose, number][]) {
        if (w <= 0) continue;
        tgt.x += P[key][0] * side * w;
        tgt.y += P[key][1] * w;
        tgt.z += P[key][2] * w;
      }
      // flutuação: cada articulação respira num ritmo próprio
      tgt.x += amp * Math.sin(t * 0.7 + ph) * side;
      tgt.y += amp * 0.9 * Math.sin(t * 0.9 + ph * 1.7);
      tgt.z += amp * 1.1 * Math.sin(t * 0.55 + ph * 2.3);
      return tgt.normalize();
    };
    const apply = (name: string, parent: string, target: THREE.Vector3) => {
      const bone = rig!.byName[name];
      rest.copy(rig!.restDir[name]);
      qTmp.setFromUnitVectors(rest, target); // rotação no espaço do modelo
      const q = qAcc[name] ?? (qAcc[name] = new THREE.Quaternion());
      q.copy(qTmp);
      bone.quaternion.copy(qAcc[parent]).invert().multiply(qTmp);
    };
    // tronco e cabeça: oscilação leve
    const hips = rig.byName.hips;
    hips.rotation.set(0.03 * Math.sin(t * 0.5), 0, 0.02 * Math.sin(t * 0.37));
    (qAcc.hips ?? (qAcc.hips = new THREE.Quaternion())).copy(hips.quaternion);
    rig.byName.spine.rotation.set(0.03 * Math.sin(t * 0.5 + 1), 0, 0);
    (qAcc.spine ?? (qAcc.spine = new THREE.Quaternion())).multiplyQuaternions(qAcc.hips, rig.byName.spine.quaternion);
    rig.byName.chest.rotation.set(-0.05 + 0.03 * Math.sin(t * 0.6 + 2), 0.04 * Math.sin(t * 0.3), 0);
    (qAcc.chest ?? (qAcc.chest = new THREE.Quaternion())).multiplyQuaternions(qAcc.spine, rig.byName.chest.quaternion);
    rig.byName.head.rotation.set(0.04 * Math.sin(t * 0.45 + 0.5), 0.1 * Math.sin(t * 0.33 + 1.2), 0.03 * Math.sin(t * 0.4));
    for (const side of [1, -1] as const) {
      const s = side === 1 ? "L" : "R";
      const ph = side === 1 ? 0 : 1.9;
      apply(`upperArm${s}`, "chest", blend("upperArm", side, ph, 0.06));
      apply(`foreArm${s}`, `upperArm${s}`, blend("foreArm", side, ph + 0.7, 0.07));
      apply(`hand${s}`, `foreArm${s}`, blend("hand", side, ph + 1.1, 0.05));
      apply(`thigh${s}`, "hips", blend("thigh", side, ph + 2.1, 0.05));
      apply(`shin${s}`, `thigh${s}`, blend("shin", side, ph + 2.9, 0.07));
      rig.byName[`foot${s}`].rotation.set(0.1 * Math.sin(t * 0.8 + ph), 0, 0);
    }
  };

  // no cubo de reflexo só o fundo é desenhado
  const setEnvVisibility = (bgOnly: boolean) => {
    root.visible = !bgOnly;
    glint.visible = !bgOnly;
    dust.visible = !bgOnly;
    jets.forEach((j) => (j.mesh.visible = !bgOnly));
  };
  const renderEnv = (rt: THREE.WebGLCubeRenderTarget, prog: number, pos: THREE.Vector3) => {
    const prevProg = bgUniforms.uProg.value;
    bgUniforms.uProg.value = prog;
    bgUniforms.uEnv.value = 1;
    setEnvVisibility(true);
    cubeCam.renderTarget = rt;
    cubeCam.position.copy(pos);
    cubeCam.update(renderer, scene);
    setEnvVisibility(false);
    bgUniforms.uProg.value = prevProg;
    bgUniforms.uEnv.value = 0;
  };
  let warmed = false;
  let envDirty = false;

  const camPos = new THREE.Vector3(), helmW = new THREE.Vector3(), L = new THREE.Vector3(), V = new THREE.Vector3(), hn = new THREE.Vector3(), fwdW = new THREE.Vector3();
  const jo = new THREE.Vector3(), jd = new THREE.Vector3(), jn = new THREE.Vector3(), jx = new THREE.Vector3(), jy = new THREE.Vector3();

  const api: OrbitScene = {
    async load(calm) {
      // 1) modelo + mapas do traje (download em paralelo; montagem e uploads em pausas)
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const [gltf, bump, orm] = await Promise.all([
        loader.loadAsync(ASSETS + "emu.glb"),
        loadBitmap(ASSETS + "emu-bump.webp"),
        loadBitmap(ASSETS + "emu-orm.webp"),
      ]);
      const maps = { bump: bitmapTexture(bump, false), orm: bitmapTexture(orm, false) };
      await calm();
      let t0 = performance.now();
      await configureSuit(gltf.scene, maps, calm);
      lap("configureSuit (em fatias)", t0);
      const baseMap = (suitMats[0] as THREE.MeshPhysicalMaterial | undefined)?.map;
      for (const tex of [maps.bump, maps.orm, baseMap]) {
        if (!tex) continue;
        await calm();
        t0 = performance.now();
        renderer.initTexture(tex);
        lap("initTexture", t0);
      }

      // 2) Terra: três texturas, uma por vez, cada upload numa pausa
      const earth: (keyof typeof bgUniforms)[] = ["uDay", "uNight", "uClouds"];
      const files = { uDay: "earth-day.jpg", uNight: "earth-night.jpg", uClouds: "earth-clouds.jpg" } as const;
      void (async () => {
        let n = 0;
        for (const name of earth) {
          try {
            const bmp = await loadBitmap(ASSETS + files[name as keyof typeof files]);
            const tex = bitmapTexture(bmp, false);
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            await calm();
            renderer.initTexture(tex);
            (bgUniforms[name] as { value: THREE.Texture | null }).value = tex;
            if (++n === 3) {
              bgUniforms.uHasTex.value = 1;
              // reflexo do visor com a Terra de verdade: refeito no próximo quadro,
              // depois que os programas do cubo já existem (ver `warm`)
              envDirty = true;
            }
          } catch {
            /* sem textura: fica o planeta procedural */
          }
        }
      })();
    },

    async warm(calm) {
      await calm();
      // compila tudo em paralelo (KHR_parallel_shader_compile) sem segurar a thread principal
      let t0 = performance.now();
      await renderer.compileAsync(scene, camera);
      lap("compileAsync", t0);
      await calm();
      // o fundo tem outra variante de programa para o alvo cúbico (espaço de cor
      // linear, sem tone mapping): compilada em paralelo também — na primeira
      // renderização do cubo ela era criada de forma síncrona (~250ms travados)
      t0 = performance.now();
      setEnvVisibility(true);
      renderer.setRenderTarget(envSky, 0);
      await renderer.compileAsync(scene, cubeCam.children[0] as THREE.Camera);
      renderer.setRenderTarget(null);
      setEnvVisibility(false);
      lap("compileAsync (cubo)", t0);
      await calm();
      // reflexos do visor: céu (com o planeta procedural, por enquanto) e treliça
      t0 = performance.now();
      renderEnv(envSky, 0.2, new THREE.Vector3(0, 0.6, 0));
      renderEnv(envLat, 0.55, new THREE.Vector3(0, 0, 0));
      lap("renderEnv×2", t0);
      warmed = true;
      await calm();
      t0 = performance.now();
      // aquecimento: um quadro para o driver terminar o pipeline (inclui o mapa de
      // sombra). Sem mexer no tamanho do canvas: realocar o buffer com MSAA custa ~80ms
      api.render({ prog: 0.2, time: 0, rot: { x: 0, y: 0 }, mouse: { x: 0, y: 0 } });
      lap("aquecimento", t0);
    },

    setSize(w, h) {
      // trocar o tamanho do canvas realoca o buffer (com MSAA, ~100ms): só quando muda
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      renderer.setSize(Math.max(1, w), Math.max(1, h), false);
      aspect = w / Math.max(1, h);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    },

    render(f) {
      if (envDirty && warmed) {
        envDirty = false;
        renderEnv(envSky, 0.2, new THREE.Vector3(0, 0.6, 0));
      }
      choreo(f, aspect, helmLocal, ch);
      // câmera
      camera.position.copy(ch.ro);
      m4.makeBasis(ch.rt, ch.up, ch.fw.clone().negate());
      camera.quaternion.setFromRotationMatrix(m4);
      camera.updateMatrixWorld();
      bgUniforms.uTime.value = f.time;
      bgUniforms.uProg.value = f.prog;
      // traje
      root.position.copy(ch.aPos);
      m4.setFromMatrix3(ch.aRot.clone().transpose());
      root.quaternion.setFromRotationMatrix(m4);
      pose(f.prog, f.time);
      uMat.value = ch.mat;
      dustMat.opacity = (1 - ch.mat) * 0.9;
      dust.visible = ch.mat < 0.995;
      dust.rotation.y = f.time * 0.15;
      root.updateMatrixWorld(true);
      // reflexo do visor: treliça na tomada B
      const b = ch.shotB;
      if (visorMat) visorMat.envMap = b > 0.5 ? envLat.texture : envSky.texture;
      // jatos: cada pluma gira em torno do próprio eixo para encarar a câmera
      (jetMat.uniforms.uJet as { value: number }).value = ch.jet;
      (jetMat.uniforms.uT as { value: number }).value = f.time;
      camera.getWorldPosition(camPos);
      for (const j of jets) {
        j.mesh.visible = ch.jet > 0.01;
        if (!j.mesh.visible) continue;
        jo.copy(j.o);
        root.localToWorld(jo);
        jd.copy(j.d).applyQuaternion(root.quaternion).normalize();
        V.subVectors(camPos, jo).normalize();
        jn.copy(V).addScaledVector(jd, -V.dot(jd)).normalize();
        jy.copy(jd).negate(); // o plano aponta -y ao longo da pluma
        jx.crossVectors(jy, jn).normalize();
        m4.makeBasis(jx, jy, jn);
        j.mesh.position.copy(jo);
        j.mesh.quaternion.setFromRotationMatrix(m4);
      }
      // brilho de lente: ponto do visor que reflete o sol para a câmera
      helmW.copy(helmLocal);
      root.localToWorld(helmW);
      L.copy(sun.position).normalize();
      V.subVectors(camPos, helmW).normalize();
      hn.addVectors(L, V).normalize();
      fwdW.set(0, 0, 1).applyQuaternion(root.quaternion);
      const facing = smoothstep(0.3, 0.55, hn.dot(fwdW)) * ch.mat * (1 - b * 0.6);
      glint.position.copy(helmW).addScaledVector(hn, VISOR_R);
      (glint.material as THREE.SpriteMaterial).opacity = facing;
      const gs = 0.75 + 0.25 * facing + 0.04 * Math.sin(f.time * 6.3);
      glint.scale.set(gs * 1.5, gs * 0.75, 1);
      glint.visible = facing > 0.01;
      // luz: na treliça (tomada B) o sol some e a contraluz fria domina
      sun.intensity = mix(2.6, 1.0, b);
      fill.intensity = mix(0.9, 0.8, b);
      rim.intensity = mix(2.0, 3.2, b);
      hemi.intensity = mix(0.9, 0.7, b);
      renderer.render(scene, camera);
    },

    dispose() {
      renderer.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      jetGeo.dispose();
      jetMat.dispose();
      (glint.material as THREE.SpriteMaterial).map?.dispose();
      glint.material.dispose();
      envSky.dispose();
      envLat.dispose();
      root.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      for (const m of suitMats) {
        const pm = m as THREE.MeshPhysicalMaterial;
        [pm.map, pm.roughnessMap, pm.bumpMap].forEach((t) => t?.dispose());
        m.dispose();
      }
      for (const k of ["uDay", "uNight", "uClouds"] as const) bgUniforms[k].value?.dispose();
      renderer.forceContextLoss();
    },
  };
  return api;
}
