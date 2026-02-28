"use client";

import React from "react";
import { structureTranscript } from "../../lib/structureClient";
import type { StructuredResult, FieldValue } from "../../types/structure";

type ReviewModalProps = {
  open: boolean;
  transcript: string;
  onClose: () => void;
};

export default function ReviewModal({
  open,
  transcript,
  onClose,
}: ReviewModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<StructuredResult | null>(null);

  React.useEffect(() => {
    if (!open || !transcript.trim()) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await structureTranscript(transcript);
        setData(result ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error con Groq");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open, transcript]);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ textAlign: "center" }}>Nota Clínica Estructurada</h3>

        {loading && <p style={{ textAlign: "center" }}>Procesando...</p>}

        {error && <div style={errorBoxStyle}>{error}</div>}

        {data && !loading && (
          <div style={{ display: "grid", gap: 14 }}>
            
            {data.motivo_consulta && (
              <Section title="Motivo de Consulta">
                <Field field={data.motivo_consulta} />
              </Section>
            )}

            {data.signos_vitales && (
              <Section title="Signos Vitales">
                {data.signos_vitales.temp && (
                  <Field field={data.signos_vitales.temp} label="Temperatura" />
                )}
                {data.signos_vitales.fc && (
                  <Field field={data.signos_vitales.fc} label="FC" />
                )}
                {data.signos_vitales.pa && (
                  <Field field={data.signos_vitales.pa} label="PA" />
                )}
                {data.signos_vitales.spo2 && (
                  <Field field={data.signos_vitales.spo2} label="SpO2" />
                )}
              </Section>
            )}

            <ArraySection title="Síntomas" items={data.sintomas ?? []} />
            <ArraySection title="Antecedentes" items={data.antecedentes ?? []} />
            <ArraySection title="Alergias" items={data.alergias ?? []} />
            <ArraySection title="Medicación Actual" items={data.medicacion_actual ?? []} />

            {data.observaciones && (
              <Section title="Observaciones">
                <Field field={data.observaciones} />
              </Section>
            )}

            {(data.alertas ?? []).length > 0 && (
              <Section title="⚠ Alertas">
                {(data.alertas ?? []).map((a, i) => (
                  <div key={i} style={alertStyle}>
                    <strong>{a?.type ?? "Alerta"}:</strong> {a?.message ?? ""}
                  </div>
                ))}
              </Section>
            )}
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={onClose} style={buttonStyle}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES AUXILIARES ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={sectionStyle}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function Field<T>({
  field,
  label,
}: {
  field?: FieldValue<T>;
  label?: string;
}) {
  if (!field) return null;

  if (
    field.value === null ||
    field.value === "" ||
    field.value === undefined
  )
    return null;

  return (
    <div style={{ marginBottom: 4 }}>
      {label && <strong>{label}: </strong>}
      {String(field.value)}
      {field.confidence && <ConfidenceBadge level={field.confidence} />}
    </div>
  );
}
function ArraySection({
  title,
  items,
}: {
  title: string;
  items?: unknown;
}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Section title={title}>
      {items.map((item: any, i: number) => {
        if (!item?.value) return null;

        return (
          <div key={i}>
            • {item.value}
            {item.confidence && (
              <ConfidenceBadge level={item.confidence} />
            )}
          </div>
        );
      })}
    </Section>
  );
}
function ConfidenceBadge({ level }: { level: string }) {
  const color =
    level === "high"
      ? "green"
      : level === "medium"
      ? "orange"
      : "red";

  return (
    <span
      style={{
        marginLeft: 8,
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 999,
        background: color,
        color: "white",
      }}
    >
      {level}
    </span>
  );
}

/* ================= ESTILOS ================= */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.45)",
  backdropFilter: "blur(6px)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
  padding: 20,
};

const modalStyle: React.CSSProperties = {
  width: "min(600px, 100%)",
  maxHeight: "85vh",
  overflowY: "auto",
  borderRadius: 28,
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(226,232,240,0.9)",
  boxShadow: "0 18px 60px rgba(2,6,23,0.18)",
  padding: 20,
};

const sectionStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: "rgba(241,245,249,0.85)",
  border: "1px solid rgba(226,232,240,0.95)",
};

const alertStyle: React.CSSProperties = {
  marginBottom: 6,
  padding: 8,
  borderRadius: 12,
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 999,
  border: "1px solid rgba(6,182,212,0.35)",
  background: "rgba(6,182,212,0.08)",
  fontWeight: 700,
  cursor: "pointer",
};

const errorBoxStyle: React.CSSProperties = {
  marginBottom: 14,
  padding: 12,
  borderRadius: 14,
  background: "rgba(239,68,68,0.08)",
  border: "1px solid rgba(239,68,68,0.2)",
  color: "rgba(185,28,28,0.95)",
};