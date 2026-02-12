import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Listing } from "@/types/marketplace";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("listings")
      .select("*, listing_images(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setListings((data || []).map((item: any) => ({ ...item, images: item.listing_images })));
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("listings").update({ status }).eq("id", id);
    fetchListings();
    toast({ title: `Listing marked as ${status}` });
  };

  const deleteListing = async (id: string) => {
    await supabase.from("listings").delete().eq("id", id);
    fetchListings();
    toast({ title: "Listing deleted" });
  };

  if (loading) return <div className="section-container py-6"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="section-container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button asChild size="sm">
          <Link to="/create"><Plus className="h-4 w-4 mr-1" /> New</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">You haven't posted any listings yet.</p>
          <Button asChild className="mt-4">
            <Link to="/create">Create your first listing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0].url} alt="" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/listing/${listing.id}`} className="font-medium text-sm hover:underline line-clamp-1">{listing.title}</Link>
                      <p className="text-sm font-semibold text-primary">${Number(listing.price).toLocaleString()}</p>
                    </div>
                    <Badge variant={listing.status === "active" ? "default" : listing.status === "sold" ? "destructive" : "secondary"}>
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {listing.status === "active" && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(listing.id, "sold")}>
                        Mark Sold
                      </Button>
                    )}
                    {listing.status === "sold" && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(listing.id, "active")}>
                        Relist
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteListing(listing.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
