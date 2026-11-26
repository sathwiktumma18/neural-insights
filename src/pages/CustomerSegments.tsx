import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AI_BASE = "http://localhost:5000/api/ai";

export default function CustomerSegments() {
  const [filter, setFilter] = useState<string>("All");
  const [form, setForm] = useState({
    total_purchases: 2,
    avg_order_value: 120,
    days_since_last_purchase: 30,
    ltv: 800,
  });

  const { data: segs, refetch } = useQuery({
    queryKey: ["ai-segments"],
    queryFn: async () => (await fetch(`${AI_BASE}/customers/segments`)).json(),
  });

  const { data: atRisk } = useQuery({
    queryKey: ["ai-at-risk"],
    queryFn: async () => (await fetch(`${AI_BASE}/customers/at-risk`)).json(),
  });

  const predictMutation = useMutation({
    mutationFn: async () =>
      (
        await fetch(`${AI_BASE}/customers/predict-segment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      ).json(),
  });

  const trainMutation = useMutation({
    mutationFn: async () => (await fetch(`${AI_BASE}/train`, { method: "POST" })).json(),
    onSuccess: () => refetch(),
  });

  const segments = segs?.segments ?? [];
  const customers = atRisk?.customers ?? [];

  const segmentOptions = useMemo(() => ["All", ...segments.map((s: any) => s.label)], [segments]);

  const filteredCustomers = useMemo(() => {
    if (filter === "All") return customers;
    return customers.filter((c: any) => c.segment_label === filter);
  }, [customers, filter]);

  const predicted = predictMutation.data;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Customer Segments</h1>
          <p className="text-muted-foreground mt-1">KMeans segmentation with churn risk scoring.</p>
        </div>
        <Button onClick={() => trainMutation.mutate()} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={trainMutation.isPending}>
          <Sparkles className="h-4 w-4 mr-2" />
          {trainMutation.isPending ? "Training…" : "Train / Refresh"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((s: any) => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{s.customers}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg churn risk: {(Number(s.avg_churn_risk) * 100).toFixed(0)}%</p>
          </div>
        ))}
        {segments.length === 0 && <div className="glass-card p-5 text-muted-foreground">Train to generate segments.</div>}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 className="font-heading font-semibold text-foreground">Customers (filterable)</h3>
            <div className="flex gap-2 flex-wrap">
              {segmentOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    filter === opt
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/50">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Segment</th>
                  <th className="py-2 pr-4">Churn risk</th>
                  <th className="py-2 pr-4">Days since last</th>
                  <th className="py-2 pr-4">LTV</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c: any) => (
                  <tr key={c.customer_id} className="border-b border-border/30 last:border-0">
                    <td className="py-2 pr-4 text-foreground font-medium">{c.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.segment_label}</td>
                    <td className="py-2 pr-4 text-foreground">{(Number(c.churn_risk_score) * 100).toFixed(0)}%</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.days_since_last_purchase}</td>
                    <td className="py-2 pr-4 text-foreground">₹{Number(c.ltv).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No customers found for this segment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Predict Segment</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-foreground">Total purchases</Label>
                <Input
                  type="number"
                  value={form.total_purchases}
                  onChange={(e) => setForm((p) => ({ ...p, total_purchases: Number(e.target.value) }))}
                  className="mt-1.5 bg-muted border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Avg order value</Label>
                <Input
                  type="number"
                  value={form.avg_order_value}
                  onChange={(e) => setForm((p) => ({ ...p, avg_order_value: Number(e.target.value) }))}
                  className="mt-1.5 bg-muted border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Days since last purchase</Label>
                <Input
                  type="number"
                  value={form.days_since_last_purchase}
                  onChange={(e) => setForm((p) => ({ ...p, days_since_last_purchase: Number(e.target.value) }))}
                  className="mt-1.5 bg-muted border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">LTV</Label>
                <Input
                  type="number"
                  value={form.ltv}
                  onChange={(e) => setForm((p) => ({ ...p, ltv: Number(e.target.value) }))}
                  className="mt-1.5 bg-muted border-border text-foreground"
                />
              </div>
              <Button onClick={() => predictMutation.mutate()} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={predictMutation.isPending}>
                {predictMutation.isPending ? "Predicting…" : "Predict"}
              </Button>
            </div>

            {predicted && (
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-foreground font-semibold">Result</p>
                <p className="text-xs text-muted-foreground mt-1">Segment: <span className="text-foreground font-medium">{predicted.label}</span></p>
                <p className="text-xs text-muted-foreground mt-1">Churn risk: <span className="text-foreground font-medium">{(Number(predicted.churn_risk_score) * 100).toFixed(0)}%</span></p>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-warning" />
              <h3 className="font-heading font-semibold text-foreground">At-risk customers</h3>
            </div>
            <div className="space-y-2">
              {customers.slice(0, 8).map((c: any) => (
                <div key={c.customer_id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm text-foreground font-medium">{c.name}</p>
                    <span className="text-[10px] px-2 py-1 rounded-full border border-border text-muted-foreground">{(Number(c.churn_risk_score) * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.segment_label}</p>
                </div>
              ))}
              {customers.length === 0 && <p className="text-sm text-muted-foreground">Train segmentation to populate this list.</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

