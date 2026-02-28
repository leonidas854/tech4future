"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Confidence, StructuredResult } from "../types/structure";

const CRITICAL_KEYS = [
  "motivo_consulta",
  "signos_vitales.temp",
  "signos_vitales.fc",
  "alergias",
  "medicacion_actual",
] as const;

type CriticalKey = (typeof CRITICAL_KEYS)[number];

type Props = {
  onBack: () => void;
  structured: StructuredResult | null;
};

function createDemoStructured(): StructuredResult {
  return {
    motivo_consulta: { value: "Dolor de cabeza y fiebre", confidence: "medium" },
    signos_vitales: {
      temp: { value: 38.2, confidence: "medium" },
      fc: { value: 96, confidence: "medium" },
      pa: { value: "120/80", confidence: "high" },
      spo2: { value: 97, confidence: "high" },
    },
    sintomas: [{ value: "fiebre", confidence: "medium" }],
    antecedentes: [],
    alergias: [{ value: "Penicilina", confidence: "medium" }],
    medicacion_actual: [{ value: "Paracetamol", confidence: "medium" }],
    observaciones: { value: "Paciente estable.", confidence: "low" },
    alertas: [],
  };
}

export default function IntakeFormScreen(props: Props) {
  const { onBack, structured } = props;

  // draft = versión editable (lo que se va a guardar)
  const [draft, setDraft] = useState<StructuredResult>(() => structured ?? createDemoStructured());
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  // Cuando llegue un structured nuevo desde VoiceScreen, lo cargamos al draft
  useEffect(() => {
    if (structured) {
      setDraft(structured);
      setVerified({}); // opcional: reset verificación al cargar nuevo caso
    }
  }, [structured]);

  const allCriticalVerified = useMemo(() => {
    return CRITICAL_KEYS.every((k) => verified[k] === true);
  }, [verified]);

  function toggleVerify(key: CriticalKey | string) {
    setVerified((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Setter por paths (MVP, sin librerías)
  function setValue(path: string, value: string) {
    setDraft((prev) => {
      const next: StructuredResult = structuredClone(prev);
      const parts = path.split(".");
      let cur: any = next;

      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      const last = parts[parts.length - 1];

      // si el target es FieldValue<T>
      if (cur?.[last] && typeof cur[last] === "object" && "value" in cur[last]) {
        // intentamos parsear números para signos vitales numéricos
        if (path === "signos_vitales.temp" || path === "signos_vitales.fc" || path === "signos_vitales.spo2") {
          const num = value.trim() === "" ? null : Number(value);
          cur[last].value = Number.isFinite(num as number) ? num : null;
        } else {
          cur[last].value = value;
        }
      }

      return next;
    });
  }

  function setList(path: "alergias" | "medicacion_actual", text: string) {
    const items = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((v) => ({ value: v, confidence: "medium" as Confidence }));

    setDraft((prev) => ({
      ...prev,
      [path]: items,
    }));
  }

  function handleSave() {
    // aquí luego: persistencia SQLite -> records table
    // guardar draft como structured_json y verified como verified_fields_json
    alert("✅ Guardado (demo)\n\nStructured + Verified listos para persistir.");
  }

  // Helpers para mostrar en inputs (convertir number|null a string)
  const tempStr = draft.signos_vitales.temp.value ?? "";
  const fcStr = draft.signos_vitales.fc.value ?? "";
  const spo2Str = draft.signos_vitales.spo2.value ?? "";

  return (
    <div className="form-screen">
      <div className="form-phone">
        <div className="form-titlePill">Auto-filled Intake Form</div>

        <div className="form-card">
          <PillField
            label="Motivo de consulta"
            value={draft.motivo_consulta.value ?? ""}
            onChange={(v) => setValue("motivo_consulta", v)}
            verified={verified["motivo_consulta"] === true}
            onVerify={() => toggleVerify("motivo_consulta")}
            critical
          />

          <PillField
            label="Temperatura"
            value={String(tempStr)}
            onChange={(v) => setValue("signos_vitales.temp", v)}
            verified={verified["signos_vitales.temp"] === true}
            onVerify={() => toggleVerify("signos_vitales.temp")}
            critical
          />

          <PillField
            label="Frecuencia cardíaca"
            value={String(fcStr)}
            onChange={(v) => setValue("signos_vitales.fc", v)}
            verified={verified["signos_vitales.fc"] === true}
            onVerify={() => toggleVerify("signos_vitales.fc")}
            critical
          />

          <PillField
            label="Presión arterial"
            value={draft.signos_vitales.pa.value ?? ""}
            onChange={(v) => setValue("signos_vitales.pa", v)}
            verified={verified["signos_vitales.pa"] === true}
            onVerify={() => toggleVerify("signos_vitales.pa")}
          />

          <PillField
            label="SpO2"
            value={String(spo2Str)}
            onChange={(v) => setValue("signos_vitales.spo2", v)}
            verified={verified["signos_vitales.spo2"] === true}
            onVerify={() => toggleVerify("signos_vitales.spo2")}
          />

          <PillField
            label="Alergias"
            value={(draft.alergias || []).map((x) => x.value).join(", ")}
            onChange={(v) => setList("alergias", v)}
            verified={verified["alergias"] === true}
            onVerify={() => toggleVerify("alergias")}
            critical
          />

          <PillField
            label="Medicación actual"
            value={(draft.medicacion_actual || []).map((x) => x.value).join(", ")}
            onChange={(v) => setList("medicacion_actual", v)}
            verified={verified["medicacion_actual"] === true}
            onVerify={() => toggleVerify("medicacion_actual")}
            critical
          />

          <PillField
            label="Observaciones"
            value={draft.observaciones.value ?? ""}
            onChange={(v) => setValue("observaciones", v)}
            verified={verified["observaciones"] === true}
            onVerify={() => toggleVerify("observaciones")}
          />

          <div className="form-actions">
            <button className="form-primaryBtn" disabled={!allCriticalVerified} onClick={handleSave}>
              Verify and Submit
            </button>

            <button className="form-outlineBtn" onClick={() => alert("Demo: Request AI Review")}>
              Request AI Review
            </button>

            <button className="btn btn--ghost" onClick={onBack}>
              Back
            </button>
          </div>

          <div className="form-footerHint">
            {allCriticalVerified ? "✅ Campos críticos verificados" : "⚠️ Verifica campos críticos para habilitar Guardar"}
          </div>
        </div>
      </div>
    </div>
  );
}

function PillField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  verified: boolean;
  onVerify: () => void;
  critical?: boolean;
}) {
  const { label, value, onChange, verified, onVerify, critical } = props;

  return (
    <div className="form-field">
      <div className="form-labelRow">
        <div className="form-label">
          {label} {critical ? "(CRÍTICO)" : ""}
        </div>

        <button className="form-editBtn" onClick={onVerify} title="Verify" type="button">
          {verified ? "✅" : "✎"}
        </button>
      </div>

      <div className="form-pill">
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}