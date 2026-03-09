import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, Search, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const decisionLog = [
  { id: "D-001", scenario: "Loan Approval — Applicant #4821", model: "Classification", confidence: 94, decision: "Approve", domain: "Finance", date: "2026-03-08" },
  { id: "D-002", scenario: "Student Dropout Risk — ID #1129", model: "Classification", confidence: 87, decision: "High Risk", domain: "Education", date: "2026-03-07" },
  { id: "D-003", scenario: "Sales Forecast Q2 2026", model: "Time-Series", confidence: 91, decision: "$2.4M projected", domain: "Business", date: "2026-03-06" },
  { id: "D-004", scenario: "Treatment Plan — Patient #773", model: "Regression", confidence: 82, decision: "Plan B Recommended", domain: "Healthcare", date: "2026-03-05" },
];

const Decisions = () => {
  const [generated, setGenerated] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = decisionLog.filter((d) =>
    d.scenario.toLowerCase().includes(search.toLowerCase()) ||
    d.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Intelligent Decisions</h1>
        <p className="text-muted-foreground mt-1">Generate AI-powered recommendations and review past decisions.</p>
      </div>

      {/* Decision Engine */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" /> Decision Engine
        </h3>

        {!generated ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Dataset / Scenario</Label>
                <Select>
                  <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground">
                    <SelectValue placeholder="Select dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">sales_q4_2025.csv</SelectItem>
                    <SelectItem value="patients">patient_records.json</SelectItem>
                    <SelectItem value="students">student_scores.csv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground">Trained Model</Label>
                <Select>
                  <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Classification (A-001)</SelectItem>
                    <SelectItem value="reg">Regression (A-002)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => setGenerated(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
              Generate Decision <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center py-4">
              <CheckCircle className="h-10 w-10 text-success mx-auto mb-3" />
              <h4 className="font-heading text-xl font-bold text-foreground">Approve Loan Application</h4>
              <p className="text-muted-foreground text-sm mt-1">Confidence: 94%</p>
              <Progress value={94} className="max-w-xs mx-auto mt-3 h-2" />
            </div>

            <div className="glass-card p-4">
              <h5 className="font-semibold text-foreground mb-2">Reasoning Breakdown</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success" /> Credit score above threshold (720+)</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success" /> Stable income for 3+ years</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Debt-to-income ratio slightly elevated (32%)</li>
              </ul>
            </div>

            <div className="glass-card p-4">
              <h5 className="font-semibold text-foreground mb-2">Alternatives</h5>
              <div className="space-y-2">
                {[
                  { option: "Conditional Approval", score: 88 },
                  { option: "Reduced Amount", score: 79 },
                  { option: "Deny", score: 6 },
                ].map((a) => (
                  <div key={a.option} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{a.option}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={a.score} className="w-24 h-1.5" />
                      <span className="text-xs text-muted-foreground w-8">{a.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={() => setGenerated(false)} className="border-border text-foreground">
              New Decision
            </Button>
          </motion.div>
        )}
      </div>

      {/* Decision Log */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-heading font-semibold text-foreground">Decision Log</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search decisions..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Scenario</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Model</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Confidence</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Decision</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Domain</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="py-3 px-4 text-foreground">{d.scenario}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{d.model}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Progress value={d.confidence} className="w-16 h-1.5" />
                      <span className="text-xs text-foreground">{d.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground hidden lg:table-cell">{d.decision}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{d.domain}</span>
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

export default Decisions;
