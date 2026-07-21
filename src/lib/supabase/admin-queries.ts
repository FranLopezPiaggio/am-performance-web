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
  supabase: SupabaseClient<Database>,
  options?: { limit?: number; offset?: number }
): Promise<OrderWithDetails[]> {
  let query = supabase
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

  if (options?.limit) {
    const from = options.offset ?? 0;
    query = query.range(from, from + options.limit - 1);
  }

  const { data, error } = await query;
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
  supabase: SupabaseClient<Database>,
  options?: { limit?: number; offset?: number }
): Promise<ProjectLeadFlat[]> {
  let query = supabase
    .from('project_consultations')
    .select(`
      *,
      lead:leads(first_name, last_name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (options?.limit) {
    const from = options.offset ?? 0;
    query = query.range(from, from + options.limit - 1);
  }

  const { data, error } = await query;
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

// ====== Admin Dashboard KPI ======

export interface AdminKPIs {
  products: number;
  orders: number;
  projects_consultations: number;
  total_revenue: number;
  pending_orders: number;
  pending_projects: number;
  low_stock_count: number;
}

export async function getAdminKPIs(
  supabase: SupabaseClient<Database>
): Promise<AdminKPIs> {
  // Grab status IDs for orders
  const { data: statuses } = await supabase
    .from('order_statuses')
    .select('id, name');

  const statusList = (statuses || []) as { id: string; name: string }[];
  if (statusList.length === 0) {
    return { products: 0, orders: 0, projects_consultations: 0, total_revenue: 0, pending_orders: 0, pending_projects: 0, low_stock_count: 0 };
  }

  const byName = new Map(statusList.map(s => [s.name, s.id]));
  const deliveredId = byName.get('delivered');
  const pendingId = byName.get('pending');

  const [
    { count: products },
    { count: orders },
    { count: projects_consultations },
    deliveredResult,
    { count: pending_orders },
    { count: pending_projects },
    { count: low_stock_count },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('project_consultations').select('*', { count: 'exact', head: true }),
    deliveredId
      ? supabase.from('orders').select('total').eq('status_id', deliveredId)
      : { data: [] },
    pendingId
      ? supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status_id', pendingId)
      : { count: 0 },
    supabase.from('project_consultations').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('product_variants').select('*', { count: 'exact', head: true }).lte('stock', 5).eq('is_active', true),
  ]);

  const total_revenue = ((deliveredResult as { data?: { total: number }[] })?.data || [])
    .reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);

  return {
    products: products || 0,
    orders: orders || 0,
    projects_consultations: projects_consultations || 0,
    total_revenue,
    pending_orders: pending_orders || 0,
    pending_projects: pending_projects || 0,
    low_stock_count: low_stock_count || 0,
  };
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
  supabase: SupabaseClient<Database>,
  options?: { limit?: number; offset?: number }
): Promise<Lead[]> {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.limit) {
    const from = options.offset ?? 0;
    query = query.range(from, from + options.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getLeadCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
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
