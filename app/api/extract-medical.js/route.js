import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Recibimos el texto plano enviado desde el micrófono del cliente
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No se proporcionó texto" }, { status: 400 });
    }

    // 2. Llamada al LLM (Ejemplo usando la API de OpenAI para gpt-4o-mini)
    // Nota: Puedes cambiar la URL y la Key para usar Groq (Llama 3) de forma gratuita.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Tu variable de entorno
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo ultra ligero y económico
        response_format: { type: "json_object" }, // Forzamos a que solo devuelva JSON válido
        temperature: 0, // Temperatura 0 = Cero creatividad, máxima precisión analítica
        messages: [
          {
            role: 'system',
            content: `Eres un asistente médico experto en estructuración de datos. 
            Recibirás una transcripción de voz de un médico (puede estar desordenada o ser conversacional). 
            Tu única tarea es extraer la información médica y devolverla ESTRICTAMENTE en este formato JSON:
            {
              "nombre_paciente": "Nombre completo o null",
              "edad": "Edad en números o null",
              "sintomas": ["sintoma 1", "sintoma 2"],
              "notas": "Cualquier otro detalle clínico relevante o contexto adicional"
            }
            No agregues saludos, ni explicaciones, solo el objeto JSON.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    // 3. Extraemos el texto de la respuesta y lo parseamos a un objeto JavaScript
    const structuredData = JSON.parse(data.choices[0].message.content);

    // 4. Devolvemos los datos estructurados al frontend
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error("Error en la API de extracción:", error);
    return NextResponse.json(
      { error: "Hubo un error procesando el texto médico" }, 
      { status: 500 }
    );
  }
}