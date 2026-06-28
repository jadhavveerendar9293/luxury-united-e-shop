export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          collection: string | null
          category: string
          sku: string | null
          price: number
          compare_at_price: number | null
          images: string[]
          details: string[]
          stock: number
          rating: number
          reviews_count: number
          popularity: number
          is_featured: boolean
          is_new_arrival: boolean
          is_best_seller: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          collection?: string | null
          category: string
          sku?: string | null
          price?: number
          compare_at_price?: number | null
          images?: string[]
          details?: string[]
          stock?: number
          rating?: number
          reviews_count?: number
          popularity?: number
          is_featured?: boolean
          is_new_arrival?: boolean
          is_best_seller?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          collection?: string | null
          category?: string
          sku?: string | null
          price?: number
          compare_at_price?: number | null
          images?: string[]
          details?: string[]
          stock?: number
          rating?: number
          reviews_count?: number
          popularity?: number
          is_featured?: boolean
          is_new_arrival?: boolean
          is_best_seller?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { target_table: 'users'; source_column: 'user_id'; target_column: 'id' }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          tagline: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          tagline?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          tagline?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          { target_table: 'profiles'; source_column: 'user_id'; target_column: 'user_id' },
          { target_table: 'products'; source_column: 'product_id'; target_column: 'id' }
        ]
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { target_table: 'profiles'; source_column: 'user_id'; target_column: 'user_id' },
          { target_table: 'products'; source_column: 'product_id'; target_column: 'id' }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          shipping_first_name: string
          shipping_last_name: string
          shipping_email: string
          shipping_phone: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string | null
          shipping_postal_code: string
          shipping_country: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          tracking_number: string | null
          tracking_url: string | null
          courier_name: string | null
          notes: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          shipping_first_name: string
          shipping_last_name: string
          shipping_email: string
          shipping_phone?: string | null
          shipping_address: string
          shipping_city: string
          shipping_state?: string | null
          shipping_postal_code: string
          shipping_country: string
          subtotal: number
          shipping_cost?: number
          tax?: number
          total: number
          status?: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          courier_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          shipping_first_name?: string
          shipping_last_name?: string
          shipping_email?: string
          shipping_phone?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_state?: string | null
          shipping_postal_code?: string
          shipping_country?: string
          subtotal?: number
          shipping_cost?: number
          tax?: number
          total?: number
          status?: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          courier_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Relationships: [
          { target_table: 'profiles'; source_column: 'user_id'; target_column: 'user_id' }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          unit_price: number
          total_price: number
          product_image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity: number
          unit_price: number
          total_price: number
          product_image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          product_image?: string | null
          created_at?: string
        }
        Relationships: [
          { target_table: 'orders'; source_column: 'order_id'; target_column: 'id' },
          { target_table: 'products'; source_column: 'product_id'; target_column: 'id' }
        ]
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          review: string
          is_approved: boolean
          is_featured: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          review: string
          is_approved?: boolean
          is_featured?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          review?: string
          is_approved?: boolean
          is_featured?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { target_table: 'products'; source_column: 'product_id'; target_column: 'id' },
          { target_table: 'profiles'; source_column: 'user_id'; target_column: 'user_id' }
        ]
      }
      website_settings: {
        Row: {
          id: number
          site_name: string
          logo_url: string | null
          favicon_url: string | null
          primary_color: string | null
          enable_dark_mode: boolean | null
          contact_email: string | null
          contact_phone: string | null
          whatsapp_number: string | null
          address_line1: string | null
          address_line2: string | null
          address_city: string | null
          address_state: string | null
          address_postal_code: string | null
          address_country: string | null
          instagram_url: string | null
          facebook_url: string | null
          twitter_url: string | null
          pinterest_url: string | null
          linkedin_url: string | null
          youtube_url: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_collection_name: string | null
          hero_image_url: string | null
          hero_cta_text: string | null
          hero_cta_link: string | null
          footer_newsletter_title: string | null
          footer_newsletter_subtitle: string | null
          footer_about_text: string | null
          footer_copyright: string | null
          faq_content: Json | null
          privacy_policy: string | null
          terms_conditions: string | null
          refund_policy: string | null
          shipping_policy: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          enable_reviews: boolean | null
          enable_wishlist: boolean | null
          enable_search: boolean | null
          enable_newsletter: boolean | null
          currency_code: string | null
          currency_symbol: string | null
          free_shipping_threshold: number | null
          updated_at: string
        }
        Insert: {
          id?: number
          site_name?: string
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string | null
          enable_dark_mode?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_state?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          twitter_url?: string | null
          pinterest_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_collection_name?: string | null
          hero_image_url?: string | null
          hero_cta_text?: string | null
          hero_cta_link?: string | null
          footer_newsletter_title?: string | null
          footer_newsletter_subtitle?: string | null
          footer_about_text?: string | null
          footer_copyright?: string | null
          faq_content?: Json | null
          privacy_policy?: string | null
          terms_conditions?: string | null
          refund_policy?: string | null
          shipping_policy?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          enable_reviews?: boolean | null
          enable_wishlist?: boolean | null
          enable_search?: boolean | null
          enable_newsletter?: boolean | null
          currency_code?: string | null
          currency_symbol?: string | null
          free_shipping_threshold?: number | null
          updated_at?: string
        }
        Update: {
          id?: number
          site_name?: string
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string | null
          enable_dark_mode?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_state?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          twitter_url?: string | null
          pinterest_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_collection_name?: string | null
          hero_image_url?: string | null
          hero_cta_text?: string | null
          hero_cta_link?: string | null
          footer_newsletter_title?: string | null
          footer_newsletter_subtitle?: string | null
          footer_about_text?: string | null
          footer_copyright?: string | null
          faq_content?: Json | null
          privacy_policy?: string | null
          terms_conditions?: string | null
          refund_policy?: string | null
          shipping_policy?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          enable_reviews?: boolean | null
          enable_wishlist?: boolean | null
          enable_search?: boolean | null
          enable_newsletter?: boolean | null
          currency_code?: string | null
          currency_symbol?: string | null
          free_shipping_threshold?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
