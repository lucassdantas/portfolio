# AstroHero

Hero 3D com scroll em três atos para o portfólio:

1. **"Problema fora de órbita?"**: astronauta (escaneamento real do traje Apollo 11) flutuando sobre a Terra.
2. **Transição**: a tela torce, clarão, e ele entra na 4ª dimensão (túnel de quadrados neon, tesseratos, cubos espelhados).
3. **"Eu vou buscar."**: cena calma de pôr do sol sobre um planeta, com botão de contato.

O componente cria sozinho uma `<section>` de **600vh** com um palco `sticky`; o progresso do scroll dentro dela controla a animação.

## Arquivos

```
astro-hero/
  astro-hero.js                 componente (JS puro, sem framework) → window.AstroHero
  vendor/three-r147-bundle.js   three.js r147 + GLTFLoader + EffectComposer + UnrealBloomPass → window.THREE
  assets/astro_geo.js           geometria do astronauta → window.ASTRO_GEO
  assets/*.jpg                  texturas do astronauta e da Terra
  demo.html                     exemplo funcionando (servir por HTTP: npx serve .)
```

> O bundle usa **three r147 isolado em `window.THREE`**. Não troque pela versão do `three` do projeto: o código usa `THREE.EffectComposer`/`UnrealBloomPass` no formato antigo (examples/js), que não existe nas versões novas. Os dois podem conviver: `import * as THREE from 'three'` não mexe em `window.THREE`.

## Integração

1. Copie a pasta inteira para os arquivos estáticos públicos (ex.: `public/astro-hero/` no Vite/Next/CRA).
2. Carregue os scripts **nesta ordem**, só no cliente:
   - `/astro-hero/vendor/three-r147-bundle.js`
   - `/astro-hero/assets/astro_geo.js` (pode ser `defer`/async: o componente espera ele chegar)
   - `/astro-hero/astro-hero.js`
3. Monte num elemento vazio:

```js
const hero = AstroHero.mount(document.getElementById('astro-hero'), {
  assetsPath: '/astro-hero/assets/',
  texts: {
    title: 'Problema fora de órbita?',
    hint: 'Role para descer',
    midTop: 'x · y · z · w',
    midBottom: 'atravessando a quarta dimensão',
    final: 'Eu vou<br>buscar.',
    cta: 'Me conta o problema',
    ctaHref: '#contato',
    loading: 'carregando astronauta…'
  },
  speed: 1,   // velocidade do túnel 4D
  trip: 1,    // intensidade da distorção nas transições (0–2)
  hue: 0      // desloca as cores do túnel (0–1)
});

hero.setTexts({ title: 'Problem out of orbit?', final: 'I\'ll go<br>get it.' }); // troca de idioma
hero.destroy(); // ao desmontar (SPA)
```

### React / Next.js (exemplo)

```jsx
'use client';
import { useEffect, useRef } from 'react';

const load = (src) => new Promise((res, rej) => {
  if (document.querySelector(`script[src="${src}"]`)) return res();
  const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej;
  document.body.appendChild(s);
});

export default function AstroHeroSection({ texts }) {
  const ref = useRef(null);
  const heroRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load('/astro-hero/vendor/three-r147-bundle.js');
      load('/astro-hero/assets/astro_geo.js');
      await load('/astro-hero/astro-hero.js');
      if (!cancelled && ref.current) heroRef.current = window.AstroHero.mount(ref.current, { assetsPath: '/astro-hero/assets/', texts });
    })();
    return () => { cancelled = true; heroRef.current?.destroy(); heroRef.current = null; };
  }, []);
  useEffect(() => { if (texts) heroRef.current?.setTexts(texts); }, [texts]);
  return <div ref={ref} />;
}
```

## Fontes

O visual usa **Inter Tight** (600/700) e **JetBrains Mono** (400/500). Se o site não tiver, adicione:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Notas

- Peso: ~10 MB de assets (o modelo e as texturas 2048px). O texto "carregando astronauta…" aparece até a geometria chegar.
- A resolução de render se ajusta sozinha ao desempenho da máquina, e a animação pausa quando a seção sai da tela.
- Header fixo do site: o palco é `sticky top:0`. Se o header cobrir o título, ajuste `.ah-t1 { top: ... }`.
- Créditos: modelo "Neil Armstrong's Apollo 11 spacesuit", Smithsonian Open Access (CC0). Texturas da Terra: exemplos do three.js (MIT). three.js © mrdoob e colaboradores (MIT).
