import { Bell, Moon, Sun, Key, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your application preferences.</p>
      </div>

      {/* General */}
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

      {/* Notifications */}
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

      {/* API Keys */}
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

      {/* Team */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Team Management
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Admin only. Invite and manage team members.</p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Invite Member</Button>
      </div>

      {/* Audit */}
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
};

export default SettingsPage;
