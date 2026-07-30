export interface Lead {
  id?: string;
  instagram_user_id: string;
  instagram_handle?: string;
  full_name?: string;
  email?: string;
  source_post_id?: string;
  is_following: boolean;
  status: 'pending' | 'following_verified' | 'delivered';
  delivered_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LeadStats {
  total_leads: number;
  followers_verified: number;
  delivered_count: number;
  conversion_rate: string;
}

export interface DMEventPayload {
  sender_id: string;
  sender_handle?: string;
  message_text?: string;
  post_id?: string;
  button_payload?: string;
}
