"use client";

import { useCallback, useState } from "react";
import { ChatMessage } from "./components/chat-message";
import { Message } from "./types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [streaming, setStreaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(newMessages);

    try {
      // Cancel previous request if it exists
      if (controller) controller.abort();
      
      // Create new controller for this request
      const newController = new AbortController();
      setController(newController);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: newController.signal,
      });
      
      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";
      
      setMessages([...newMessages, { role: "assistant", content: "" }]);
      setStreaming(true);
      
      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
      
          aiMessage += decoder.decode(value, { stream: true });
      
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: aiMessage };
            return updated;
          });
        }
      };
      
      await readStream();
      
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        console.error("Error in chat:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant", 
            content: "Sorry, I encountered an error. Please try again."
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setStreaming(false);
    }
  };

  function stopResponse() {
    if (controller) {
      controller.abort();
      console.log("Chat stopped.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">AI Chat</h1>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex-1 flex flex-col space-y-6">
            <ScrollArea className="h-[calc(100vh-18rem)] border border-primary/20 rounded-xl shadow-lg bg-card/50">
              {messages.length > 0 ? (
                <div className="flex flex-col p-4">
                  {messages.map((message, i) => (
                    <ChatMessage key={i} message={message} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-lg text-muted-foreground/80 italic">Start your conversation...</p>
                </div>
              )}
            </ScrollArea>

            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-4 backdrop-blur-sm bg-card/30 p-4 rounded-xl border border-primary/20"
            >
              <Input
                value={input}
                autoComplete="off"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-background/50 border-primary/20 focus:border-primary/40 rounded-lg"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading}
                className="bg-primary/90 hover:bg-primary rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
