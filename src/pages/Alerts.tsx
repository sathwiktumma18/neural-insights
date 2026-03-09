import { useState } from "react";
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const alertRules = [
  { id: 1, name: "Low Accuracy Alert", condition: "Accuracy drops below 80%", status: "Active" },
  { id: 2, name: "Data Quality Warning", condition: "Null values exceed 10%", status: "Active" },
  { id: 3, name: "Model Drift Detection", condition: "Feature distribution shift > 15%", status: "Paused" },
];

const alertHistory = [
  { message: "Accuracy dropped to 78.2% on model A-004", type: "warning", time: "5 hr ago" },
  { message: "Analysis A-003 completed successfully", type: "success", time: "1 hr ago" },
  { message: "New dataset uploaded: transactions_2025.xlsx", type: "info", time: "2 hr ago" },
  { message: "Scheduled report generated: Weekly KPI Summary", type: "info", time: "6 hr ago" },
];

const Alerts = () => {
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

      {/* Alert Rules */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Alert Rules</h3>
        <div className="space-y-3">
          {alertRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="text-foreground font-medium">{rule.name}</p>
                <p className="text-xs text-muted-foreground">{rule.condition}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rule.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}>{rule.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Notification History</h3>
        <div className="space-y-3">
          {alertHistory.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />}
              {alert.type === "success" && <CheckCircle className="h-5 w-5 text-success mt-0.5" />}
              {alert.type === "info" && <Info className="h-5 w-5 text-primary mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
