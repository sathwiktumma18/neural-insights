import { useState } from "react";
import { motion } from "framer-motion";
import { Network } from "lucide-react";

// ─── Node/Edge definitions ─────────────────────────────────────────────────
interface Node {
  id: string; label: string; type: "product" | "supplier" | "customer" | "season" | "category";
  x: number; y: number; r: number;
}
interface Edge { from: string; to: string; }

const NODES: Node[] = [
  // Products (cyan)
  { id: "P1",  label: "Fresh Produce",   type: "product",  x: 320, y: 140, r: 22 },
  { id: "P2",  label: "Dairy",           type: "product",  x: 520, y: 200, r: 20 },
  { id: "P3",  label: "Packaged Goods",  type: "product",  x: 200, y: 290, r: 18 },
  { id: "P4",  label: "Beverages",       type: "product",  x: 620, y: 320, r: 20 },
  { id: "P5",  label: "Snacks",          type: "product",  x: 400, y: 380, r: 16 },
  // Suppliers (purple)
  { id: "S1",  label: "FarmLink Ltd",    type: "supplier", x: 100, y: 150, r: 20 },
  { id: "S2",  label: "DairyCo",         type: "supplier", x: 680, y: 160, r: 20 },
  { id: "S3",  label: "GlobalPack",      type: "supplier", x: 80,  y: 380, r: 18 },
  // Customers (amber)
  { id: "C1",  label: "Segment A",       type: "customer", x: 560, y: 440, r: 20 },
  { id: "C2",  label: "Segment B",       type: "customer", x: 380, y: 480, r: 22 },
  { id: "C3",  label: "Segment C",       type: "customer", x: 200, y: 440, r: 18 },
  // Seasons (green)
  { id: "SE1", label: "Winter",          type: "season",   x: 160, y: 200, r: 18 },
  { id: "SE2", label: "Summer",          type: "season",   x: 480, y: 100, r: 18 },
  // Category
  { id: "CA1", label: "Health & Org.",   type: "category", x: 360, y: 240, r: 16 },
];

const EDGES: Edge[] = [
  { from: "S1", to: "P1" }, { from: "S1", to: "P3" }, { from: "S1", to: "SE1" },
  { from: "S2", to: "P2" }, { from: "S2", to: "P4" },
  { from: "S3", to: "P3" }, { from: "S3", to: "P5" },
  { from: "P1", to: "CA1" }, { from: "P2", to: "CA1" }, { from: "P1", to: "C1" },
  { from: "P2", to: "C2" }, { from: "P3", to: "C3" }, { from: "P4", to: "C1" },
  { from: "P5", to: "C2" }, { from: "P5", to: "C3" },
  { from: "SE1", to: "P1" }, { from: "SE1", to: "P2" },
  { from: "SE2", to: "P4" }, { from: "SE2", to: "P5" },
];

const NODE_COLORS: Record<Node["type"], string> = {
  product:  "hsl(191 100% 50%)",
  supplier: "hsl(262 100% 59%)",
  customer: "hsl(43 96% 56%)",
  season:   "hsl(142 76% 50%)",
  category: "hsl(280 60% 65%)",
};

const NODE_LABELS: Record<Node["type"], string> = {
  product: "Product", supplier: "Supplier", customer: "Customer", season: "Season", category: "Category",
};

const INSIGHTS = [
  { title: "Top Connected Node", value: "FarmLink Ltd", desc: "4 direct connections to products & seasons." },
  { title: "Seasonal Correlation", value: "Winter → 6 SKUs", desc: "Winter season strongly correlates with 6 products including Fresh Produce & Dairy." },
  { title: "Driven by Segment B", value: "38% of Demand", desc: "Customer Segment B drives 38% of demand across Dairy, Packaged Goods, and Snacks." },
];

// Get connected node IDs
function getConnected(nodeId: string) {
  return EDGES.filter(e => e.from === nodeId || e.to === nodeId)
    .flatMap(e => [e.from, e.to]).filter(id => id !== nodeId);
}

export default function KnowledgeGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const connectedIds = hoveredNode ? new Set(getConnected(hoveredNode)) : new Set<string>();

  const getNodeOpacity = (id: string) => {
    if (!hoveredNode) return 1;
    if (id === hoveredNode || connectedIds.has(id)) return 1;
    return 0.2;
  };

  const getEdgeOpacity = (e: Edge) => {
    if (!hoveredNode) return 0.35;
    if (e.from === hoveredNode || e.to === hoveredNode) return 0.9;
    return 0.08;
  };

  const hoveredNodeData = NODES.find(n => n.id === hoveredNode);
  const connCount = hoveredNode ? getConnected(hoveredNode).length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Knowledge Graph</h1>
        <p className="text-muted-foreground mt-1">Entity relationship map — hover nodes to explore connections.</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {(Object.entries(NODE_COLORS) as [Node["type"], string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-muted-foreground capitalize">{NODE_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Graph SVG */}
      <div className="glass-card p-4 overflow-hidden">
        <svg
          viewBox="0 0 760 530"
          className="w-full"
          style={{ minHeight: 320 }}
        >
          {/* Edges */}
          {EDGES.map((e, i) => {
            const from = NODES.find(n => n.id === e.from)!;
            const to = NODES.find(n => n.id === e.to)!;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="hsl(215 20% 55%)"
                strokeWidth={hoveredNode && (e.from === hoveredNode || e.to === hoveredNode) ? 2 : 1}
                strokeOpacity={getEdgeOpacity(e)}
                style={{ transition: "stroke-opacity 0.2s" }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => (
            <g
              key={node.id}
              style={{ cursor: "pointer", transition: "opacity 0.2s", opacity: getNodeOpacity(node.id) }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle
                cx={node.x} cy={node.y} r={node.r + 4}
                fill={NODE_COLORS[node.type]}
                opacity={hoveredNode === node.id ? 0.2 : 0}
              />
              <circle
                cx={node.x} cy={node.y} r={node.r}
                fill={NODE_COLORS[node.type]}
                opacity={0.85}
                stroke={hoveredNode === node.id ? "white" : "transparent"}
                strokeWidth={2}
              />
              <text
                x={node.x} y={node.y + node.r + 14}
                textAnchor="middle"
                fontSize={10}
                fill="hsl(210 40% 80%)"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Hover tooltip */}
          {hoveredNodeData && (
            <g>
              <rect
                x={hoveredNodeData.x - 50} y={hoveredNodeData.y - hoveredNodeData.r - 44}
                width={100} height={36}
                rx={6} fill="hsl(220 47% 11%)"
                stroke="hsl(220 30% 30%)" strokeWidth={1}
              />
              <text
                x={hoveredNodeData.x} y={hoveredNodeData.y - hoveredNodeData.r - 30}
                textAnchor="middle" fontSize={10} fill="hsl(210 40% 96%)" fontWeight="600"
              >
                {hoveredNodeData.label}
              </text>
              <text
                x={hoveredNodeData.x} y={hoveredNodeData.y - hoveredNodeData.r - 16}
                textAnchor="middle" fontSize={9} fill="hsl(191 100% 50%)"
              >
                {connCount} connection{connCount !== 1 ? "s" : ""}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Insights */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Graph Insights</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {INSIGHTS.map((ins) => (
            <div key={ins.title} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">{ins.title}</p>
              </div>
              <p className="text-lg font-heading font-bold text-primary mb-1">{ins.value}</p>
              <p className="text-xs text-muted-foreground">{ins.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
