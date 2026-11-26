import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// ─── Simulation logic ─────────────────────────────────────────────────────────
const BASE_REVENUE = 128000;
const BASE_SAT = 82;
const BASE_TURNOVER = 5.4;
const BASE_PROFIT = 18;

const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const baselineData = LABELS.map((d, i) => ({
  day: d,
  revenue: Math.round(BASE_REVENUE * (0.85 + Math.sin(i * 0.8) * 0.1)),
}));

function calcOutcomes(price: number, marketing: number, inventory: number, staff: number) {
  const priceEffect = 1 - price * 0.008; // higher price → slightly lower revenue
  const mktEffect = 1 + (marketing / 100000) * 0.04;
  const invEffect = inventory > 100 ? 1.02 : inventory / 100 * 0.95;
  const staffEffect = Math.min(staff / 20, 1.3);
  const satEffect = 1 - Math.abs(price) * 0.003 + (staff / 20) * 0.05;

  return {
    revenue: Math.round(BASE_REVENUE * priceEffect * mktEffect * invEffect),
    satisfaction: Math.min(99, Math.round(BASE_SAT * satEffect)),
    turnover: +(BASE_TURNOVER * invEffect).toFixed(1),
    profit: Math.round(BASE_PROFIT + price * 0.2 - (marketing / 100000) * 2 + invEffect * 2),
  };
}

export default function SimulationEngine() {
  const [price, setPrice] = useState([0]);
  const [marketing, setMarketing] = useState([100000]);
  const [inventory, setInventory] = useState([100]);
  const [staff, setStaff] = useState([20]);
  const [simRunning, setSimRunning] = useState(false);
  const [simDone, setSimDone] = useState(false);
  const { toast } = useToast();

  const outcomes = useMemo(
    () => calcOutcomes(price[0], marketing[0], inventory[0], staff[0]),
    [price, marketing, inventory, staff]
  );

  const afterData = LABELS.map((d, i) => ({
    day: d,
    revenue: Math.round(outcomes.revenue * (0.85 + Math.sin(i * 0.8) * 0.1)),
  }));

  const roiDiff = (((outcomes.revenue - BASE_REVENUE) / BASE_REVENUE) * 100).toFixed(1);

  const runSim = () => {
    setSimRunning(true);
    setSimDone(false);
    setTimeout(() => {
      setSimRunning(false);
      setSimDone(true);
      toast({ title: "Simulation Complete", description: `Expected ${Number(roiDiff) >= 0 ? "+" : ""}${roiDiff}% revenue change vs baseline.` });
    }, 2000);
  };

  const metricCards = [
    { label: "Projected Revenue", value: `₹${outcomes.revenue.toLocaleString("en-IN")}`, sub: `/day avg` },
    { label: "Customer Satisfaction", value: `${outcomes.satisfaction}%`, sub: "predicted score" },
    { label: "Inventory Turnover", value: `${outcomes.turnover}×`, sub: "per week" },
    { label: "Profit Margin", value: `${outcomes.profit}%`, sub: "estimated" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Digital Twin Business Simulator</h1>
        <p className="text-muted-foreground mt-1">Adjust variables and preview real-time business impact.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-heading font-semibold text-foreground">Variable Controls</h3>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-foreground font-medium">Price Adjustment</p>
              <span className={`text-sm font-semibold ${price[0] > 0 ? "text-success" : price[0] < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {price[0] > 0 ? "+" : ""}{price[0]}%
              </span>
            </div>
            <Slider min={-30} max={30} step={1} value={price} onValueChange={setPrice} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>-30%</span><span>+30%</span></div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-foreground font-medium">Marketing Spend</p>
              <span className="text-sm font-semibold text-primary">₹{marketing[0].toLocaleString("en-IN")}</span>
            </div>
            <Slider min={0} max={500000} step={10000} value={marketing} onValueChange={setMarketing} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹0</span><span>₹5,00,000</span></div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-foreground font-medium">Inventory Level</p>
              <span className="text-sm font-semibold text-warning">{inventory[0]}% of current</span>
            </div>
            <Slider min={0} max={200} step={5} value={inventory} onValueChange={setInventory} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0%</span><span>200%</span></div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-foreground font-medium">Staff Count</p>
              <span className="text-sm font-semibold text-foreground">{staff[0]} staff</span>
            </div>
            <Slider min={1} max={50} step={1} value={staff} onValueChange={setStaff} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>50</span></div>
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Predicted Outcomes (Live)</h3>
            <div className="grid grid-cols-2 gap-3">
              {metricCards.map((m) => (
                <div key={m.label} className="rounded-lg bg-muted/30 border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-heading font-bold text-primary mt-0.5">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={runSim}
            disabled={simRunning}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
          >
            <Play className="h-4 w-4 mr-2" />
            {simRunning ? "Running Simulation..." : "Run Full Simulation"}
          </Button>

          {simRunning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
              <p className="text-sm text-foreground mb-2 font-medium">Running digital twin simulation...</p>
              <Progress value={75} className="h-2" />
            </motion.div>
          )}

          {simDone && !simRunning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 border border-success/30"
            >
              <p className="text-success font-heading font-semibold text-sm mb-1">Simulation Complete ✓</p>
              <p className="text-sm text-muted-foreground">
                Expected{" "}
                <span className={Number(roiDiff) >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                  {Number(roiDiff) >= 0 ? "+" : ""}{roiDiff}%
                </span>{" "}
                revenue change vs baseline with current variable configuration.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Before Simulation (Baseline)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={baselineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(215 20% 55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">After Simulation (Projected)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={afterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
              <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(191 100% 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
