import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Target, Database, Cpu, Upload, Brain, FileText, ArrowRight, Calendar, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const API_BASE = 'http://localhost:5000/api';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const raf = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    raf.current = setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); clearInterval(raf.current!); }
      else setVal(Math.round(current));
    }, duration / steps);
    return () => clearInterval(raf.current!);
  }, [target, duration]);
  return val;
}

const quickActions = [
  { label: "Upload Data", icon: Upload, to: "/dashboard/data" },
  { label: "Run Analysis", icon: Brain, to: "/dashboard/analysis" },
  { label: "View Reports", icon: FileText, to: "/dashboard/reports" },
];

// ─── Health Score ─────────────────────────────────────────────────────────────
const HEALTH_SCORE = 78;
const healthGaugeData = [{ name: "Health", value: HEALTH_SCORE, fill: "hsl(142 76% 50%)" }];

const subScores = [
  { label: "Forecast Accuracy", value: 82, color: "bg-success" },
  { label: "Inventory Health",  value: 74, color: "bg-primary" },
  { label: "Sales Trend",       value: 85, color: "bg-success" },
  { label: "Anomaly Index",     value: 71, color: "bg-warning" },
  { label: "Alert Severity",    value: 70, color: "bg-warning" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// ─── KPI Card with count-up ────────────────────────────────────────────────────
const targets = [1248, 947, 2400000, 12];
const kpiMeta = [
  { label: "Total Analyses",    icon: Activity, change: "+12%", fmt: (v: number) => v.toLocaleString() },
  { label: "Decision Accuracy", icon: Target,   change: "+2.3%", fmt: (v: number) => `${(v / 10).toFixed(1)}%` },
  { label: "Data Points",       icon: Database, change: "+18%", fmt: (v: number) => `${(v / 1000000).toFixed(1)}M` },
  { label: "Active Models",     icon: Cpu,      change: "+3",   fmt: (v: number) => String(v) },
];

function KpiCard({ meta, target }: { meta: (typeof kpiMeta)[0]; target: number }) {
  const val = useCountUp(target);
  return (
    <motion.div variants={item} className="glass-card-hover p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{meta.label}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <meta.icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-heading font-bold text-foreground">{meta.fmt(val)}</p>
      <span className="text-xs text-success font-medium">{meta.change} from last month</span>
    </motion.div>
  );
}

const DashboardHome = () => {
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/get-dashboard-data`);
      return response.json();
    }
  });

  const { data: segmentsData } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/get-customer-segments`);
      return response.json();
    }
  });

  const segments = segmentsData?.segments || [];

  // Dashboard values returned from backend
  const totalCustomers = dashboardData?.total_customers ?? 0;
  const totalSales = dashboardData?.total_sales ?? 0;
  const salesTrend = dashboardData?.sales_trend ?? [];
  const totalModels = dashboardData?.total_models ?? 2;
  const totalDataPoints = dashboardData?.total_data_points ?? 150;

  const kpiMeta = [
    { label: "Total Customers", icon: Users, change: "+5%", fmt: (v: number) => v.toLocaleString() },
    { label: "Total Sales", icon: DollarSign, change: "+12%", fmt: (v: number) => `$${v.toLocaleString()}` },
    { label: "Active Models", icon: Cpu, change: "+2", fmt: (v: number) => String(v) },
    { label: "Data Points", icon: Database, change: "+15%", fmt: (v: number) => `${v}K` },
  ];

  const targets = [totalCustomers, totalSales, totalModels, totalDataPoints];

  const recentActivity = [
    { type: "success", action: "New sales data uploaded", time: "Just now" },
    { type: "warning", action: "Model retraining scheduled", time: "2 hours ago" },
    { type: "info", action: "Customer segmentation updated", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's your business intelligence overview.</p>
        </div>
      </div>

      {/* KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMeta.map((meta, i) => (
          <KpiCard key={meta.label} meta={meta} target={targets[i]} />
        ))}
      </motion.div>

      {/* Business Health Score */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-heading font-semibold text-foreground">Business Health Score</h3>
          <span className="text-xs bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-full font-semibold">↑ +3 pts vs last week</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <RadialBarChart
                width={180} height={180}
                cx={90} cy={90}
                innerRadius={55} outerRadius={80}
                barSize={14}
                data={healthGaugeData}
                startAngle={210} endAngle={-30}
              >
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(220 30% 18%)" }} />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-extrabold text-success">{HEALTH_SCORE}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-success font-semibold mt-1">Good Health</p>
          </div>
          {/* Sub-scores */}
          <div className="space-y-3">
            {subScores.map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="text-foreground font-semibold">{s.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%`, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="x" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
              <Line type="monotone" dataKey="y" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(191 100% 50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Customer Segments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={segments}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="segment" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
              <Bar dataKey="count" fill="hsl(262 100% 59%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.type === "success" ? "bg-success" : a.type === "warning" ? "bg-warning" : "bg-primary"}`} />
                  <span className="text-sm text-foreground">{a.action}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((qa) => (
              <Link key={qa.label} to={qa.to}>
                <Button variant="outline" className="w-full justify-between border-border text-foreground hover:bg-muted hover:text-foreground mb-2">
                  <span className="flex items-center gap-2">
                    <qa.icon className="h-4 w-4 text-primary" />{qa.label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
