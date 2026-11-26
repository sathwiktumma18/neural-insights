import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Brain,
  Lightbulb,
  FileText,
  Bell,
  Settings,
  UserCircle,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Activity,
  TrendingUp,
  Zap,
  FlaskConical,
  Network,
  AlertTriangle,
  CheckCircle,
  Info,
  Sun,
  Moon,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/monitoring", icon: Activity, label: "Live Monitoring" },
  { to: "/dashboard/forecasting", icon: TrendingUp, label: "Forecasting" },
  { to: "/dashboard/data", icon: Upload, label: "Data Upload" },
  { to: "/dashboard/analysis", icon: Brain, label: "AI Analysis" },
  { to: "/dashboard/decisions", icon: Lightbulb, label: "Decisions" },
  { to: "/dashboard/strategy", icon: Zap, label: "Strategy Engine" },
  { to: "/dashboard/simulation", icon: FlaskConical, label: "Simulation" },
  { to: "/dashboard/knowledge-graph", icon: Network, label: "Knowledge Graph" },
  { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { to: "/dashboard/domain-insights", icon: Globe, label: "Domain Insights" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "/dashboard/profile", icon: UserCircle, label: "Profile" },
];

const aiNavItems = [
  { to: "/dashboard/ai", icon: Sparkles, label: "AI Dashboard" },
  { to: "/dashboard/ai/sales-prediction", icon: TrendingUp, label: "Sales Prediction" },
  { to: "/dashboard/ai/customer-segments", icon: Users, label: "Customer Segments" },
  { to: "/dashboard/ai/marketing-decisions", icon: Lightbulb, label: "Marketing Decisions" },
  { to: "/dashboard/ai/whatif", icon: FlaskConical, label: "What-If Simulator" },
  { to: "/dashboard/ai/explainable", icon: Brain, label: "Explainable AI" },
  { to: "/dashboard/ai/alerts", icon: AlertTriangle, label: "AI Alerts" },
  { to: "/dashboard/ai/chatbot", icon: Sparkles, label: "Chatbot" },
];

const recentAlerts = [
  { message: "Accuracy dropped to 78.2% on model A-004", type: "warning", time: "5 hr ago" },
  { message: "Analysis A-003 completed successfully", type: "success", time: "1 hr ago" },
  { message: "New dataset uploaded: transactions_2025.xlsx", type: "info", time: "2 hr ago" },
  { message: "Scheduled report generated: Weekly KPI Summary", type: "info", time: "6 hr ago" },
  { message: "Model drift detected on classifier C-002", type: "warning", time: "8 hr ago" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [unreadCount, setUnreadCount] = useState(3);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setBellOpen(false);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userDomain = user?.user_metadata?.domain || "general";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-64" : "w-16"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-sidebar-border ${sidebarOpen ? "justify-between" : "justify-center"}`}>
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-primary" />
              <span className="font-heading font-bold text-foreground text-lg">NeuralDecide</span>
            </Link>
          )}
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(false); }}
            className="text-muted-foreground hover:text-foreground hidden lg:block"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${!sidebarOpen ? "justify-center" : ""}`}
              activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {/* AI Features section */}
          {sidebarOpen && (
            <div className="px-3 pt-4 pb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80 font-semibold">AI Features</p>
            </div>
          )}
          {!sidebarOpen && <div className="my-2 border-t border-sidebar-border/60" />}

          {aiNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${!sidebarOpen ? "justify-center" : ""}`}
              activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-foreground"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Health Score Chip */}
            <Link to="/dashboard" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold hover:bg-success/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              78
            </Link>

            {/* Domain badge */}
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize hidden sm:block">{userDomain}</span>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Bell with popover */}
            <Popover open={bellOpen} onOpenChange={setBellOpen}>
              <PopoverTrigger asChild>
                <button className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 bg-card border-border p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h4 className="font-heading font-semibold text-foreground text-sm">Notifications</h4>
                  <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {recentAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 px-4 py-3 hover:bg-muted/30 transition-colors">
                      {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />}
                      {alert.type === "success" && <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />}
                      {alert.type === "info" && <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{alert.time}</p>
                      </div>
                      {i < unreadCount && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
