import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Profile, Listing } from "@/types/marketplace";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({ users: 0, listings: 0, active: 0 });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers((profilesData as Profile[]) || []);

    const { data: listingsData } = await supabase
      .from("listings")
      .select("*, listing_images(*), profiles!listings_user_id_fkey(full_name)")
      .order("created_at", { ascending: false });

    const mapped = (listingsData || []).map((item: any) => ({
      ...item,
      images: item.listing_images,
      profile: item.profiles,
    }));
    setListings(mapped);

    setStats({
      users: (profilesData || []).length,
      listings: (listingsData || []).length,
      active: (listingsData || []).filter((l: any) => l.status === "active").length,
    });
  };

  const deleteListing = async (id: string) => {
    await supabase.from("listings").delete().eq("id", id);
    toast({ title: "Listing deleted" });
    fetchData();
  };

  if (!isAdmin) return null;

  return (
    <div className="section-container py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: stats.users },
          { label: "Total Listings", value: stats.listings },
          { label: "Active Listings", value: stats.active },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-2 mt-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {listing.profile?.full_name || "Unknown"} · ${Number(listing.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={listing.status === "active" ? "default" : "secondary"}>{listing.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteListing(listing.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-2 mt-4">
          {users.map((profile) => (
            <Card key={profile.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{profile.full_name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{profile.location || "No location"}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
