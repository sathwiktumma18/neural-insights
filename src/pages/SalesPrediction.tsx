import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, TrendingUp } from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AI_BASE = "http://localhost:5000/api/ai";

function downloadCsv(rows: Record<string, any>[], filename: string) {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SalesPrediction() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["ai-sales-predict-12"],
    queryFn: async () => (await fetch(`${AI_BASE}/sales/predict?months=12`)).json(),
  });

  const trainMutation = useMutation({
    mutationFn: async () => (await fetch(`${AI_BASE}/train`, { method: "POST" })).json(),
    onSuccess: () => refetch(),
  });

  const chartData = useMemo(() => {
    const preds = data?.predictions ?? [];
    return preds.map((p: any) => ({
      label: `${p.year}-${String(p.month).padStart(2, "0")}`,
      forecast: p.predicted_revenue,
      upper: p.confidence_upper,
      lower: p.confidence_lower,
    }));
  }, [data]);

  const topProducts = data?.top_products ?? [];
  const rf = data?.accuracy?.random_forest ?? {};
  const lr = data?.accuracy?.linear_regression ?? {};

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Sales Prediction</h1>
          <p className="text-muted-foreground mt-1">Forecast with confidence bands + model quality metrics.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => trainMutation.mutate()} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={trainMutation.isPending}>
            <RefreshCw className={`h-4 w-4 mr-2 ${trainMutation.isPending ? "animate-spin" : ""}`} />
            Retrain Model
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
            onClick={() => downloadCsv(chartData, "sales_forecast.csv")}
            disabled={chartData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-1">Forecast (12 months)</h3>
        <p className="text-xs text-muted-foreground mb-4">RandomForestRegressor with confidence interval from tree variance.</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 100% 59%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(262 100% 59%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
            <XAxis dataKey="label" stroke="hsl(215 20% 55%)" fontSize={11} />
            <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
            <Legend />
            <Area dataKey="upper" fill="url(#band)" stroke="none" name="Upper" />
            <Area dataKey="lower" fill="hsl(220 47% 11%)" stroke="none" name="Lower" />
            <Line type="monotone" dataKey="forecast" stroke="hsl(262 100% 59%)" strokeWidth={2} dot={false} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/50">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Orders</th>
                  <th className="py-2 pr-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p: any) => (
                  <tr key={p.product} className="border-b border-border/30 last:border-0">
                    <td className="py-2 pr-4 text-foreground font-medium">{p.product}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{p.orders}</td>
                    <td className="py-2 pr-4 text-foreground">₹{Number(p.total_revenue).toLocaleString()}</td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      Train the model to populate top products.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Model Accuracy</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Random Forest
                </p>
                <span className="text-xs text-muted-foreground">Primary</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">R²</p>
                  <p className="text-foreground font-semibold">{rf.r2?.toFixed?.(3) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RMSE</p>
                  <p className="text-foreground font-semibold">{rf.rmse?.toFixed?.(2) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MAE</p>
                  <p className="text-foreground font-semibold">{rf.mae?.toFixed?.(2) ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground font-semibold">Linear Regression</p>
                <span className="text-xs text-muted-foreground">Baseline</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">R²</p>
                  <p className="text-foreground font-semibold">{lr.r2?.toFixed?.(3) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RMSE</p>
                  <p className="text-foreground font-semibold">{lr.rmse?.toFixed?.(2) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MAE</p>
                  <p className="text-foreground font-semibold">{lr.mae?.toFixed?.(2) ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            {isFetching ? "Refreshing…" : "Tip: retrain after uploading new sales data."}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

