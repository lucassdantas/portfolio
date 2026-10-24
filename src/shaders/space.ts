// Fundo da OrbitSection: céu, planeta, treliça e as duas transições, guiados
// pela rolagem. O astronauta em si é um modelo 3D (traje Z-2 da NASA) desenhado
// pelo three.js em `src/lib/orbitScene.ts`; este shader só pinta o que está
// atrás dele, num triângulo de tela cheia, com a MESMA câmera (posição e base
// vêm por uniform, calculadas uma vez em TS — nada de duplicar a coreografia).
//
// `uProg` (0..1) é o progresso da rolagem:
//   A  0.00–0.40  espaço: céu azul-noite, estrelas e a Terra embaixo
//   ~  0.34–0.46  transição 1: túnel neon de anéis hexagonais
//   B  0.40–0.72  treliça escura
//   ~  0.68–0.76  transição 2: onda de choque cromática
//   C  0.72–1.00  espaço de novo; o céu se dissolve e devolve as partículas do site
//
// Saída com alpha pré-multiplicado: nas pontas (bgA → 0) o canvas fica
// transparente e as partículas do site aparecem por trás.

export const SPACE_VERTEX_SRC = "void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }";

/** Ruído 3D compartilhado com o efeito de materialização do traje (orbitScene). */
export const NOISE_GLSL = [
  "float ldHash3(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }",
  "float ldNoise(vec3 p){",
  "  vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);",
  "  float a = mix(ldHash3(i), ldHash3(i+vec3(1.0,0.0,0.0)), f.x);",
  "  float b = mix(ldHash3(i+vec3(0.0,1.0,0.0)), ldHash3(i+vec3(1.0,1.0,0.0)), f.x);",
  "  float c = mix(ldHash3(i+vec3(0.0,0.0,1.0)), ldHash3(i+vec3(1.0,0.0,1.0)), f.x);",
  "  float d = mix(ldHash3(i+vec3(0.0,1.0,1.0)), ldHash3(i+vec3(1.0,1.0,1.0)), f.x);",
  "  return mix(mix(a,b,f.y), mix(c,d,f.y), f.z);",
  "}",
].join("\n");

export function buildSpaceSrc(): string {
  return [
    "uniform vec2 uRes; uniform float uTime; uniform float uProg;",
    "uniform vec3 uCamPos; uniform vec3 uCamFw; uniform vec3 uCamRt; uniform vec3 uCamUp;",
    // texturas equirretangulares da Terra (NASA): dia, luzes noturnas, nuvens. uHasTex=0 até carregarem.
    "uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uClouds; uniform float uHasTex;",
    "const vec3 BLUE = vec3(0.114,0.580,0.890);",
    "const vec3 CYAN = vec3(0.40,0.85,1.0);",
    "float gLat;",
    "mat3 rotX(float a){ float s=sin(a),c=cos(a); return mat3(1.,0.,0., 0.,c,-s, 0.,s,c); }",
    "float hash1(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }",
    NOISE_GLSL,
    "float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a*ldNoise(p); p = p*2.03 + 1.7; a *= 0.5; } return s; }",
    "float sdRBox(vec3 p, vec3 b, float r){ vec3 q = abs(p)-b+r; return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r; }",

    // céu das tomadas A e C: azul-noite, nebulosa, estrelas, Terra
    "vec3 sky(vec3 ro, vec3 rd){",
    "  vec3 col = mix(vec3(0.002,0.005,0.014), vec3(0.012,0.04,0.10), smoothstep(-0.7,0.8,rd.y));",
    "  col += BLUE*pow(fbm(rd*1.7+vec3(0.0,0.0,uTime*0.006)), 2.6)*0.55;",
    "  col += CYAN*pow(fbm(rd*3.3+5.0), 4.0)*0.25;",
    "  vec2 sp = vec2(atan(rd.z, rd.x), asin(clamp(rd.y,-1.0,1.0)));",
    "  vec2 g1 = sp*110.0; float h1 = hash1(floor(g1));",
    "  col += vec3(0.8,0.9,1.0) * step(0.972,h1) * smoothstep(0.16,0.0,length(fract(g1)-0.5)) * (0.5+0.5*sin(uTime*1.7+h1*50.0)) * 1.4;",
    "  vec3 pc = vec3(0.0,-9.5,-5.0); float pr = 8.0;",
    "  vec3 oc = ro-pc; float b = dot(oc,rd); float c = dot(oc,oc)-pr*pr; float h = b*b-c;",
    "  if (b < 0.0 && h <= 0.0) {",
    "    float closest = sqrt(max(dot(oc,oc)-b*b, 0.0));",
    "    float atm = smoothstep(pr+1.4, pr, closest);",
    "    col += (CYAN*0.5 + BLUE*0.55)*atm*atm;",
    "  }",
    "  if (h > 0.0 && b < 0.0) {",
    "    vec3 pp = ro + rd*(-b-sqrt(h)); vec3 pn = normalize(pp-pc);",
    "    vec3 L = normalize(vec3(0.6,0.7,0.5));",
    "    float ndl = dot(pn,L);",
    "    float rim = pow(1.0-max(dot(pn,-rd),0.0), 2.2);",
    "    vec3 surf;",
    "    if (uHasTex > 0.5) {",
    // mapeamento equirretangular do normal do planeta; a Terra gira devagar
    "      vec3 tn = rotX(-1.25) * pn;",
    "      vec2 uv = vec2(atan(tn.z, tn.x)/6.2832 + 0.72 + uTime*0.0012, 0.5 - asin(clamp(tn.y,-1.0,1.0))/3.1416);",
    "      vec3 day = pow(texture2D(uDay, uv).rgb, vec3(2.2));",
    "      vec3 night = pow(texture2D(uNight, uv).rgb, vec3(2.2));",
    "      vec2 cuv = uv + vec2(uTime*0.0007, 0.0);",
    "      float cl = texture2D(uClouds, cuv).r;",
    "      float clShadow = texture2D(uClouds, cuv + vec2(0.005, -0.004)).r;",
    "      float sun = smoothstep(-0.05, 0.25, ndl);",
    "      float ocean = smoothstep(0.0, 0.05, day.b - max(day.r, day.g));",
    "      vec3 ground = day * (0.012 + 1.25*sun) * (1.0 - 0.5*clShadow);",
    "      float spec = pow(max(dot(reflect(-L,pn), -rd), 0.0), 80.0) * ocean * sun;",
    "      vec3 cloudCol = vec3(1.0,1.0,1.0) * (0.02 + 1.15*sun);",
    "      vec3 lights = night * vec3(1.0,0.78,0.5) * (1.0 - sun) * 1.6 * (1.0 - 0.85*cl);",
    "      surf = mix(ground + vec3(1.0,0.96,0.88)*spec*0.9, cloudCol, cl) + lights;",
    "    } else {",
    "      float pd = max(ndl*0.8+0.2, 0.0);",
    "      vec3 ocean = mix(vec3(0.01,0.04,0.13), vec3(0.04,0.20,0.48), fbm(pn*4.5));",
    "      float clouds = smoothstep(0.52,0.72, fbm(pn*7.0+vec3(uTime*0.01,0.0,0.0)));",
    "      surf = mix(ocean, vec3(0.85,0.92,1.0), clouds*0.7) * (0.06+pd*1.0);",
    "    }",
    "    col = surf + (CYAN*0.55 + BLUE*0.35)*pow(rim,1.6)*(0.25 + 0.75*smoothstep(-0.2,0.4,ndl));",
    "  }",
    "  return col;",
    "}",

    // tomada B: túnel de treliça escura ao longo do eixo z, com brilhos nos nós
    "float latMap(vec3 p){",
    "  vec3 c = floor(p); vec3 q = fract(p)-0.5;",
    "  float h = ldHash3(c);",
    "  float bx = max(abs(q.y),abs(q.z))-0.028;",
    "  float by = max(abs(q.x),abs(q.z))-0.028;",
    "  float bz = max(abs(q.x),abs(q.y))-0.022;",
    "  float d = min(by, bz); if (h > 0.35) d = min(d, bx);",
    "  float gl = 1e5; if (h > 0.86) gl = sdRBox(q, vec3(0.05), 0.01);",
    "  gLat = gl < d ? 1.0 : 0.0; d = min(d, gl);",
    "  return max(d, 1.5-length(p.xy));",
    "}",
    "vec3 lattice(vec3 ro, vec3 rd){",
    "  float t = 0.0; vec3 col = vec3(0.0); float glow = 0.0;",
    "  for (int i = 0; i < 56; i++) {",
    "    vec3 p = ro+rd*t; float d = latMap(p);",
    "    glow += gLat * 0.012/(1.0+d*d*900.0);",
    "    if (d < 0.002) {",
    "      float fog = exp(-t*0.16);",
    "      vec3 c = floor(p);",
    "      if (gLat > 0.5) { col = mix(vec3(1.0), CYAN, ldHash3(c+3.0)) * 2.4 * fog; }",
    "      else {",
    "        float edge = pow(abs(sin((p.x+p.y+p.z)*3.0)), 8.0);",
    "        col = (vec3(0.07,0.085,0.11) + BLUE*0.08*edge) * fog + vec3(0.6,0.8,1.0)*0.25*fog*step(0.93, ldHash3(c+7.0));",
    "      }",
    "      break;",
    "    }",
    "    t += d*0.8; if (t > 22.0) break;",
    "  }",
    "  return col + CYAN*glow;",
    "}",

    // transição 1: túnel neon de anéis hexagonais, com separação de cor por canal
    "float ringLayer(vec2 uv, float t, float k){",
    "  float a = atan(uv.y, uv.x) + t*0.6; float r = length(uv)*k;",
    "  float hex = cos(0.5236) / cos(mod(a, 1.0472) - 0.5236);",
    "  float z = 0.32 / max(r*hex, 0.001);",
    "  float rings = pow(1.0 - abs(fract(z*1.4 - t*3.0)-0.5)*2.0, 70.0);",
    "  float spokes = pow(1.0 - abs(fract(a/1.0472)-0.5)*2.0, 140.0) * smoothstep(0.0, 0.4, r);",
    "  return (rings + spokes*0.45) * smoothstep(0.04, 0.35, r) * exp(-z*0.18);",
    "}",
    "vec3 wormhole(vec2 uv, float t){",
    "  vec3 c = vec3(ringLayer(uv,t,1.02), ringLayer(uv,t,1.0), ringLayer(uv,t,0.98));",
    "  vec3 col = vec3(0.004,0.012,0.035) + c * mix(BLUE, CYAN, 0.45) * 1.5 + c.g*vec3(0.85,0.92,1.0)*0.25;",
    "  col += mix(BLUE, CYAN, 0.6) * exp(-length(uv)*11.0) * 0.9;",
    "  return col;",
    "}",

    "void main(){",
    "  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;",
    "  float p = uProg;",
    "  float w1 = smoothstep(0.34,0.40,p) * (1.0-smoothstep(0.40,0.46,p));",
    "  float w2 = smoothstep(0.68,0.72,p) * (1.0-smoothstep(0.72,0.76,p));",
    "  float shot = p < 0.40 ? 0.0 : (p < 0.72 ? 1.0 : 2.0);",
    "  vec3 ro = uCamPos;",
    "  vec3 rd = normalize(uCamFw*1.6 + uCamRt*uv.x + uCamUp*uv.y);",
    // fundo: céu (A, C) ou treliça (B); entra e sai aos poucos nas pontas
    "  float bgA = smoothstep(0.02,0.18,p) * (1.0-smoothstep(0.88,0.99,p));",
    "  vec3 bg = shot > 0.5 && shot < 1.5 ? lattice(ro, rd) : sky(ro, rd);",
    "  vec3 col = bg*bgA; float alpha = bgA;",
    // transições
    "  if (w1 > 0.0) {",
    "    vec3 wc = wormhole(uv, uTime + p*40.0);",
    "    col = mix(col, wc, smoothstep(0.0,0.6,w1)); alpha = max(alpha, smoothstep(0.0,0.4,w1));",
    "    col += vec3(0.6,0.85,1.0) * pow(w1, 60.0) * 0.5;",
    "  }",
    "  if (w2 > 0.0) {",
    "    float ph = smoothstep(0.68, 0.76, p); float r = length(uv);",
    "    vec3 ring = vec3(smoothstep(0.035,0.0,abs(r-ph*1.5+0.02)), smoothstep(0.035,0.0,abs(r-ph*1.5)), smoothstep(0.035,0.0,abs(r-ph*1.5-0.02)));",
    "    col += (ring*vec3(0.6,0.9,1.4)*2.4 + vec3(0.6,0.85,1.0)*pow(w2,60.0)*0.5) * w2;",
    "    alpha = max(alpha, w2*0.9);",
    "  }",
    // halo de lente sutil (some quando o céu some)
    "  float lr = length(uv*vec2(0.9,1.0));",
    "  vec3 rainbow = 0.5+0.5*cos(6.2832*(lr*1.4 + vec3(0.0,0.33,0.67)));",
    "  col += rainbow * exp(-pow((lr-0.78)*7.0, 2.0)) * 0.045 * bgA;",

    "  col = col / max(alpha, 0.001);",
    "  col = col*(2.51*col+0.03)/(col*(2.43*col+0.59)+0.14);",
    "  col = pow(clamp(col,0.0,1.0), vec3(0.92));",
    "  float vig = 0.5 + 0.5*smoothstep(1.4, 0.2, length(uv*vec2(0.85,1.1)));",
    "  col *= mix(1.0, vig, bgA);",
    "  col += (hash1(gl_FragCoord.xy + fract(uTime)*91.0) - 0.5)*0.012*alpha;",
    "  gl_FragColor = vec4(col*alpha, alpha);",
    "}",
  ].join("\n");
}
