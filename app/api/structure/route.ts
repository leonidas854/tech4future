import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const transcript = body?.transcript;

  if (!transcript) {
    return NextResponse.json(
      { error: "transcript requerido" },
      { status: 400 }
    );
  }

  const structured = {
    motivo_consulta: { value: "Dolor de cabeza y fiebre", confidence: "medium" },
    signos_vitales: {
      temp: { value: null, confidence: "low" },
      fc: { value: null, confidence: "low" },
      pa: { value: null, confidence: "low" },
      spo2: { value: null, confidence: "low" }
    },
    sintomas: [{ value: "fiebre", confidence: "medium" }],
    antecedentes: [],
    alergias: [],
    medicacion_actual: [],
    observaciones: { value: null, confidence: "low" },
    alertas: [
      { type: "missing_field", message: "Faltan alergias y medicación_actual" }
    ]
  };

  return NextResponse.json(structured);
}