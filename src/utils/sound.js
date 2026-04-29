// utils/sound.js

let audioContext = null;

const soundManager = {
  cache: new Map(),
  activeSounds: new Set(),
  unlocked: false,

  init() {
    if (typeof window === "undefined") return;
    this.preload();
    this.setupUnlock();
  },

  preload() {
    const sounds = {
      kotCreated: "/Sound/created.mp3",
      successSound: "/Sound/success.mp3",
      cancelSound: "/Sound/cancel.mp3",
      serveSound: "/Sound/serve.mp3",
    };

    Object.entries(sounds).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = 0.6;
      this.cache.set(name, audio);
    });
  },

  // -------- UNLOCK AUDIO --------
  setupUnlock() {
    const unlock = () => {
      this.unlockAudio();

      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
  },

  unlockAudio() {
    if (this.unlocked) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();

      // create silent buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      this.unlocked = true;
      console.log("🔊 Audio unlocked");
    } catch (err) {
      console.warn("Audio unlock failed:", err);
    }
  },

  // -------- PLAY SOUND --------
  async play(name) {
    if (!this.isEnabled()) return;

    const audio = this.cache.get(name);
    if (!audio) return;

    try {
      const clone = audio.cloneNode(true);
      this.activeSounds.add(clone);

      clone.currentTime = 0;
      await clone.play();

      clone.addEventListener("ended", () => this.activeSounds.delete(clone), {
        once: true,
      });
    } catch (err) {
      console.warn(`Sound "${name}" failed:`, err);
    }
  },

  stopAll() {
    this.activeSounds.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    this.activeSounds.clear();
  },

  // -------- SETTINGS --------
  isEnabled() {
    return localStorage.getItem("soundEnabled") !== "false";
  },

  setEnabled(enabled) {
    localStorage.setItem("soundEnabled", enabled ? "true" : "false");
    if (!enabled) this.stopAll();
  },

  setVolume(volume) {
    const v = Math.min(1, Math.max(0, volume));
    this.cache.forEach((a) => (a.volume = v));
  },
};

// INIT ON IMPORT
soundManager.init();

// PUBLIC API
export const playOrderCreatedSound = () => soundManager.play("kotCreated");
export const playSuccessSound = () => soundManager.play("successSound");
export const playCancelSound = () => soundManager.play("cancelSound");
export const playServeSound = () => soundManager.play("serveSound");

export const setSoundEnabled = (v) => soundManager.setEnabled(v);

export const isSoundEnabled = () => soundManager.isEnabled();

export const setSoundVolume = (v) => soundManager.setVolume(v);
