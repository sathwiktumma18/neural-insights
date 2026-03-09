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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/data", icon: Upload, label: "Data Upload" },
  { to: "/dashboard/analysis", icon: Brain, label: "AI Analysis" },
  { to: "/dashboard/decisions", icon: Lightbulb, label: "Decisions" },
  { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { to: "/dashboard/domain-insights", icon: Globe, label: "Domain Insights" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "/dashboard/profile", icon: UserCircle, label: "Profile" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground lg:hidden">
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
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">{userDomain}</span>
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
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
