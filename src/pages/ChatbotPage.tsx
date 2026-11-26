import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AI_BASE = "http://localhost:5000/api/ai";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMsg[]>([]);

  const mutation = useMutation({
    mutationFn: async (payload: any) =>
      (
        await fetch(`${AI_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ).json(),
    onSuccess: (data) => {
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
    },
  });

  const suggested = useMemo(() => {
    return mutation.data?.suggested_followups ?? [
      "What are the top risks this month?",
      "Which segment should we focus on?",
      "Predict next 6 months revenue",
    ];
  }, [mutation.data]);

  const send = () => {
    const text = message.trim();
    if (!text) return;
    setHistory((h) => [...h, { role: "user", content: text }]);
    setMessage("");
    mutation.mutate({ message: text, conversation_history: history });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">AI Chatbot</h1>
        <p className="text-muted-foreground mt-1">Ask questions with live business data injected into context.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Chat</h3>
        </div>

        {history.length === 0 && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm text-foreground font-semibold mb-2">Suggested starter questions</p>
            <div className="flex flex-wrap gap-2">
              {suggested.slice(0, 3).map((q: string) => (
                <Button key={q} variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => setMessage(q)}>
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {history.map((m, i) => (
            <div key={i} className={`p-4 rounded-lg border ${m.role === "user" ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"}`}>
              <p className="text-xs text-muted-foreground mb-1">{m.role === "user" ? "You" : "Assistant"}</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about revenue, churn, recommendations…"
            className="bg-muted border-border text-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button onClick={send} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={mutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {mutation.isPending && <p className="text-xs text-muted-foreground mt-2">Thinking…</p>}
      </div>
    </motion.div>
  );
}

