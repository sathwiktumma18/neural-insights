import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sliders, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AI_BASE = "http://localhost:5000/api/ai";

export default function WhatIfSimulator() {
  const { data: scenarios } = useQuery({
    queryKey: ["ai-whatif-scenarios"],
    queryFn: async () => (await fetch(`${AI_BASE}/whatif/scenarios`)).json(),
  });

  const [marketingSpend, setMarketingSpend] = useState(180000);
  const [discountRate, setDiscountRate] = useState(7);
  const [region, setRegion] = useState("All");
  const [channel, setChannel] = useState("Paid Social");

  const mutation = useMutation({
    mutationFn: async (payload: any) =>
      (
        await fetch(`${AI_BASE}/whatif/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ).json(),
  });

  const payload = useMemo(
    () => ({
      marketing_spend: marketingSpend,
      discount_rate: discountRate / 100,
      target_region: region,
      ad_channel: channel,
    }),
    [marketingSpend, discountRate, region, channel],
  );

  const run = () => mutation.mutate(payload);

  const result = mutation.data;
  const risk = result?.risk_level ?? "—";

  const riskStyle =
    risk === "HIGH" ? "bg-destructive/10 text-destructive border-destructive/30" : risk === "MEDIUM" ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30";

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">What‑If Simulator</h1>
        <p className="text-muted-foreground mt-1">Simulate marketing + pricing decisions and see projected revenue impact.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Scenario Controls</h3>
            </div>
            <Button onClick={run} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={mutation.isPending}>
              <TrendingUp className="h-4 w-4 mr-2" />
              {mutation.isPending ? "Simulating…" : "Simulate"}
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground font-medium">Marketing spend</p>
              <p className="text-sm text-muted-foreground">₹{marketingSpend.toLocaleString()}</p>
            </div>
            <div className="mt-3">
              <Slider value={[marketingSpend]} min={0} max={600000} step={10000} onValueChange={(v) => setMarketingSpend(v[0])} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground font-medium">Discount rate</p>
              <p className="text-sm text-muted-foreground">{discountRate}%</p>
            </div>
            <div className="mt-3">
              <Slider value={[discountRate]} min={0} max={30} step={1} onValueChange={(v) => setDiscountRate(v[0])} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-foreground font-medium mb-2">Target region</p>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["All", "North", "South", "East", "West"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-foreground font-medium mb-2">Ad channel</p>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["Email", "Paid Social", "Search", "In-app", "SMS"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="font-heading font-semibold text-foreground">Output</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground">Baseline revenue</p>
              <p className="text-xl font-heading font-bold text-foreground mt-1">₹{Number(result?.baseline_revenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground">Projected revenue</p>
              <p className="text-xl font-heading font-bold text-foreground mt-1">₹{Number(result?.projected_revenue ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Change: <span className="text-foreground font-medium">{Number(result?.change_pct ?? 0).toFixed(2)}%</span> (
                <span className="text-foreground font-medium">₹{Number(result?.change_inr ?? 0).toLocaleString()}</span>)
              </p>
            </div>
            <div className={`p-3 rounded-lg border text-xs font-medium ${riskStyle}`}>Risk level: {risk}</div>

            {Array.isArray(result?.recommendations) && result.recommendations.length > 0 && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-foreground font-semibold mb-2">Recommendations</p>
                <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                  {result.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Preset scenarios</h3>
        <div className="flex flex-wrap gap-2">
          {(scenarios?.scenarios ?? []).map((s: any) => (
            <Button
              key={s.name}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
              onClick={() => {
                setMarketingSpend(s.params.marketing_spend);
                setDiscountRate(Math.round(s.params.discount_rate * 100));
                setRegion(s.params.target_region);
                setChannel(s.params.ad_channel);
              }}
            >
              {s.name}
            </Button>
          ))}
          {(scenarios?.scenarios ?? []).length === 0 && <p className="text-sm text-muted-foreground">No presets available yet.</p>}
        </div>
      </div>
    </motion.div>
  );
}

