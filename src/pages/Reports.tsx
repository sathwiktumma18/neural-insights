import { useState } from "react";
import { FileText, Download, Share2, Calendar, Plus, Sparkles, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const AI_STEPS = [
  "Analyzing data...",
  "Identifying key trends...",
  "Drafting executive summary...",
  "Compiling recommendations...",
  "Report ready ✓",
];

const AI_REPORT_SECTIONS = [
  {
    title: "Executive Summary",
    content: "Overall business performance for Q1 2026 shows a 12% improvement in decision accuracy, reaching 94.7%. Revenue growth tracked at +18% MoM with consistent model performance across all four domains. The system processed 2.4M data points with zero critical failures.",
  },
  {
    title: "Key Findings",
    content: "Education domain achieved highest forecasting accuracy at 91.3%. Finance fraud detection rate improved to 97.1% — a 2.4% gain vs. Q4 2025. Customer Segment B continues to drive 38% of demand volume across all business units.",
  },
  {
    title: "Risk Analysis",
    content: "Two high-severity anomalies were flagged in the revenue stream (March 12). Inventory levels for 3 SKUs are trending below safe thresholds. Model A-004 experienced a failure on 2026-03-06 requiring investigation into data pipeline integrity.",
  },
  {
    title: "Recommendations",
    content: "Deploy XGBoost classifier for Finance domain to gain +1.9% accuracy improvement. Increase marketing spend by ₹50,000 for Segment B to boost retention. Implement automated model retraining pipeline to prevent accuracy degradation below 90%.",
  },
];

const initialReports = [
  { id: "R-001", title: "Monthly Performance Summary", type: "Summary",     date: "2026-03-01", pages: 12 },
  { id: "R-002", title: "Q1 2026 Domain Comparison",   type: "Comparative", date: "2026-02-28", pages: 24 },
  { id: "R-003", title: "Healthcare Model Deep Dive",   type: "Detailed",    date: "2026-02-20", pages: 38 },
  { id: "R-004", title: "Weekly Accuracy Trends",       type: "Summary",     date: "2026-03-08", pages: 6  },
];

const scheduledReports = [
  { title: "Weekly KPI Summary",     frequency: "Weekly",  next: "2026-03-15" },
  { title: "Monthly Analysis Digest", frequency: "Monthly", next: "2026-04-01" },
];

export default function Reports() {
  const [aiStepIdx, setAiStepIdx] = useState(-1);   // -1 = idle
  const [aiDone, setAiDone] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [reports, setReports] = useState(initialReports);
  const { toast } = useToast();

  const runAiGenerate = () => {
    setAiDone(false);
    setAiStepIdx(0);
    let idx = 0;
    const tick = setInterval(() => {
      idx += 1;
      if (idx >= AI_STEPS.length - 1) {
        clearInterval(tick);
        setAiStepIdx(AI_STEPS.length - 1);
        setAiDone(true);
      } else {
        setAiStepIdx(idx);
      }
    }, 1000);
  };

  const saveToLibrary = () => {
    const newReport = {
      id: `R-00${reports.length + 1}`,
      title: "AI Generated Executive Report",
      type: "Detailed",
      date: new Date().toISOString().slice(0, 10),
      pages: 22,
    };
    setReports(prev => [newReport, ...prev]);
    toast({ title: "Report saved to library", description: "AI Generated Executive Report added." });
  };

  const downloadPdf = () => {
    toast({ title: "PDF download started", description: "Your report is being prepared..." });
  };

  const progress = aiStepIdx < 0 ? 0 : Math.round(((aiStepIdx + 1) / AI_STEPS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate, view, and manage analytical reports.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      {/* Generate report panel */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-heading font-semibold text-foreground">Generate Report</h3>
          <Button onClick={runAiGenerate} disabled={aiStepIdx >= 0 && !aiDone} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <Sparkles className="h-4 w-4 mr-2" /> AI Generate
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-foreground">Source</Label>
            <Select>
              <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground"><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a001">Analysis A-001</SelectItem>
                <SelectItem value="d001">Decision D-001</SelectItem>
                <SelectItem value="all">All recent data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Report Type</Label>
            <Select>
              <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="comparative">Comparative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Generate</Button>
          </div>
        </div>

        {/* AI Generate stepper */}
        <AnimatePresence>
          {aiStepIdx >= 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{AI_STEPS[aiStepIdx]}</p>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-2 flex-wrap">
                {AI_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-1 text-xs ${i <= aiStepIdx ? "text-primary" : "text-muted-foreground"}`}>
                    {i < aiStepIdx || aiDone ? <CheckCircle className="h-3 w-3 text-success" /> : <div className={`w-3 h-3 rounded-full border ${i === aiStepIdx ? "border-primary bg-primary/20" : "border-border"}`} />}
                    <span className="hidden sm:block">{i + 1}. {step.replace(" ✓", "")}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Report Preview */}
      <AnimatePresence>
        {aiDone && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4 border border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-heading font-semibold text-foreground">AI Generated Executive Report</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Generated · {new Date().toLocaleDateString("en-IN")} · 4 sections · ~22 pages</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={downloadPdf} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="h-3.5 w-3.5 mr-1" /> Download PDF
                </Button>
                <Button size="sm" variant="outline" onClick={saveToLibrary} className="border-border text-foreground">
                  Save to Library
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {AI_REPORT_SECTIONS.map(sec => (
                <div key={sec.title} className="rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpenSection(openSection === sec.title ? null : sec.title)}
                  >
                    <span className="text-sm font-medium text-foreground">{sec.title}</span>
                    {openSection === sec.title ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {openSection === sec.title && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{sec.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports Library */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Reports Library</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Type", "Date", "Pages", ""].map(h => (
                  <th key={h} className={`text-left py-3 px-4 text-muted-foreground font-medium ${h === "Type" || h === "Date" ? "hidden md:table-cell" : ""} ${h === "Pages" ? "hidden lg:table-cell" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">{r.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{r.type}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{r.date}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{r.pages}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={downloadPdf}><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Share2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-foreground">Scheduled Reports</h3>
          <Button variant="outline" size="sm" className="border-border text-foreground">
            <Calendar className="h-4 w-4 mr-2" /> Add Schedule
          </Button>
        </div>
        <div className="space-y-3">
          {scheduledReports.map(s => (
            <div key={s.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="text-foreground font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.frequency} · Next: {s.next}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
