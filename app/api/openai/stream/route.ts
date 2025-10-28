import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    console.log("[OpenAI Stream] Received query request");

    if (!query || typeof query !== "string") {
      console.error("[OpenAI Stream] Invalid query:", query);
      return NextResponse.json(
        { error: "Invalid query. Please provide a valid question." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[OpenAI Stream] API key not configured");
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
          details: "Visit https://platform.openai.com/api-keys to obtain an API key."
        },
        { status: 500 }
      );
    }

    console.log("[OpenAI Stream] Starting GPT-4 stream...");

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful health and wellness assistant for Woman's World magazine. Provide accurate, evidence-based answers to health questions.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Create readable stream for client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    console.log("[OpenAI Stream] Stream started successfully");

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[OpenAI Stream] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate answer",
        details: errorMessage,
        suggestion: "Check server logs for more details."
      },
      { status: 500 }
    );
  }
}
