// Cena 3D da OrbitSection (three.js), carregada só quando a seção se aproxima.
//
// - Astronauta: traje Z-2 da NASA (NASA 3D Resources, domínio público; a
//   insígnia e a bandeira foram apagadas da textura — o uso da insígnia é
//   restrito). `public/assets/space/z2.glb` (malha + cor base) e mapas
//   separados: relevo (bump), rugosidade/metal (ORM) e cor especular.
// - Fundo: shader `src/shaders/space.ts` num triângulo de tela cheia, com a
//   mesma câmera (posição e base via uniform).
// - Coreografia: `choreo()` calcula câmera, posição/rotação do traje,
//   materialização (`mat`) e jatos a partir do progresso da rolagem; são as
//   mesmas fórmulas do shader antigo, agora em TS.
// - Materialização: `onBeforeCompile` no material do traje descarta fragmentos
//   por ruído 3D (borda ciano) — o traje nasce da poeira e se desfaz nas
//   transições, como antes. Poeira em volta: nuvem de pontos aditivos.
// - Compilação: `renderer.compileAsync` (paralela, sem travar) e um desenho de
//   aquecimento de 2×2 px antes da cena aparecer.
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

/** Executa `fn` numa pausa da rolagem (fila da OrbitSection). */
export type Calm = () => Promise<void>;

export type OrbitScene = {
  /** Modelo, mapas e texturas da Terra; resolve quando o traje pode ser desenhado. */
  load(calm: Calm): Promise<void>;
  /** Compila os shaders em paralelo e faz um desenho de aquecimento. */
  warm(calm: Calm): Promise<void>;
  /** Tamanho do buffer em pixels do dispositivo (o CSS continua 100%). */
  setSize(w: number, h: number): void;
  render(f: OrbitFrameInput): void;
  dispose(): void;
};

const ASSETS = "/assets/space/";
const SUIT_HEIGHT = 2.05;
const S = 0.62; // escala do astronauta antigo: a coreografia foi escrita nela
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
  /** matriz mundo→local (como no shader); o modelo usa a transposta */
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
      .copy(rotZ(Math.sin(t * 0.23) * 0.1))
      .multiply(rotX(f.rot.y + Math.sin(t * 0.31) * 0.07))
      .multiply(rotY(mix(2.4, 0.1, smoothstep(0.05, 0.8, lp)) + f.rot.x));
    camD = mix(8.0, 3.9, smoothstep(0, 0.85, lp)) * (1 + 0.55 * (1 - wide));
    camA = mix(-0.55, 0.15, lp);
    camH = mix(0.9, 0.05, lp);
    target.set(-0.72 * wide, 0.35 * (1 - wide), 0);
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
    out.aRot
      .copy(rotZ(-0.8 + Math.sin(t * 0.4) * 0.05))
      .multiply(rotX(-0.4))
      .multiply(rotY(1.3 + lp * 0.4 + f.rot.x));
    camD = 5.2;
    camA = -0.2;
    camH = 0.5;
    target.set(0, 0.2, -1);
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

export function createOrbitScene(canvas: HTMLCanvasElement, opts: { isTouch: boolean }): OrbitScene | null {
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
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = !opts.isTouch;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(2 * Math.atan(0.5 / 1.6) * (180 / Math.PI), 1, 0.05, 120);

  // fundo: triângulo de tela cheia, desenhado primeiro, misturado por cima do canvas transparente
  const bgUniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uProg: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uCamFw: { value: new THREE.Vector3(0, 0, -1) },
    uCamRt: { value: new THREE.Vector3(1, 0, 0) },
    uCamUp: { value: new THREE.Vector3(0, 1, 0) },
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
  scene.add(bg);

  // luzes: sol quente (com sombra), brilho azul da Terra por baixo, contraluz fria
  // e um hemisfério (céu escuro em cima, Terra azul embaixo). Sem mapa de
  // ambiente de propósito: o PMREM do three compila um shader pesado de forma
  // síncrona (~400ms travados na thread principal) — reflexos vêm das luzes.
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
  sun.position.set(6, 7, 5);
  const fill = new THREE.DirectionalLight(0x3f9cff, 1.6);
  fill.position.set(0.5, -8, 3);
  const rim = new THREE.DirectionalLight(0xbfe4ff, 2.0);
  rim.position.set(-4, 2, -8);
  const ambient = new THREE.AmbientLight(0x2a3d5c, 0.8);
  const hemi = new THREE.HemisphereLight(0x22324e, 0x2f86d9, 1.4);
  scene.add(sun, fill, rim, ambient, hemi);

  // o traje: grupo posicionado pela coreografia; o modelo entra dentro, centrado e na escala certa
  const root = new THREE.Group();
  scene.add(root);
  sun.target = root;
  fill.target = root;
  rim.target = root;
  if (!opts.isTouch) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -1.6;
    sun.shadow.camera.right = sun.shadow.camera.top = 1.6;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 3;
  }

  // materialização: limiar compartilhado pelo material do traje, poeira e jatos
  const uMat = { value: 1 };
  let suitMaterial: THREE.MeshPhysicalMaterial | null = null;

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

  // jatos (tomada C): dois cones aditivos atrás das pernas — apagam ao longo do
  // comprimento e nas bordas (normal de lado para a câmera), com tremor no tempo
  const jetMat = new THREE.ShaderMaterial({
    uniforms: { uJet: { value: 0 }, uT: { value: 0 } },
    vertexShader:
      "varying float vT; varying vec3 vN; void main(){ vT = uv.y; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform float uJet; uniform float uT; varying float vT; varying vec3 vN;\n" +
      "void main(){ float edge = abs(normalize(vN).z); float flick = 0.85 + 0.15*sin(uT*37.0 + vT*20.0);\n" +
      "  float a = uJet * pow(1.0 - vT, 2.0) * edge * edge * flick * 0.85;\n" +
      "  gl_FragColor = vec4(mix(vec3(0.114,0.58,0.89), vec3(0.55,0.9,1.0), vT*0.6 + edge*0.4) * a, a); }",
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    side: THREE.DoubleSide,
  });
  const jetGeo = new THREE.ConeGeometry(0.1, 1.7, 18, 1, true);
  jetGeo.translate(0, -0.85, 0);
  jetGeo.rotateX(-0.55);
  for (const sx of [-1, 1]) {
    const jet = new THREE.Mesh(jetGeo, jetMat);
    jet.position.set(0.14 * sx, -0.25, -0.5);
    jet.frustumCulled = false;
    root.add(jet);
  }

  const helmLocal = new THREE.Vector3(0, 0.99 * S, 0.03 * S);
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

  const configureSuit = (gltf: THREE.Group, maps: { bump: THREE.Texture; orm: THREE.Texture; spec: THREE.Texture }) => {
    const box = new THREE.Box3().setFromObject(gltf);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = SUIT_HEIGHT / Math.max(size.y, 1e-3);
    gltf.scale.setScalar(k);
    gltf.position.set(-center.x * k, -center.y * k, -center.z * k);
    // cabeça (para a câmera da tomada B): ~12% abaixo do topo
    helmLocal.set(0, SUIT_HEIGHT / 2 - 0.26, 0.02);
    gltf.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const old = o.material as THREE.MeshStandardMaterial;
      const m = new THREE.MeshPhysicalMaterial({
        map: old.map,
        roughness: 1,
        metalness: 1,
        roughnessMap: maps.orm,
        metalnessMap: maps.orm,
        bumpMap: maps.bump,
        bumpScale: 0.9,
        specularIntensity: 1,
        specularColorMap: maps.spec,
        side: THREE.DoubleSide,
      });
      if (m.map) m.map.anisotropy = 4;
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
      m.customProgramCacheKey = () => "ld-suit";
      o.material = m;
      old.dispose();
      suitMaterial = m;
    });
    root.add(gltf);
  };

  const api: OrbitScene = {
    async load(calm) {
      // 1) modelo + mapas do traje (download em paralelo, upload numa pausa cada)
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const [gltf, bump, orm, spec] = await Promise.all([
        loader.loadAsync(ASSETS + "z2.glb"),
        loadBitmap(ASSETS + "z2-bump.webp"),
        loadBitmap(ASSETS + "z2-orm.webp"),
        loadBitmap(ASSETS + "z2-spec.webp"),
      ]);
      const maps = { bump: bitmapTexture(bump, false), orm: bitmapTexture(orm, false), spec: bitmapTexture(spec, true) };
      await calm();
      configureSuit(gltf.scene, maps);
      for (const tex of [maps.bump, maps.orm, maps.spec, suitMaterial?.map]) {
        if (!tex) continue;
        await calm();
        renderer.initTexture(tex);
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
            if (++n === 3) bgUniforms.uHasTex.value = 1;
          } catch {
            /* sem textura: fica o planeta procedural */
          }
        }
      })();
    },

    async warm(calm) {
      await calm();
      // compila tudo em paralelo (KHR_parallel_shader_compile) sem segurar a thread principal
      await renderer.compileAsync(scene, camera);
      await calm();
      // aquecimento: um quadro minúsculo para o driver terminar o pipeline
      const w = canvas.width;
      const h = canvas.height;
      renderer.setSize(4, 4, false);
      api.render({ prog: 0.2, time: 0, rot: { x: 0, y: 0 }, mouse: { x: 0, y: 0 } });
      renderer.setSize(Math.max(1, w), Math.max(1, h), false);
    },

    setSize(w, h) {
      renderer.setSize(Math.max(1, w), Math.max(1, h), false);
      aspect = w / Math.max(1, h);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      bgUniforms.uRes.value.set(w, h);
    },

    render(f) {
      choreo(f, aspect, helmLocal, ch);
      // câmera
      camera.position.copy(ch.ro);
      m4.makeBasis(ch.rt, ch.up, ch.fw.clone().negate());
      camera.quaternion.setFromRotationMatrix(m4);
      bgUniforms.uCamPos.value.copy(ch.ro);
      bgUniforms.uCamFw.value.copy(ch.fw);
      bgUniforms.uCamRt.value.copy(ch.rt);
      bgUniforms.uCamUp.value.copy(ch.up);
      bgUniforms.uTime.value = f.time;
      bgUniforms.uProg.value = f.prog;
      // traje
      root.position.copy(ch.aPos);
      m4.setFromMatrix3(ch.aRot.clone().transpose());
      root.quaternion.setFromRotationMatrix(m4);
      uMat.value = ch.mat;
      root.castShadow = ch.mat > 0.98;
      dustMat.opacity = (1 - ch.mat) * 0.9;
      dust.visible = ch.mat < 0.995;
      dust.rotation.y = f.time * 0.15;
      (jetMat.uniforms.uJet as { value: number }).value = ch.jet;
      (jetMat.uniforms.uT as { value: number }).value = f.time;
      // luz: na treliça (tomada B) o sol some e a contraluz fria domina
      const b = ch.shotB;
      sun.intensity = mix(3.2, 1.1, b);
      fill.intensity = mix(1.6, 1.0, b);
      rim.intensity = mix(2.0, 3.4, b);
      ambient.intensity = mix(0.8, 2.0, b);
      hemi.intensity = mix(1.4, 0.6, b);
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
      root.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.MeshPhysicalMaterial;
          [m.map, m.roughnessMap, m.bumpMap, m.specularColorMap].forEach((t) => t?.dispose());
          m.dispose();
        }
      });
      for (const k of ["uDay", "uNight", "uClouds"] as const) bgUniforms[k].value?.dispose();
      renderer.forceContextLoss();
    },
  };
  return api;
}
