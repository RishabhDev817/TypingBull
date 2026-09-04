import { soundEngine } from '../../../utils/audio';

class NeonAudioService {
  private ctx: AudioContext | null = null;
  private bgmIntervalId: number | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private currentStep = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // ─── 1. CYBERPUNK SYNTHWAVE PROCEDURAL BACKGROUND TRACK ───────────

  startBgm() {
    if (soundEngine.muted || this.isBgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.currentStep = 0;

    // Master BGM gain node
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.2, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);

    // 124 BPM -> 16th note interval = (60 / 124) / 4 = ~121ms
    const stepIntervalMs = 120;
    const bassline = [
      // D minor progression (Dm - Bb - F - C)
      73.42, 73.42, 146.83, 73.42, 73.42, 73.42, 146.83, 73.42,  // D2
      58.27, 58.27, 116.54, 58.27, 58.27, 58.27, 116.54, 58.27,  // Bb1
      87.31, 87.31, 174.61, 87.31, 87.31, 87.31, 174.61, 87.31,  // F2
      65.41, 65.41, 130.81, 65.41, 65.41, 65.41, 130.81, 65.41   // C2
    ];

    const arpNotes = [
      293.66, 349.23, 440.00, 587.33, // D4, F4, A4, D5
      233.08, 293.66, 349.23, 466.16, // Bb3, D4, F4, Bb4
      349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
      261.63, 329.63, 392.00, 523.25  // C4, E4, G4, C5
    ];

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.isBgmPlaying || soundEngine.muted || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const step = this.currentStep % 32;

      // 1. Kick Drum (beats 0, 4, 8, 12, 16, 20, 24, 28 - four on the floor)
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.1);
        kickGain.gain.setValueAtTime(0.7, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.13);
      }

      // 2. Punchy Snare / Clap (beats 4, 12, 20, 28)
      if (step % 8 === 4) {
        // Noise burst
        const bufferSize = this.ctx.sampleRate * 0.09;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-22 * (i / this.ctx.sampleRate));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, t);
        noise.connect(noiseGain);
        noiseGain.connect(this.bgmGain);
        noise.start(t);
      }

      // 3. Crisp Hi-Hats (every even 16th note)
      if (step % 2 === 0) {
        const hhSize = this.ctx.sampleRate * 0.03;
        const hhBuffer = this.ctx.createBuffer(1, hhSize, this.ctx.sampleRate);
        const hhData = hhBuffer.getChannelData(0);
        for (let i = 0; i < hhSize; i++) {
          hhData[i] = (Math.random() * 2 - 1) * Math.exp(-60 * (i / this.ctx.sampleRate));
        }
        const hh = this.ctx.createBufferSource();
        hh.buffer = hhBuffer;
        const hhGain = this.ctx.createGain();
        hhGain.gain.setValueAtTime(step % 4 === 2 ? 0.25 : 0.12, t);
        hh.connect(hhGain);
        hhGain.connect(this.bgmGain);
        hh.start(t);
      }

      // 4. Analog Sawtooth Bassline
      const bassFreq = bassline[step];
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, t);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(450, t);
      bassFilter.frequency.exponentialRampToValueAtTime(160, t + 0.08);

      bGain.gain.setValueAtTime(0.35, t);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bGain);
      bGain.connect(this.bgmGain);
      bassOsc.start(t);
      bassOsc.stop(t + 0.1);

      // 5. Arpeggiated Atmospheric Synth Plucks
      if (step % 2 === 1) {
        const chordIdx = Math.floor(step / 8);
        const noteIdx = (step % 8) % 4;
        const arpFreq = arpNotes[chordIdx * 4 + noteIdx];

        const arpOsc = this.ctx.createOscillator();
        const aGain = this.ctx.createGain();
        arpOsc.type = 'triangle';
        arpOsc.frequency.setValueAtTime(arpFreq, t);

        aGain.gain.setValueAtTime(0.15, t);
        aGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        arpOsc.connect(aGain);
        aGain.connect(this.bgmGain);
        arpOsc.start(t);
        arpOsc.stop(t + 0.19);
      }

      this.currentStep++;
    }, stepIntervalMs);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      } catch {
        // Safe ramp
      }
    }
  }

  // ─── 2. SHOOTING / TYPING: SCI-FI SYNTHWAVE SNAP ZAP ──────────────

  playLaser(pitch = 1.0) {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dual oscillator for punchy snap zap + laser tail
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1200 * pitch, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      // Sub click
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(450 * pitch, now);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.09);
      osc2.start(now);
      osc2.stop(now + 0.05);
    } catch {
      // AudioContext fallback
    }
  }

  // ─── 3. WORD DESTROYED: SATISFYING DIGITAL CONFIRM BEEP ───────────

  playWordDestroyed(isTurbo = false) {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Digital double confirmation chime (high-tech beep)
      const f1 = isTurbo ? 1046.5 : 880; // C6 or A5
      const f2 = isTurbo ? 1318.5 : 1174.66; // E6 or D6

      [f1, f2].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.17);
      });

      // Sub bass boom
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.31);
    } catch {
      // AudioContext fallback
    }
  }

  // ─── 4. PLAYER HIT: SYSTEM WARNING ALARM + GLITCHY ROBOTIC AI VOICE ─

  playDamage() {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Harsh system warning buzzer with distortion
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const shaper = ctx.createWaveShaper();

      // Simple soft distortion curve
      const n = 256;
      const curve = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i * 2) / n - 1;
        curve[i] = (3 + 10) * x * 20 * (Math.PI / 180) / (Math.PI + 10 * Math.abs(x));
      }
      shaper.curve = curve;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.35);

      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(shaper);
      shaper.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // AudioContext fallback
    }

    // Glitchy Robotic AI Voice Repetition using Web Speech API
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Warning! Shield breach!');
        utterance.rate = 1.4;
        utterance.pitch = 0.65;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // SpeechSynthesis fallback
    }
  }

  // ─── 5. COMBO & TURBO BOOST: RISING SYNTHWAVE CRESCENDO ───────────

  playComboUp(multiplier: number) {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chordNotes = multiplier >= 8 
        ? [523.25, 659.25, 783.99, 1046.5, 1318.5] // C5 E5 G5 C6 E6
        : multiplier >= 4
        ? [440, 554.37, 659.25, 880] // A4 C#5 E5 A5
        : [329.63, 440, 554.37]; // E4 A4 C#5

      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now + idx * 0.04);
        filter.frequency.exponentialRampToValueAtTime(2400, now + idx * 0.04 + 0.25);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.22, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.31);
      });
    } catch {
      // AudioContext fallback
    }
  }

  playTurboActivated() {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Intense analog riser sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.55);

      filter.type = 'bandpass';
      filter.Q.value = 4.0;
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.55);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.62);

      // AI Voice Alert: "Turbo Overdrive engaged!"
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Turbo Overdrive!');
        utterance.rate = 1.35;
        utterance.pitch = 0.8;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // AudioContext fallback
    }
  }

  // ─── 6. VICTORY CRESCENDO FANFARE ─────────────────────────────────

  playVictoryCrescendo() {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const victoryChords = [
        [261.63, 329.63, 392.0],        // C Major
        [329.63, 415.3, 493.88],        // E Major
        [392.0, 493.88, 587.33],        // G Major
        [523.25, 659.25, 783.99, 1046.5] // C Octave Climax
      ];

      victoryChords.forEach((chord, step) => {
        const stepTime = now + step * 0.18;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.setValueAtTime(0.24, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + (step === 3 ? 1.2 : 0.28));

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(stepTime);
          osc.stop(stepTime + (step === 3 ? 1.25 : 0.3));
        });
      });

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('System override success!');
        utterance.rate = 1.2;
        utterance.pitch = 0.9;
        utterance.volume = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // AudioContext fallback
    }
  }

  playTypoZap() {
    if (soundEngine.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(95, now + 0.04);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // AudioContext fallback
    }
  }
}

export const neonAudio = new NeonAudioService();
