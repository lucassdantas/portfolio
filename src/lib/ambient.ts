// Trilha ambiente do site, gerada ao vivo com Web Audio API — sem arquivo,
// sem lib, nada para baixar. Calma e baixinha no site inteiro; a
// OrbitSection sobe a "intensidade" enquanto o astronauta está em cena e
// devolve ao zero depois.
//
// Camadas: pad (acordes longos, osciladores levemente desafinados num
// filtro passa-baixa), grave contínuo, sinos esparsos sorteados numa escala
// pentatônica e um reverb gerado (resposta ao impulso de ruído com
// decaimento). Intensidade abre o filtro, adiciona um pulso suave e mais sinos.
//
// Se `site.ambientTrack` apontar para um arquivo em /public, ele toca no
// lugar da trilha gerada, com a mesma lógica de volume/intensidade.
//
// Navegador só deixa tocar áudio depois de um gesto (clique/tecla): por isso
// começa desligado e só liga pelo botão (SoundToggle).
import { site } from "@/data";

type Ctor = typeof AudioContext;

const BASE_GAIN = 0.05; // volume "baixinho" no site todo
const PEAK_GAIN = 0.11; // no auge do astronauta
const CHORD_SECONDS = 9;
// acordes em Hz (Cmaj9 → Am9 → Fmaj7 → Gsus2), registro médio-grave
const CHORDS = [
  [130.81, 196.0, 246.94, 293.66],
  [110.0, 164.81, 196.0, 246.94],
  [87.31, 130.81, 164.81, 220.0],
  [98.0, 146.83, 196.0, 220.0],
];
const BELLS = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private wet: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextChordAt = 0;
  private nextBeatAt = 0;
  private chordIndex = 0;
  private intensity = 0;
  private audioEl: HTMLAudioElement | null = null;
  playing = false;

  private build(): boolean {
    if (typeof window === "undefined") return false;
    const C =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!C) return false;
    const ctx = new C();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.4;

    // reverb: ruído estéreo com decaimento exponencial
    const len = Math.floor(ctx.sampleRate * 4);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    const dry = ctx.createGain();
    dry.gain.value = 0.6;

    filter.connect(dry).connect(master);
    filter.connect(conv).connect(wet).connect(master);

    this.ctx = ctx;
    this.master = master;
    this.filter = filter;
    this.wet = wet;
    return true;
  }

  private voice(freq: number, start: number, dur: number, gain: number, type: OscillatorType, detune = 0) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const atk = Math.min(dur * 0.4, 3.2);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + atk);
    g.gain.setValueAtTime(gain, start + dur - atk);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(this.filter!);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  private bell(freq: number, start: number, gain: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 2.8);
    osc.connect(g).connect(this.filter!);
    osc.start(start);
    osc.stop(start + 3);
  }

  /** Agenda o que cai nos próximos ~0,6s (chamado a cada 200ms). */
  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    const ahead = ctx.currentTime + 0.6;
    while (this.nextChordAt < ahead) {
      const chord = CHORDS[this.chordIndex % CHORDS.length];
      const dur = CHORD_SECONDS + 3; // sobreposição: um acorde funde no outro
      chord.forEach((f, i) => {
        this.voice(f, this.nextChordAt, dur, 0.05, "triangle", -6 + i * 3);
        this.voice(f * 2, this.nextChordAt, dur, 0.018, "sine", 7);
      });
      this.voice(chord[0] / 2, this.nextChordAt, dur, 0.06, "sine");
      this.chordIndex++;
      this.nextChordAt += CHORD_SECONDS;
    }
    // batida de 1/2s: sinos esparsos; na intensidade, pulso suave e mais sinos
    while (this.nextBeatAt < ahead) {
      const i = this.intensity;
      if (Math.random() < 0.12 + i * 0.4) {
        this.bell(BELLS[Math.floor(Math.random() * BELLS.length)], this.nextBeatAt, 0.02 + i * 0.025);
      }
      if (i > 0.15) {
        const root = CHORDS[(this.chordIndex - 1 + CHORDS.length) % CHORDS.length][0];
        this.bell(root * 2, this.nextBeatAt, 0.012 * i);
      }
      this.nextBeatAt += 0.5;
    }
  };

  async start() {
    if (this.playing) return;
    if (site.ambientTrack) {
      if (!this.audioEl) {
        this.audioEl = new Audio(site.ambientTrack);
        this.audioEl.loop = true;
      }
      this.audioEl.volume = BASE_GAIN * 4;
      try {
        await this.audioEl.play();
        this.playing = true;
      } catch {
        /* navegador bloqueou: fica desligado */
      }
      return;
    }
    if (!this.ctx && !this.build()) return;
    const ctx = this.ctx!;
    if (ctx.state === "suspended") await ctx.resume();
    this.nextChordAt = ctx.currentTime + 0.1;
    this.nextBeatAt = ctx.currentTime + 1.5;
    this.schedule();
    this.timer = setInterval(this.schedule, 200);
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setTargetAtTime(this.targetGain(), ctx.currentTime, 1.2);
    this.playing = true;
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    if (this.audioEl) {
      this.audioEl.pause();
      return;
    }
    const ctx = this.ctx;
    if (!ctx) return;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.master!.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(() => {
      if (!this.playing) void ctx.suspend();
    }, 2000);
  }

  private targetGain() {
    return BASE_GAIN + (PEAK_GAIN - BASE_GAIN) * this.intensity;
  }

  /** 0 = calmo (site inteiro), 1 = auge (astronauta). Transição suave. */
  setIntensity(v: number) {
    const i = Math.max(0, Math.min(1, v));
    if (Math.abs(i - this.intensity) < 0.01) return;
    this.intensity = i;
    if (this.audioEl) {
      this.audioEl.volume = Math.min(1, this.targetGain() * 4);
      return;
    }
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    const now = ctx.currentTime;
    this.filter!.frequency.setTargetAtTime(900 + i * 3600, now, 0.6);
    this.wet!.gain.setTargetAtTime(0.55 + i * 0.2, now, 0.6);
    this.master!.gain.setTargetAtTime(this.targetGain(), now, 0.8);
  }
}

/** Instância única: o botão liga/desliga, a OrbitSection ajusta a intensidade. */
export const ambient = new Ambient();
