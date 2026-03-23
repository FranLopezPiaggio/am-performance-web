'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderKanban,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Productos', href: '/admin?view=products', icon: Package },
  { name: 'Órdenes', href: '/admin?view=orders', icon: ShoppingCart },
  { name: 'Proyectos', href: '/admin?view=projects', icon: FolderKanban },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-brutal-black flex">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/5 border border-white/10"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
            fixed md:static inset-y-0 left-0 z-40
            w-64 bg-black border-r border-white/10
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminNav.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                      flex items-center space-x-3 px-4 py-3
                      text-sm font-medium uppercase tracking-widest
                      transition-all duration-200
                      ${isActive
                      ? 'bg-neon-green text-brutal-black'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                    `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Badge */}
          <div className="p-4 border-t border-white/10">
            <div className="px-4 py-2 bg-white/5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-neon-green font-bold">
                Panel de Administración
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Mobile Title */}
            <div className="md:hidden">
              <Image src='/logo/AMPerformance_Favicon_verde.png' height={48} width={48} alt='logoAM' />
            </div>

            {/* Spacer */}
            <div className="hidden md:block" />

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-white/60">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.email || 'Admin'}
                  </p>
                  {isAdmin && (
                    <p className="text-[10px] uppercase tracking-widest text-neon-green">
                      Administrador
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium uppercase tracking-widest
                    border border-white/20 text-white/60 hover:text-white hover:border-white/40
                    transition-all duration-200"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
