// Sons curtos de enviar/receber mensagem do chat, sintetizados via Web Audio
// API — sem arquivos de áudio externos, sem libs. Falha em silêncio se o
// navegador bloquear/não suportar (ex.: jsdom nos testes, modo economia de bateria).
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  return sharedCtx;
}

function beep(freq: number, durationMs: number, volume = 0.05): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Web Audio indisponível/bloqueada — som é só um extra, nunca deve quebrar o chat
  }
}

export function playSendSound(): void {
  beep(720, 90);
}

export function playReceiveSound(): void {
  beep(480, 110);
}
