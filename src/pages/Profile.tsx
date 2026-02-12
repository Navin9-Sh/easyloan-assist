import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setLocation(profile.location || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        location: location.trim() || null,
        bio: bio.trim() || null,
        phone: phone.trim() || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const path = `${user.id}/avatar.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("listing-images").upload(path, file, { upsert: true });

    if (!error) {
      const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
      await refreshProfile();
      toast({ title: "Avatar updated!" });
    }
  };

  return (
    <div className="section-container py-6">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <label className="cursor-pointer">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
            <p className="text-sm text-muted-foreground">Click avatar to change photo</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Area" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" maxLength={20} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell buyers a bit about yourself" rows={3} maxLength={500} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
