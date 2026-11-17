// Native Web Audio API Sound Effects Synthesizer (Optimized for Mobile & Desktop)

type SoundStateListener = (isMuted: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private listeners: Set<SoundStateListener> = new Set();
  private isUnlocked: boolean = false;

  constructor() {
    // Check localStorage for audio preference (default unmuted or muted)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rtson_sound_enabled');
      this.isMuted = saved === 'false';

      // Auto-unlock AudioContext on first mobile touch or click
      const unlockAudio = () => {
        if (!this.isUnlocked) {
          this.initContext();
          this.isUnlocked = true;
        }
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('touchend', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };

      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('touchend', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // AudioContext creation failure on restrictive devices
    }
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isMuted);
      } catch (e) {
        // Safe dispatch
      }
    });
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rtson_sound_enabled', String(!this.isMuted));
    }
    if (!this.isMuted) {
      this.initContext();
      this.playChime();
    }
    this.notifyListeners();
    return !this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rtson_sound_enabled', String(!this.isMuted));
    }
    this.notifyListeners();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Futuristic soft hover blip (balanced for mobile speaker drivers)
  public playHover() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignore audio failure
    }
  }

  // Satisfying click confirmation tone
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.07); // A5

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      // Ignore
    }
  }

  // High-energy success chime
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + idx * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.2);
      });
    } catch (e) {
      // Ignore
    }
  }

  // Playful UI pop/sparkle tone
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      // Ignore
    }
  }

  public playSuccess() {
    this.playChime();
  }

  // Realistic mechanical wall light switch click (tactile toggle snap)
  public playSwitch(isOn: boolean = true) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      // Low transient thump
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(isOn ? 180 : 140, t);
      osc1.frequency.exponentialRampToValueAtTime(isOn ? 70 : 50, t + 0.035);
      gain1.gain.setValueAtTime(0.06, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.04);

      // High metallic snap
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(isOn ? 2200 : 1600, t);
      osc2.frequency.exponentialRampToValueAtTime(isOn ? 3400 : 2200, t + 0.02);
      gain2.gain.setValueAtTime(0.025, t);
      gain2.gain.exponentialRampToValueAtTime(0.0005, t + 0.02);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.025);
    } catch (e) {
      // Audio safety
    }
  }

  // Tactile dimmer slider / rheostat notch tick
  public playDimmer(levelPercent: number = 50) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      // Pitch rises gently with higher dimmer levels
      const baseFreq = 220 + (levelPercent / 100) * 380;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, t + 0.025);
      gain.gain.setValueAtTime(0.018, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.025);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) {
      // Audio safety
    }
  }

  // Cyber calculation / filter adjust swoop
  public playSwoop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore
    }
  }

  // Realistic Robot Footstep Hydraulic Impact Sound
  public playRobotStep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Low frequency punchy step thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);

      // Metallic hydraulic servo friction blip
      const servoOsc = this.ctx.createOscillator();
      const servoGain = this.ctx.createGain();
      servoOsc.type = 'triangle';
      servoOsc.frequency.setValueAtTime(380, this.ctx.currentTime + 0.02);
      servoOsc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.09);

      servoGain.gain.setValueAtTime(0.02, this.ctx.currentTime + 0.02);
      servoGain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.09);

      servoOsc.connect(servoGain);
      servoGain.connect(this.ctx.destination);

      servoOsc.start(this.ctx.currentTime + 0.02);
      servoOsc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      // Ignore
    }
  }

  // App & Web Holographic Splash Bursts Sound
  public playAppSplash() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const pitches = [587.33, 783.99, 1174.66, 1567.98]; // D5, G5, D6, G6
      pitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.025);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, this.ctx.currentTime + idx * 0.025 + 0.1);

        gain.gain.setValueAtTime(0.025, this.ctx.currentTime + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + idx * 0.025 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.025);
        osc.stop(this.ctx.currentTime + idx * 0.025 + 0.12);
      });
    } catch (e) {
      // Ignore
    }
  }

  // Studio Camera Shutter Snapshot Sound Effect
  public playCameraShutter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);

      // Secondary mechanical mirror click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.04);
      clickOsc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);

      clickGain.gain.setValueAtTime(0.08, this.ctx.currentTime + 0.04);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start(this.ctx.currentTime + 0.04);
      clickOsc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      // Ignore
    }
  }

  // Authentic iPhone Date Picker / Rotary Scroll Wheel Haptic Tick Sound
  public playIPhoneWheelTick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. High transient mechanical tick (iOS haptic tick click)
      const highOsc = this.ctx.createOscillator();
      const highGain = this.ctx.createGain();
      const highFilter = this.ctx.createBiquadFilter();

      highOsc.type = 'triangle';
      highOsc.frequency.setValueAtTime(2400, now);
      highOsc.frequency.exponentialRampToValueAtTime(700, now + 0.009);

      highFilter.type = 'bandpass';
      highFilter.frequency.setValueAtTime(1800, now);
      highFilter.Q.setValueAtTime(4.0, now);

      highGain.gain.setValueAtTime(0.08, now);
      highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.011);

      highOsc.connect(highFilter);
      highFilter.connect(highGain);
      highGain.connect(this.ctx.destination);

      highOsc.start(now);
      highOsc.stop(now + 0.012);

      // 2. Damped subtle acoustic resonance body
      const lowOsc = this.ctx.createOscillator();
      const lowGain = this.ctx.createGain();

      lowOsc.type = 'sine';
      lowOsc.frequency.setValueAtTime(320, now);
      lowOsc.frequency.exponentialRampToValueAtTime(140, now + 0.012);

      lowGain.gain.setValueAtTime(0.04, now);
      lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

      lowOsc.connect(lowGain);
      lowGain.connect(this.ctx.destination);

      lowOsc.start(now);
      lowOsc.stop(now + 0.015);
    } catch (e) {
      // Ignore
    }
  }

  // Alias for date picker / wheel tick
  public playPickerTick() {
    this.playIPhoneWheelTick();
  }

  // Realistic Viscous Paint Droplet Falling & Splashing into Jar
  public playLiquidDrop(pitchMultiplier = 1) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.type = 'sine';
      // Downward liquid pitch drop characteristic of viscous paint
      const startFreq = (520 + Math.random() * 60) * pitchMultiplier;
      const endFreq = (240 + Math.random() * 30) * pitchMultiplier;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.075);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
