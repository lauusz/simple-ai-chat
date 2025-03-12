import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  
  const stream = await ollama.chat({
    model: "qwen2.5:1.5b",
    messages,
    stream: true,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk.message.content));
          }
          controller.close();
        } catch (error) {
          console.error("Stream interrupted:", error);
          controller.close();
        }
      },
      cancel() {
        console.log("Stream aborted by client");
      },
    }),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
}
