import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import type { Listing, Category } from "@/types/marketplace";
import { Skeleton } from "@/components/ui/skeleton";

const Browse = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      setCategories((data as Category[]) || []);
    });
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select("*, listing_images(*), profiles!listings_user_id_fkey(*), categories(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      const { data } = await query;
      const mapped = (data || []).map((item: any) => ({
        ...item,
        images: item.listing_images,
        category: item.categories,
        profile: item.profiles,
      }));
      setListings(mapped);
      setLoading(false);
    };

    const timeout = setTimeout(fetchListings, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  return (
    <div className="section-container py-6">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Listings grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No listings found.</p>
          {search && (
            <Button variant="ghost" className="mt-2" onClick={() => setSearch("")}>
              Clear search
            </Button>
          )}
        </div>
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

export default Browse;
