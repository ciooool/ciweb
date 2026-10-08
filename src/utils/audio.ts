// Web Audio API 纯原生合成音效（无需任何外部 mp3 文件，零网络延迟，毫秒级响应）

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 模拟复古金属拉绳吊灯机械开关的清脆咔哒声（Click）
   */
  public playLampSwitch() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. 高频金属撞击声 (Metallic snap)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // 2. 机械继电器低频回弹敲击 (Relay thud)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();

      thudOsc.type = "sine";
      thudOsc.frequency.setValueAtTime(160, now + 0.015);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);

      thudGain.gain.setValueAtTime(0, now);
      thudGain.gain.setValueAtTime(0.28, now + 0.015);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);

      thudOsc.start(now + 0.015);
      thudOsc.stop(now + 0.08);
    } catch {
      // Audio context might be restricted by browser policy before first gesture
    }
  }

  /**
   * 轻微的拉绳弹力声 (Cord stretch tension)
   */
  public playCordTension() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.linearRampToValueAtTime(520, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
