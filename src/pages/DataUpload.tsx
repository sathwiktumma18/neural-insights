import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Table, Trash2, Download, Search, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const API_BASE = 'http://localhost:5000/api';

type DataType = 'sales' | 'customers';

const INITIAL_DATASETS = {
  "student_scores.csv": {
    headers: ["Student ID", "Grade", "Attendance%", "Score", "Risk"],
    rows: [
      ["S-101", "10", "92%", "84", "Low"],
      ["S-102", "11", "67%", "59", "High"],
      ["S-103", "10", "88%", "77", "Low"],
    ],
  },
  "transactions_2025.xlsx": {
    headers: ["Txn ID", "Amount", "Type", "Date", "Status"],
    rows: [
      ["T-4421", "₹23,000", "Credit", "2025-11-01", "Cleared"],
      ["T-4422", "₹5,400",  "Debit",  "2025-11-01", "Pending"],
      ["T-4423", "₹91,200", "Credit", "2025-11-02", "Cleared"],
    ],
  },
};

const DataUpload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<DataType>('sales');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedType);

    try {
      const response = await fetch(`${API_BASE}/upload-data`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          size: file.size,
          type: selectedType,
          uploadedAt: new Date().toISOString()
        }]);
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded and processed.`,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [selectedType]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = "";
  };

  // ── Download ─────────────────────────────────────────────────────────────────
  const handleDownload = (dataset: (typeof datasets)[0]) => {
    // For mock/existing datasets, create a simple CSV blob and download it
    const preview = INITIAL_DATASETS[dataset.name];
    let content = "";
    if (preview) {
      content = [preview.headers, ...preview.rows].map((r) => r.join(",")).join("\n");
    } else {
      content = "id,value,date\n1,sample,2026-03-12";
    }
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dataset.name.endsWith(".json") ? dataset.name : dataset.name.replace(/\.[^.]+$/, ".csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Download started", description: `Downloading ${dataset.name}` });
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = (id: string, name: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Dataset removed", description: `${name} has been deleted from the library.` });
  };

  // ── Preview ──────────────────────────────────────────────────────────────────
  const handlePreview = (name: string) => {
    setPreviewFile(name);
  };

  const previewData = previewFile ? INITIAL_DATASETS[previewFile] : null;

  const datasetsArray = Object.entries(datasets).map(([key, value]) => ({
    name: key,
    ...(typeof value === 'object' ? value : {}),
  }));

  const filtered = datasetsArray.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Data Upload</h1>
          <p className="text-purple-300">Upload and manage your datasets for AI analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${"border-purple-500 bg-purple-500/10"}`}
              onDragOver={() => setDragOver(true)}
              onDragLeave={() => setDragOver(false)} 
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Drop your files here</h2>
              <p className="text-purple-300 mb-4">or click to select from computer</p>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DataType)}
                className="mb-4 px-4 py-2 bg-purple-900 text-white rounded border border-purple-500"
              >
                <option value="sales">Sales Data</option>
                <option value="customers">Customer Data</option>
              </select>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-white font-semibold mb-2">Upload Status</h3>
              <p className="text-purple-300 text-sm">{uploadedFiles.length} files uploaded</p>
            </div>
          </div>
        </div>

        {/* Datasets Library */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Datasets</h2>
            <Input
              placeholder="Search datasets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs bg-slate-800 border-purple-500/30 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((dataset) => (
              <div
                key={dataset.name}
                className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-white font-semibold">{dataset.name}</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete("", dataset.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(dataset.name)}
                  >
                    <Table className="w-4 h-4 mr-1" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(dataset)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewFile}</DialogTitle>
          </DialogHeader>
          {previewData && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {previewData.headers.map((h) => (
                      <th key={h} className="text-left p-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-100">
                      {r.map((cell, idx2) => (
                        <td key={idx2} className="p-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataUpload;
