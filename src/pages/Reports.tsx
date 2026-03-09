import { FileText, Download, Share2, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const reports = [
  { id: "R-001", title: "Monthly Performance Summary", type: "Summary", date: "2026-03-01", pages: 12 },
  { id: "R-002", title: "Q1 2026 Domain Comparison", type: "Comparative", date: "2026-02-28", pages: 24 },
  { id: "R-003", title: "Healthcare Model Deep Dive", type: "Detailed", date: "2026-02-20", pages: 38 },
  { id: "R-004", title: "Weekly Accuracy Trends", type: "Summary", date: "2026-03-08", pages: 6 },
];

const scheduledReports = [
  { title: "Weekly KPI Summary", frequency: "Weekly", next: "2026-03-15" },
  { title: "Monthly Analysis Digest", frequency: "Monthly", next: "2026-04-01" },
];

const Reports = () => {
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

      {/* Generate */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Generate Report</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-foreground">Source</Label>
            <Select>
              <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
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
              <SelectTrigger className="mt-1.5 bg-muted border-border text-foreground">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
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
      </div>

      {/* Library */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Reports Library</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Type</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Pages</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Share2 className="h-4 w-4" />
                      </Button>
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
          {scheduledReports.map((s) => (
            <div key={s.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="text-foreground font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.frequency} • Next: {s.next}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
