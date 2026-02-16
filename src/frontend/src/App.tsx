import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import JobPortalPage from './pages/JobPortalPage';
import MatrimonyPortalPage from './pages/MatrimonyPortalPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useState } from 'react';

export type PageView = 'home' | 'jobs' | 'matrimony' | 'dashboard' | 'admin';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1">
          {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
          {currentPage === 'jobs' && <JobPortalPage />}
          {currentPage === 'matrimony' && <MatrimonyPortalPage />}
          {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
          {currentPage === 'admin' && <AdminDashboardPage />}
        </main>
        <Footer />
      </div>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </ThemeProvider>
  );
}
