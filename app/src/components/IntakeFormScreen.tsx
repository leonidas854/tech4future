"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

import type { Confidence, StructuredResult } from "../../types/structure";

type Props = {
  onBack: () => void;
  structured: StructuredResult | null;
};

const CRITICAL_KEYS = [
  "motivo_consulta",
  "signos_vitales.temp",
  "signos_vitales.fc",
  "alergias",
  "medicacion_actual",
] as const;

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

export default function IntakeFormScreen({ onBack, structured }: Props) {
  const [draft, setDraft] = useState<StructuredResult>(
    () => structured ?? createDemoStructured()
  );

  const [verified, setVerified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (structured) {
      setDraft(structured);
      setVerified({});
    }
  }, [structured]);

  const allCriticalVerified = useMemo(() => {
    return CRITICAL_KEYS.every((k) => verified[k] === true);
  }, [verified]);

  function toggleVerify(key: string) {
    setVerified((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setValue(path: string, value: string) {
    setDraft((prev) => {
      const next: StructuredResult = structuredClone(prev);
      const parts = path.split(".");
      let cur: any = next;

      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }

      const last = parts[parts.length - 1];

      if (cur?.[last] && typeof cur[last] === "object" && "value" in cur[last]) {
        if (
          ["signos_vitales.temp", "signos_vitales.fc", "signos_vitales.spo2"].includes(
            path
          )
        ) {
          const num = value.trim() === "" ? null : Number(value);
          cur[last].value = Number.isFinite(num as number) ? num : null;
        } else {
          cur[last].value = value;
        }
      }

      return next;
    });
  }

  function handleSave() {
    alert("✅ Registro guardado correctamente (Demo)");
  }

  return (
    <div className="container p-d-flex p-jc-center p-p-4">
      <div style={{ width: "100%", maxWidth: "650px" }}>
        <Card>
          <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
            <div>
              <h2 className="p-m-0">Registro Clínico</h2>
              <small>Generado automáticamente por IA</small>
            </div>
            <Tag severity="info" value="AI Assisted" />
          </div>

          <Divider />

          {/* Motivo de consulta */}
          <div className="p-field p-mb-3">
            <label>Motivo de Consulta *</label>
            <InputText
              value={draft.motivo_consulta.value ?? ""}
              onChange={(e) =>
                setValue("motivo_consulta", e.target.value)
              }
              className="p-inputtext-sm"
            />
            <Button
              icon={verified["motivo_consulta"] ? "pi pi-check" : "pi pi-pencil"}
              className="p-button-text p-ml-2"
              onClick={() => toggleVerify("motivo_consulta")}
            />
          </div>

          {/* Signos Vitales */}
          <h4>Signos Vitales</h4>

          <div className="p-formgrid p-grid">
            <div className="p-col-6">
              <label>Temperatura (°C) *</label>
              <InputNumber
                value={draft.signos_vitales.temp.value}
                onValueChange={(e) =>
                  setValue("signos_vitales.temp", String(e.value ?? ""))
                }
                mode="decimal"
                minFractionDigits={1}
                maxFractionDigits={1}
              />
            </div>

            <div className="p-col-6">
              <label>Frecuencia Cardíaca (LPM) *</label>
              <InputNumber
                value={draft.signos_vitales.fc.value}
                onValueChange={(e) =>
                  setValue("signos_vitales.fc", String(e.value ?? ""))
                }
              />
            </div>
          </div>

          <div className="p-formgrid p-grid p-mt-2">
            <div className="p-col-6">
              <label>Presión Arterial</label>
              <InputText
                value={draft.signos_vitales.pa.value ?? ""}
                onChange={(e) =>
                  setValue("signos_vitales.pa", e.target.value)
                }
              />
            </div>

            <div className="p-col-6">
              <label>SpO2 (%)</label>
              <InputNumber
                value={draft.signos_vitales.spo2.value}
                onValueChange={(e) =>
                  setValue("signos_vitales.spo2", String(e.value ?? ""))
                }
              />
            </div>
          </div>

          <Divider />

          {/* Alergias */}
          <div className="p-field">
            <label>Alergias *</label>
            <Chips
              value={draft.alergias.map((a) => a.value)}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  alergias: e.value.map((v: string) => ({
                    value: v,
                    confidence: "medium" as Confidence,
                  })),
                }))
              }
            />
          </div>

          {/* Medicación */}
          <div className="p-field p-mt-3">
            <label>Medicación Actual *</label>
            <Chips
              value={draft.medicacion_actual.map((m) => m.value)}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  medicacion_actual: e.value.map((v: string) => ({
                    value: v,
                    confidence: "medium" as Confidence,
                  })),
                }))
              }
            />
          </div>

          <Divider />

          {/* Observaciones */}
          <div className="p-field">
            <label>Observaciones</label>
            <InputTextarea
              rows={3}
              value={draft.observaciones.value ?? ""}
              onChange={(e) =>
                setValue("observaciones", e.target.value)
              }
            />
          </div>

          <Divider />

          {/* Botones */}
          <div className="p-d-flex p-flex-column p-gap-2">
            <Button
              label="Verificar y Guardar"
              icon="pi pi-check"
              className="p-button-success"
              disabled={!allCriticalVerified}
              onClick={handleSave}
            />

            <Button
              label="Solicitar Revisión IA"
              icon="pi pi-refresh"
              className="p-button-outlined p-button-secondary"
            />

            <Button
              label="Atrás"
              icon="pi pi-arrow-left"
              className="p-button-text"
              onClick={onBack}
            />
          </div>

          <div className="p-mt-3">
            {allCriticalVerified ? (
              <Message severity="success" text="Campos críticos verificados" />
            ) : (
              <Message severity="warn" text="Faltan campos críticos obligatorios" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}