// Web Audio API Procedural Synthesizer for GrowFolio Game Audio
class SoundManager {
  private ctx: AudioContext | null = null;
  private isSfxMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.5;

  // Background Music State
  private musicNode: OscillatorNode[] = [];
  private musicGain: GainNode | null = null;
  private musicInterval: any = null;
  private musicPlaying: boolean = false;

  constructor() {
    // Lazy initialize to bypass browser autoplay policies
    this.isSfxMuted = localStorage.getItem('gf_sfx_muted') === 'true';
    this.isMusicMuted = localStorage.getItem('gf_music_muted') === 'true';
  }

  private initCtx() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("AudioContext initialization failed or blocked:", e);
      this.ctx = null;
    }
  }

  public toggleSfx() {
    this.isSfxMuted = !this.isSfxMuted;
    localStorage.setItem('gf_sfx_muted', this.isSfxMuted ? 'true' : 'false');
    return this.isSfxMuted;
  }

  public toggleMusic() {
    this.isMusicMuted = !this.isMusicMuted;
    localStorage.setItem('gf_music_muted', this.isMusicMuted ? 'true' : 'false');
    if (this.isMusicMuted) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
    return this.isMusicMuted;
  }

  public getSettings() {
    return { sfxMuted: this.isSfxMuted, musicMuted: this.isMusicMuted };
  }

  // SOUND EFFECTS
  public playClick() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("playClick failed:", e);
    }
  }

  public playCorrect() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // First note (C5)
      this.playTone(523.25, 'sine', 0.15, this.sfxVolume * 0.4);
      
      // Second note (E5) 80ms later
      setTimeout(() => {
        try {
          this.playTone(659.25, 'sine', 0.25, this.sfxVolume * 0.45);
        } catch (err) {}
      }, 85);
    } catch (e) {
      console.warn("playCorrect failed:", e);
    }
  }

  public playWrong() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      // Apply simple lowpass filter to make the buzz warmer/less harsh
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch (e) {
      console.warn("playWrong failed:", e);
    }
  }

  public playXpGain() {
    if (this.isSfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatonic scale sweep
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.15, this.sfxVolume * 0.25);
      }, idx * 60);
    });
  }

  public playCoin() {
    if (this.isSfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Classic retro game coin ping
    this.playTone(987.77, 'sine', 0.08, this.sfxVolume * 0.3);
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.25, this.sfxVolume * 0.35);
    }, 80);
  }

  public playWatering() {
    if (this.isSfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Simulate flowing water bubbles using frequency-modulated bubble tones
    const now = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const pitch = 300 + Math.random() * 500;
        this.playTone(pitch, 'sine', 0.08, this.sfxVolume * 0.2);
      }, i * 70);
    }
  }

  public playLevelUp() {
    if (this.isSfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Beautiful major-chord arpeggio culminating in a triumph!
    const chords = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.3, this.sfxVolume * 0.35);
      }, idx * 100);
    });
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    try {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.05);
    } catch (e) {
      console.warn("playTone failed:", e);
    }
  }

  // AMBIENT PROCEDURAL BACKGROUND MUSIC
  // Deactivated as requested for standard gameplay.
  public playMusic() {
    // No background music in main game unless explicitly called
  }

  // INTRO ONLY MUSIC
  public playIntroMusic() {
    // Music removed as requested
  }

  public stopIntroMusic() {
    this.stopMusic();
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicNode.length > 0) {
      try {
        this.musicNode.forEach(osc => {
          try {
            osc.stop();
          } catch (err) {}
        });
      } catch (e) {}
      this.musicNode = [];
    }
  }
}

export const gameAudio = new SoundManager();
