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
  // Deactivated as requested.
  public playMusic() {
    // No background music
  }

  /*
  public playMusic() {
    if (this.isMusicMuted || this.musicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.musicPlaying = true;
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(this.musicVolume * 0.22, this.ctx.currentTime);
    
    // Low-pass filter to keep it extremely warm, cozy and relaxing
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    this.musicGain.connect(filter);
    filter.connect(this.ctx.destination);

    // Beautiful scale frequencies (G minor / G natural minor)
    const G2 = 98.00;
    const Bb2 = 116.54;
    const C3 = 130.81;
    const D3 = 146.83;
    const Eb3 = 155.56;
    const F3 = 174.61;
    const G3 = 196.00;
    const A3 = 220.00;
    const Bb3 = 233.08;
    const C4 = 261.63;
    const D4 = 293.66;
    const Eb4 = 311.13;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const Bb4 = 466.16;

    // Chords definition matching the 4 phrases of the melody
    // G minor, Eb major, F major, D minor / G minor
    const chords = [
      [G2, D3, G3, Bb3, D4], // Gm
      [Eb3, Bb3, Eb4, G4],   // Eb
      [F3, C4, F4, A4],      // F
      [G2, D3, G3, Bb3, D4], // Gm
    ];

    // Tum Hi Ho iconic melody notation: [frequency, duration in beats]
    const melody: [number | null, number][] = [
      // 1. "Hum tere bin ab reh nahi sakte..." (9 beats)
      [D4, 1], [Eb4, 1], [D4, 1], [C4, 1.5], [Bb3, 0.5], [C4, 1], [D4, 2], [null, 1],
      // 2. "Tere bina kya wajood mera..." (9 beats)
      [C4, 1], [D4, 1], [C4, 1], [Bb3, 1.5], [A3, 0.5], [Bb3, 1], [C4, 2], [null, 1],
      // 3. "Tujhse juda agar ho jayenge..." (9 beats)
      [D4, 1], [F4, 1], [Eb4, 1], [D4, 1.5], [C4, 0.5], [Eb4, 1], [D4, 2], [null, 1],
      // 4. "Toh khud se hi ho jayenge juda..." (9 beats)
      [C4, 1], [Eb4, 1], [D4, 1], [C4, 1.5], [Bb3, 0.5], [C4, 1], [G3, 2], [null, 1]
    ];

    let currentStep = 0;
    let melodyIndex = 0;
    let nextNoteTime = 0;

    const BEAT_DURATION = 0.52; // slow, beautiful tempo (~115 BPM)

    const playStep = () => {
      if (!this.ctx || !this.musicPlaying || this.isMusicMuted) return;

      const now = this.ctx.currentTime;

      // Play a background pad chord at the start of each of the 4 phrases (every 9 beats)
      if (currentStep % 9 === 0) {
        const chordIndex = Math.floor(currentStep / 9) % chords.length;
        const chordNotes = chords[chordIndex];

        chordNotes.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

          // Soft ambient swell for the background pad
          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.12, now + BEAT_DURATION * 1.5);
          noteGain.gain.setValueAtTime(0.12, now + BEAT_DURATION * 6);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + BEAT_DURATION * 8.8);

          osc.connect(noteGain);
          noteGain.connect(this.musicGain!);
          osc.start(now);
          osc.stop(now + BEAT_DURATION * 9);
          
          this.musicNode.push(osc);
        });
      }

      // Play the lead melody note
      const [freq, durationBeats] = melody[melodyIndex];
      if (freq !== null) {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Sweet flute/bell-like sine wave for the soulful traditional lead
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Add subtle beautiful vibrato (frequency modulation) for that classic vocal expression
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.value = 5.2; // 5.2 Hz vibrato rate
        vibratoGain.gain.value = 3.2;  // 3.2 Hz vibrato depth
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        vibrato.start(now);
        vibrato.stop(now + BEAT_DURATION * durationBeats);
        this.musicNode.push(vibrato);

        // Melody note envelope (warm soft attack, sweet long release)
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.22, now + 0.05); // warm attack
        noteGain.gain.setValueAtTime(0.22, now + BEAT_DURATION * durationBeats - 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + BEAT_DURATION * durationBeats);

        // Connect through a lush feedback echo delay simulation
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.26;
        const delayGain = this.ctx.createGain();
        delayGain.gain.value = 0.32; // feedback ratio

        osc.connect(noteGain);
        noteGain.connect(this.musicGain!);

        // Feed to echo path
        noteGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + BEAT_DURATION * durationBeats + 0.1);

        this.musicNode.push(osc);
      }

      // Advance indices
      melodyIndex = (melodyIndex + 1) % melody.length;
      currentStep = (currentStep + durationBeats) % 36;
    };

    // Keep scheduling ahead using lookahead scheduler to bypass setInterval drift
    const scheduler = () => {
      if (!this.ctx || !this.musicPlaying || this.isMusicMuted) return;
      
      const now = this.ctx.currentTime;
      if (nextNoteTime === 0) {
        nextNoteTime = now;
      }

      while (nextNoteTime < now + 0.1) {
        const [_, durationBeats] = melody[melodyIndex];
        playStep();
        nextNoteTime += durationBeats * BEAT_DURATION;
      }
    };

    // Clear any active interval
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
    }

    // Dynamic scheduler runs every 50ms for clock-perfect timing
    this.musicInterval = setInterval(scheduler, 50);
  }
  */

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
