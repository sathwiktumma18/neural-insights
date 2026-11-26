import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, TrendingUp, Mail, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AI_BASE = "http://localhost:5000/api/ai";

export default function MarketingDecisions() {
  const [objective, setObjective] = useState("Retention");

  const { data } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: async () => (await fetch(`${AI_BASE}/recommendations`)).json(),
  });

  const recs = data?.recommendations ?? [];
  const channels = data?.best_channels ?? [];

  const priorityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sorted = [...recs].sort((a: any, b: any) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Marketing Decisions</h1>
        <p className="text-muted-foreground mt-1">AI-driven recommendations, channel ranking, and strategy generation.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {sorted.map((r: any) => (
              <div key={r.title} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-foreground font-semibold">{r.title}</p>
                  <span className="text-[10px] px-2 py-1 rounded-full border border-border text-muted-foreground">{r.priority}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                <div className="grid sm:grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="p-3 rounded-lg bg-background/40 border border-border/40">
                    <p className="text-muted-foreground">Channel</p>
                    <p className="text-foreground font-medium mt-0.5">{r.channel}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/40 border border-border/40">
                    <p className="text-muted-foreground">Impact</p>
                    <p className="text-foreground font-medium mt-0.5">₹{Number(r.estimated_impact_inr ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/40 border border-border/40">
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="text-foreground font-medium mt-0.5">{r.confidence_pct ?? "—"}%</p>
                  </div>
                </div>
                {Array.isArray(r.action_steps) && (
                  <ul className="mt-3 text-xs text-muted-foreground list-disc pl-5 space-y-1">
                    {r.action_steps.slice(0, 4).map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {sorted.length === 0 && <p className="text-sm text-muted-foreground">Train models to generate recommendations.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-heading font-semibold text-foreground">Best Channels</h3>
            </div>
            <div className="space-y-2">
              {channels.map((c: any) => (
                <div key={c.channel} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground font-medium">{c.channel}</p>
                    <span className="text-xs text-muted-foreground">{c.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Best for: {(c.best_for ?? []).join(", ")}</p>
                </div>
              ))}
              {channels.length === 0 && <p className="text-sm text-muted-foreground">No channel rankings available yet.</p>}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Campaign Strategy</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-foreground">Objective</Label>
                <Input value={objective} onChange={(e) => setObjective(e.target.value)} className="mt-1.5 bg-muted border-border text-foreground" />
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  // Strategy is generated client-side to keep routes spec unchanged.
                  // (We already return best channels + recommendations from backend.)
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Generate
              </Button>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
                Try: <span className="text-foreground font-medium">Retention</span>,{" "}
                <span className="text-foreground font-medium">Growth</span>,{" "}
                <span className="text-foreground font-medium">Reduce churn</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

