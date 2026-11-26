import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

type BizContext = "Grocery" | "Retail" | "Restaurant" | "Pharmacy" | "Finance";

const STRATEGIES: Record<BizContext, typeof STRATEGY_TEMPLATES> = {
  Grocery: [
    { rank: 1, title: "Dynamic Bundle Pricing", category: "Pricing", roi: 28, desc: "Bundle slow-moving items with bestsellers to increase basket size and reduce waste. Offer time-limited discounts on near-expiry stock." },
    { rank: 2, title: "Demand-Driven Inventory Replenishment", category: "Inventory", roi: 22, desc: "Use ML forecasts to auto-reorder top 50 SKUs 72 hours before projected stockout. Reduce overstock by 18%." },
    { rank: 3, title: "Footfall-Based Staffing", category: "Operations", roi: 14, desc: "Align cashier staffing to predicted hourly footfall curves to cut idle labor cost by 11%." },
  ],
  Retail: [
    { rank: 1, title: "Personalized Discount Engine", category: "Marketing", roi: 32, desc: "Serve targeted discounts based on purchase history and RFM scoring. Increases repeat purchase rate by 24%." },
    { rank: 2, title: "Markdown Optimization", category: "Pricing", roi: 25, desc: "Use regression model to find optimal markdown timing for seasonal inventory. Improves sell-through by 19%." },
    { rank: 3, title: "Cross-Sell Recommendation", category: "Operations", roi: 17, desc: "Place AI-recommended complementary products adjacent to anchor items to lift average order value." },
  ],
  Restaurant: [
    { rank: 1, title: "Menu Price Elasticity Tuning", category: "Pricing", roi: 30, desc: "Identify price-inelastic items to increase margin by 8–12% without impacting order volume significantly." },
    { rank: 2, title: "Waste Reduction via Prep Forecasting", category: "Inventory", roi: 21, desc: "Forecast daily demand per dish to optimize prep quantities and reduce raw material waste by 25%." },
    { rank: 3, title: "Peak-Hour Table Management", category: "Operations", roi: 16, desc: "Optimize seating assignment and reservation windows to increase table turns from 2.6 to 3.1 per evening." },
  ],
  Pharmacy: [
    { rank: 1, title: "Expiry-Based Promotions", category: "Marketing", roi: 18, desc: "Auto-flag drugs within 60 days of expiry and run targeted promotions to reduce write-offs." },
    { rank: 2, title: "Prescription Renewal Alerts", category: "Operations", roi: 26, desc: "Send proactive SMS/email reminders 5 days before predicted prescription renewal to increase retention." },
    { rank: 3, title: "Generic Substitution Recommendations", category: "Pricing", roi: 33, desc: "Recommend FDA-approved generics at checkout to improve margin by up to 40% on eligible prescriptions." },
  ],
  Finance: [
    { rank: 1, title: "Risk-Based Loan Pricing", category: "Pricing", roi: 38, desc: "Use ML credit scoring to offer tiered interest rates, improving portfolio yield while controlling default rates." },
    { rank: 2, title: "Churn Prevention Campaign", category: "Marketing", roi: 27, desc: "Identify customers with >70% churn probability 30 days in advance and trigger retention offers." },
    { rank: 3, title: "Fraud Pattern Monitoring", category: "Operations", roi: 19, desc: "Deploy real-time transaction scoring to flag suspicious activity with <200ms latency, reducing fraud losses by 31%." },
  ],
};

// Dummy template for type reference
const STRATEGY_TEMPLATES = [
  { rank: 1, title: "", category: "" as string, roi: 0, desc: "" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Pricing: "bg-primary/10 text-primary",
  Inventory: "bg-success/10 text-success",
  Marketing: "bg-warning/10 text-warning",
  Operations: "bg-secondary/20 text-purple-300",
};

const ROI_COLORS = ["hsl(191 100% 50%)", "hsl(262 100% 59%)", "hsl(43 96% 56%)"];

export default function StrategyEngine() {
  const [context, setContext] = useState<BizContext>("Grocery");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof STRATEGY_TEMPLATES | null>(null);
  const { toast } = useToast();

  const generate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(STRATEGIES[context]);
    }, 1500);
  };

  const applyStrategy = (title: string) => {
    toast({ title: "Strategy queued for simulation", description: `"${title}" has been added to the simulation queue.` });
  };

  const chartData = result
    ? result.map((s) => ({ name: `Strategy #${s.rank}`, roi: s.roi }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Strategy Engine</h1>
        <p className="text-muted-foreground mt-1">AI-driven reinforcement learning strategy recommendations.</p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <p className="text-sm text-foreground font-medium mb-1.5">Business Context</p>
          <Select value={context} onValueChange={(v) => { setContext(v as BizContext); setResult(null); }}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Grocery", "Retail", "Restaurant", "Pharmacy", "Finance"] as BizContext[]).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={generate}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
          {loading ? "Generating..." : "Generate Strategies"}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {result.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-heading font-extrabold text-primary/30">#{s.rank}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[s.category]}`}>{s.category}</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-success font-bold text-sm">+{s.roi}% ROI</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10 text-xs"
                      onClick={() => applyStrategy(s.title)}
                    >
                      Apply Strategy
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ROI bar chart */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">Expected ROI Comparison</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }}
                    formatter={(v: number) => [`${v}%`, "Expected ROI"]}
                  />
                  <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={ROI_COLORS[i % ROI_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
