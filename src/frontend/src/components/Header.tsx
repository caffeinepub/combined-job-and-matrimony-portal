import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Heart, Briefcase, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import type { PageView } from '../App';
import { useState } from 'react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate('home');
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { id: 'home' as PageView, label: 'Home', icon: null },
    { id: 'jobs' as PageView, label: 'Jobs', icon: Briefcase },
    { id: 'matrimony' as PageView, label: 'Matrimony', icon: Heart },
  ];

  if (isAuthenticated) {
    navItems.push({ id: 'dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin' as PageView, label: 'Admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/generated/combined-platform-logo-transparent.dim_200x200.png" alt="Logo" className="h-10 w-10" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ConnectHub
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(item.id)}
                className="gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Desktop Auth Button */}
        <div className="hidden md:block">
          <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
            {buttonText}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col gap-2 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Button>
              );
            })}
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} className="mt-2">
              {buttonText}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
