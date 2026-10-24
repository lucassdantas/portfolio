/**
 * Salto de âncora com `content-visibility: auto`: as seções acima do alvo
 * ainda são só um espaço reservado (`contain-intrinsic-size`), então o salto
 * cairia centenas de px longe (no celular, a "Sistemas" caía 600px abaixo).
 *
 * Duas medidas, juntas:
 * 1. `revealForNav`: por ~1,6s todas ficam visíveis (`html.ld-nav`, em
 *    globals.css) — o layout fica exato e, como o tamanho é `auto`, o
 *    navegador guarda as alturas reais depois.
 * 2. `settleAnchor`: depois que a rolagem suave acabou e a classe saiu,
 *    confere onde o alvo ficou e corrige de uma vez o resto (o ancoramento de
 *    rolagem do Chrome deixava ~48px no celular). Desiste se a pessoa rolar.
 */
const REVEAL_MS = 1600;
let timer = 0;

export function revealForNav(ms = REVEAL_MS): void {
  const root = document.documentElement;
  root.classList.add("ld-nav");
  clearTimeout(timer);
  timer = window.setTimeout(() => root.classList.remove("ld-nav"), ms);
}

export function settleAnchor(el: HTMLElement): void {
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("touchstart", cancel, { once: true, passive: true });
  const check = () => {
    if (cancelled) return;
    const y0 = window.scrollY;
    window.setTimeout(() => {
      // só mexe com a rolagem parada e o layout já de volta ao normal
      if (cancelled || window.scrollY !== y0 || document.documentElement.classList.contains("ld-nav")) return;
      if (Math.abs(el.getBoundingClientRect().top) > 1) {
        el.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
      }
    }, 120);
  };
  for (const at of [REVEAL_MS + 200, REVEAL_MS + 600, REVEAL_MS + 1100]) window.setTimeout(check, at);
}

/** Liga as duas medidas a todo clique em link interno e à navegação por hash. */
export function installAnchorNav(): () => void {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
    if (!a) return;
    revealForNav();
    const el = document.getElementById((a.getAttribute("href") || "").slice(1));
    if (el) settleAnchor(el);
  };
  const onHash = () => {
    revealForNav();
    const el = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
    if (el) settleAnchor(el);
  };
  document.addEventListener("click", onClick, true);
  window.addEventListener("hashchange", onHash);
  if (location.hash.length > 1) onHash();
  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("hashchange", onHash);
  };
}
