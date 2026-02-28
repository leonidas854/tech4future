"use client";

import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import VoiceScreen from "./components/VoiceScreen";
import IntakeFormScreen from "./components/IntakeFormScreen";
import type { StructuredResult } from "./types/structure";

type Step = "login" | "voice" | "form";

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
        onSignIn={() => setStep("voice")}
      />
    );
  }

  if (step === "voice") {
    return (
      <VoiceScreen
        transcript={transcript}
        setTranscript={setTranscript}
        onBack={() => setStep("login")}
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