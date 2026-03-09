import { useState, useEffect } from "react";
import { UserCircle, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [bio, setBio] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setName(session.user.user_metadata?.full_name || "");
        setEmail(session.user.email || "");
        setDomain(session.user.user_metadata?.domain || "");
      }
    });
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, domain, bio },
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information.</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-lg">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 bg-muted border-border text-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Email</Label>
            <Input value={email} disabled className="mt-1.5 bg-muted border-border text-muted-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Domain</Label>
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1.5 bg-muted border-border text-foreground" />
          </div>
        </div>

        <div>
          <Label className="text-foreground">Bio</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-lg bg-muted border border-border text-foreground p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Tell us about yourself..."
          />
        </div>

        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
