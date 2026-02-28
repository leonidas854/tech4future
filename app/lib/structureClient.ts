import type { StructuredResult } from "../types/structure";

export async function structureTranscript(transcript: string): Promise<StructuredResult> {
  const res = await fetch("/api/structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? "Error en /api/structure");
  }

  return (await res.json()) as StructuredResult;
}