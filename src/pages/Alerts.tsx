import { useState } from "react";
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, Info, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Severity = "Critical" | "Warning" | "Info";
type Category = "All" | Severity;

const SEVERITY_STYLE: Record<Severity, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
  Warning:  "bg-warning/10 text-warning border-warning/30",
  Info:     "bg-primary/10 text-primary border-primary/30",
};

const SEVERITY_DOT: Record<Severity, string> = {
  Critical: "bg-destructive",
  Warning:  "bg-warning",
  Info:     "bg-primary",
};

const initialRules = [
  { id: 1, name: "Low Accuracy Alert",     condition: "Accuracy drops below 80%",             threshold: 80,  severity: "Critical" as Severity, status: "Active" },
  { id: 2, name: "Data Quality Warning",   condition: "Null values exceed 10%",                threshold: 10,  severity: "Warning"  as Severity, status: "Active" },
  { id: 3, name: "Model Drift Detection",  condition: "Feature distribution shift > 15%",      threshold: 15,  severity: "Warning"  as Severity, status: "Paused" },
  { id: 4, name: "High Latency Alert",     condition: "Response time exceeds 500ms",           threshold: 500, severity: "Critical" as Severity, status: "Active" },
  { id: 5, name: "Low Data Volume",        condition: "Daily data points below threshold",     threshold: 1000, severity: "Info"    as Severity, status: "Active" },
];

const alertHistory = [
  { message: "Accuracy dropped to 78.2% on model A-004", type: "warning" as const, time: "5 hr ago", severity: "Critical" as Severity },
  { message: "Analysis A-003 completed successfully",     type: "success" as const, time: "1 hr ago",  severity: "Info"     as Severity },
  { message: "New dataset uploaded: transactions_2025.xlsx", type: "info" as const, time: "2 hr ago", severity: "Info"     as Severity },
  { message: "Scheduled report generated: Weekly KPI",    type: "info"    as const, time: "6 hr ago",  severity: "Info"     as Severity },
  { message: "Model drift detected: classifier C-002",    type: "warning" as const, time: "8 hr ago",  severity: "Warning"  as Severity },
];

const CATEGORIES: Category[] = ["All", "Critical", "Warning", "Info"];

export default function Alerts() {
  const [filter, setFilter] = useState<Category>("All");
  const [rules, setRules] = useState(initialRules);
  const [editRule, setEditRule] = useState<(typeof initialRules)[0] | null>(null);
  const [newThreshold, setNewThreshold] = useState("");
  const { toast } = useToast();

  const filtered = rules.filter(r => filter === "All" || r.severity === filter);

  const saveThreshold = () => {
    if (!editRule) return;
    const val = Number(newThreshold);
    if (isNaN(val)) return;
    setRules(prev => prev.map(r => r.id === editRule.id ? { ...r, threshold: val, condition: r.condition.replace(/[\d.]+/, String(val)) } : r));
    toast({ title: "Threshold updated", description: `${editRule.name} threshold set to ${val}` });
    setEditRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">Configure alert rules and view notification history.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> New Rule
        </Button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alert Rules */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Alert Rules</h3>
        <div className="space-y-3">
          {filtered.map(rule => (
            <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${SEVERITY_DOT[rule.severity]}`} />
                <div>
                  <p className="text-foreground font-medium text-sm">{rule.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rule.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVERITY_STYLE[rule.severity]}`}>
                  {rule.severity}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${rule.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {rule.status}
                </span>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7"
                  onClick={() => { setEditRule(rule); setNewThreshold(String(rule.threshold)); }}>
                  <Edit2 className="h-3 w-3 mr-1" /> Edit Threshold
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">No {filter} alerts found.</p>
          )}
        </div>
      </div>

      {/* Notification History */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Notification History</h3>
        <div className="space-y-3">
          {alertHistory.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />}
              {alert.type === "success" && <CheckCircle className="h-5 w-5 text-success mt-0.5" />}
              {alert.type === "info" && <Info className="h-5 w-5 text-primary mt-0.5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${SEVERITY_STYLE[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Threshold Dialog */}
      <Dialog open={!!editRule} onOpenChange={() => setEditRule(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading">Edit Threshold — {editRule?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{editRule?.condition}</p>
            <div>
              <Label className="text-foreground">New Threshold Value</Label>
              <Input
                type="number"
                value={newThreshold}
                onChange={e => setNewThreshold(e.target.value)}
                className="mt-1.5 bg-muted border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveThreshold} className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
              <Button variant="outline" onClick={() => setEditRule(null)} className="border-border text-foreground">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
