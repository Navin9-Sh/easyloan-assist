import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, MapPin, ArrowLeft } from "lucide-react";
import type { Listing } from "@/types/marketplace";
import { conditionLabels, type ListingCondition } from "@/types/marketplace";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("listings")
        .select("*, listing_images(*), profiles!listings_user_id_fkey(*), categories(*)")
        .eq("id", id!)
        .maybeSingle();

      if (data) {
        setListing({
          ...data,
          images: (data as any).listing_images,
          category: (data as any).categories,
          profile: (data as any).profiles,
        } as any);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      supabase.from("bookmarks").select("id").eq("user_id", user.id).eq("listing_id", id).maybeSingle().then(({ data }) => {
        setBookmarked(!!data);
      });
    }
  }, [user, id]);

  const toggleBookmark = async () => {
    if (!user) return navigate("/auth");
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("listing_id", id!);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, listing_id: id! });
      setBookmarked(true);
    }
  };

  const startChat = async () => {
    if (!user) return navigate("/auth");
    if (!listing) return;

    // Check existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .maybeSingle();

    if (existing) {
      navigate(`/chat/${existing.id}`);
    } else {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({ listing_id: listing.id, buyer_id: user.id, seller_id: listing.user_id })
        .select("id")
        .single();

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (created) {
        navigate(`/chat/${created.id}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="section-container py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="aspect-video max-w-2xl rounded-lg" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="section-container py-16 text-center">
        <p className="text-muted-foreground">Listing not found.</p>
        <Button asChild variant="ghost" className="mt-2">
          <Link to="/browse">Back to Browse</Link>
        </Button>
      </div>
    );
  }

  const images = listing.images || [];
  const isOwner = user?.id === listing.user_id;

  return (
    <div className="section-container py-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <img src={images[selectedImage]?.url} alt={listing.title} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No images</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    i === selectedImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>
              <p className="text-3xl font-bold text-primary mt-1">${Number(listing.price).toLocaleString()}</p>
            </div>
            {!isOwner && (
              <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                <Heart className={`h-5 w-5 ${bookmarked ? "fill-destructive text-destructive" : ""}`} />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {listing.category && <Badge variant="secondary">{listing.category.name}</Badge>}
            {listing.condition && <Badge variant="outline">{conditionLabels[listing.condition as ListingCondition]}</Badge>}
            {listing.status === "sold" && <Badge className="bg-destructive">Sold</Badge>}
          </div>

          {listing.location && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
              <MapPin className="h-4 w-4" /> {listing.location}
            </p>
          )}

          <div className="mt-6">
            <h2 className="font-semibold mb-1">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Seller info */}
          {listing.profile && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={listing.profile.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {listing.profile.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{listing.profile.full_name || "User"}</p>
                  {listing.profile.location && (
                    <p className="text-xs text-muted-foreground">{listing.profile.location}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isOwner && listing.status === "active" && (
            <Button className="w-full mt-6" size="lg" onClick={startChat}>
              <MessageCircle className="h-4 w-4 mr-2" /> Message Seller
            </Button>
          )}

          {isOwner && (
            <Button asChild variant="outline" className="w-full mt-6">
              <Link to="/my-listings">Manage Listing</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
