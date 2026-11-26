import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, CheckCircle, Info, XCircle,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

// ─── Mock data helpers ───────────────────────────────────────────────────────
const rand = (base: number, spread: number) =>
  Math.round(base + (Math.random() - 0.5) * spread);

const INITIAL_SALES = Array.from({ length: 10 }, (_, i) => ({
  t: `${10 - i}m ago`,
  v: rand(42000, 8000),
})).reverse();

const INITIAL_LOG = [
  { msg: "New sale: ₹1,240 — Order #8821", type: "success", ts: new Date() },
  { msg: "Stock updated for Product #42", type: "info", ts: new Date() },
  { msg: "Customer footfall spike detected", type: "warning", ts: new Date() },
  { msg: "Invoice #9910 processed", type: "info", ts: new Date() },
  { msg: "Inventory restocked: 400 units", type: "success", ts: new Date() },
];

const LOG_POOL = [
  { msg: "New sale: ₹2,150 — Order #8822", type: "success" },
  { msg: "Stock below threshold: SKU-0042", type: "warning" },
  { msg: "Customer footfall: 340 visitors today", type: "info" },
  { msg: "Payment received: ₹18,000", type: "success" },
  { msg: "Model A-003 retraining started", type: "info" },
  { msg: "Anomaly detected: Revenue spike +42%", type: "warning" },
];

const ANOMALY_DATA = [
  { t: "09:00", v: 38000 }, { t: "09:30", v: 41000 }, { t: "10:00", v: 39500 },
  { t: "10:30", v: 82000, anomaly: true }, { t: "11:00", v: 43000 }, { t: "11:30", v: 44500 },
  { t: "12:00", v: 42000 }, { t: "12:30", v: 12000, anomaly: true }, { t: "13:00", v: 45000 },
  { t: "13:30", v: 46000 }, { t: "14:00", v: 44000 },
];

const ANOMALY_HISTORY = [
  { ts: "2026-03-12 10:30", metric: "Revenue", type: "Spike", score: "96%", severity: "High", detail: "Revenue jumped 2.1× above the rolling 60-minute average. Likely caused by a flash sale event or bulk order." },
  { ts: "2026-03-12 12:30", metric: "Sales Volume", type: "Drop", score: "88%", severity: "High", detail: "Sales volume dropped 71% in a 30-minute window. Possible POS system outage or network disruption." },
  { ts: "2026-03-11 14:15", metric: "Inventory", type: "Drift", score: "74%", severity: "Medium", detail: "Inventory levels drifted 18% below expected threshold. Check supplier delivery schedule." },
  { ts: "2026-03-11 09:00", metric: "Footfall", type: "Spike", score: "65%", severity: "Medium", detail: "Customer footfall 60% above the Tuesday average. Marketing campaign may have driven extra traffic." },
  { ts: "2026-03-10 16:45", metric: "Revenue", type: "Drift", score: "58%", severity: "Low", detail: "Gradual revenue drift detected over 3-hour window. Pattern consistent with end-of-day slowdown." },
  { ts: "2026-03-10 11:20", metric: "Processing Time", type: "Spike", score: "52%", severity: "Low", detail: "Order processing time increased 35%. Likely due to high concurrency during peak hours." },
];

// ─── KPI helpers ─────────────────────────────────────────────────────────────
const makeKPIs = () => [
  { label: "Live Sales", value: `₹${(rand(428310, 30000)).toLocaleString("en-IN")}`, sub: "Today" },
  { label: "Inventory Level", value: `${rand(74, 10)}%`, sub: "Current stock" },
  { label: "Revenue Today", value: `₹${(rand(128000, 20000)).toLocaleString("en-IN")}`, sub: "All channels" },
  { label: "Customer Footfall", value: `${rand(340, 60)}`, sub: "Visitors today" },
];

const severityColor: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-primary/10 text-primary",
};

export default function RealTimeMonitoring() {
  const [tab, setTab] = useState<"live" | "anomalies">("live");
  const [kpis, setKpis] = useState(makeKPIs());
  const [salesData, setSalesData] = useState(INITIAL_SALES);
  const [log, setLog] = useState(INITIAL_LOG);
  const [selectedAnomaly, setSelectedAnomaly] = useState<(typeof ANOMALY_HISTORY)[0] | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setKpis(makeKPIs());
      setSalesData((prev) => {
        const next = [...prev.slice(1), { t: "now", v: rand(42000, 12000) }];
        return next.map((p, i) => ({ ...p, t: `${next.length - i - 1}m ago` })).reverse().reverse();
      });
      const pick = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
      setLog((prev) => [{ ...pick, ts: new Date() }, ...prev].slice(0, 10));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Live Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">Real-time operational data feed.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-success text-sm font-semibold">LIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["live", "anomalies"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "live" ? "Live Feed" : "Anomalies"}
          </button>
        ))}
      </div>

      {/* ── LIVE FEED TAB ── */}
      {tab === "live" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="glass-card p-5">
                <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Sales chart */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Live Sales (Last 10 points)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
                <XAxis dataKey="t" stroke="hsl(215 20% 55%)" fontSize={11} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Sales"]}
                />
                <Line type="monotone" dataKey="v" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(191 100% 50%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Activity log */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Activity Log</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {log.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                  {entry.type === "success" && <CheckCircle className="h-4 w-4 text-success mt-0.5" />}
                  {entry.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />}
                  {entry.type === "info" && <Info className="h-4 w-4 text-primary mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{entry.msg}</p>
                    <p className="text-xs text-muted-foreground">{fmtTime(entry.ts)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── ANOMALIES TAB ── */}
      {tab === "anomalies" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Anomaly chart */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Revenue — Anomaly Detection</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={ANOMALY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
                <XAxis dataKey="t" stroke="hsl(215 20% 55%)" fontSize={11} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="v" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={false} />
                {ANOMALY_DATA.filter((d) => d.anomaly).map((d) => (
                  <ReferenceDot key={d.t} x={d.t} y={d.v} r={8} fill="hsl(0 84% 60%)" stroke="white" strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">● Red dots indicate detected anomalies</p>
          </div>

          {/* Anomaly history table */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Anomaly History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Timestamp", "Metric", "Type", "Confidence", "Severity", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ANOMALY_HISTORY.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 text-muted-foreground text-xs">{row.ts}</td>
                      <td className="py-3 px-3 text-foreground font-medium">{row.metric}</td>
                      <td className="py-3 px-3 text-foreground">{row.type}</td>
                      <td className="py-3 px-3 text-primary font-semibold">{row.score}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColor[row.severity]}`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary text-xs h-7"
                          onClick={() => setSelectedAnomaly(row)}
                        >
                          View Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Anomaly Detail Dialog */}
      <Dialog open={!!selectedAnomaly} onOpenChange={() => setSelectedAnomaly(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading">
              Anomaly Detail — {selectedAnomaly?.metric}
            </DialogTitle>
          </DialogHeader>
          {selectedAnomaly && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm text-foreground font-medium">{selectedAnomaly.ts}</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm text-primary font-bold">{selectedAnomaly.score}</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm text-foreground font-medium">{selectedAnomaly.type}</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColor[selectedAnomaly.severity]}`}>
                    {selectedAnomaly.severity}
                  </span>
                </div>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm font-semibold text-foreground mb-2">AI Explanation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedAnomaly.detail}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
