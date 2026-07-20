'use client';

import { useState, useEffect } from 'react';

export interface AdminStats {
  products: number;
  orders: number;
  projects_consultations: number;
  total_revenue: number;
  pending_orders: number;
  pending_projects: number;
  low_stock_count: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obtener KPIs del dashboard admin desde /api/admin/stats.
 * La API route verifica la sesión admin vía cookie y usa service_role para los datos.
 */
export function useAdminStats(): AdminStats {
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [projects_consultations, setProjectsConsultations] = useState(0);
  const [total_revenue, setTotalRevenue] = useState(0);
  const [pending_orders, setPendingOrders] = useState(0);
  const [pending_projects, setPendingProjects] = useState(0);
  const [low_stock_count, setLowStockCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const loading = products === 0 && orders === 0 && error === null;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products ?? 0);
        setOrders(data.orders ?? 0);
        setProjectsConsultations(data.projects_consultations ?? 0);
        setTotalRevenue(data.total_revenue ?? 0);
        setPendingOrders(data.pending_orders ?? 0);
        setPendingProjects(data.pending_projects ?? 0);
        setLowStockCount(data.low_stock_count ?? 0);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    products,
    orders,
    projects_consultations,
    total_revenue,
    pending_orders,
    pending_projects,
    low_stock_count,
    loading,
    error,
  };
}
