"use client";

import { useEffect, useRef, useState } from "react";

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

export default function TestDictadoPage() {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    const recognition: ISpeechRecognition =
      new SpeechRecognitionAPI();

    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setText((prev) => prev + transcript);
    };

    recognition.onerror = (event: Event) => {
      console.error("Error reconocimiento:", event);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const start = () => {
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clear = () => {
    setText("");
  };

  if (!supported) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Tu navegador no soporta dictado por voz</h1>
        <p>Prueba con Google Chrome o Edge.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>🧪 Página de Prueba - Dictado por Voz</h1>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {!isListening ? (
          <button onClick={start}>🎙 Iniciar</button>
        ) : (
          <button onClick={stop}>⏹ Detener</button>
        )}
        <button onClick={clear}>🧹 Limpiar</button>
      </div>

      <textarea
        value={text}
        readOnly
        rows={10}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 10,
          fontSize: 16
        }}
        placeholder="Aquí aparecerá lo que dictes..."
      />
    </div>
  );
}