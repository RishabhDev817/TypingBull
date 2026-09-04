import { soundEngine } from '../../../utils/audio';

/**
 * LilypadAudioService uses standard HTMLAudioElement linked directly to real
 * audio recordings in /sounds/ (calm water ambience, organic frog croak, victory fanfare).
 */
class LilypadAudioService {
  private ambientWaterAudio: HTMLAudioElement | null = null;
  private frogCroakAudio: HTMLAudioElement | null = null;
  private victoryHurrayAudio: HTMLAudioElement | null = null;
  private isAmbientPlaying = false;

  constructor() {
    // 1. Continuous soothing ambient calm water track (Volume: 0.15 strictly)
    try {
      this.ambientWaterAudio = new Audio('/sounds/calm_water_ambience.wav');
      this.ambientWaterAudio.loop = true;
      this.ambientWaterAudio.volume = 0.15;
    } catch {
      this.ambientWaterAudio = null;
    }

    // 2. Real Organic Frog Croak / Ribbit Jump Sound
    try {
      this.frogCroakAudio = new Audio('/sounds/frog_croak.wav');
      this.frogCroakAudio.volume = 0.75;
    } catch {
      this.frogCroakAudio = null;
    }

    // 3. Real Victory Hurray Fanfare
    try {
      this.victoryHurrayAudio = new Audio('/sounds/victory_hurray.wav');
      this.victoryHurrayAudio.volume = 0.8;
    } catch {
      this.victoryHurrayAudio = null;
    }
  }

  /**
   * Starts peaceful calm lake water ambient sound at low 15% volume (0.15)
   */
  startAmbient() {
    if (soundEngine.muted || this.isAmbientPlaying || !this.ambientWaterAudio) return;

    this.ambientWaterAudio.currentTime = 0;
    this.ambientWaterAudio.volume = 0.15;
    this.ambientWaterAudio
      .play()
      .then(() => {
        this.isAmbientPlaying = true;
      })
      .catch(() => {
        // User gesture may be required before autoplay
      });
  }

  /**
   * Stops ambient water audio cleanly
   */
  stopAmbient() {
    if (!this.isAmbientPlaying || !this.ambientWaterAudio) return;

    this.ambientWaterAudio.pause();
    this.ambientWaterAudio.currentTime = 0;
    this.isAmbientPlaying = false;
  }

  /**
   * Plays real organic frog croak sound
   * STRICT TRIGGER: Only called at the exact moment the frog jumps.
   * Resets currentTime = 0 so rapid typing never skips or cuts off.
   */
  playJumpRibbit() {
    if (soundEngine.muted) return;

    if (this.frogCroakAudio) {
      try {
        this.frogCroakAudio.currentTime = 0;
        this.frogCroakAudio.play().catch(() => {});
      } catch {
        // Safe fallback
      }
    }
  }

  /**
   * Plays gentle water landing splash
   */
  playSplash() {
    if (soundEngine.muted) return;
    soundEngine.playPop();
  }

  /**
   * Keystroke mechanical click
   */
  playKeyClick() {
    if (soundEngine.muted) return;
    soundEngine.playClick(false);
  }

  /**
   * Soft mistake boing
   */
  playKeyError() {
    if (soundEngine.muted) return;
    soundEngine.playError();
  }

  /**
   * Celebratory "Hurray!" fanfare on Lotus Flower finale
   */
  playHurrayVictory() {
    if (soundEngine.muted) return;

    if (this.victoryHurrayAudio) {
      try {
        this.victoryHurrayAudio.currentTime = 0;
        this.victoryHurrayAudio.play().catch(() => {});
      } catch {
        // Safe fallback
      }
    }
  }
}

export const lilypadAudio = new LilypadAudioService();
