import { useState } from "react";
import { Bell, Sun, Key, Users, Shield, Upload, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type BizType = "Grocery" | "Retail" | "Restaurant" | "Pharmacy" | "Finance";

const BIZ_OPTIONS: { type: BizType; emoji: string; desc: string }[] = [
  { type: "Grocery",    emoji: "🛒", desc: "FMCG & fresh goods" },
  { type: "Retail",     emoji: "🏪", desc: "Apparel & general" },
  { type: "Restaurant", emoji: "🍽️", desc: "Food & beverage" },
  { type: "Pharmacy",   emoji: "💊", desc: "Healthcare products" },
  { type: "Finance",    emoji: "📈", desc: "Lending & investment" },
];

const BIZ_CONFIG: Record<BizType, { metrics: string[]; terms: { from: string; to: string }[] }> = {
  Grocery: {
    metrics: ["Daily Sales", "Stock Turnover", "Waste %", "Footfall"],
    terms: [{ from: "Transactions", to: "Sales" }, { from: "Units", to: "Items" }, { from: "Orders", to: "Baskets" }],
  },
  Retail: {
    metrics: ["Daily Revenue", "Sell-Through Rate", "Return Rate", "Avg. Order Value"],
    terms: [{ from: "Tickets", to: "Orders" }, { from: "Visitors", to: "Shoppers" }, { from: "SKUs", to: "Styles" }],
  },
  Restaurant: {
    metrics: ["Covers/Day", "Avg. Spend per Table", "Waste kg", "Table Turnover"],
    terms: [{ from: "Transactions", to: "Orders" }, { from: "Units", to: "Portions" }, { from: "Inventory", to: "Ingredients" }],
  },
  Pharmacy: {
    metrics: ["Prescriptions/Day", "OTC Sales", "Expiry Waste %", "Refill Rate"],
    terms: [{ from: "Products", to: "Medicines" }, { from: "Customers", to: "Patients" }, { from: "SKUs", to: "Formulations" }],
  },
  Finance: {
    metrics: ["Loans Processed", "Default Rate", "Portfolio Yield", "Fraud Cases"],
    terms: [{ from: "Customers", to: "Borrowers" }, { from: "Products", to: "Instruments" }, { from: "Orders", to: "Transactions" }],
  },
};

const PREVIEW_ROWS = [
  { date: "2026-03-10", value: "₹42,310", unit: "856", status: "Processed" },
  { date: "2026-03-11", value: "₹39,820", unit: "741", status: "Processed" },
  { date: "2026-03-12", value: "₹44,502", unit: "912", status: "Processing" },
];

export default function SettingsPage() {
  const [bizType, setBizType] = useState<BizType>("Grocery");
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { toast } = useToast();

  const cfg = BIZ_CONFIG[bizType];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploaded(true);
    toast({ title: "File received", description: "Template validated successfully." });
  };

  const downloadTemplate = () => {
    toast({ title: `Downloading ${bizType}_template.csv`, description: "Preparing your business data template..." });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your application preferences.</p>
      </div>

      {/* ── Business Profile & Data Adapter ── */}
      <div className="glass-card p-6 space-y-5">
        <h3 className="font-heading font-semibold text-foreground text-base">Business Profile & Data Adapter</h3>

        {/* Business type cards */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Select your business type to configure metrics and terminology</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BIZ_OPTIONS.map(opt => (
              <button
                key={opt.type}
                onClick={() => setBizType(opt.type)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                  bizType === opt.type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-semibold">{opt.type}</span>
                <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Configuration */}
        <div className="rounded-lg bg-muted/30 border border-border/50 p-4 space-y-4">
          <p className="text-sm font-semibold text-foreground">Data Configuration — {bizType}</p>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Key Metrics</p>
            <div className="flex flex-wrap gap-2">
              {cfg.metrics.map(m => (
                <span key={m} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Terminology Mapping</p>
            <div className="space-y-1.5">
              {cfg.terms.map(t => (
                <div key={t.from} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground line-through">{t.from}</span>
                  <span className="text-primary">→</span>
                  <span className="text-foreground font-medium">{t.to}</span>
                </div>
              ))}
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={downloadTemplate} className="border-border text-foreground">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download Sample Template
          </Button>
        </div>

        {/* Upload zone */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Upload Business Data</p>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => { setUploaded(true); toast({ title: "Upload simulated", description: "File validated for template format." }); }}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-foreground font-medium">Drop {bizType} template file here</p>
            <p className="text-xs text-muted-foreground mt-1">Accepts CSV matching the {bizType} template format</p>
          </div>
        </div>

        {/* Preview table */}
        {uploaded && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Validation Preview (first 3 rows)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border/40 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    {["Date", "Revenue", "Volume", "Status"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map((row, i) => (
                    <tr key={i} className="border-t border-border/30">
                      <td className="py-2 px-3 text-foreground">{row.date}</td>
                      <td className="py-2 px-3 text-primary font-semibold">{row.value}</td>
                      <td className="py-2 px-3 text-foreground">{row.unit}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${row.status === "Processed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── General ── */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary" /> General
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Language</p>
              <p className="text-xs text-muted-foreground">Interface language</p>
            </div>
            <span className="text-sm text-muted-foreground">English</span>
          </div>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">In-App Notifications</p>
              <p className="text-xs text-muted-foreground">Show notifications in the bell menu</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* ── API Keys ── */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" /> API Keys
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Manage API keys for external integrations.</p>
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-foreground font-medium text-sm">Production Key</p>
            <p className="text-xs text-muted-foreground font-mono">sk-•••••••••••••••••4f2a</p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-foreground">Regenerate</Button>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Team Management
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Admin only. Invite and manage team members.</p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Invite Member</Button>
      </div>

      {/* ── Audit Log ── */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Audit Log
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Admin only. View all user actions.</p>
        <div className="space-y-2 text-sm">
          {[
            { action: "User john@acme.com logged in", time: "2 min ago" },
            { action: "Analysis A-003 started by analyst@acme.com", time: "1 hr ago" },
            { action: "Report R-004 exported by admin@acme.com", time: "3 hr ago" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-foreground">{log.action}</span>
              <span className="text-xs text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
