"use client";

import { useState, useEffect, useRef } from "react";

const VOICES = [
  "Bella", "Jasper", "Luna", "Bruno",
  "Rosie", "Hugo", "Kiki", "Leo",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Jasper");
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });
      if (!res.ok) throw new Error("Synthesis failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTimeout(() => audioRef.current?.play(), 100);
    } catch (err) {
      console.error(err);
      alert("Failed to generate audio. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    const blob = await fetch(audioUrl!).then(r => r.blob());
    const file = new File([blob], "tts-output.wav", { type: "audio/wav" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "Pussy TTS Audio" });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            😸️ Pussy Text to Speech Model
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            80M parameter model — CPU only
          </p>
        </div>

        <textarea
          className="w-full h-32 resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to synthesize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Voice
            </label>
            <select
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
            >
              {VOICES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Speed: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!mounted || loading || !text.trim()}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium py-3 transition-colors"
        >
          {loading ? "Generating..." : "Generate Speech"}
        </button>

        {audioUrl && (
          <div className="space-y-2">
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            <div className="flex gap-2">
              <a
                href={audioUrl}
                download="tts-output.wav"
                className="flex-1 block text-center rounded-xl border border-zinc-200 dark:border-zinc-700 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Download WAV
              </a>
              <button
                onClick={handleShare}
                className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 transition-colors"
              >
                Share to WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
