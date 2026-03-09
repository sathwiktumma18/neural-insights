import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Table, Trash2, Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const mockDatasets = [
  { id: "1", name: "sales_q4_2025.csv", size: "2.4 MB", domain: "Business", rows: 15420, date: "2026-03-01", status: "Ready" },
  { id: "2", name: "patient_records.json", size: "8.1 MB", domain: "Healthcare", rows: 42300, date: "2026-02-28", status: "Ready" },
  { id: "3", name: "student_scores.csv", size: "1.2 MB", domain: "Education", rows: 8900, date: "2026-02-25", status: "Ready" },
  { id: "4", name: "transactions_2025.xlsx", size: "5.7 MB", domain: "Finance", rows: 31200, date: "2026-02-20", status: "Processing" },
];

const DataUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    toast({ title: "File received", description: "Dataset upload simulated successfully." });
  }, [toast]);

  const filtered = mockDatasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Data Management</h1>
        <p className="text-muted-foreground mt-1">Upload, manage, and preview your datasets.</p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onClick={() => toast({ title: "Upload simulated", description: "File upload functionality ready for backend integration." })}
      >
        <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-sm text-muted-foreground">Supports CSV, Excel, and JSON files up to 50MB</p>
      </motion.div>

      {/* Dataset Library */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-heading font-semibold text-foreground">Dataset Library</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Domain</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden lg:table-cell">Rows</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Size</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{d.domain}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{d.rows.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{d.size}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${d.status === "Ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Table className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default DataUpload;
