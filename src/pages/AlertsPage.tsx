import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AI_BASE = "http://localhost:5000/api/ai";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const SEVERITY_STYLE: Record<Severity, string> = {
  CRITICAL: "bg-destructive/10 text-destructive border-destructive/30",
  HIGH: "bg-warning/10 text-warning border-warning/30",
  MEDIUM: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-success/10 text-success border-success/30",
};

export default function AlertsPage() {
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"All" | Severity>("All");

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["ai-alerts"],
    queryFn: async () => (await fetch(`${AI_BASE}/alerts`)).json(),
  });

  useEffect(() => {
    const t = setInterval(() => refetch(), 60_000);
    return () => clearInterval(t);
  }, [refetch]);

  const alerts = (data?.alerts ?? []).map((a: any, idx: number) => ({
    ...a,
    _id: `${a.alert_type ?? "alert"}-${idx}-${a.severity ?? "x"}`,
  }));

  const filtered = useMemo(() => {
    const base = filter === "All" ? alerts : alerts.filter((a: any) => a.severity === filter);
    return base.filter((a: any) => !readIds[a._id]);
  }, [alerts, filter, readIds]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">AI Alerts</h1>
          <p className="text-muted-foreground mt-1">Auto-refreshes every 60 seconds.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="border-border text-foreground hover:bg-muted" disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((a: any) => (
          <div key={a._id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {a.severity === "CRITICAL" && <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />}
                {a.severity === "HIGH" && <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />}
                {a.severity === "MEDIUM" && <Info className="h-5 w-5 text-primary mt-0.5" />}
                {a.severity === "LOW" && <CheckCircle className="h-5 w-5 text-success mt-0.5" />}
                <div>
                  <p className="text-foreground font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${SEVERITY_STYLE[a.severity as Severity]}`}>{a.severity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted h-7 text-xs"
                  onClick={() => setReadIds((p) => ({ ...p, [a._id]: true }))}
                >
                  Mark as read
                </Button>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Suggested action: <span className="text-foreground font-medium">{a.suggested_action}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="glass-card p-6 text-center text-muted-foreground">No alerts (or all marked as read).</div>}
      </div>
    </motion.div>
  );
}

