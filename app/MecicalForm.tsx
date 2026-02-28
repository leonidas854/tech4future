"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tipo mínimo manual para evitar depender de lib.dom
 */
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

export default function MecicalForm() {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition: ISpeechRecognition =
      new SpeechRecognitionAPI();

    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: Event) => {
      console.error("Speech recognition error:", event);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  if (!isSupported) {
    return (
      <div className="p-4">
        <p className="text-red-600">
          Tu navegador no soporta reconocimiento de voz.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        Formulario Médico (Dictado por Voz)
      </h2>

      <div className="flex gap-2">
        {!isListening ? (
          <button
            onClick={startListening}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Iniciar Dictado
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Detener
          </button>
        )}

        <button
          onClick={clearTranscript}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Limpiar
        </button>
      </div>

      <textarea
        value={transcript}
        readOnly
        rows={6}
        className="w-full border rounded p-2"
        placeholder="Aquí aparecerá el texto dictado..."
      />
    </div>
  );
}