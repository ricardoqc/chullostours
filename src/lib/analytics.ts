/**
 * Google Analytics 4 (GA4) & Google Tag Manager (GTM) Analytics Utilities
 * Provides type-safe dataLayer pushes and event helpers for e-commerce and lead tracking.
 */

export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Safe helper to push events to window.dataLayer
 */
export function pushToDataLayer(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    timestamp: new Date().toISOString(),
    ...params,
  });
}

/**
 * Track WhatsApp click with context
 */
export function trackWhatsAppClick(data: {
  location: string;
  tourSlug?: string;
  tourName?: string;
  agentName?: string;
  phoneNumber?: string;
}): void {
  pushToDataLayer("whatsapp_click", {
    click_location: data.location,
    tour_slug: data.tourSlug || null,
    tour_name: data.tourName || null,
    agent_name: data.agentName || null,
    phone_number: data.phoneNumber || null,
    contact_channel: "whatsapp",
  });
}

/**
 * Track View Item (GA4 Standard E-commerce Event)
 */
export function trackViewItem(data: {
  id: string;
  name: string;
  price?: number;
  currency?: string;
  category?: string;
}): void {
  pushToDataLayer("view_item", {
    ecommerce: {
      currency: data.currency || "USD",
      value: data.price || 0,
      items: [
        {
          item_id: data.id,
          item_name: data.name,
          price: data.price || 0,
          item_category: data.category || "Tour",
          quantity: 1,
        },
      ],
    },
  });
}

/**
 * Track Begin Checkout (GA4 Standard E-commerce Event)
 */
export function trackBeginCheckout(data: {
  id: string;
  name: string;
  price?: number;
  currency?: string;
  travelers?: number;
  date?: string;
}): void {
  pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: data.currency || "USD",
      value: data.price || 0,
      items: [
        {
          item_id: data.id,
          item_name: data.name,
          price: data.price || 0,
          quantity: data.travelers || 1,
        },
      ],
    },
    travel_date: data.date || null,
  });
}

/**
 * Track Booking Submission / Reservation Lead (GA4 & GTM Lead Event)
 */
export function trackBookingSubmitted(data: {
  tourSlug: string;
  tourTitle: string;
  totalPrice: number;
  currency?: string;
  travelersCount?: number;
  travelDate?: string;
  customerEmail?: string;
  customerPhone?: string;
}): void {
  // Push standard GA4 generate_lead event
  pushToDataLayer("generate_lead", {
    lead_type: "booking_reservation",
    currency: data.currency || "USD",
    value: data.totalPrice,
    tour_slug: data.tourSlug,
    tour_title: data.tourTitle,
    travelers_count: data.travelersCount || 1,
    travel_date: data.travelDate || null,
  });

  // Also push purchase/conversion custom event for GTM triggers
  pushToDataLayer("booking_lead_submitted", {
    tour_slug: data.tourSlug,
    tour_title: data.tourTitle,
    value: data.totalPrice,
    currency: data.currency || "USD",
    travelers_count: data.travelersCount || 1,
  });
}

/**
 * Track General Lead Generation (Contact Form, Custom Trip, etc.)
 */
export function trackGenerateLead(data: {
  formName: string;
  tourSlug?: string;
  method?: string;
  contactEmail?: string;
  contactPhone?: string;
}): void {
  pushToDataLayer("generate_lead", {
    form_name: data.formName,
    tour_slug: data.tourSlug || null,
    contact_method: data.method || "web_form",
  });
}

/**
 * Track Search execution
 */
export function trackSearch(data: { searchTerm: string; resultsCount?: number }): void {
  pushToDataLayer("search", {
    search_term: data.searchTerm,
    results_count: data.resultsCount ?? null,
  });
}

/**
 * Track Direct Contact Click (Phone, Email)
 */
export function trackContactClick(data: {
  type: "phone" | "email" | "address";
  value: string;
  location: string;
}): void {
  pushToDataLayer("contact_click", {
    contact_type: data.type,
    contact_value: data.value,
    click_location: data.location,
  });
}

/**
 * Track Newsletter Subscription
 */
export function trackNewsletterSubscribe(data: { location: string }): void {
  pushToDataLayer("newsletter_subscribe", {
    signup_location: data.location,
  });
}
