
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SendHorizonal, Bot, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { assistantChat, type HistoryMessage } from "@/ai/flows/assistant-chat";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

const initialMessages: Message[] = [
  { id: '1', text: "Hello! I'm your CampusCompanion AI. How can I assist you with your academic or placement journey today?", sender: 'bot' }
];

export default function AssistMePage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for the Genkit flow
      const history: HistoryMessage[] = messages
        .filter(msg => msg.id !== '1') // Exclude initial bot message from history
        .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: [{ text: msg.text }],
      }));

      const { response } = await assistantChat({ query: input, history });

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("AI chat failed:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="container flex-1 flex flex-col py-6">
        <div className="text-center mb-6">
            <h1 className="font-headline text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">Your personal guide for all things campus.</p>
        </div>
        <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === 'user' ? "justify-end" : ""
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-2xl rounded-lg p-3 text-sm",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p>{message.text}</p>
                  </div>
                  {message.sender === 'user' && user && (
                    <Avatar>
                      <AvatarImage src={user.photoURL ?? undefined} />
                      <AvatarFallback>{user.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4 bg-background">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} size="icon" aria-label="Send Message" disabled={isLoading}>
                <SendHorizonal className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
