import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import { toFile } from "openai/uploads";

import { createReadStream } from "fs";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("Usando la versión de API:", process.env.AZURE_OPENAI_API_VERSION);
  
    const credential = new DefaultAzureCredential();
    const tokenProvider = getBearerTokenProvider(credential, process.env.AZURE_OPENAI_ENDPOINT! + "/.default");

    const client = new AzureOpenAI({
     // baseURL: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_KEY!,
    //  azureADTokenProvider: tokenProvider,
     apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    });

    const transcription = await client.audio.transcriptions.create({
      model: process.env.WHISPER_DEPLOYMENT!,
      file: await toFile(Buffer.from(await file.arrayBuffer()), file.name, { type: file.type }),
      language: "es"
    });

    return NextResponse.json({ text: transcription.text });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "An unknown error occurred" },
      { status: err.status || 500 }
    );
  }
}


