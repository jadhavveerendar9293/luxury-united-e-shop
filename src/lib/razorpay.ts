import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise (e.g., 5000 for Rs 50)
  currency?: string;
  order_id: string;
  name: string;
  description: string;
  customer_email: string;
  customer_phone: string;
  prefill?: {
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
  handler?: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  retry?: {
    enabled: boolean;
    max_count: number;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OrderData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  subtotal: number;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    product_image?: string;
  }[];
}

/**
 * Initialize Razorpay checkout and handle payment
 */
export async function initializeRazorpayCheckout(
  options: RazorpayCheckoutOptions,
  onSuccess?: (response: RazorpayPaymentResponse) => void,
  onError?: (error: Error) => void,
) {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    // Ensure Razorpay is available
    if (typeof window.Razorpay === "undefined") {
      throw new Error("Razorpay script not loaded");
    }

    // Merge handler with custom callback
    const razorpay = new window.Razorpay({
      ...options,
      handler: (response: RazorpayPaymentResponse) => {
        if (options.handler) {
          options.handler(response);
        }
        if (onSuccess) {
          onSuccess(response);
        }
      },
      modal: {
        ondismiss: () => {
          if (options.modal?.ondismiss) {
            options.modal.ondismiss();
          }
          if (onError) {
            onError(new Error("Payment cancelled by user"));
          }
        },
      },
    });

    razorpay.open();
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Failed to initialize Razorpay");
    if (onError) {
      onError(err);
    } else {
      throw err;
    }
  }
}

/**
 * Create an order in the database
 */
export async function createOrder(orderData: OrderData) {
  try {
    // Get current user
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        shipping_email: orderData.email,
        shipping_phone: orderData.phone,
        shipping_first_name: orderData.firstName,
        shipping_last_name: orderData.lastName,
        shipping_address: orderData.address,
        shipping_city: orderData.city,
        shipping_postal_code: orderData.postalCode,
        shipping_country: orderData.country,
        shipping_state: orderData.state || null,
        subtotal: orderData.subtotal,
        shipping_cost: 0,
        tax: 0,
        total: orderData.subtotal,
        status: "pending",
        payment_status: "pending",
        payment_method: "razorpay",
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    if (orderData.items.length > 0) {
      const itemsData = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsData);

      if (itemsError) {
        throw itemsError;
      }
    }

    return order;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Failed to create order");
    throw err;
  }
}

/**
 * Verify payment signature with Razorpay
 */
export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): Promise<boolean> {
  try {
    // In a real application, you would verify the signature on the backend
    // using RAZORPAY_KEY_SECRET. This is a client-side placeholder.
    // The actual verification should happen on a server-side endpoint.

    // For now, we'll just validate the format
    if (!orderId || !paymentId || !signature) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentId: string,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  signature?: string,
) {
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_id: paymentId,
        status: paymentStatus === "paid" ? "confirmed" : "pending",
        confirmed_at: paymentStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Failed to update order:", error);
    return false;
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_name,
          product_image,
          quantity,
          unit_price,
          total_price
        )
      `,
      )
      .eq("id", orderId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
}

/**
 * Load Razorpay script dynamically
 */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));

    document.head.appendChild(script);
  });
}

// Augment Window interface for TypeScript
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
    };
  }
}
