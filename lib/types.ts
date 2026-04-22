export type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  campus: string;
  condition: string;
  status: 'active' | 'reserved' | 'sold';
  created_at: string;
  profiles?: {
    full_name: string | null;
    campus: string | null;
  } | null;
  listing_images?: { image_url: string; sort_order: number }[];
};

export type Conversation = {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string | null;
  content: string;
  created_at: string;
};
