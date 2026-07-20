import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  Lead,
  OrderStatus,
  OrderWithDetails,
  ProjectLeadFlat,
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

// ====== Project Lead Queries (normalized: leads + project_consultations) ======
// Return flat shape matching ProjectLeadFlat so frontend needs zero changes.

export async function getProjectLeads(
  supabase: SupabaseClient<Database>
): Promise<ProjectLeadFlat[]> {
  const { data, error } = await supabase
    .from('project_consultations')
    .select(`
      *,
      lead:leads(first_name, last_name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((pc: Record<string, unknown>) => {
    const lead = pc.lead as Record<string, unknown> | null;
    return {
      id: pc.id as string,
      client_name: lead ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim() : '',
      client_email: (lead?.email as string) || '',
      client_phone: (lead?.phone as string) || '',
      client_address: (pc.address as string) || '',
      square_meters: pc.square_meters as number,
      gym_type: pc.gym_type as string,
      budget_range: pc.budget_range as string | null,
      timeline: pc.timeline as string | null,
      additional_notes: pc.additional_notes as string | null,
      status: pc.status as string,
      assigned_to: pc.assigned_to as string | null,
      created_at: pc.created_at as string,
      updated_at: pc.updated_at as string,
    };
  });
}

export async function getProjectLead(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<ProjectLeadFlat | null> {
  const { data, error } = await supabase
    .from('project_consultations')
    .select(`
      *,
      lead:leads(first_name, last_name, email, phone)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  const pc = data as Record<string, unknown>;
  const lead = pc.lead as Record<string, unknown> | null;
  return {
    id: pc.id as string,
    client_name: lead ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim() : '',
    client_email: (lead?.email as string) || '',
    client_phone: (lead?.phone as string) || '',
    client_address: (pc.address as string) || '',
    square_meters: pc.square_meters as number,
    gym_type: pc.gym_type as string,
    budget_range: pc.budget_range as string | null,
    timeline: pc.timeline as string | null,
    additional_notes: pc.additional_notes as string | null,
    status: pc.status as string,
    assigned_to: pc.assigned_to as string | null,
    created_at: pc.created_at as string,
    updated_at: pc.updated_at as string,
  };
}

export async function getProjectLeadCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { count, error } = await supabase
    .from('project_consultations')
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

// ====== Order Status Queries ======

export async function getOrderStatuses(
  supabase: SupabaseClient<Database>
): Promise<OrderStatus[]> {
  const { data, error } = await supabase
    .from('order_statuses')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateOrder(
  supabase: SupabaseClient<Database>,
  id: string,
  fields: { status_id?: string; admin_notes?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update(fields as never)
    .eq('id', id);

  if (error) throw error;
}

// ====== Project Lead Mutations ======

export async function updateProjectLead(
  supabase: SupabaseClient<Database>,
  id: string,
  fields: { status?: string; assigned_to?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from('project_consultations')
    .update(fields as never)
    .eq('id', id);

  if (error) throw error;
}

// ====== Lead (Customer) Queries ======

export async function getLeads(
  supabase: SupabaseClient<Database>
): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLead(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getLeadOrders(
  supabase: SupabaseClient<Database>,
  leadId: string
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
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as OrderWithDetails[]) || [];
}
