// ─── Waveform bars ────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

// Static decorative bars — seeded from filename so they're consistent per file
const WaveformBars = ({ seed = "default", progress = 0, isOut, barCount = 32 }) => {
  const heights = useRef(
    Array.from({ length: barCount }, (_, i) => {
      // pseudo-random heights from seed + index
      const n = ((seed.charCodeAt(i % seed.length) || 65) * (i + 1) * 7) % 100;
      return Math.max(20, Math.min(90, n));
    })
  ).current;

  const filled = Math.round(progress * barCount);

  return (
    <div className="flex items-center gap-[2px] h-8 flex-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-full transition-colors duration-100 ${
            i < filled
              ? isOut ? "bg-white/90" : "bg-primary-500"
              : isOut ? "bg-white/30" : "bg-gray-300"
          }`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

// ─── Audio Player (WhatsApp style) ────────────────────────────────────────────
export const AudioPlayer = ({ file, isOut }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(file.duration || 0);

  const src = file.audioUrl
    || (file.file instanceof File ? URL.createObjectURL(file.file) : null)
    || file.url
    || null;

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
      setReady(true);
    };
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => { setPlaying(false); setCurrentTime(0); };
    audio.onerror = () => setReady(true);

    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !ready) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const displayTime = playing ? fmtTime(currentTime) : fmtTime(duration);

  // ── Outgoing (green bg, WhatsApp exact) ──
  if (isOut) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl rounded-br-sm bg-primary-500 min-w-[220px] max-w-[280px] shadow-sm">
          {/* Mic avatar */}
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <Mic size={16} className="text-white/90" />
          </div>

          {/* Play button */}
          <button
            onClick={toggle}
            disabled={!ready || !src}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
          >
            {playing
              ? <Pause size={13} className="text-white fill-white" />
              : <Play size={13} className="text-white fill-white translate-x-px" />
            }
          </button>

          {/* Waveform */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="flex-1 cursor-pointer py-1"
          >
            <WaveformBars
              seed={file.name || "voice"}
              progress={progress}
              isOut={true}
              barCount={28}
            />
          </div>

          {/* Duration */}
          <span className="text-[11px] text-white/70 tabular-nums shrink-0 min-w-[32px] text-right font-medium">
            {displayTime}
          </span>
        </div>

        {/* Timestamp row */}
        <MsgTimestamp time={file.time} status={file.status} isOut={isOut} />
      </div>
    );
  }

  // ── Incoming (white bg) ──
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-gray-100 shadow-sm min-w-[220px] max-w-[280px]">
        {/* Play button */}
        <button
          onClick={toggle}
          disabled={!ready || !src}
          className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 shadow-sm"
        >
          {playing
            ? <Pause size={13} className="text-white fill-white" />
            : <Play size={13} className="text-white fill-white translate-x-px" />
          }
        </button>

        {/* Waveform */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="flex-1 cursor-pointer py-1"
        >
          <WaveformBars
            seed={file.name || "voice"}
            progress={progress}
            isOut={false}
            barCount={28}
          />
        </div>

        {/* Duration */}
        <span className="text-[11px] text-gray-400 tabular-nums shrink-0 min-w-[32px] text-right font-medium">
          {displayTime}
        </span>

        {/* Mic icon */}
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Mic size={13} className="text-gray-400" />
        </div>
      </div>

      {/* Timestamp row */}
      <MsgTimestamp time={file.time} status={file.status} isOut={isOut} />
    </div>
  );
};
