"use client";

import { useState } from "react";
import LoginScreen from "./src/components/LoginScreen";
import VoiceScreen from "./src/components/VoiceScreen";
import IntakeFormScreen from "./src/components/IntakeFormScreen";
import BienvenidaSection from "./src/components/Bienvenida";
import type { StructuredResult } from "./types/structure";

type Step = "login" | "bienvenida" | "voice" | "form";

export default function Page() {
  const [step, setStep] = useState<Step>("login");

  const [email, setEmail] = useState("user@hospital.com");
  const [password, setPassword] = useState("password");

  const [transcript, setTranscript] = useState("Paciente con fiebre y dolor de garganta...");
  const [structured, setStructured] = useState<StructuredResult | null>(null);

  if (step === "login") {
    return (
      <LoginScreen
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSignIn={() => setStep("bienvenida")}
      />
    );
  }

  if (step === "bienvenida") {
    return (
      <BienvenidaSection 
        onContinue={() => setStep("voice")} 
        onLogout={() => setStep("login")}
      />
    );
  }

  if (step === "voice") {
    return (
      <VoiceScreen
        transcript={transcript}
        setTranscript={setTranscript}
        onBack={() => setStep("bienvenida")}
        onReview={(result) => {
          setStructured(result);
          setStep("form");
        }}
      />
    );
  }

  return (
    <IntakeFormScreen
      onBack={() => setStep("voice")}
      structured={structured}
    />
  );
}