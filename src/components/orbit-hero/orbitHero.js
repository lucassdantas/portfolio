/*!
 * OrbitHero — hero com scroll em três atos, feito só de partículas (WebGL puro).
 * Sem dependências, sem assets: este arquivo é tudo.
 *
 *   1. "Problema fora de órbita?"  planeta de partículas; um bug vermelho escapa da órbita
 *   2. scroll                       o planeta explode num tesserato 4D dentro de um túnel de quadrados
 *   3. "Eu vou buscar."             órbitas calmas; o bug é puxado de volta e fica dourado
 *
 * Uso:
 *   import { mountOrbitHero } from './orbit-hero.js';      // ou <script type="module">
 *   const hero = mountOrbitHero(document.getElementById('orbit-hero'), { texts: {...} });
 *   hero.setTexts({...});  // troca de idioma
 *   hero.destroy();        // ao desmontar
 *
 * Ajustes da integração no portfólio (só desempenho e estilo; a cena é a original):
 * - shaders compilados sem bloquear (KHR_parallel_shader_compile): a checagem de
 *   status só acontece quando o driver termina; até lá, nada é desenhado.
 * - o laço só roda com a seção perto da tela (IntersectionObserver) e a posição
 *   da seção é relida no máximo a cada 250ms, não a cada quadro.
 * - a resolução só cai, nunca sobe de volta: cada troca de tamanho realoca o
 *   buffer do canvas (subir e descer em sequência era uma travada a cada vez).
 * - onFrame({ p, w2 }) para a trilha sonora acompanhar o tesserato.
 * - seção ocupa 100% do pai, fontes do site, título em <h2>, título em 2 linhas,
 *   botão com canto de 3px (padrão do site).
 * - clique/toque: onda de choque no ponto do clique (anel que empurra e acende
 *   as partículas e volta em ~1s); no planeta, clicar perto do bug dá um tranco
 *   nele; no tesserato, um quarto de volta extra na 4ª dimensão + glitch de cor;
 *   nas órbitas calmas, a onda é suave. `onPulse({ act, bug })` avisa a trilha.
 */

function createOrbitHero(canvas, getProps) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) return null;

    const VS_BG = 'attribute vec2 aP;varying vec2 vUv;void main(){vUv=aP*0.5+0.5;gl_Position=vec4(aP,0.0,1.0);}';
    const FS_BG = [
      'precision mediump float;varying vec2 vUv;uniform vec3 uW;uniform vec2 uGlow;uniform float uAspect,uTime;',
      'void main(){vec2 q=vUv;vec2 c=(q-uGlow)*vec2(uAspect,1.0);float r=length(c);',
      ' vec3 a=vec3(0.006,0.01,0.03)+vec3(0.05,0.09,0.25)*exp(-r*r*2.2)*0.95;',
      ' vec3 b=vec3(0.012,0.004,0.025)+vec3(0.18,0.03,0.28)*exp(-r*r*1.4)*(0.35+0.15*sin(uTime*0.8));',
      ' vec3 d=mix(vec3(0.16,0.06,0.09),vec3(0.015,0.015,0.05),smoothstep(0.0,0.85,q.y))+vec3(0.35,0.16,0.08)*exp(-r*r*2.0)*0.6;',
      ' vec3 col=a*uW.x+b*uW.y+d*uW.z;',
      ' vec2 v=q-0.5;col*=1.0-dot(v,v)*0.9;',
      ' gl_FragColor=vec4(col,1.0);}'
    ].join('\n');

    const VS = [
      'attribute vec4 aR;attribute float aT;',
      'uniform float uTime,uP,uAspect,uPx,uF,uTravel,uTrip,uHue,uVel,uSpin,uGl,uBug,uBugPh;uniform vec4 uClk;uniform vec2 uMouse;uniform vec3 uCam,uOff,uOff3;uniform mat3 uView,uObj;',
      'varying vec3 vC;',
      '#define PI 3.14159265',
      '#define TAU 6.2831853',
      'mat2 r2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
      'vec3 pal(float t){return 0.5+0.5*cos(TAU*(t+vec3(0.0,0.33,0.67)+uHue));}',
      'vec3 sph(vec2 r){float z=r.x*2.0-1.0;float a=r.y*TAU;float s=sqrt(max(0.0,1.0-z*z));return vec3(s*cos(a),z,s*sin(a));}',

      'vec3 planet(vec4 r,float t,out vec3 col){',
      ' if(r.w<0.6){',
      '  vec3 p=sph(r.xy);',
      '  float n=sin(p.x*4.2+sin(p.y*3.1+1.3))*sin(p.z*3.7+p.y*2.4)+0.35*sin(p.x*9.0+p.z*7.0);',
      '  vec3 sun=normalize(vec3(0.9,0.45,0.7));',
      '  float l=clamp(dot(p,sun),0.0,1.0);',
      '  p.xz=r2(t*0.12)*p.xz;',
      '  float land=smoothstep(0.05,0.35,n);',
      '  col=mix(vec3(0.16,0.38,1.0),vec3(0.55,0.95,0.85),land);',
      '  col*=(0.07+1.25*pow(l,0.8))*2.4;',
      '  float rim=pow(1.0-abs(p.z),3.0);',
      '  col+=vec3(0.25,0.5,1.0)*rim*0.6;',
      '  return p*(1.0+0.012*land);',
      ' }',
      ' float rad=1.5+r.z*0.85;float a=r.y*TAU+t*(0.35/rad);',
      ' float band=smoothstep(0.0,0.08,abs(fract(r.z*3.0)-0.5));',
      ' vec3 p=vec3(cos(a)*rad,(r.x-0.5)*0.025,sin(a)*rad);',
      ' p.yz=r2(0.38)*p.yz;p.xy=r2(-0.32)*p.xy;',
      ' col=mix(vec3(0.62,0.55,1.0),vec3(0.45,0.8,1.0),r.z)*(0.22+0.3*band)*2.2;',
      ' return p;',
      '}',

      'vec3 tess(vec4 r,float t,out vec3 col){',
      ' if(r.w<0.45){',
      '  float e=floor(r.x*32.0);float b=floor(e/8.0);float m=mod(e,8.0);',
      '  vec3 o=vec3(mod(m,2.0),mod(floor(m/2.0),2.0),floor(m/4.0))*2.0-1.0;',
      '  float s=r.y*2.0-1.0;vec4 q;',
      '  if(b<0.5)q=vec4(s,o);else if(b<1.5)q=vec4(o.x,s,o.y,o.z);else if(b<2.5)q=vec4(o.x,o.y,s,o.z);else q=vec4(o,s);',
      '  q+=(vec4(r.z,fract(r.z*7.13),fract(r.z*13.7),fract(r.z*3.3))-0.5)*0.025;',
      '  float a1=t*0.33+uP*7.0+uSpin,a2=t*0.21+uP*4.0+uSpin*0.6,a3=t*0.27+uP*2.0+uSpin*0.35;',
      '  q.xw=r2(a1)*q.xw;q.yw=r2(a2)*q.yw;q.zw=r2(a3)*q.zw;q.xy=r2(t*0.07)*q.xy;',
      '  float k=2.7/(2.7-q.w);',
      '  float gj=step(0.72,fract(r.z*91.7+floor(t*24.0)*0.137))*uGl;',
      '  col=pal(q.w*0.22+t*0.05+0.55+uGl*0.5+gj*0.4)*(0.55+0.25*k)*2.0*(1.0+uGl*0.8);',
      '  return q.xyz*k*0.62;',
      ' }',
      ' float L=26.0;float layer=floor(r.x*44.0);',
      ' float z=mod(layer*(L/44.0)+uTravel,L)-L+4.0;',
      ' float u=r.y*4.0;float sd=floor(u);float f=fract(u)*2.0-1.0;',
      ' vec2 sq=sd<0.5?vec2(f,-1.0):sd<1.5?vec2(1.0,f):sd<2.5?vec2(-f,1.0):vec2(-1.0,-f);',
      ' sq*=2.9+0.15*sin(t*1.3+layer);sq=r2(z*0.11+t*0.18)*sq;',
      ' float fade=smoothstep(-L+4.0,-L+11.0,z)*(1.0-smoothstep(0.5,3.5,z));',
      ' col=pal(layer*0.045+t*0.06+uGl*0.33+step(0.75,fract(layer*0.61+floor(t*24.0)*0.29))*uGl*0.4)*1.7*fade*(1.0+uGl*0.5);',
      ' return vec3(sq,z);',
      '}',

      'vec3 calm(vec4 r,float t,out vec3 col){',
      ' if(r.w<0.42){',
      '  vec3 p=sph(r.xy)*0.78;vec3 sun=normalize(vec3(-0.5,0.55,0.7));',
      '  float l=clamp(dot(normalize(p),sun),0.0,1.0);p.xz=r2(t*0.08)*p.xz;',
      '  col=mix(vec3(0.9,0.38,0.28),vec3(1.0,0.82,0.58),l)*(0.05+1.05*l)*2.2;',
      '  return p;',
      ' }',
      ' float ring=floor(r.z*5.0);float rad=1.2+ring*0.3;float a=r.y*TAU+t*0.3/rad;',
      ' vec3 p=vec3(cos(a)*rad,(r.x-0.5)*0.01,sin(a)*rad);',
      ' p.yz=r2(0.42)*p.yz;p.xy=r2(0.14)*p.xy;',
      ' col=mix(vec3(1.0,0.62,0.42),vec3(0.78,0.58,1.0),ring/4.0)*0.95;',
      ' return p;',
      '}',

      'void main(){',
      ' float t=uTime;vec3 col;float size;vec3 p;float ring=0.0;',
      ' float w2=smoothstep(0.3,0.36,uP)*(1.0-smoothstep(0.72,0.78,uP));',
      ' float w3=smoothstep(0.72,0.78,uP);',
      ' if(aT<0.5){',
      '  float d=aR.z*0.1+aR.w*0.04;',
      '  float k1=smoothstep(0.2+d,0.34+d,uP);float k2=smoothstep(0.64+d,0.78+d,uP);',
      '  vec3 cA,cB,cC;',
      '  vec3 A=uObj*planet(aR,t,cA);vec3 B=tess(aR,t,cB);vec3 C=uObj*calm(aR,t,cC);',
      '  vec3 dir=normalize(sph(fract(aR.yx*7.31+aR.w))+vec3(0.0001));',
      '  float burst=(sin(k1*PI)+sin(k2*PI))*uTrip;',
      '  p=mix(mix(A,B,k1),C,k2)+dir*burst*(1.6+aR.z*2.4);',
      '  p.xy=r2(burst*0.6*(aR.w-0.5))*p.xy;',
      '  col=mix(mix(cA,cB,k1),cC,k2)+pal(aR.x+t*0.2)*burst*0.25;',
      '  size=1.5+1.3*aR.w;',
      '  p+=mix(mix(uOff,vec3(0.0),k1),uOff3,k2);',
      ' } else if(aT<1.5){',
      '  float s=aR.x;float tau=t-s*0.9;',
      '  float off=smoothstep(-0.3,1.0,sin(tau*0.28-1.2))+uBug*1.2;',
      '  float rr1=1.95+off*1.4+0.05*sin(tau*3.0);float a1=tau*0.75+uBugPh;',
      '  vec3 P1=vec3(cos(a1)*rr1,0.0,sin(a1)*rr1);P1.yz=r2(0.38)*P1.yz;P1.xy=r2(-0.32)*P1.xy;P1+=vec3(0.0,off*0.5,0.0);',
      '  float a2=tau*2.1;vec3 P2=vec3(cos(a2)*2.2,sin(tau*1.3)*1.2,sin(a2)*2.2);',
      '  float rr3=1.82;float a3=tau*0.55;',
      '  vec3 P3=vec3(cos(a3)*rr3,0.0,sin(a3)*rr3);P3.yz=r2(0.42)*P3.yz;P3.xy=r2(0.14)*P3.xy;',
      '  p=mix(mix(uObj*P1+uOff,P2,w2),uObj*P3+uOff3,w3);',
      '  float head=pow(1.0-s,6.0);',
      '  col=mix(vec3(1.0,0.16,0.22),vec3(1.0,0.78,0.42),w3)*(0.25+2.6*head)*(1.0-s*0.85);',
      '  size=1.4+6.5*head;',
      ' } else {',
      '  p=sph(aR.xy)*40.0;col=vec3(0.75,0.82,1.0)*(0.18+0.6*pow(aR.z,8.0))*(1.0-w2*0.6)*(0.7+0.3*sin(t*1.5+aR.w*40.0));size=0.8+1.4*pow(aR.z,6.0);',
      ' }',
      ' vec3 v=uView*(p-uCam);',
      ' float wz=-v.z;',
      ' if(wz<0.15){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;vC=vec3(0.0);return;}',
      ' gl_Position=vec4(v.x*uF/uAspect,v.y*uF,0.0,wz);',
      ' if(aT<0.5){vec2 nd=gl_Position.xy/wz;vec2 dm=(nd-uMouse)*vec2(uAspect,1.0);float l=length(dm);',
      '  vec2 push=dm/max(l,1e-3)*0.11*exp(-l*l*22.0)*(1.0-w2);gl_Position.xy+=push/vec2(uAspect,1.0)*wz;',
      '  vec2 dc=(gl_Position.xy/wz-uClk.xy)*vec2(uAspect,1.0);float lc=length(dc);',
      '  float amp=uClk.w*exp(-uClk.z*mix(2.2,3.6,w3))*mix(1.0,0.45,w3);',
      '  ring=exp(-pow((lc-uClk.z*1.5)/0.07,2.0))*amp;',
      '  gl_Position.xy+=dc/max(lc,1e-3)*ring*0.09/vec2(uAspect,1.0)*wz;}',
      ' gl_PointSize=size*uPx*clamp(6.0/wz,0.3,4.0);',
      ' vC=col*clamp(wz/6.0,0.6,1.6)+ring*mix(vec3(0.55,0.65,1.0),vec3(1.0,0.75,0.55),w3)*0.9;',
      '}'
    ].join('\n');
    const FS = 'precision mediump float;varying vec3 vC;void main(){vec2 q=gl_PointCoord-0.5;float d=dot(q,q)*4.0;float a=exp(-d*3.2);gl_FragColor=vec4(vC*a,1.0);}';

    // integração: compila e linka sem perguntar o status (perguntar bloqueia até o
    // driver terminar); `ready()` consulta COMPLETION_STATUS_KHR, que não bloqueia
    const parExt = gl.getExtension('KHR_parallel_shader_compile');
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = (vs, fs) => { const a = mk(gl.VERTEX_SHADER, vs), b = mk(gl.FRAGMENT_SHADER, fs); const p = gl.createProgram(); gl.attachShader(p, a); gl.attachShader(p, b); gl.linkProgram(p); return p; };
    const pBg = prog(VS_BG, FS_BG), pPts = prog(VS, FS);
    let linked = false, broken = false;
    const ready = () => {
      if (linked || broken) return linked;
      if (parExt && (!gl.getProgramParameter(pBg, parExt.COMPLETION_STATUS_KHR) || !gl.getProgramParameter(pPts, parExt.COMPLETION_STATUS_KHR))) return false;
      for (const pr of [pBg, pPts]) if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(pr)); broken = true; return false; }
      linked = true;
      return true;
    };

    const small = Math.min(window.innerWidth, window.innerHeight) < 700 || (navigator.hardwareConcurrency || 8) <= 4;
    const N = small ? 22000 : 42000, NB = 260, NS = 1600, TOT = N + NB + NS;
    const R = new Float32Array(TOT * 4), T = new Float32Array(TOT);
    for (let i = 0; i < TOT; i++) {
      R[i * 4] = Math.random(); R[i * 4 + 1] = Math.random(); R[i * 4 + 2] = Math.random(); R[i * 4 + 3] = Math.random();
      T[i] = i < N ? 0 : i < N + NB ? 1 : 2;
      if (T[i] === 1) R[i * 4] = (i - N) / NB;
    }
    const bufR = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufR); gl.bufferData(gl.ARRAY_BUFFER, R, gl.STATIC_DRAW);
    const bufT = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufT); gl.bufferData(gl.ARRAY_BUFFER, T, gl.STATIC_DRAW);
    const bufQ = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufQ); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    // locais de atributos/uniforms só depois do link (consultar antes bloquearia)
    let locR = -1, locT = -1, locQ = -1, looked = false;
    const U = {}, UB = {};
    const lookup = () => {
      locR = gl.getAttribLocation(pPts, 'aR'); locT = gl.getAttribLocation(pPts, 'aT'); locQ = gl.getAttribLocation(pBg, 'aP');
      ['uTime', 'uP', 'uAspect', 'uPx', 'uF', 'uTravel', 'uTrip', 'uHue', 'uVel', 'uMouse', 'uCam', 'uOff', 'uOff3', 'uView', 'uObj', 'uClk', 'uSpin', 'uGl', 'uBug', 'uBugPh'].forEach((n) => { U[n] = gl.getUniformLocation(pPts, n); });
      ['uW', 'uGlow', 'uAspect', 'uTime'].forEach((n) => { UB[n] = gl.getUniformLocation(pBg, n); });
    };

    const clamp01 = (x) => Math.min(1, Math.max(0, x));
    const ss = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const st = { t: 0, p: 0, travel: 0, mx: 0, my: 0, tx: 9, ty: 9, scale: 1, acc: 0, n: 0, w: 0, h: 0,
      ck: [9, 9, 99, 0], spin: 0, spinT: 0, gl: 0, bug: 0, bugPh: 0, last: null };
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); if (!r.width) return; st.tx = ((e.clientX - r.left) / r.width) * 2 - 1; st.ty = -(((e.clientY - r.top) / r.height) * 2 - 1); };
    const onLeave = () => { st.tx = 9; st.ty = 9; };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    const rotY = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 1, 0, s, 0, c]; };
    const rotX = (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, s, 0, -s, c]; };
    const rotZ = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, -s, c, 0, 0, 0, 1]; };
    const mul = (A, B) => { const o = new Array(9); for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) o[c * 3 + r] = A[r] * B[c * 3] + A[3 + r] * B[c * 3 + 1] + A[6 + r] * B[c * 3 + 2]; return o; };

    const frame = (dt, pTarget) => {
      if (!looked) { looked = true; lookup(); }
      const P = getProps ? getProps() : {};
      const speed = P.speed == null ? 1 : P.speed;
      st.t += dt;
      const t = st.t;
      const prev = st.p;
      st.p += (pTarget - st.p) * Math.min(1, dt * 3.0);
      const p = st.p;
      const vel = Math.abs(st.p - prev) / Math.max(dt, 1e-3);
      const k = Math.min(1, dt * 4);
      // clique: idade da onda, giro do tesserato, glitch e tranco do bug decaindo
      st.ck[2] += dt;
      st.spin += (st.spinT - st.spin) * Math.min(1, dt * 4);
      st.gl *= Math.exp(-dt * 3); st.bug *= Math.exp(-dt * 1.6); st.bugPh += dt * st.bug * 2.5;
      st.mx += ((st.tx > 5 ? 0 : st.tx) - st.mx) * k; st.my += ((st.ty > 5 ? 0 : st.ty) - st.my) * k;

      const cw = canvas.clientWidth || 1, ch = canvas.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * st.scale;
      const w = Math.max(2, Math.round(cw * dpr)), h = Math.max(2, Math.round(ch * dpr));
      if (w !== st.w || h !== st.h) { st.w = w; st.h = h; canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      const aspect = cw / ch, wide = aspect > 1.1;

      const w2 = ss(0.3, 0.36, p) * (1 - ss(0.72, 0.78, p)), w3 = ss(0.72, 0.78, p), w1 = Math.max(0, 1 - w2 - w3);
      st.travel += dt * speed * (2.2 + Math.min(vel * 50, 12)) * (0.3 + w2);

      const offX = wide ? Math.min(1.7, (aspect - 1) * 2.2) : 0, offY = wide ? -0.1 : -0.9;
      const camZ = (wide ? 6.2 : 8.6) - w2 * (wide ? 1.0 : 2.0);
      const view = mul(rotZ(w2 * Math.sin(t * 0.2) * 0.25), mul(rotX(-st.my * 0.06), rotY(st.mx * 0.08)));
      const obj = mul(rotX(0.18 + st.my * 0.07 + Math.sin(t * 0.13) * 0.04), rotY(-0.2 + st.mx * 0.16));
      const fov = 38 * Math.PI / 180;

      gl.disable(gl.BLEND);
      gl.useProgram(pBg);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufQ); gl.enableVertexAttribArray(locQ); gl.vertexAttribPointer(locQ, 2, gl.FLOAT, false, 0, 0);
      const gx = 0.5 + (offX / camZ) * (1 / Math.tan(fov / 2)) / aspect * 0.5 * (1 - w2), gy = 0.5 + (offY / camZ) * (1 / Math.tan(fov / 2)) * 0.5 * (1 - w2);
      gl.uniform3f(UB.uW, w1, w2, w3); gl.uniform2f(UB.uGlow, gx, gy); gl.uniform1f(UB.uAspect, aspect); gl.uniform1f(UB.uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(locQ);

      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(pPts);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufR); gl.enableVertexAttribArray(locR); gl.vertexAttribPointer(locR, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufT); gl.enableVertexAttribArray(locT); gl.vertexAttribPointer(locT, 1, gl.FLOAT, false, 0, 0);
      gl.uniform1f(U.uTime, t * (0.6 + 0.4 * speed)); gl.uniform1f(U.uP, p); gl.uniform1f(U.uAspect, aspect);
      gl.uniform1f(U.uPx, dpr * Math.min(1.25, Math.max(0.8, ch / 800)));
      gl.uniform1f(U.uF, 1 / Math.tan(fov / 2)); gl.uniform1f(U.uTravel, st.travel);
      gl.uniform1f(U.uTrip, P.trip == null ? 1 : P.trip); gl.uniform1f(U.uHue, P.hue || 0); gl.uniform1f(U.uVel, vel);
      gl.uniform2f(U.uMouse, st.tx > 5 ? 9 : st.tx, st.ty > 5 ? 9 : st.ty);
      gl.uniform3f(U.uCam, st.mx * 0.14, st.my * 0.1, camZ);
      gl.uniform3f(U.uOff, offX, offY, 0);
      gl.uniform3f(U.uOff3, offX * 0.72, offY, 0);
      gl.uniformMatrix3fv(U.uView, false, view);
      gl.uniformMatrix3fv(U.uObj, false, obj);
      gl.uniform4f(U.uClk, st.ck[0], st.ck[1], st.ck[2], st.ck[3]);
      gl.uniform1f(U.uSpin, st.spin); gl.uniform1f(U.uGl, st.gl); gl.uniform1f(U.uBug, st.bug); gl.uniform1f(U.uBugPh, st.bugPh);
      st.last = { ut: t * (0.6 + 0.4 * speed), obj, view, cam: [st.mx * 0.14, st.my * 0.1, camZ], offX, offY, aspect, f: 1 / Math.tan(fov / 2) };
      gl.drawArrays(gl.POINTS, 0, TOT);
      gl.disableVertexAttribArray(locR); gl.disableVertexAttribArray(locT);
      return { p, w2 };
    };

    // posição na tela (NDC) da cabeça do bug no 1º ato — a mesma conta do shader (aT == 1, s = 0)
    const bugNdc = () => {
      const L = st.last; if (!L) return null;
      const tau = L.ut;
      const off = ss(-0.3, 1, Math.sin(tau * 0.28 - 1.2)) + st.bug * 1.2;
      const rr = 1.95 + off * 1.4 + 0.05 * Math.sin(tau * 3), a = tau * 0.75 + st.bugPh;
      let x = Math.cos(a) * rr, y = 0, z = Math.sin(a) * rr, c = Math.cos(0.38), s = Math.sin(0.38);
      [y, z] = [c * y + s * z, -s * y + c * z];
      c = Math.cos(-0.32); s = Math.sin(-0.32);
      [x, y] = [c * x + s * y, -s * x + c * y];
      y += off * 0.5;
      const O = L.obj, V = L.view;
      const px = O[0] * x + O[3] * y + O[6] * z + L.offX - L.cam[0], py = O[1] * x + O[4] * y + O[7] * z + L.offY - L.cam[1], pz = O[2] * x + O[5] * y + O[8] * z - L.cam[2];
      const vx = V[0] * px + V[3] * py + V[6] * pz, vy = V[1] * px + V[4] * py + V[7] * pz, wz = -(V[2] * px + V[5] * py + V[8] * pz);
      return wz < 0.15 ? null : [vx * L.f / L.aspect / wz, vy * L.f / wz];
    };

    // clique em (clientX, clientY): onda no ponto e o efeito do ato atual
    const pulse = (cx, cy, soft) => {
      const r = canvas.getBoundingClientRect(); if (!r.width) return null;
      const x = ((cx - r.left) / r.width) * 2 - 1, y = -(((cy - r.top) / r.height) * 2 - 1);
      const p = st.p, w2 = ss(0.3, 0.36, p) * (1 - ss(0.72, 0.78, p)), w3 = ss(0.72, 0.78, p);
      const act = w2 > 0.5 ? 2 : w3 > 0.5 ? 3 : 1;
      const k = soft ? 0.35 : 1;
      st.ck = [x, y, 0, k];
      let bug = false;
      if (act === 2) { st.spinT += (Math.PI / 2) * k; st.gl = k; }
      if (act === 1) {
        const b = bugNdc();
        const aspect = r.width / r.height;
        if (b && Math.hypot((b[0] - x) * aspect, b[1] - y) < 0.28) { bug = true; st.bug = Math.min(1.4, st.bug + k); }
      }
      return { act, bug };
    };

    return {
      frame,
      ready,
      pulse,
      failed: () => broken,
      // integração: só desce (subir e descer em sequência realocava o buffer a cada vez)
      adapt: (dt) => {
        st.acc += dt; st.n++;
        if (st.n >= 90) { const avg = st.acc / st.n; if (avg > 1 / 40 && st.scale > 0.6) st.scale = Math.max(0.6, st.scale - 0.15); st.acc = 0; st.n = 0; }
      },
      dispose: () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        [bufR, bufT, bufQ].forEach((b) => gl.deleteBuffer(b));
        gl.deleteProgram(pBg); gl.deleteProgram(pPts);
      }
    };
  }

const DEFAULT_TEXTS = {
  title: 'Problema fora de órbita?',
  hint: 'Role para descer',
  midTop: 'x · y · z · w',
  midBottom: 'rastreando o bug na quarta dimensão',
  final: 'Eu vou<br>buscar.',
  finalSub: 'E trago de volta pra órbita.',
  cta: 'Me conta o problema',
  ctaHref: '#contato'
};

const STYLE_ID = 'orbit-hero-style';
const CSS = `
.oh-root{position:relative;width:100%;height:100%;background:#02030a;color:#F4F6FF;font-family:var(--font-schibsted),"Inter Tight",system-ui,sans-serif}
.oh-stage{position:sticky;top:0;width:100%;height:100vh;min-height:560px;overflow:hidden}
.oh-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.oh-t1,.oh-t3{position:absolute;left:clamp(20px,3.4vw,56px);will-change:opacity,transform}
.oh-t1{top:clamp(88px,17vh,180px);pointer-events:none}
.oh-t1 .oh-h{width:max-content;max-width:min(7.6em,calc(100vw - 2*clamp(20px,3.4vw,56px)));text-wrap:balance}
.oh-t3{top:clamp(88px,22vh,230px);display:flex;flex-direction:column;align-items:flex-start;gap:20px;opacity:0;visibility:hidden}
.oh-h{margin:0;font-size:clamp(52px,7.6vw,124px);line-height:.92;font-weight:700;letter-spacing:-.05em}
.oh-t1 .oh-h{color:#F4F6FF}
.oh-t3 .oh-h{color:#FFF6EE}
.oh-sub{margin:0;max-width:30ch;font-size:clamp(16px,1.4vw,20px);line-height:1.45;color:#E9D9CF}
.oh-cta{display:inline-flex;align-items:center;gap:12px;min-height:48px;margin-top:8px;padding:0 22px;border:1px solid rgba(255,246,238,.55);border-radius:3px;font-size:16px;font-weight:600;text-decoration:none;color:#F4F1EC;background:rgba(20,8,24,.25)}
.oh-cta:hover{color:#FFD9B8}
.oh-mono{margin:0;font-family:var(--font-dm-mono),"JetBrains Mono",ui-monospace,monospace}
.oh-hint{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none}
.oh-hint p{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#C9D2EA}
.oh-line{width:1px;height:44px;background:rgba(201,210,234,.25);overflow:hidden;position:relative}
.oh-line i{position:absolute;top:0;left:0;width:1px;height:44px;background:#F4F6FF;animation:ohHint 2.2s cubic-bezier(.6,0,.2,1) infinite}
@keyframes ohHint{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.oh-mid{position:absolute;left:50%;bottom:clamp(32px,8vh,72px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;visibility:hidden;pointer-events:none;text-align:center}
.oh-mid .a{font-size:clamp(13px,1.2vw,16px);letter-spacing:.5em;color:#E9F6FF}
.oh-mid .b{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B9C2DC}
@media (prefers-reduced-motion: reduce){.oh-line i{animation:none}}
`;

function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

export function mountOrbitHero(root, opts = {}) {
  const texts = Object.assign({}, DEFAULT_TEXTS, opts.texts || {});
  const props = { speed: opts.speed ?? 1, trip: opts.trip ?? 1, hue: opts.hue ?? 0 };

  if (!document.getElementById(STYLE_ID)) { const s = el('style'); s.id = STYLE_ID; s.textContent = CSS; document.head.appendChild(s); }

  const wrap = el('section', 'oh-root');
  const stage = el('div', 'oh-stage');
  const canvas = el('canvas', 'oh-canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.ariaLabel || 'Planeta de partículas com um ponto vermelho saindo de órbita, que vira um tesserato 4D e termina num sistema de órbitas calmo');
  const t1 = el('div', 'oh-t1'); const h1 = el('h2', 'oh-h'); t1.appendChild(h1);
  const hint = el('div', 'oh-hint'); const hintP = el('p', 'oh-mono'); hint.appendChild(hintP); hint.appendChild(el('div', 'oh-line', '<i></i>'));
  const mid = el('div', 'oh-mid'); const midA = el('p', 'oh-mono a'); const midB = el('p', 'oh-mono b'); mid.appendChild(midA); mid.appendChild(midB);
  const t3 = el('div', 'oh-t3'); const h2 = el('p', 'oh-h'); const sub = el('p', 'oh-sub'); const cta = el('a', 'oh-cta');
  t3.appendChild(h2); t3.appendChild(sub); t3.appendChild(cta);
  [canvas, t1, hint, mid, t3].forEach((n) => stage.appendChild(n));
  wrap.appendChild(stage);
  root.appendChild(wrap);

  const applyTexts = () => {
    h1.textContent = texts.title;
    hintP.textContent = texts.hint;
    midA.textContent = texts.midTop;
    midB.textContent = texts.midBottom;
    h2.innerHTML = texts.final;
    sub.textContent = texts.finalSub;
    sub.style.display = texts.finalSub ? '' : 'none';
    cta.textContent = texts.cta + ' ';
    const arrow = el('span', null, '→'); arrow.setAttribute('aria-hidden', 'true'); cta.appendChild(arrow);
    cta.setAttribute('href', texts.ctaHref);
  };
  applyTexts();

  const hero = createOrbitHero(canvas, () => props);
  if (!hero) { console.warn('OrbitHero: WebGL indisponível; mostrando só os textos.'); }

  // clique/toque curto no palco (arrastar para rolar não conta; links e botões seguem normais)
  const soft = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let down = null;
  const onDown = (e) => { down = e.button > 0 ? null : { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; };
  const onUp = (e) => {
    const d = down; down = null;
    if (!d || e.pointerId !== d.id || !hero || !hero.ready()) return;
    if (performance.now() - d.t > 450 || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12) return;
    if (e.target && e.target.closest && e.target.closest('a,button')) return;
    const info = hero.pulse(e.clientX, e.clientY, soft);
    if (info && opts.onPulse) opts.onPulse(info);
  };
  const onCancel = () => { down = null; };
  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointerup', onUp);
  stage.addEventListener('pointercancel', onCancel);

  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const set = (n, o, y, cx) => {
    const key = o.toFixed(3) + '|' + y.toFixed(1);
    if (n._k === key) return; n._k = key;
    n.style.opacity = o.toFixed(3);
    n.style.visibility = o < 0.01 ? 'hidden' : 'visible';
    n.style.transform = (cx ? 'translateX(-50%) ' : '') + 'translateY(' + y.toFixed(1) + 'px)';
  };
  const updateText = (p) => {
    const o1 = 1 - ss(0.08, 0.2, p); set(t1, o1, -70 * (1 - o1), false);
    set(hint, 1 - ss(0.01, 0.06, p), 0, true);
    const om = ss(0.42, 0.48, p) * (1 - ss(0.6, 0.66, p)); set(mid, om, 16 * (1 - om), true);
    const o3 = ss(0.84, 0.93, p); set(t3, o3, 48 * (1 - o3), false);
  };

  let raf = 0, last = performance.now(), alive = true, sp = 0, near = !('IntersectionObserver' in window);
  let gTop = 0, gH = 1, gStamp = -1e9;
  const loop = (now) => {
    raf = 0;
    if (!alive || !near) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.1); last = now;
    if (now - gStamp > 250) { const r = wrap.getBoundingClientRect(); gTop = r.top + window.scrollY; gH = r.height; gStamp = now; }
    const vh = canvas.clientHeight || window.innerHeight || 1;
    const top = gTop - window.scrollY;
    if (top + gH < 0 || top > vh) return;
    const pT = Math.min(1, Math.max(0, -top / Math.max(1, gH - vh)));
    if (hero && hero.ready()) { const s = hero.frame(dt, pT); sp = s.p; hero.adapt(dt); if (opts.onFrame) opts.onFrame(s); }
    else { sp = pT; if (hero && hero.failed()) canvas.style.visibility = 'hidden'; }
    updateText(sp);
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    near = es[0].isIntersecting;
    if (near && alive && !raf) { last = performance.now(); gStamp = -1e9; raf = requestAnimationFrame(loop); }
  }, { rootMargin: '50% 0px' }) : null;
  if (io) io.observe(wrap); else raf = requestAnimationFrame(loop);

  return {
    element: wrap,
    setTexts(t) { Object.assign(texts, t || {}); applyTexts(); },
    setOptions(o) { Object.assign(props, o || {}); },
    destroy() {
      alive = false; cancelAnimationFrame(raf); if (io) io.disconnect();
      stage.removeEventListener('pointerdown', onDown); stage.removeEventListener('pointerup', onUp); stage.removeEventListener('pointercancel', onCancel);
      if (hero) { try { hero.dispose(); } catch (e) { console.error(e); } }
      wrap.remove();
    }
  };
}

export default mountOrbitHero;
