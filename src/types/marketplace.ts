export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category_id: string | null;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor' | null;
  location: string | null;
  status: 'active' | 'sold' | 'archived';
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
  images?: ListingImage[];
  profile?: Profile;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position: number;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  // joined
  listing?: Listing;
  buyer_profile?: Profile;
  seller_profile?: Profile;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_profile?: Profile;
}

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';

export const conditionLabels: Record<ListingCondition, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};
