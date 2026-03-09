import { motion } from "framer-motion";
import { Activity, Target, Database, Cpu, Upload, Brain, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const kpis = [
  { label: "Total Analyses", value: "1,248", icon: Activity, change: "+12%" },
  { label: "Decision Accuracy", value: "94.7%", icon: Target, change: "+2.3%" },
  { label: "Data Points", value: "2.4M", icon: Database, change: "+18%" },
  { label: "Active Models", value: "12", icon: Cpu, change: "+3" },
];

const lineData = [
  { month: "Jan", accuracy: 88 }, { month: "Feb", accuracy: 89 },
  { month: "Mar", accuracy: 91 }, { month: "Apr", accuracy: 90 },
  { month: "May", accuracy: 93 }, { month: "Jun", accuracy: 94.7 },
];

const barData = [
  { domain: "Education", count: 340 }, { domain: "Healthcare", count: 290 },
  { domain: "Business", count: 420 }, { domain: "Finance", count: 198 },
];

const recentActivity = [
  { action: "Classification analysis completed", time: "2 min ago", type: "success" },
  { action: "New dataset uploaded: sales_q4.csv", time: "15 min ago", type: "info" },
  { action: "Decision generated: Risk Assessment #47", time: "1 hr ago", type: "info" },
  { action: "Report exported: Monthly Performance", time: "3 hr ago", type: "info" },
  { action: "Alert triggered: Accuracy below threshold", time: "5 hr ago", type: "warning" },
];

const quickActions = [
  { label: "Upload Data", icon: Upload, to: "/dashboard/data" },
  { label: "Run Analysis", icon: Brain, to: "/dashboard/analysis" },
  { label: "View Reports", icon: FileText, to: "/dashboard/reports" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your intelligence overview.</p>
      </div>

      {/* KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={item} className="glass-card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{kpi.value}</p>
            <span className="text-xs text-success font-medium">{kpi.change} from last month</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Decision Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="month" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} domain={[85, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
              />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(191 100% 50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Domain-wise Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="domain" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
              />
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
                    <qa.icon className="h-4 w-4 text-primary" />
                    {qa.label}
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
