import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Play, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const featureImportance = [
  { feature: "Age", importance: 0.89 },
  { feature: "Income", importance: 0.76 },
  { feature: "History", importance: 0.72 },
  { feature: "Location", importance: 0.58 },
  { feature: "Score", importance: 0.45 },
];

const analysisHistory = [
  { id: "A-001", model: "Classification", dataset: "sales_q4_2025.csv", accuracy: "94.2%", status: "Completed", date: "2026-03-08" },
  { id: "A-002", model: "Regression", dataset: "patient_records.json", accuracy: "91.7%", status: "Completed", date: "2026-03-07" },
  { id: "A-003", model: "Clustering", dataset: "student_scores.csv", accuracy: "—", status: "Running", date: "2026-03-09" },
  { id: "A-004", model: "Time-Series", dataset: "transactions_2025.xlsx", accuracy: "—", status: "Failed", date: "2026-03-06" },
];

const AIAnalysis = () => {
  const [step, setStep] = useState(1);
  const [dataset, setDataset] = useState("");
  const [model, setModel] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const runAnalysis = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setRunning(false);
          setComplete(true);
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">AI Analysis</h1>
        <p className="text-muted-foreground mt-1">Configure and run machine learning models on your data.</p>
      </div>

      {/* Stepper */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-colors ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                onClick={() => !running && setStep(s)}
              >
                {s}
              </div>
              {s < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-foreground">Select Dataset</Label>
            <Select value={dataset} onValueChange={(v) => { setDataset(v); }}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue placeholder="Choose a dataset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_q4_2025.csv">sales_q4_2025.csv</SelectItem>
                <SelectItem value="patient_records.json">patient_records.json</SelectItem>
                <SelectItem value="student_scores.csv">student_scores.csv</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(2)} disabled={!dataset} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label className="text-foreground">Choose ML Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="regression">Regression</SelectItem>
                <SelectItem value="clustering">Clustering</SelectItem>
                <SelectItem value="timeseries">Time-Series Forecasting</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="border-border text-foreground">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!model} className="bg-primary text-primary-foreground hover:bg-primary/90">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Label className="text-foreground">Parameters</Label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Train/Test Split</p>
                <p className="text-foreground font-semibold">80% / 20%</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Feature Selection</p>
                <p className="text-foreground font-semibold">Auto (PCA)</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Cross Validation</p>
                <p className="text-foreground font-semibold">5-Fold</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Hyperparameters</p>
                <p className="text-foreground font-semibold">Auto-tuned</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="border-border text-foreground">Back</Button>
              <Button onClick={() => setStep(4)} className="bg-primary text-primary-foreground hover:bg-primary/90">Next</Button>
            </div>
          </div>
        )}

        {step === 4 && !complete && (
          <div className="text-center py-8">
            {!running ? (
              <>
                <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-glow" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Ready to Run</h3>
                <p className="text-muted-foreground mb-6">Dataset: {dataset} • Model: {model}</p>
                <Button onClick={runAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                  <Play className="h-4 w-4 mr-2" /> Run Analysis
                </Button>
              </>
            ) : (
              <>
                <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Running Analysis...</h3>
                <Progress value={progress} className="max-w-md mx-auto h-2" />
                <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
              </>
            )}
          </div>
        )}

        {complete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Analysis Complete</h3>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { label: "Accuracy", value: "94.2%" },
                { label: "Precision", value: "93.8%" },
                { label: "Recall", value: "92.1%" },
                { label: "F1 Score", value: "92.9%" },
              ].map((m) => (
                <div key={m.label} className="glass-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-heading font-bold text-primary">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <h4 className="font-heading font-semibold text-foreground mb-4">Feature Importance</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 20%)" />
                  <XAxis type="number" stroke="hsl(215 20% 55%)" fontSize={12} domain={[0, 1]} />
                  <YAxis type="category" dataKey="feature" stroke="hsl(215 20% 55%)" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(220 30% 20%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                  <Bar dataKey="importance" fill="hsl(191 100% 50%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-heading font-semibold text-foreground mb-2">AI Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The classification model achieved 94.2% accuracy on the test set. Age and Income were the most significant predictors,
                contributing to 89% and 76% of feature importance respectively. The model shows strong precision (93.8%) and recall (92.1%),
                indicating balanced performance across classes. Recommended for production deployment with periodic retraining on new data.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-foreground" onClick={() => { setComplete(false); setStep(1); setDataset(""); setModel(""); }}>
                New Analysis
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Export PDF</Button>
              <Button variant="outline" className="border-border text-foreground">Export CSV</Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* History */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Analysis History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Model</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Dataset</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Accuracy</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {analysisHistory.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="py-3 px-4 text-primary font-medium">{a.id}</td>
                  <td className="py-3 px-4 text-foreground">{a.model}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{a.dataset}</td>
                  <td className="py-3 px-4 text-foreground">{a.accuracy}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      a.status === "Completed" ? "bg-success/10 text-success" :
                      a.status === "Running" ? "bg-primary/10 text-primary" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {a.status === "Completed" && <CheckCircle className="h-3 w-3" />}
                      {a.status === "Running" && <Clock className="h-3 w-3" />}
                      {a.status === "Failed" && <XCircle className="h-3 w-3" />}
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
