import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, TrendingUp, Users, AlertTriangle, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API_BASE = "http://localhost:5000/api";
const AI_BASE = "http://localhost:5000/api/ai";

const pieColors = ["hsl(262 100% 59%)", "hsl(191 100% 50%)", "hsl(142 76% 50%)", "hsl(45 100% 60%)"];

export default function AIDashboard() {
  const { data: aiPred } = useQuery({
    queryKey: ["ai-sales-predict-6"],
    queryFn: async () => (await fetch(`${AI_BASE}/sales/predict?months=6`)).json(),
  });

  const { data: segs } = useQuery({
    queryKey: ["ai-segments"],
    queryFn: async () => (await fetch(`${AI_BASE}/customers/segments`)).json(),
  });

  const { data: recs } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: async () => (await fetch(`${AI_BASE}/recommendations`)).json(),
  });

  const { data: alerts } = useQuery({
    queryKey: ["ai-alerts"],
    queryFn: async () => (await fetch(`${AI_BASE}/alerts`)).json(),
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => (await fetch(`${API_BASE}/get-dashboard-data`)).json(),
  });

  const predictedNext = aiPred?.predictions?.[0]?.predicted_revenue ?? 0;
  const rfR2 = aiPred?.accuracy?.random_forest?.r2 ?? null;

  const kpis = [
    { label: "Predicted Revenue", value: `₹${Number(predictedNext).toLocaleString()}`, icon: TrendingUp, sub: "Next month forecast" },
    { label: "Segments", value: `${segs?.segments?.length ?? 0}`, icon: Users, sub: "Active clusters" },
    { label: "AI Accuracy", value: rfR2 === null ? "—" : `${(Number(rfR2) * 100).toFixed(1)}%`, icon: Brain, sub: "RandomForest R²" },
    { label: "Active Alerts", value: `${alerts?.alerts?.length ?? 0}`, icon: AlertTriangle, sub: "Live risk signals" },
  ];

  const actualTrend = useMemo(() => {
    const trend = dashboardData?.sales_trend;
    if (!trend?.x || !trend?.y) return [];
    return trend.x.map((x: string, i: number) => ({ label: x, actual: trend.y[i] }));
  }, [dashboardData]);

  const predictedSeries = useMemo(() => {
    const preds = aiPred?.predictions ?? [];
    return preds.map((p: any) => ({
      label: `${p.year}-${String(p.month).padStart(2, "0")}`,
      predicted: p.predicted_revenue,
    }));
  }, [aiPred]);

  const segmentsPie = useMemo(() => {
    const s = segs?.segments ?? [];
    return s.map((seg: any) => ({ name: seg.label, value: seg.customers }));
  }, [segs]);

  const topRecs = (recs?.recommendations ?? []).slice(0, 3);
  const recentAlerts = (alerts?.alerts ?? []).slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">AI Dashboard</h1>
          <p className="text-muted-foreground mt-1">Forecasts, segmentation, recommendations, and alerts in one view.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/dashboard/ai/sales-prediction">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Open Forecast</Button>
          </Link>
          <Link to="/dashboard/ai/chatbot">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Sparkles className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{k.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <k.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-1">Sales: Actual vs Predicted</h3>
          <p className="text-xs text-muted-foreground mb-4">Actual trend from your backend + forward-looking AI forecast.</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="label" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
              <Line data={actualTrend} type="monotone" dataKey="actual" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={false} name="Actual" />
              <Line data={predictedSeries} type="monotone" dataKey="predicted" stroke="hsl(262 100% 59%)" strokeWidth={2} dot={{ r: 3 }} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-1">Customer Segments</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution by AI cluster label.</p>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={segmentsPie} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                {segmentsPie.map((_, idx) => (
                  <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Top AI Recommendations</h3>
            <Link to="/dashboard/ai/marketing-decisions" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topRecs.map((r: any) => (
              <div key={r.title} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-foreground font-semibold">{r.title}</p>
                  <span className="text-[10px] px-2 py-1 rounded-full border border-border text-muted-foreground">{r.priority}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
              </div>
            ))}
            {topRecs.length === 0 && <p className="text-sm text-muted-foreground">Train models to generate recommendations.</p>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((a: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm text-foreground font-medium">{a.title}</p>
                  <span className="text-[10px] px-2 py-1 rounded-full border border-border text-muted-foreground">{a.severity}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
              </div>
            ))}
            {recentAlerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts detected.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

