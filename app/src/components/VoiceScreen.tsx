"use client";

import React from "react";
import type { StructuredResult } from "../../types/structure";
import { structureTranscript } from "../../lib/structureClient";
import ReviewModal from "./Reviewmodal";



type VoiceScreenProps = {
  transcript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
  onReview: (structured: StructuredResult) => void;
};

export default function VoiceScreen(props: VoiceScreenProps) {
  const { transcript, setTranscript, onBack, onReview } = props;
const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isListening, setIsListening] = React.useState(false);

  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition no soportado en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) =>
          prev ? prev + " " + finalText.trim() : finalText.trim()
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [setTranscript]);

  function toggleMic() {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Evita error si se llama start dos veces seguidas
      }
    }
  }

  async function handleReview() {
    if (!transcript.trim()) {
      setError("El transcript está vacío.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const structured = await structureTranscript(transcript.trim());
      onReview(structured);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#F3FAF9",
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          borderRadius: 28,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(226,232,240,0.9)",
          boxShadow: "0 18px 60px rgba(2,6,23,0.10)",
          padding: 18,
        }}
      >
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
            Voice Recording
          </div>
        </div>

        <div style={{ marginTop: 18, display: "grid", placeItems: "center" }}>
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--accentAI) 80%, white), var(--secondary))",
              boxShadow: "0 18px 60px rgba(2,6,23,0.18)",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                letterSpacing: 1,
                color: "white",
              }}
            >
              AI
            </div>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -70,
                right: -70,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: 0.75,
                pointerEvents: "none",
              }}
            >
              <WaveSide />
              <WaveSide flip />
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              marginTop: 18,
              width: "100%",
              maxWidth: 340,
              height: 70,
              borderRadius: 18,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.18)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 6,
              padding: "12px 14px",
            }}
          >
            <WaveBars />
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "var(--muted)" }}>
              MedAssist AI is listening...
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "rgba(15,23,42,0.75)",
                lineHeight: 1.45,
                padding: "0 10px",
              }}
            >
              Dicta la nota y luego presiona <b>Review</b> para estructurarla.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(15,23,42,0.85)",
              marginBottom: 8,
            }}
          >
            Transcript (editable)
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Ej: Paciente refiere dolor torácico..."
            disabled={loading}
            style={{
              width: "100%",
              minHeight: 120,
              padding: 12,
              borderRadius: 18,
              border: "1px solid rgba(226,232,240,0.95)",
              background: "rgba(241,245,249,0.85)",
              color: "var(--text)",
              resize: "vertical",
              outline: "none",
              fontSize: 14,
              lineHeight: 1.5,
              opacity: loading ? 0.85 : 1,
            }}
          />

          {error ? (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "rgba(185,28,28,0.95)",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.18)",
                padding: "10px 12px",
                borderRadius: 14,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={onBack}
            disabled={loading}
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(15,23,42,0.75)",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              padding: "10px 6px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Atrás
          </button>
          

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setTranscript("")}
              disabled={loading}
              style={{
                minHeight: 42,
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.08)",
                color: "rgba(185,28,28,0.95)",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Stop
            </button>

            <button
              onClick={toggleMic}
              disabled={loading}
              aria-label="Mic"
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                border: "none",
                background: isListening
                  ? "red"
                  : "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--accentAI) 75%, white), var(--secondary))",
                boxShadow: "0 12px 26px rgba(16,185,129,0.22)",
                color: "white",
                fontSize: 20,
                cursor: loading ? "not-allowed" : "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              {isListening ? "⏹" : "🎙"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              //onClick={() => setShowModal(true)}>
              disabled={loading}
              style={{
                minHeight: 42,
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid rgba(6,182,212,0.35)",
                background: "rgba(6,182,212,0.08)",
                color: "rgba(15,23,42,0.85)",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : "Revisar"}
            </button>

            <ReviewModal
  open={showModal}
  transcript={transcript}
  onClose={() => setShowModal(false)}
/>


            
            
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            marginTop: 18,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 4,
              borderRadius: 999,
              background: "rgba(15,23,42,0.18)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function WaveSide({ flip }: { flip?: boolean }) {
  return (
    <div
      style={{
        width: 64,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
        <path
          d="M2 20 C 10 8, 18 32, 26 20 C 34 8, 42 32, 50 20 C 54 14, 58 10, 62 20"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function WaveBars() {
  const bars = [10, 26, 16, 32, 14, 28, 18, 34, 16, 24, 12];
  return (
    <>
      {bars.map((h, idx) => (
        <div
          key={idx}
          style={{
            width: 6,
            height: h,
            borderRadius: 999,
            background: "rgba(16,185,129,0.65)",
          }}
        />
      ))}
    </>
  );
}