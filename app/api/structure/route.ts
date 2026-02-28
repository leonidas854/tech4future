import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY no está definida en las variables de entorno");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.transcript || typeof body.transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript inválido o vacío" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      // 1. CAMBIO DE MODELO: Usamos uno rápido y preciso disponible en Groq
      model: "llama-3.1-8b-instant", 
      temperature: 1,
      max_tokens: 1200, // En Groq se usa max_tokens, no max_completion_tokens
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `
Eres un asistente médico clínico experto.
A partir de la transcripción médica, extrae la información y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta. 
Para la propiedad "confidence", usa "high", "medium" o "low" según qué tan seguro estés de la información basada en el texto.
Si un dato no se menciona en la transcripción, omite el campo o déjalo vacío, no inventes datos.

ESTRUCTURA JSON REQUERIDA:
{
  "motivo_consulta": { "value": "string", "confidence": "high|medium|low" },
  "signos_vitales": {
    "temp": { "value": "string", "confidence": "high|medium|low" },
    "fc": { "value": "string", "confidence": "high|medium|low" },
    "pa": { "value": "string", "confidence": "high|medium|low" },
    "spo2": { "value": "string", "confidence": "high|medium|low" }
  },
  "sintomas": [{ "value": "string", "confidence": "high|medium|low" }],
  "antecedentes": [{ "value": "string", "confidence": "high|medium|low" }],
  "alergias": [{ "value": "string", "confidence": "high|medium|low" }],
  "medicacion_actual": [{ "value": "string", "confidence": "high|medium|low" }],
  "diagnostico_presuntivo": { "value": "string", "confidence": "high|medium|low" },
  "plan": { "value": "string", "confidence": "high|medium|low" },
  "observaciones": { "value": "string", "confidence": "high|medium|low" },
  "alertas": [{ "type": "string", "message": "string" }]
}
          `,
        },
        {
          role: "user",
          content: body.transcript,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Respuesta vacía del modelo" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "El modelo no devolvió JSON válido" },
        { status: 502 }
      );
    }

    // 2. RETORNAMOS EL JSON DIRECTAMENTE
    // Como le pedimos a la IA la estructura exacta del frontend, 
    // ya no necesitamos normalizarlo a strings planos.
    return NextResponse.json(parsed);
    
  } catch (error) {
    console.error("Error en /api/medical:", error);
    return NextResponse.json(
      { error: "Error interno procesando solicitud" },
      { status: 500 }
    );
  }
}