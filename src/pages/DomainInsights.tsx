import { motion } from "framer-motion";
import {
  GraduationCap, HeartPulse, TrendingUp, Landmark,
  Users, AlertTriangle, DollarSign, Shield, BarChart3, Target
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const domains = [
  {
    name: "Education",
    icon: GraduationCap,
    color: "from-primary to-cyan-400",
    kpis: [
      { label: "Students Analyzed", value: "12,450", icon: Users },
      { label: "Dropout Risk Alerts", value: "234", icon: AlertTriangle },
      { label: "Prediction Accuracy", value: "91.3%", icon: Target },
    ],
    useCases: [
      "Student performance prediction based on attendance, grades & engagement",
      "Dropout risk scoring with early intervention recommendations",
      "Course recommendation engine based on aptitude analysis",
    ],
    demoResult: { label: "Sample: Student #4821 Dropout Risk", score: 23, status: "Low Risk" },
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    color: "from-emerald-400 to-success",
    kpis: [
      { label: "Patients Processed", value: "8,920", icon: Users },
      { label: "Diagnoses Assisted", value: "1,340", icon: Target },
      { label: "Treatment Accuracy", value: "93.7%", icon: BarChart3 },
    ],
    useCases: [
      "Patient diagnosis assistance using symptom pattern analysis",
      "Treatment recommendation scoring based on patient history",
      "Resource allocation optimization for hospital management",
    ],
    demoResult: { label: "Sample: Patient #773 Treatment Score", score: 87, status: "Plan B Recommended" },
  },
  {
    name: "Business",
    icon: TrendingUp,
    color: "from-secondary to-purple-400",
    kpis: [
      { label: "Forecasts Generated", value: "3,210", icon: BarChart3 },
      { label: "Churn Predictions", value: "890", icon: AlertTriangle },
      { label: "Forecast Accuracy", value: "89.5%", icon: Target },
    ],
    useCases: [
      "Sales forecasting with seasonal trend analysis",
      "Customer churn prediction and retention strategies",
      "Market segmentation using clustering algorithms",
    ],
    demoResult: { label: "Sample: Q2 Sales Forecast Confidence", score: 91, status: "$2.4M Projected" },
  },
  {
    name: "Finance",
    icon: Landmark,
    color: "from-warning to-amber-400",
    kpis: [
      { label: "Transactions Analyzed", value: "1.2M", icon: DollarSign },
      { label: "Fraud Detected", value: "47", icon: Shield },
      { label: "Detection Rate", value: "97.1%", icon: Target },
    ],
    useCases: [
      "Risk assessment for loan and credit applications",
      "Fraud detection scoring with real-time monitoring",
      "Portfolio optimization using predictive models",
    ],
    demoResult: { label: "Sample: Transaction #99201 Fraud Score", score: 8, status: "Legitimate" },
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const DomainInsights = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Domain Insights</h1>
        <p className="text-muted-foreground mt-1">Specialized AI analytics tailored to your industry.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {domains.map((d) => (
          <motion.div key={d.name} variants={item} className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center`}>
                <d.icon className="h-6 w-6 text-background" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">{d.name}</h2>
            </div>

            {/* KPIs */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {d.kpis.map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <kpi.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  </div>
                  <p className="text-xl font-heading font-bold text-foreground">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Use Cases */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">Use Cases</h4>
              <ul className="space-y-1.5">
                {d.useCases.map((uc, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Demo */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground font-medium mb-2">{d.demoResult.label}</p>
              <div className="flex items-center gap-3">
                <Progress value={d.demoResult.score} className="flex-1 h-2" />
                <span className="text-sm font-semibold text-primary">{d.demoResult.score}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Result: {d.demoResult.status}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DomainInsights;
