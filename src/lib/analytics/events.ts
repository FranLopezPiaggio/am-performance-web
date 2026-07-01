'use client';

import posthog from 'posthog-js';

// ── E-commerce events ──────────────────────────────────────────────

export function trackProductViewed(product: {
  id: string;
  name: string;
  category?: string;
  price: number;
  hasVariants: boolean;
}) {
  posthog.capture('product_viewed', product);
}

export function trackProductAddedToCart(item: {
  variant_id: string;
  product_name: string;
  price: number;
  quantity: number;
  category?: string;
  is_immediate: boolean;
}) {
  posthog.capture('product_added_to_cart', item);
}

export function trackCheckoutStarted(data: {
  total: number;
  items_count: number;
  has_delayed_items: boolean;
}) {
  posthog.capture('checkout_started', data);
}

// ── Project / Consulting events ───────────────────────────────────

export function trackProjectPageViewed() {
  posthog.capture('project_page_viewed');
}

export function trackProjectFormStarted() {
  posthog.capture('project_form_started');
}

// ── WhatsApp events ────────────────────────────────────────────────

export function trackWhatsappClicked(source: string) {
  posthog.capture('whatsapp_clicked', { source });
}

export function trackWhatsappRedirected(event: string, metadata?: Record<string, unknown>) {
  posthog.capture(event, metadata);
}

// ── Catalog events ────────────────────────────────────────────────

export function trackCatalogFiltered(filter: { type: 'category' | 'search' | 'offers'; value: string }) {
  posthog.capture('catalog_filtered', filter);
}
