import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import type { Listing } from "@/types/marketplace";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const imageUrl = listing.images?.[0]?.url;
  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true });

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={listing.title} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No image
            </div>
          )}
          {listing.status === "sold" && (
            <Badge className="absolute top-2 left-2 bg-destructive">Sold</Badge>
          )}
        </div>
        <div className="p-3">
          <p className="font-semibold text-lg text-foreground">
            ${Number(listing.price).toLocaleString()}
          </p>
          <h3 className="text-sm font-medium text-foreground line-clamp-1 mt-0.5">
            {listing.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {listing.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {listing.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
