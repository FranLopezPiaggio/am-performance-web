import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  OrderWithDetails,
  ProjectLead,
} from '@/types/database';

// ====== Order Queries ======

export async function getOrders(
  supabase: SupabaseClient<Database>
): Promise<OrderWithDetails[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      status:order_statuses(*),
      lead:leads(*),
      shipping_address:addresses!shipping_address_id(*),
      billing_address:addresses!billing_address_id(*),
      items:order_items(*),
      payments:payments(*),
      coupons:order_coupons(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as OrderWithDetails[]) || [];
}

export async function getOrder(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderWithDetails | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      status:order_statuses(*),
      lead:leads(*),
      shipping_address:addresses!shipping_address_id(*),
      billing_address:addresses!billing_address_id(*),
      items:order_items(*),
      payments:payments(*),
      coupons:order_coupons(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as OrderWithDetails;
}

export async function getOrderCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

// ====== Project Lead Queries ======

export async function getProjectLeads(
  supabase: SupabaseClient<Database>
): Promise<ProjectLead[]> {
  const { data, error } = await supabase
    .from('project_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProjectLead(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<ProjectLead | null> {
  const { data, error } = await supabase
    .from('project_leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getProjectLeadCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { count, error } = await supabase
    .from('project_leads')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

// ====== Product Count (for dashboard) ======

export async function getAdminProductCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) throw error;
  return count || 0;
}
