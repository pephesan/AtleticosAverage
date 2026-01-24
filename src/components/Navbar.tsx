// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Users, Calendar, TrendingUp, DollarSign, Settings, Menu, X, LogOut, User } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Jugadores', href: '/players', icon: Users },
  { name: 'Juegos', href: '/games', icon: Calendar },
  { name: 'Estadísticas', href: '/stats', icon: TrendingUp },
  { name: 'Finanzas', href: '/finanzas', icon: DollarSign },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si está autenticado
    const auth = localStorage.getItem('isAuthenticated');
    const user = localStorage.getItem('adminUser');
    setIsAuthenticated(auth === 'true');
    setUserName(user);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUserName(null);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/80 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-1 group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Atléticos Average Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Atléticos
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Average
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* User Badge - Mostrar si está autenticado */}
            {isAuthenticated && userName && (
              <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 gap-1 px-3 py-1">
                <User className="w-3 h-3" />
                <span className="capitalize">{userName}</span>
              </Badge>
            )}

            {/* Logout Button - Visible siempre que esté autenticado */}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="ml-2 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {/* User Badge Mobile */}
            {isAuthenticated && userName && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 gap-1 px-2 py-1 text-xs">
                <User className="w-3 h-3" />
                <span className="capitalize">{userName}</span>
              </Badge>
            )}
            
            <ThemeToggle />
            
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Logout Button Mobile */}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="justify-start gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}