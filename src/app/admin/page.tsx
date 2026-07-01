// src/app/admin/page.tsx
// Admin Dashboard Home - Summary View with Table Views

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, ShoppingCart, FolderKanban, TrendingUp, ArrowRight } from 'lucide-react';
import OrdersTable from '@/components/admin/OrdersTable';
import ProjectsTable from '@/components/admin/ProjectsTable';
import ProductsTable from '@/components/admin/ProductsTable';
import { useAdminStats } from '@/hooks/useAdminStats';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
        Cargando...
      </div>
    </div>
  );
}

function DashboardContent() {
  const { products, orders, projects, loading } = useAdminStats();

  const stats = [
    {
      name: 'Total Productos',
      value: loading ? '...' : String(products),
      change: loading ? 'Cargando...' : `Activos en catálogo`,
      icon: Package,
      href: '/admin?view=products',
      color: 'text-neon-green',
    },
    {
      name: 'Órdenes',
      value: loading ? '...' : String(orders),
      change: loading ? 'Cargando...' : orders === 0 ? 'Sin órdenes aún' : `Registradas en el sistema`,
      icon: ShoppingCart,
      href: '/admin?view=orders',
      color: 'text-blue-400',
    },
    {
      name: 'Proyectos',
      value: loading ? '...' : String(projects),
      change: loading ? 'Cargando...' : projects === 0 ? 'Sin consultas aún' : `Consultas recibidas`,
      icon: FolderKanban,
      href: '/admin?view=projects',
      color: 'text-purple-400',
    },
    {
      name: 'Ventas',
      value: loading ? '...' : `$${0}`,
      change: loading ? 'Cargando...' : 'Sin ventas aún',
      icon: TrendingUp,
      href: '/admin?view=orders',
      color: 'text-neon-green',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-white/60">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group block bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <ArrowRight
                size={16}
                className="text-white/20 group-hover:text-neon-green group-hover:translate-x-1 transition-all"
              />
            </div>
            <p className="text-3xl font-display uppercase tracking-tighter mb-1">
              {stat.value}
            </p>
            <p className="text-sm font-medium uppercase tracking-widest text-white/40 mb-2">
              {stat.name}
            </p>
            <p className="text-xs text-white/30">
              {stat.change}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-display uppercase tracking-widest mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/productos/nuevo"
            className="brutal-btn text-center"
          >
            + Nuevo Producto
          </Link>
          <Link
            href="/admin?view=orders"
            className="px-8 py-4 text-center border border-white/20 font-bold uppercase tracking-widest text-sm
              hover:border-white/40 transition-all"
          >
            Ver Órdenes
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-8 py-4 text-center border border-white/20 font-bold uppercase tracking-widest text-sm
              hover:border-white/40 transition-all"
          >
            Ver Sitio
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-display uppercase tracking-widest mb-6">
          Estado del Sistema
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white/80">Base de datos</p>
              <p className="text-xs text-white/40">Supabase PostgreSQL</p>
            </div>
            <span className="text-neon-green text-xs uppercase tracking-widest">
              Conectado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display uppercase tracking-tighter mb-2">
          Órdenes
        </h1>
        <p className="text-white/60">
          Gestiona todas las órdenes de clientes.
        </p>
      </div>
      <div className="bg-white/5 border border-white/10">
        <OrdersTable />
      </div>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display uppercase tracking-tighter mb-2">
          Proyectos
        </h1>
        <p className="text-white/60">
          Consulta de proyectos de gimnasios.
        </p>
      </div>
      <div className="bg-white/5 border border-white/10">
        <ProjectsTable />
      </div>
    </div>
  );
}

function ProductsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display uppercase tracking-tighter mb-2">
          Productos
        </h1>
        <p className="text-white/60">
          Catálogo completo de productos.
        </p>
      </div>
      <div className="bg-white/5 border border-white/10">
        <ProductsTable />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  if (view === 'orders') {
    return <OrdersContent />;
  }

  if (view === 'projects') {
    return <ProjectsContent />;
  }

  if (view === 'products') {
    return <ProductsContent />;
  }

  if (view === 'leads') {
    // Ahora redirigido a /admin/leads
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/leads';
    }
    return null;
  }

  return <DashboardContent />;
}
