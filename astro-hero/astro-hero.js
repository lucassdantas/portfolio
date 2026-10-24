/*!
 * AstroHero — hero 3D com scroll em três atos (Terra → 4ª dimensão → calmaria).
 * Sem dependências de framework. Requer, carregados antes como <script> comum:
 *   vendor/three-r147-bundle.js   (three.js r147 + GLTFLoader + EffectComposer + UnrealBloomPass, define window.THREE)
 *   assets/astro_geo.js           (geometria do astronauta, define window.ASTRO_GEO)
 *
 * Uso:
 *   const hero = AstroHero.mount(document.getElementById('astro-hero'), {
 *     assetsPath: '/astro-hero/assets/',          // pasta com as texturas
 *     texts: { title: 'Problema fora de órbita?', hint: 'Role para descer',
 *              midTop: 'x · y · z · w', midBottom: 'atravessando a quarta dimensão',
 *              final: 'Eu vou<br>buscar.', cta: 'Me conta o problema', ctaHref: '#contato',
 *              loading: 'carregando astronauta…' },
 *     speed: 1, trip: 1, hue: 0
 *   });
 *   hero.setTexts({...});   // troca de idioma
 *   hero.destroy();         // desmontar (SPA)
 *
 * Modelo 3D: escaneamento do traje Apollo 11 de Neil Armstrong (Smithsonian, CC0).
 * Texturas da Terra: exemplos públicos do three.js (MIT).
 */
(function (global) {
'use strict';

function createAstroHero(THREE, o) {
    const canvas = o.canvas;
    const urls = o.urls;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.05, 500);
    const clamp01 = (x) => Math.min(1, Math.max(0, x));
    const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const lerp = (a, b, t) => a + (b - a) * t;
    const bump = (a, b, c, d, x) => sstep(a, b, x) * (1 - sstep(c, d, x));

    const GLSL_NOISE = [
      'float h31(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}',
      'float vnoise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);',
      'return mix(mix(mix(h31(i+vec3(0,0,0)),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),',
      'mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}',
      'float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*vnoise(p);p*=2.03;a*=0.5;}return s;}'
    ].join('\n');

    const SUN1 = new THREE.Vector3(0.9, 0.32, -0.3).normalize();
    const SUN3 = new THREE.Vector3(-0.25, 0.42, -1.0).normalize();

    const skyU = { w1: { value: 1 }, w2: { value: 0 }, w3: { value: 0 }, uTime: { value: 0 }, uSun: { value: SUN1 }, uSun3: { value: SUN3 } };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: skyU, side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vDir;void main(){vDir=normalize(position);vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=p.xyww;}',
      fragmentShader: [
        'uniform float w1,w2,w3,uTime;uniform vec3 uSun,uSun3;varying vec3 vDir;',
        GLSL_NOISE,
        'void main(){vec3 d=normalize(vDir);',
        ' vec3 sp=vec3(0.002,0.003,0.008);',
        ' float n1=fbm(d*2.2+vec3(3.0,1.0,0.0));float n2=fbm(d*3.5+vec3(9.0,2.0,5.0));',
        ' sp+=vec3(0.02,0.05,0.14)*pow(n1,3.0)*0.9+vec3(0.12,0.03,0.16)*pow(n2,4.0)*0.6;',
        ' float sg=max(dot(d,uSun),0.0);sp+=vec3(1.0,0.86,0.66)*(pow(sg,900.0)*30.0+pow(sg,40.0)*0.25+pow(sg,6.0)*0.04);',
        ' vec3 fd=vec3(0.006,0.002,0.012)+vec3(0.16,0.02,0.3)*pow(fbm(d*2.0+vec3(0.0,0.0,uTime*0.05)),3.0)*0.5;',
        ' float y=d.y;',
        ' vec3 cm=mix(vec3(0.85,0.42,0.26),vec3(0.26,0.14,0.42),smoothstep(-0.3,0.18,y));',
        ' cm=mix(cm,vec3(0.006,0.008,0.035),smoothstep(0.0,0.55,y));',
        ' float cs=max(dot(d,uSun3),0.0);cm+=vec3(1.0,0.66,0.42)*(pow(cs,6.0)*0.35+pow(cs,60.0)*0.8+pow(cs,700.0)*8.0);',
        ' cm+=vec3(0.3,0.12,0.35)*pow(fbm(d*2.6+vec3(4.0,0.0,1.0)),3.0)*0.35;',
        ' gl_FragColor=vec4(sp*w1+fd*w2+cm*w3*0.7,1.0);}'
      ].join('\n')
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 64, 32), skyMat);
    sky.frustumCulled = false;
    sky.renderOrder = -10;
    scene.add(sky);

    const starN = 5000;
    const sPos = new Float32Array(starN * 3), sCol = new Float32Array(starN * 3), sSz = new Float32Array(starN);
    for (let i = 0; i < starN; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
      sPos[i * 3] = r * Math.cos(th) * 200; sPos[i * 3 + 1] = u * 200; sPos[i * 3 + 2] = r * Math.sin(th) * 200;
      const k = Math.random();
      const c = k < 0.15 ? [1.0, 0.8, 0.6] : k < 0.4 ? [0.7, 0.8, 1.0] : [1, 1, 1];
      const b = Math.pow(Math.random(), 6) * 6 + 0.25;
      sCol[i * 3] = c[0] * b; sCol[i * 3 + 1] = c[1] * b; sCol[i * 3 + 2] = c[2] * b;
      sSz[i] = 0.8 + Math.pow(Math.random(), 4) * 2.4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(sSz, 1));
    const starU = { uOp: { value: 1 }, uTime: { value: 0 }, uPx: { value: 1 } };
    const stars = new THREE.Points(starGeo, new THREE.ShaderMaterial({
      uniforms: starU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      vertexShader: 'attribute float aSize;uniform float uTime,uPx;varying vec3 vC;void main(){vC=color*(0.75+0.25*sin(uTime*2.0+position.x*1.7+position.y));vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*uPx;}',
      fragmentShader: 'uniform float uOp;varying vec3 vC;void main(){vec2 q=gl_PointCoord-0.5;float d=length(q);float a=smoothstep(0.5,0.0,d);gl_FragColor=vec4(vC*a*uOp,1.0);}'
    }));
    stars.frustumCulled = false;
    scene.add(stars);

    const tl = new THREE.TextureLoader();
    const loadTex = (u) => { const t = tl.load(u); t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t; };
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    const earthU = {
      tDay: { value: loadTex(urls.day) }, tNight: { value: loadTex(urls.night) }, tClouds: { value: loadTex(urls.clouds) },
      tSpec: { value: loadTex(urls.spec) }, tNormal: { value: loadTex(urls.normal) },
      uSun: { value: SUN1 }, uTime: { value: 0 }, uOp: { value: 1 }
    };
    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthU,
      vertexShader: 'varying vec3 vN;varying vec3 vW;varying vec2 vUv;varying vec3 vT;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vT=normalize(mat3(modelMatrix)*vec3(-sin(uv.x*6.2831853),0.0,cos(uv.x*6.2831853)));vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader: [
        'uniform sampler2D tDay,tNight,tClouds,tSpec,tNormal;uniform vec3 uSun;uniform float uTime,uOp;varying vec3 vN,vW,vT;varying vec2 vUv;',
        'vec3 lin(vec3 c){return pow(c,vec3(2.2));}',
        'void main(){',
        ' vec3 N0=normalize(vN);vec3 T=normalize(vT-N0*dot(vT,N0));vec3 B=cross(N0,T);',
        ' vec3 nm=texture2D(tNormal,vUv).xyz*2.0-1.0;vec3 N=normalize(T*nm.x*0.6+B*nm.y*0.6+N0*nm.z);',
        ' vec3 V=normalize(cameraPosition-vW);vec3 L=normalize(uSun);',
        ' float ndl0=dot(N0,L);float ndl=max(dot(N,L),0.0);',
        ' vec3 day=lin(texture2D(tDay,vUv).rgb);',
        ' vec3 night=lin(texture2D(tNight,vUv).rgb);',
        ' float cl=texture2D(tClouds,vUv+vec2(uTime*0.0015,0.0)).r;cl=smoothstep(0.05,0.9,cl);',
        ' float sea=texture2D(tSpec,vUv).r;',
        ' float dl=smoothstep(-0.12,0.3,ndl0);',
        ' vec3 col=day*ndl*2.0;',
        ' vec3 H=normalize(L+V);col+=sea*(1.0-cl)*pow(max(dot(N0,H),0.0),70.0)*vec3(1.0,0.86,0.66)*3.0*dl;',
        ' col=mix(col,vec3(1.0,0.99,0.97)*max(ndl0,0.0)*1.75,cl*0.9);',
        ' col+=night*vec3(1.0,0.72,0.42)*1.6*(1.0-dl)*(1.0-cl*0.8);',
        ' float fr=pow(1.0-max(dot(N0,V),0.0),2.6);',
        ' col=mix(col,vec3(0.25,0.55,1.4)*smoothstep(-0.25,0.5,ndl0)*1.6,fr*0.85);',
        ' col+=vec3(1.0,0.45,0.2)*pow(1.0-abs(ndl0),18.0)*0.25*fr;',
        ' gl_FragColor=vec4(col*uOp,1.0);}'
      ].join('\n')
    });
    const EARTH_R = 9;
    const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 160, 96), earthMat);
    earth.rotation.z = 0.41;
    earthGroup.add(earth);
    const atmU = { uSun: { value: SUN1 }, uOp: { value: 1 } };
    const atm = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R * 1.045, 128, 64), new THREE.ShaderMaterial({
      uniforms: atmU, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vN;varying vec3 vW;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader: 'uniform vec3 uSun;uniform float uOp;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);float k=dot(-vN,V);float g=smoothstep(0.0,0.42,k);float rim=pow(clamp(1.0-k*2.3,0.0,1.0),2.0);float lit=smoothstep(-0.35,0.45,dot(normalize(vN),normalize(uSun)));gl_FragColor=vec4(vec3(0.3,0.6,1.5)*rim*g*lit*2.2*uOp,1.0);}'
    }));
    earthGroup.add(atm);

    const fourGroup = new THREE.Group();
    scene.add(fourGroup);
    const SQN = 56, SQS = 1.5;
    const sqShape = new THREE.Shape();
    const so = 3.4, si = 3.36;
    sqShape.moveTo(-so, -so); sqShape.lineTo(so, -so); sqShape.lineTo(so, so); sqShape.lineTo(-so, so); sqShape.lineTo(-so, -so);
    const hole = new THREE.Path();
    hole.moveTo(-si, -si); hole.lineTo(-si, si); hole.lineTo(si, si); hole.lineTo(si, -si); hole.lineTo(-si, -si);
    sqShape.holes.push(hole);
    const sqGeo = new THREE.ShapeGeometry(sqShape);
    const idx = new Float32Array(SQN); for (let i = 0; i < SQN; i++) idx[i] = i;
    sqGeo.setAttribute('aIdx', new THREE.InstancedBufferAttribute(idx, 1));
    const sqU = { uTime: { value: 0 }, uTravel: { value: 0 }, uOp: { value: 0 }, uHue: { value: 0 }, uTwist: { value: 0 } };
    const sqMat = new THREE.ShaderMaterial({
      uniforms: sqU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: [
        'attribute float aIdx;uniform float uTime,uTravel,uTwist;varying float vI;varying float vF;',
        'void main(){float L=' + (SQN * SQS).toFixed(2) + ';float z=mod(aIdx*' + SQS.toFixed(2) + '+uTravel,L);float zz=-L*0.86+z;',
        ' float tw=zz*(0.05+uTwist*0.06)+uTime*0.22;vec3 p=position;float s=1.0+0.06*sin(uTime*1.4+aIdx*0.55);p.xy*=s;',
        ' p.xy=mat2(cos(tw),-sin(tw),sin(tw),cos(tw))*p.xy;p.z+=zz;vI=aIdx;',
        ' vF=smoothstep(-L*0.86,-L*0.45,zz)*(1.0-smoothstep(-3.0,1.0,zz));',
        ' gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.0);}'
      ].join('\n'),
      fragmentShader: 'uniform float uTime,uOp,uHue;varying float vI;varying float vF;vec3 pal(float t){return 0.5+0.5*cos(6.2831853*(t+vec3(0.0,0.33,0.67)));}void main(){vec3 c=pal(vI*0.043+uTime*0.06+uHue);c=pow(c,vec3(2.2));gl_FragColor=vec4(c*1.5*vF*uOp,1.0);}'
    });
    const squares = new THREE.InstancedMesh(sqGeo, sqMat, SQN);
    squares.frustumCulled = false;
    fourGroup.add(squares);

    const V4 = []; for (let i = 0; i < 16; i++) V4.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
    const E4 = []; for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (j > i) E4.push([i, j]); }
    const cyl = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
    const ball = new THREE.SphereGeometry(1, 12, 8);
    const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3(), tmpSc = new THREE.Vector3(), UPY = new THREE.Vector3(0, 1, 0);
    const makeTesseract = (size, wd, color, th, pos, sp) => {
      const eMat = new THREE.MeshBasicMaterial({ color: color.clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
      const nMat = new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(1.8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
      const edges = new THREE.InstancedMesh(cyl, eMat, E4.length);
      const nodes = new THREE.InstancedMesh(ball, nMat, 16);
      edges.frustumCulled = false; nodes.frustumCulled = false;
      const g = new THREE.Group(); g.position.copy(pos); g.add(edges); g.add(nodes);
      fourGroup.add(g);
      return { g, edges, nodes, size, wd, th, sp, eMat, nMat, P: V4.map(() => new THREE.Vector3()) };
    };
    const tesseracts = [
      makeTesseract(0.95, 2.6, new THREE.Color(0.45, 0.9, 1.6).multiplyScalar(1.1), 0.006, new THREE.Vector3(0, 0, 0), [0.31, 0.23, 0.27, 0.07]),
      makeTesseract(0.7, 2.6, new THREE.Color(1.7, 0.35, 1.2).multiplyScalar(1.1), 0.007, new THREE.Vector3(-3.1, 1.3, -3.5), [0.42, 0.18, 0.33, 0.12]),
      makeTesseract(0.55, 2.6, new THREE.Color(1.8, 0.9, 0.25).multiplyScalar(1.1), 0.007, new THREE.Vector3(3.4, -1.1, -5.0), [0.22, 0.37, 0.29, 0.1]),
      makeTesseract(0.9, 2.6, new THREE.Color(0.5, 0.6, 1.9).multiplyScalar(1.0), 0.008, new THREE.Vector3(1.8, 2.6, -9.0), [0.18, 0.28, 0.41, 0.05])
    ];
    const updateTesseract = (T, t, p) => {
      const a1 = t * T.sp[0] + p * 7.0, a2 = t * T.sp[1] + p * 3.0, a3 = t * T.sp[2] + p * 5.0, a4 = t * T.sp[3];
      const c1 = Math.cos(a1), s1 = Math.sin(a1), c2 = Math.cos(a2), s2 = Math.sin(a2), c3 = Math.cos(a3), s3 = Math.sin(a3), c4 = Math.cos(a4), s4 = Math.sin(a4);
      for (let i = 0; i < 16; i++) {
        let x = V4[i][0], y = V4[i][1], z = V4[i][2], w = V4[i][3], q;
        q = x * c1 - w * s1; w = x * s1 + w * c1; x = q;
        q = y * c2 - w * s2; w = y * s2 + w * c2; y = q;
        q = z * c3 - w * s3; w = z * s3 + w * c3; z = q;
        q = x * c4 - y * s4; y = x * s4 + y * c4; x = q;
        const k = T.wd / (T.wd - w) * T.size;
        T.P[i].set(x * k, y * k, z * k);
        const r = T.th * 2.6 * k / T.size;
        tmpM.compose(T.P[i], tmpQ.identity(), tmpS.set(r, r, r));
        T.nodes.setMatrixAt(i, tmpM);
      }
      for (let e = 0; e < E4.length; e++) {
        const A = T.P[E4[e][0]], B = T.P[E4[e][1]];
        tmpV.subVectors(B, A); const len = tmpV.length();
        tmpQ.setFromUnitVectors(UPY, tmpV.multiplyScalar(1 / Math.max(len, 1e-5)));
        tmpM.compose(tmpP.addVectors(A, B).multiplyScalar(0.5), tmpQ, tmpSc.set(T.th, len, T.th));
        T.edges.setMatrixAt(e, tmpM);
      }
      T.edges.instanceMatrix.needsUpdate = true;
      T.nodes.instanceMatrix.needsUpdate = true;
    };

    const cubes = [];
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06 });
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 30; i++) {
      const m = new THREE.Mesh(cubeGeo, cubeMat);
      const ang = Math.random() * Math.PI * 2, rad = 1.9 + Math.random() * 2.6;
      m.userData = { ang, rad, z0: Math.random() * 40, s: 0.12 + Math.pow(Math.random(), 2) * 0.5, rs: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(2.2) };
      fourGroup.add(m); cubes.push(m);
    }

    const calmGroup = new THREE.Group();
    scene.add(calmGroup);
    const planetU = { uSun: { value: SUN3 }, uTime: { value: 0 }, uOp: { value: 0 } };
    const PR = 40;
    const planet = new THREE.Mesh(new THREE.SphereGeometry(PR, 160, 96), new THREE.ShaderMaterial({
      uniforms: planetU,
      vertexShader: 'varying vec3 vN;varying vec3 vW;varying vec3 vO;void main(){vO=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader: [
        'uniform vec3 uSun;uniform float uTime,uOp;varying vec3 vN,vW,vO;', GLSL_NOISE,
        'void main(){vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);float lat=vO.y/' + PR.toFixed(1) + ';',
        ' float w=fbm(vec3(vO.x*0.06+uTime*0.01,lat*6.0,vO.z*0.06));',
        ' float band=0.5+0.5*sin(lat*34.0+w*5.0);',
        ' vec3 base=mix(vec3(0.55,0.26,0.24),vec3(0.2,0.16,0.36),band);base=mix(base,vec3(0.9,0.55,0.38),smoothstep(0.62,0.9,w)*0.7);',
        ' float ndl=dot(N,normalize(uSun));',
        ' vec3 col=base*max(ndl,0.0)*1.4+base*vec3(0.05,0.04,0.08);',
        ' float fr=pow(1.0-max(dot(N,V),0.0),7.0);',
        ' col+=vec3(1.0,0.55,0.38)*fr*smoothstep(0.0,0.6,ndl)*2.2;',
        ' gl_FragColor=vec4(col*uOp,1.0);}'
      ].join('\n')
    }));
    calmGroup.add(planet);
    const dustN = 900;
    const dPos = new Float32Array(dustN * 3), dSeed = new Float32Array(dustN);
    for (let i = 0; i < dustN; i++) { dPos[i * 3] = (Math.random() - 0.5) * 16; dPos[i * 3 + 1] = (Math.random() - 0.5) * 9; dPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2; dSeed[i] = Math.random(); }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 1));
    const dustU = { uTime: { value: 0 }, uOp: { value: 0 }, uPx: { value: 1 } };
    const dust = new THREE.Points(dustGeo, new THREE.ShaderMaterial({
      uniforms: dustU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute float aSeed;uniform float uTime,uPx;varying float vA;void main(){vec3 p=position;p.y+=sin(uTime*0.2+aSeed*30.0)*0.3+uTime*0.05*(aSeed-0.3);p.y=mod(p.y+4.5,9.0)-4.5;p.x+=cos(uTime*0.15+aSeed*20.0)*0.3;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=(1.0+aSeed*2.5)*uPx*(6.0/-mv.z);vA=0.35+0.65*sin(uTime*0.8+aSeed*40.0)*0.5+0.5;}',
      fragmentShader: 'uniform float uOp;varying float vA;void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d);gl_FragColor=vec4(vec3(1.0,0.75,0.55)*a*vA*uOp*0.9,1.0);}'
    }));
    dust.frustumCulled = false;
    calmGroup.add(dust);

    const sun = new THREE.DirectionalLight(0xffffff, 3);
    scene.add(sun); scene.add(sun.target);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    scene.add(fill); scene.add(fill.target);
    const hemi = new THREE.HemisphereLight(0x0b1330, 0x2856c8, 0.5);
    scene.add(hemi);
    const pA = new THREE.PointLight(0xff2fd0, 0, 9, 1.6), pB = new THREE.PointLight(0x2fe8ff, 0, 9, 1.6);
    scene.add(pA); scene.add(pB);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const makeEnv = (frag) => {
      const s = new THREE.Scene();
      s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 128, 64), new THREE.ShaderMaterial({ side: THREE.BackSide, vertexShader: 'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: 'varying vec3 vD;void main(){vec3 d=normalize(vD);' + frag + '}' })));
      const crt = new THREE.WebGLCubeRenderTarget(512, { type: THREE.HalfFloatType, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
      const cc = new THREE.CubeCamera(0.1, 50, crt);
      cc.update(renderer, s);
      const tex = pmrem.fromCubemap(crt.texture).texture;
      crt.dispose();
      return tex;
    };
    const v3 = (v) => 'vec3(' + v.x.toFixed(5) + ',' + v.y.toFixed(5) + ',' + v.z.toFixed(5) + ')';
    const envSpace = makeEnv('vec3 s=normalize(' + v3(SUN1) + ');float g=max(dot(d,s),0.0);vec3 c=vec3(0.004,0.006,0.012)+vec3(1.0,0.9,0.75)*(pow(g,30.0)*6.0+pow(g,4.0)*0.2)+vec3(0.06,0.16,0.45)*smoothstep(0.1,-0.7,d.y);gl_FragColor=vec4(c,1.0);');
    const envCalm = makeEnv('vec3 s=normalize(' + v3(SUN3) + ');float g=max(dot(d,s),0.0);vec3 c=mix(vec3(0.6,0.3,0.22),vec3(0.05,0.05,0.14),smoothstep(-0.3,0.6,d.y))+vec3(1.0,0.7,0.45)*(pow(g,20.0)*5.0+pow(g,3.0)*0.3);gl_FragColor=vec4(c,1.0);');
    const envNeon = makeEnv('float a=atan(d.y,d.x);vec3 c=0.5+0.5*cos(6.2831853*(a/6.2831853*2.0+d.z*0.3+vec3(0.0,0.33,0.67)));c=pow(c,vec3(2.0))*1.4*(0.25+0.75*pow(abs(sin(a*4.0+d.z*6.0)),8.0));gl_FragColor=vec4(c+vec3(0.01,0.0,0.02),1.0);');
    cubeMat.envMap = envNeon;
    const dynRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    const dynCam = new THREE.CubeCamera(0.05, 400, dynRT);
    scene.add(dynCam);
    const dynU = { tDyn: { value: dynRT.texture } };
    scene.environment = envSpace;
    let envState = 0;
    let dynTick = 0;

    const astro = new THREE.Group();
    const astroInner = new THREE.Group();
    astro.add(astroInner);
    scene.add(astro);
    let loaded = false;
    let disposed = false;
    const astroMats = [];
    const texL = new THREE.TextureLoader();
    const mkT = (u, srgb) => {
      const t = texL.load(u);
      t.flipY = false;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      if (srgb) t.encoding = THREE.sRGBEncoding;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    };
    const limbU = {
      uArmR: { value: new THREE.Vector3() }, uArmL: { value: new THREE.Vector3() },
      uLegR: { value: new THREE.Vector2() }, uLegL: { value: new THREE.Vector2() }
    };
    const DEFORM = [
      'uniform vec3 uArmR;uniform vec3 uArmL;uniform vec2 uLegR;uniform vec2 uLegL;',
      'mat3 aRX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}',
      'mat3 aRZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.0,-s,c,0.0,0.0,0.0,1.0);}',
      'void astroDeform(inout vec3 p,inout vec3 n){',
      ' vec3 r=p;float xc=r.x-0.02;float d=abs(xc);float sR=smoothstep(-0.03,0.03,xc);float side=sR*2.0-1.0;',
      ' float armM=smoothstep(0.212,0.248,d)*smoothstep(0.66,0.78,r.y)*smoothstep(1.66,1.52,r.y);',
      ' vec3 A=mix(uArmL,uArmR,sR);',
      ' float we=armM*smoothstep(1.17,1.03,r.y);',
      ' vec3 pe=vec3(0.02+side*0.31,1.1,-0.01);mat3 E=aRX(A.z*we);p=pe+E*(p-pe);n=E*n;',
      ' float ws=armM*smoothstep(1.52,1.34,r.y);',
      ' vec3 ps=vec3(0.02+side*0.25,1.42,0.0);mat3 S=aRZ(A.y*side*ws)*aRX(A.x*ws);p=ps+S*(p-ps);n=S*n;',
      ' float legM=smoothstep(0.235,0.2,d)*(1.0-armM);',
      ' vec2 Lg=mix(uLegL,uLegR,sR);float lx=0.02+mix(-0.11,0.11,sR);',
      ' float wk=legM*smoothstep(0.48,0.36,r.y);',
      ' vec3 pk=vec3(lx+mix(-0.01,0.01,sR),0.42,0.0);mat3 K=aRX(Lg.y*wk);p=pk+K*(p-pk);n=K*n;',
      ' float wh=legM*smoothstep(0.88,0.64,r.y);',
      ' vec3 ph=vec3(lx,0.84,0.0);mat3 H=aRX(Lg.x*wh);p=ph+H*(p-ph);n=H*n;',
      '}'
    ].join('\n');
    const applyDeform = (mat) => {
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.tDyn = dynU.tDyn;
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\nuniform samplerCube tDyn;')
          .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = max( roughnessFactor, 0.16 );')
          .replace('#include <map_fragment>', '#include <map_fragment>\nfloat vGold = clamp( ( diffuseColor.r - 2.5 * diffuseColor.b - 0.12 ) * 5.0, 0.0, 1.0 ) * step( 0.35 * diffuseColor.r, diffuseColor.g );')
          .replace('#include <dithering_fragment>', [
            '#include <dithering_fragment>',
            'vec3 vV = normalize( vViewPosition );',
            'vec3 rW = inverseTransformDirection( reflect( -vV, normal ), viewMatrix );',
            'vec3 mir = textureCube( tDyn, rW ).rgb;',
            'float fr = pow( 1.0 - clamp( dot( normal, vV ), 0.0, 1.0 ), 5.0 );',
            'vec3 tint = mix( vec3( 1.0, 0.76, 0.38 ), vec3( 1.0 ), fr );',
            'vec3 visor = mir * tint * ( 0.55 + 0.45 * fr ) + vec3( 0.02, 0.014, 0.006 );',
            'gl_FragColor.rgb = mix( gl_FragColor.rgb, visor, vGold );',
            'gl_FragColor.rgb = min( gl_FragColor.rgb, vec3( 24.0 ) );'
          ].join('\n'));
      };
    };
    let geoTries = 0;
    const buildAstro = () => {
      if (disposed || loaded) return;
      const G = window.ASTRO_GEO;
      if (!G) { if (geoTries++ < 600) setTimeout(buildAstro, 150); return; }
      const bin = atob(G.b64);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const buf = u8.buffer;
      const m = new THREE.Group();
      G.prims.forEach((pr) => {
        const ib = new THREE.InterleavedBuffer(new Float32Array(buf, pr.vOff, pr.vCount * 8), 8);
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.InterleavedBufferAttribute(ib, 3, 0));
        g.setAttribute('normal', new THREE.InterleavedBufferAttribute(ib, 3, 3));
        const uvA = new THREE.InterleavedBufferAttribute(ib, 2, 6);
        g.setAttribute('uv', uvA);
        g.setAttribute('uv2', uvA);
        g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, pr.iOff, pr.iCount), 1));
        const orm = mkT(urls.tex[pr.orm], false);
        const mat = new THREE.MeshStandardMaterial({ map: mkT(urls.tex[pr.base], true), normalMap: mkT(urls.tex[pr.normal], false), aoMap: orm, roughnessMap: orm, metalnessMap: orm, metalness: 1, roughness: 1 });
        applyDeform(mat);
        m.add(new THREE.Mesh(g, mat));
      });
      const box = new THREE.Box3().setFromObject(m);
      const c = box.getCenter(new THREE.Vector3());
      const h = box.max.y - box.min.y;
      m.position.sub(c);
      const holder = new THREE.Group();
      holder.add(m);
      holder.scale.setScalar(1.85 / h);
      m.traverse((n) => { if (n.isMesh) { n.frustumCulled = false; const mats = Array.isArray(n.material) ? n.material : [n.material]; mats.forEach((mt) => { mt.envMapIntensity = 1; astroMats.push(mt); }); } });
      astroInner.add(holder);
      loaded = true;
    };
    buildAstro();

    const rt = new THREE.WebGLRenderTarget(16, 16, { type: THREE.HalfFloatType });
    const composer = new THREE.EffectComposer(renderer, rt);
    composer.addPass(new THREE.RenderPass(scene, camera));
    const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.55, 0.82);
    [bloom.renderTargetBright].concat(bloom.renderTargetsHorizontal, bloom.renderTargetsVertical).forEach((r) => { r.texture.type = THREE.HalfFloatType; });
    composer.addPass(bloom);
    const finalPass = new THREE.ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uWarp: { value: 0 }, uFlash: { value: 0 }, uCA: { value: 0 }, uExp: { value: 1 }, uAspect: { value: 1.7 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: [
        'uniform sampler2D tDiffuse;uniform float uTime,uWarp,uFlash,uCA,uExp,uAspect;varying vec2 vUv;',
        'float hh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
        'vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}',
        'void main(){vec2 c=vUv-0.5;c.x*=uAspect;float r=length(c);',
        ' float ang=uWarp*(2.6*exp(-r*2.2))*sin(uTime*0.9+r*3.0);float cs=cos(ang),sn=sin(ang);c=mat2(cs,-sn,sn,cs)*c;',
        ' c*=1.0-uWarp*0.35*exp(-r*2.5)+uWarp*0.05*sin(r*30.0-uTime*6.0)*r;',
        ' c.x/=uAspect;vec2 uv=c+0.5;vec2 dir=uv-0.5;float ca=0.0015+uCA*0.035;',
        ' vec3 col=vec3(texture2D(tDiffuse,uv-dir*ca).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv+dir*ca).b);',
        ' col=aces(col*uExp);col=pow(col,vec3(1.0/2.2));',
        ' col=mix(col,vec3(1.0,0.97,0.94),uFlash);',
        ' vec2 q=vUv;col*=0.25+0.75*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.22);',
        ' col+=(hh(vUv*vec2(1731.0,977.0)+fract(uTime*7.0))-0.5)*0.03;',
        ' gl_FragColor=vec4(col,1.0);}'
      ].join('\n')
    });
    composer.addPass(finalPass);

    const st = { t: 0, lt: 0, travel: 0, p: 0, mx: 0, my: 0, tx: 0, ty: 0, scale: 0.85, acc: 0, n: 0, w: 0, h: 0 };
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); if (!r.width) return; st.tx = clamp01((e.clientX - r.left) / r.width) * 2 - 1; st.ty = -(clamp01((e.clientY - r.top) / r.height) * 2 - 1); };
    window.addEventListener('pointermove', onMove);

    const resize = (cw, ch) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(cw * dpr * st.scale)), h = Math.max(2, Math.round(ch * dpr * st.scale));
      if (w === st.w && h === st.h) return;
      st.w = w; st.h = h;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      starU.uPx.value = dpr * st.scale;
      dustU.uPx.value = dpr * st.scale * 1.4;
    };

    const KC = new THREE.Vector3(), KL = new THREE.Vector3();
    const frame = (dt, pTarget) => {
      const P = o.getProps ? o.getProps() : {};
      const speed = P.speed == null ? 1 : P.speed;
      st.t += dt;
      const t = st.t;
      const prev = st.p;
      st.p += (pTarget - st.p) * Math.min(1, dt * 3.2);
      const p = st.p;
      const vel = Math.abs(st.p - prev) / Math.max(dt, 1e-3);
      const k = Math.min(dt * 2.2, 1);
      st.mx += (st.tx - st.mx) * k; st.my += (st.ty - st.my) * k;

      const cw = canvas.clientWidth || 1, ch = canvas.clientHeight || 1;
      resize(cw, ch);
      const aspect = cw / ch;
      const wide = aspect > 1.1;

      const w1 = 1 - sstep(0.29, 0.345, p);
      const w3 = sstep(0.745, 0.80, p);
      const w2 = Math.max(0, 1 - w1 - w3);
      const warp = bump(0.18, 0.32, 0.33, 0.42, p) + bump(0.64, 0.76, 0.77, 0.86, p) + w2 * 0.12;
      const flash = Math.pow(bump(0.30, 0.335, 0.335, 0.37, p), 1.5) * 0.85 + Math.pow(bump(0.73, 0.775, 0.775, 0.81, p), 1.5) * 0.9;

      st.travel += dt * speed * (1.6 + Math.min(vel * 60, 14)) * (0.4 + w2 * 1.6);


      const want = p < 0.335 ? 0 : p < 0.775 ? 1 : 2;
      if (want !== envState) { envState = want; scene.environment = want === 0 ? envSpace : want === 1 ? envNeon : envCalm; }
      skyU.w1.value = w1; skyU.w2.value = w2; skyU.w3.value = w3; skyU.uTime.value = t;
      starU.uOp.value = w1 + w3 * 0.55; starU.uTime.value = t;
      stars.rotation.y = t * 0.004 + p * 0.6;

      const ax1 = wide ? Math.min(0.95, (aspect - 1) * 1.3) : 0, ay1 = wide ? -0.02 : -0.5;
      const ax3 = wide ? Math.min(0.95, (aspect - 1) * 1.3) : 0, ay3 = wide ? 0.0 : -0.55;
      const tA = sstep(0.16, 0.36, p), tB = sstep(0.70, 0.84, p);
      const ax = lerp(lerp(ax1, 0, tA), ax3, tB), ay = lerp(lerp(ay1, 0, tA), ay3, tB);
      astro.position.set(ax + Math.sin(t * 0.31) * 0.05, ay + Math.sin(t * 0.47) * 0.07, 0);
      const spin = w2 * (t * 0.6 + p * 9.0);
      astro.rotation.set(
        0.18 + Math.sin(t * 0.23) * 0.06 + w2 * Math.sin(t * 0.7 + p * 6) * 0.5 - st.my * 0.12,
        -0.55 + Math.sin(t * 0.17) * 0.18 + st.mx * 0.35 + spin + w3 * 0.25,
        0.32 + Math.sin(t * 0.21) * 0.07 + w2 * Math.sin(t * 0.5) * 0.6 - w3 * 0.18
      );
      astroInner.rotation.x = -0.25 * (1 - w2);


      const z1 = wide ? 4.3 : 6.6, z2 = wide ? 4.9 : 6.8, z3 = wide ? 4.6 : 6.8;
      const push1 = bump(0.16, 0.33, 0.335, 0.40, p), push2 = bump(0.62, 0.775, 0.775, 0.84, p);
      const zc = lerp(lerp(z1, z2, sstep(0.3, 0.4, p)), z3, sstep(0.74, 0.86, p)) - push1 * 2.4 - push2 * 2.6;
      const orb = w2 * Math.sin(t * 0.13 + p * 4) * 0.35;
      KC.set(Math.sin(orb) * zc + st.mx * 0.22, 0.12 + st.my * 0.14 + w1 * 0.05, Math.cos(orb) * zc);
      camera.position.copy(KC);
      KL.set(0, 0, 0);
      camera.lookAt(KL);
      camera.rotateZ(w2 * Math.sin(t * 0.21) * 0.12 + (push1 + push2) * 0.25);
      camera.fov = 35 + (push1 + push2) * 22 + w2 * 6;
      camera.updateProjectionMatrix();

      earthGroup.visible = w1 > 0.001;
      earthGroup.position.set(wide ? 0.6 : 0, -EARTH_R - 1.55 - sstep(0.12, 0.34, p) * 6, -5.5);
      earth.rotation.y = t * 0.012 + 2.2;
      earthU.uTime.value = t; earthU.uOp.value = w1; atmU.uOp.value = w1;

      fourGroup.visible = w2 > 0.001;
      if (fourGroup.visible) {
        sqU.uTime.value = t; sqU.uTravel.value = st.travel; sqU.uOp.value = w2; sqU.uTwist.value = Math.min(vel * 8, 1.5);
        sqU.uHue.value = P.hue || 0;
        for (let i = 0; i < tesseracts.length; i++) {
          const T = tesseracts[i];
          updateTesseract(T, t, p);
          T.eMat.opacity = w2; T.nMat.opacity = w2;
          if (i > 0) { T.g.position.z = ((T.g.position.z + dt * (0.4 + w2 * 1.5) * speed + 14) % 16) - 14; }
        }
        for (let i = 0; i < cubes.length; i++) {
          const m = cubes[i], u = m.userData;
          const z = ((u.z0 + st.travel * 0.9) % 40) - 34;
          const a = u.ang + t * 0.08 + z * 0.03;
          m.position.set(Math.cos(a) * u.rad, Math.sin(a) * u.rad, z);
          m.rotation.set(t * u.rs.x, t * u.rs.y, t * u.rs.z);
          m.scale.setScalar(Math.max(1e-4, u.s * w2 * sstep(-34, -26, z) * (1 - sstep(-1.5, 1.5, z))));
        }
      }
      pA.intensity = w2 * 3.2; pB.intensity = w2 * 3.2;
      pA.position.set(Math.cos(t * 0.9) * 2.2, Math.sin(t * 0.7) * 1.2, Math.sin(t * 0.9) * 2.2 + 1);
      pB.position.set(Math.cos(t * 0.9 + 3.1) * 2.2, -Math.sin(t * 0.6) * 1.2, Math.sin(t * 0.9 + 3.1) * 2.2 + 1);

      calmGroup.visible = w3 > 0.001;
      planet.position.set(wide ? -6 : -2, -PR - 2.6, -26);
      planet.rotation.y = t * 0.003;
      planetU.uTime.value = t; planetU.uOp.value = w3;
      dustU.uTime.value = t; dustU.uOp.value = w3;

      sun.position.copy(SUN1).multiplyScalar(10 * (w1 + w2)).addScaledVector(SUN3, 10 * w3);
      sun.color.setRGB(1.0, lerp(0.95, 0.72, w3), lerp(0.88, 0.52, w3));
      sun.intensity = w1 * 3.4 + w2 * 0.35 + w3 * 3.2;
      fill.position.set(-3, 1, 5);
      fill.color.setRGB(lerp(0.55, 0.75, w3), lerp(0.65, 0.6, w3), lerp(1.0, 0.95, w3));
      fill.intensity = w1 * 0.25 + w3 * 0.55 + w2 * 0.1;
      hemi.intensity = w1 * 0.55 + w3 * 0.35 + w2 * 0.15;
      hemi.groundColor.setRGB(lerp(0.16, 0.5, w3), lerp(0.34, 0.25, w3), lerp(0.78, 0.3, w3));
      const envI = w1 * 0.55 + w2 * 0.55 + w3 * 0.7;
      for (let i = 0; i < astroMats.length; i++) astroMats[i].envMapIntensity = envI;

      bloom.strength = 0.45 * w1 + 0.75 * w2 + 0.5 * w3;
      bloom.radius = 0.55;
      bloom.threshold = 0.82;
      const fu = finalPass.uniforms;
      fu.uTime.value = t; fu.uWarp.value = warp * (P.trip == null ? 1 : P.trip); fu.uFlash.value = flash; fu.uCA.value = warp * 0.8 + w2 * 0.12; fu.uExp.value = 1.0; fu.uAspect.value = aspect;

      if (loaded && (dynTick++ % 2 === 0)) {
        astro.visible = false;
        dynCam.position.copy(astro.position);
        dynCam.position.y += 0.6;
        dynCam.update(renderer, scene);
        astro.visible = true;
      }
      composer.render(dt);
      return { p, w1, w2, w3 };
    };

    return {
      frame,
      isLoaded: () => loaded,
      adapt: (dt) => {
        st.acc += dt; st.n += 1;
        if (st.n >= 40) {
          const avg = st.acc / st.n;
          if (avg > 1 / 42 && st.scale > 0.45) st.scale = Math.max(0.45, st.scale - 0.1);
          else if (avg < 1 / 58 && st.scale < 1) st.scale = Math.min(1, st.scale + 0.05);
          st.acc = 0; st.n = 0;
        }
      },
      dispose: () => {
        disposed = true;
        window.removeEventListener('pointermove', onMove);
        composer.renderTarget1.dispose(); composer.renderTarget2.dispose();
        pmrem.dispose(); renderer.dispose();
      }
    };
  }

var DEFAULT_TEXTS = {
  title: 'Problema fora de órbita?',
  hint: 'Role para descer',
  midTop: 'x · y · z · w',
  midBottom: 'atravessando a quarta dimensão',
  final: 'Eu vou<br>buscar.',
  cta: 'Me conta o problema',
  ctaHref: '#contato',
  loading: 'carregando astronauta…'
};

var STYLE_ID = 'astro-hero-style';
var CSS = [
  '.ah-root{position:relative;width:100%;height:600vh;background:#020208;color:#F4F6FF;font-family:"Inter Tight",system-ui,sans-serif}',
  '.ah-stage{position:sticky;top:0;width:100%;height:100vh;min-height:560px;overflow:hidden}',
  '.ah-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
  '.ah-t1,.ah-t3{position:absolute;left:clamp(20px,3.4vw,56px);will-change:opacity,transform}',
  '.ah-t1{top:clamp(88px,17vh,180px);max-width:10ch;pointer-events:none}',
  '.ah-t3{top:clamp(88px,22vh,230px);display:flex;flex-direction:column;align-items:flex-start;gap:28px;opacity:0;visibility:hidden}',
  '.ah-h{margin:0;font-size:clamp(52px,7.6vw,124px);line-height:.92;font-weight:700;letter-spacing:-.05em}',
  '.ah-t1 .ah-h{color:#F4F6FF;text-shadow:0 2px 40px rgba(2,2,8,.6)}',
  '.ah-t3 .ah-h{color:#FFF6EE;text-shadow:0 2px 40px rgba(40,14,30,.45)}',
  '.ah-cta{display:inline-flex;align-items:center;gap:12px;min-height:48px;padding:0 22px;border:1px solid rgba(255,246,238,.55);border-radius:999px;font-size:16px;font-weight:600;text-decoration:none;color:#F4F1EC;background:rgba(20,8,24,.25)}',
  '.ah-cta:hover{color:#FFD9B8}',
  '.ah-mono{margin:0;font-family:"JetBrains Mono",ui-monospace,monospace}',
  '.ah-hint{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none}',
  '.ah-hint p{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#C9D2EA}',
  '.ah-line{width:1px;height:44px;background:rgba(201,210,234,.25);overflow:hidden;position:relative}',
  '.ah-line i{position:absolute;top:0;left:0;width:1px;height:44px;background:#F4F6FF;animation:ahHint 2.2s cubic-bezier(.6,0,.2,1) infinite}',
  '@keyframes ahHint{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}',
  '.ah-mid{position:absolute;left:50%;bottom:clamp(32px,8vh,72px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;visibility:hidden;pointer-events:none;text-align:center}',
  '.ah-mid .a{font-size:clamp(13px,1.2vw,16px);letter-spacing:.5em;color:#E9F6FF}',
  '.ah-mid .b{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B9C2DC}',
  '.ah-load{position:absolute;right:clamp(20px,3.4vw,56px);bottom:28px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9AA4C2;transition:opacity .6s;pointer-events:none}',
  '@media (prefers-reduced-motion: reduce){.ah-line i{animation:none}}'
].join('\n');

function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

function mount(root, opts) {
  opts = opts || {};
  var THREE = global.THREE;
  if (!THREE || !THREE.EffectComposer || !THREE.UnrealBloomPass) throw new Error('AstroHero: carregue vendor/three-r147-bundle.js antes de astro-hero.js');
  var base = opts.assetsPath || 'assets/';
  if (base.charAt(base.length - 1) !== '/') base += '/';
  var texts = Object.assign({}, DEFAULT_TEXTS, opts.texts || {});
  var props = { speed: opts.speed == null ? 1 : opts.speed, trip: opts.trip == null ? 1 : opts.trip, hue: opts.hue || 0 };

  if (!document.getElementById(STYLE_ID)) { var st = el('style'); st.id = STYLE_ID; st.textContent = CSS; document.head.appendChild(st); }

  var wrap = el('section', 'ah-root');
  var stage = el('div', 'ah-stage');
  var canvas = el('canvas', 'ah-canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.ariaLabel || 'Astronauta flutuando sobre a Terra, atravessando uma dimensão de tesseratos e chegando a um planeta calmo');
  var t1 = el('div', 'ah-t1'); var h1 = el('h1', 'ah-h'); t1.appendChild(h1);
  var hint = el('div', 'ah-hint'); var hintP = el('p', 'ah-mono'); var line = el('div', 'ah-line', '<i></i>'); hint.appendChild(hintP); hint.appendChild(line);
  var mid = el('div', 'ah-mid'); var midA = el('p', 'ah-mono a'); var midB = el('p', 'ah-mono b'); mid.appendChild(midA); mid.appendChild(midB);
  var t3 = el('div', 'ah-t3'); var h2 = el('h2', 'ah-h'); var cta = el('a', 'ah-cta'); t3.appendChild(h2); t3.appendChild(cta);
  var load = el('p', 'ah-mono ah-load');
  [canvas, t1, hint, mid, t3, load].forEach(function (n) { stage.appendChild(n); });
  wrap.appendChild(stage);
  root.appendChild(wrap);

  function applyTexts() {
    h1.textContent = texts.title;
    hintP.textContent = texts.hint;
    midA.textContent = texts.midTop;
    midB.textContent = texts.midBottom;
    h2.innerHTML = texts.final;
    cta.innerHTML = '';
    cta.appendChild(document.createTextNode(texts.cta + ' '));
    var arrow = el('span', null, '→'); arrow.setAttribute('aria-hidden', 'true'); cta.appendChild(arrow);
    cta.setAttribute('href', texts.ctaHref);
    load.textContent = texts.loading;
  }
  applyTexts();

  var tex = {};
  ['baseColor_1', 'baseColor_2', 'baseColor_3', 'baseColor_4', 'normal_1', 'normal_2', 'normal_3', 'normal_4', 'occlusion_1', 'occlusion_2', 'occlusion_3', 'occlusion_4']
    .forEach(function (n) { tex[n] = base + n + '.jpg'; });

  var hero = createAstroHero(THREE, {
    canvas: canvas,
    urls: { tex: tex, day: base + 'earth_day.jpg', night: base + 'earth_lights.jpg', clouds: base + 'earth_clouds.jpg', spec: base + 'earth_spec.jpg', normal: base + 'earth_normal.jpg' },
    getProps: function () { return props; }
  });

  var ss = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  var set = function (n, o, y, cx) {
    var key = o.toFixed(3) + '|' + y.toFixed(1);
    if (n._k === key) return; n._k = key;
    n.style.opacity = o.toFixed(3);
    n.style.visibility = o < 0.01 ? 'hidden' : 'visible';
    n.style.transform = (cx ? 'translateX(-50%) ' : '') + 'translateY(' + y.toFixed(1) + 'px)';
  };
  function updateText(p) {
    var o1 = 1 - ss(0.08, 0.2, p); set(t1, o1, -70 * (1 - o1), false);
    set(hint, 1 - ss(0.01, 0.06, p), 0, true);
    var om = ss(0.42, 0.48, p) * (1 - ss(0.6, 0.66, p)); set(mid, om, 16 * (1 - om), true);
    var o3 = ss(0.84, 0.93, p); set(t3, o3, 48 * (1 - o3), false);
    var lo = hero.isLoaded() ? '0' : '1'; if (load.style.opacity !== lo) load.style.opacity = lo;
  }

  var raf = 0, last = performance.now(), visible = true, alive = true;
  var io = 'IntersectionObserver' in global ? new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && alive && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }) : null;
  if (io) io.observe(wrap);
  function loop(now) {
    raf = 0;
    if (!alive || !visible) return;
    raf = requestAnimationFrame(loop);
    var dt = Math.min(Math.max((now - last) / 1000, 0), 0.1); last = now;
    var r = wrap.getBoundingClientRect();
    var vh = canvas.clientHeight || global.innerHeight || 1;
    var pT = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    var s = hero.frame(dt, pT);
    hero.adapt(dt);
    updateText(s.p);
  }
  raf = requestAnimationFrame(loop);

  return {
    element: wrap,
    setTexts: function (t) { Object.assign(texts, t || {}); applyTexts(); },
    setOptions: function (o) { Object.assign(props, o || {}); },
    destroy: function () {
      alive = false; cancelAnimationFrame(raf); raf = 0;
      if (io) io.disconnect();
      try { hero.dispose(); } catch (e) { console.error(e); }
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }
  };
}

global.AstroHero = { mount: mount };
})(typeof window !== 'undefined' ? window : this);
