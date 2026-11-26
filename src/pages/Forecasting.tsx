import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from "lucide-react";

type Metric = "Sales" | "Demand" | "Revenue" | "Inventory";
type Period = 7 | 30 | 90;

const API_BASE = 'http://localhost:5000/api';

export default function Forecasting() {
  const [metric, setMetric] = useState<Metric>("Sales");
  const [period, setPeriod] = useState<Period>(30);

  const { data: predictions, refetch, isLoading } = useQuery({
    queryKey: ['sales-predictions', period],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/predict-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months: period })
      });
      return response.json();
    }
  });

  const data = useMemo(() => {
    if (!predictions?.predictions) return [];
    
    return predictions.predictions.map((pred: any, index: number) => ({
      label: pred.date,
      forecast: pred.predicted_sales,
      upper: pred.predicted_sales * 1.1,
      lower: pred.predicted_sales * 0.9,
    }));
  }, [predictions]);

  const statCards = [
    {
      label: "Forecast Period",
      value: `${period} months`,
      icon: <Calendar className="h-4 w-4 text-primary" />,
    },
    {
      label: "Model Type",
      value: "Linear Regression",
      icon: <TrendingUp className="h-4 w-4 text-success" />,
    },
    {
      label: "Data Points",
      value: data.length.toString(),
      icon: <RefreshCw className="h-4 w-4 text-warning" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Forecasting</h1>
        <p className="text-muted-foreground mt-1">Time-series predictions with confidence intervals.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Predictions'}
        </Button>

        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {([6, 12, 24] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p} Months
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-1">
          Sales Forecast - Next {period} Months
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Predicted sales based on historical data using Linear Regression
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 100% 59%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(262 100% 59%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
            <XAxis dataKey="label" stroke="hsl(215 20% 55%)" fontSize={10} />
            <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
            />
            <Legend />
            <Area dataKey="upper" fill="url(#confBand)" stroke="none" name="Upper Band" />
            <Area dataKey="lower" fill="hsl(220 47% 11%)" stroke="none" name="Lower Band" />
            <Line type="monotone" dataKey="forecast" stroke="hsl(262 100% 59%)" strokeWidth={2} dot={false} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="glass-card p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">{s.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-heading font-bold mt-0.5 ${(s as any).color || "text-foreground"}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
