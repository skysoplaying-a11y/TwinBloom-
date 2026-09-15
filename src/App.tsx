import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChildProvider, useChild } from './context/ChildContext';
import { Sidebar } from './components/Sidebar';
import { Navbar, MobileBottomNav } from './components/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChildrenPage } from './pages/ChildrenPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { GameZonePage } from './pages/GameZonePage';
import { ProgressPage } from './pages/ProgressPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { FocusCalmPage } from './pages/FocusCalmPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

type ViewMode = 'landing' | 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'app';

const MainAppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { childrenList, isLoading: childLoading } = useChild();

  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetActivityId, setTargetActivityId] = useState<string | undefined>(undefined);

  // Sync viewMode when auth changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // If user has no children, guide to onboarding
        if (childrenList.length === 0 && !childLoading && viewMode !== 'onboarding') {
          setViewMode('onboarding');
        } else if (viewMode !== 'onboarding' && viewMode !== 'app') {
          setViewMode('app');
        }
      } else {
        if (viewMode === 'app' || viewMode === 'onboarding') {
          setViewMode('landing');
        }
      }
    }
  }, [user, childrenList.length, childLoading, authLoading]);

  const handleNavigate = (tab: string, extraId?: string) => {
    if (extraId && tab === 'activities') {
      setTargetActivityId(extraId);
    } else {
      setTargetActivityId(undefined);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF001E] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-[#010313]">Loading TwinBloom Space...</span>
      </div>
    );
  }

  // 1. Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onNavigateToAuth={(mode) => setViewMode(mode)}
        onEnterApp={() => setViewMode('app')}
      />
    );
  }

  // 2. Login Page
  if (viewMode === 'login') {
    return (
      <LoginPage
        onSuccess={() => setViewMode('app')}
        onNavigateToSignup={() => setViewMode('signup')}
        onNavigateToForgotPassword={() => setViewMode('forgot-password')}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // 3. Signup Page
  if (viewMode === 'signup') {
    return (
      <SignupPage
        onSuccess={() => setViewMode('onboarding')}
        onNavigateToLogin={() => setViewMode('login')}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // 4. Forgot Password Page
  if (viewMode === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setViewMode('login')}
      />
    );
  }

  // 5. Onboarding Page
  if (viewMode === 'onboarding') {
    return (
      <OnboardingPage
        onComplete={() => {
          setViewMode('app');
          setCurrentTab('dashboard');
        }}
      />
    );
  }

  // 6. Main Application Dashboard & Views
  return (
    <div className="min-h-screen bg-[#FDFDFE] flex selection:bg-[#FCEBE5] selection:text-[#FF001E]">
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={handleNavigate}
        />

        {/* Tab Viewport */}
        <main className="flex-1">
          {currentTab === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentTab === 'children' && (
            <ChildrenPage />
          )}

          {currentTab === 'activities' && (
            <ActivitiesPage initialActivityId={targetActivityId} />
          )}

          {currentTab === 'quizzes' && (
            <QuizzesPage />
          )}

          {currentTab === 'games' && (
            <GameZonePage />
          )}

          {currentTab === 'progress' && (
            <ProgressPage />
          )}

          {currentTab === 'recommendations' && (
            <RecommendationsPage onStartActivity={(id) => handleNavigate('activities', id)} />
          )}

          {currentTab === 'focus-calm' && (
            <FocusCalmPage />
          )}

          {currentTab === 'profile' && (
            <ProfilePage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}

          {currentTab === 'admin' && user?.role === 'ADMIN' && (
            <AdminPage />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ChildProvider>
        <MainAppContent />
      </ChildProvider>
    </AuthProvider>
  );
}
