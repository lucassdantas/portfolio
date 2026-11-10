export type OrbitHeroTexts = {
  title: string;
  hint: string;
  midTop: string;
  midBottom: string;
  /** Aceita HTML (`<br>`). */
  final: string;
  finalSub: string;
  cta: string;
  ctaHref: string;
};

export type OrbitHeroFrame = {
  /** Progresso suavizado da rolagem dentro da seção (0..1). */
  p: number;
  /** Peso do 2º ato (tesserato 4D), 0..1. */
  w2: number;
};

export type OrbitHeroPulse = {
  /** Ato em que o clique aconteceu: 1 planeta, 2 tesserato, 3 órbitas calmas. */
  act: 1 | 2 | 3;
  /** No 1º ato, se o clique pegou perto do bug vermelho. */
  bug: boolean;
};

export type OrbitHeroOptions = {
  texts?: Partial<OrbitHeroTexts>;
  ariaLabel?: string;
  speed?: number;
  trip?: number;
  hue?: number;
  onFrame?: (s: OrbitHeroFrame) => void;
  /** Clique/toque curto na cena. */
  onPulse?: (s: OrbitHeroPulse) => void;
};

export type OrbitHeroInstance = {
  element: HTMLElement;
  setTexts: (t: Partial<OrbitHeroTexts>) => void;
  setOptions: (o: { speed?: number; trip?: number; hue?: number }) => void;
  destroy: () => void;
};

export function mountOrbitHero(root: HTMLElement, opts?: OrbitHeroOptions): OrbitHeroInstance;
export default mountOrbitHero;
