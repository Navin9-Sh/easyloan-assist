import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/types/marketplace";

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }

    const fetch = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("listing_id, listings(*, listing_images(*), categories(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const mapped = (data || [])
        .map((b: any) => b.listings)
        .filter(Boolean)
        .map((item: any) => ({ ...item, images: item.listing_images, category: item.categories }));

      setListings(mapped);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="section-container py-6"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="section-container py-6">
      <h1 className="text-2xl font-bold mb-6">Saved Items</h1>
      {listings.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No saved items yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
