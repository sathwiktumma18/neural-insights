import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const AI_BASE = "http://localhost:5000/api/ai";

export default function ExplainableAIPage() {
  const { data } = useQuery({
    queryKey: ["ai-explain-features"],
    queryFn: async () => (await fetch(`${AI_BASE}/explain/features`)).json(),
  });

  const [input, setInput] = useState({
    month: 1,
    quarter: 1,
    lag_1: 1000,
    lag_3: 1000,
    lag_6: 1000,
    rolling_avg_3: 1000,
    rolling_avg_6: 1000,
  });

  const { data: predExplain, refetch, isFetching } = useQuery({
    queryKey: ["ai-explain-prediction", input],
    enabled: false,
    queryFn: async () => {
      const qs = new URLSearchParams(Object.entries(input).map(([k, v]) => [k, String(v)]));
      return (await fetch(`${AI_BASE}/explain/prediction?${qs.toString()}`)).json();
    },
  });

  const features = useMemo(() => (data?.features ?? []).slice(0, 12), [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Explainable AI</h1>
        <p className="text-muted-foreground mt-1">Feature importance + plain‑English explanations for predictions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Feature Importance</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">RandomForest feature importance (global).</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={[...features].reverse()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis type="number" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis type="category" dataKey="feature_name" stroke="hsl(215 20% 55%)" fontSize={11} width={120} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
              <Bar dataKey="importance_score" fill="hsl(262 100% 59%)" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="h-5 w-5 text-success" />
            <h3 className="font-heading font-semibold text-foreground">Explain a Prediction</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Provide the engineered features and get a plain-English explanation.</p>

          <div className="space-y-3">
            {Object.entries(input).map(([k, v]) => (
              <div key={k}>
                <Label className="text-foreground">{k}</Label>
                <Input
                  type="number"
                  value={v as any}
                  onChange={(e) => setInput((p) => ({ ...p, [k]: Number(e.target.value) }))}
                  className="mt-1.5 bg-muted border-border text-foreground"
                />
              </div>
            ))}

            <Button onClick={() => refetch()} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isFetching}>
              {isFetching ? "Explaining…" : "Explain"}
            </Button>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground">
              {predExplain?.explanation ?? <span className="text-muted-foreground">Run “Explain” to generate an explanation.</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Model Comparison</h3>
        <p className="text-xs text-muted-foreground mb-4">Shown on the Sales Prediction page (Random Forest vs Linear Regression).</p>
      </div>
    </motion.div>
  );
}

