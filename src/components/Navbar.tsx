import React, { useState } from 'react';
import {
  Bell,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  Settings,
  ShieldAlert,
  Compass,
  FileQuestion,
  Gamepad2,
  TrendingUp,
  HeartHandshake,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { Logo } from './Logo';
import { KidAvatar } from './KidAvatar';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();
  const { selectedChild, childrenList, setSelectedChild } = useChild();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#F0F0F3] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 text-[#010313] hover:bg-[#F8F8FA] rounded-lg cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="lg:hidden">
            <Logo size="sm" />
          </div>

          {/* Current Screen Title indicator on Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#9CA3AF]">
              TwinBloom Space
            </span>
            <span className="text-xs text-[#E5E7EB]">/</span>
            <span className="text-xs font-semibold text-[#1E3C65] capitalize">
              {currentTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Right Header Utilities: Child Switcher & Notifications & User avatar */}
        <div className="flex items-center gap-3">
          {/* Child Picker in Topbar */}
          {childrenList.length > 0 && (
            <div className="hidden sm:flex items-center bg-[#F8F8FA] border border-[#E5E7EB] rounded-full p-1 pr-3 gap-2">
              <KidAvatar child={selectedChild} size="xs" shape="circle" />
              <select
                value={selectedChild?.id || ''}
                onChange={(e) => {
                  const found = childrenList.find(c => c.id === e.target.value);
                  if (found) setSelectedChild(found);
                }}
                className="text-xs font-bold text-[#010313] bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                {childrenList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.bloom_points || 0} pts)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Non-medical positioning badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEBE5]/60 border border-[#FCEBE5] text-[11px] font-semibold text-[#1E3C65]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF001E]"></span>
            <span>Educational Support</span>
          </div>

          {/* Quick Bloom Points */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8F8FA] border border-[#E5E7EB] text-xs font-bold text-[#010313]">
            <span className="text-[#FF001E]">🌱</span>
            <span>{selectedChild?.bloom_points || 0}</span>
          </div>

          {/* Parent avatar icon */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="w-8 h-8 rounded-full bg-[#1E3C65] text-white flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-[#FF001E] transition-all cursor-pointer"
            title="Parent Profile"
          >
            {user?.name.charAt(0) || 'P'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#010313]/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-2xl p-5 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F3]">
              <Logo size="sm" showTagline={true} />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#6B7280] hover:text-[#010313] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Child switcher for mobile */}
            {childrenList.length > 0 && (
              <div className="py-3 border-b border-[#F0F0F3]">
                <label className="text-[10px] uppercase font-bold text-[#9CA3AF] mb-1 block">
                  Active Child Digital Twin
                </label>
                <select
                  value={selectedChild?.id || ''}
                  onChange={(e) => {
                    const found = childrenList.find(c => c.id === e.target.value);
                    if (found) setSelectedChild(found);
                  }}
                  className="w-full text-xs font-bold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-lg p-2"
                >
                  {childrenList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.age} yrs, {c.bloom_points} pts)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'children', label: 'My Children', icon: Users },
                { id: 'activities', label: 'Activities', icon: Compass },
                { id: 'quizzes', label: 'Quizzes', icon: FileQuestion },
                { id: 'games', label: 'Game Zone', icon: Gamepad2 },
                { id: 'progress', label: 'Progress Analytics', icon: TrendingUp },
                { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
                { id: 'focus-calm', label: 'Focus & Calm', icon: HeartHandshake },
                { id: 'profile', label: 'Parent Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FCEBE5] text-[#FF001E]'
                        : 'text-[#1E3C65] hover:bg-[#F8F8FA]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1E3C65] hover:bg-[#F8F8FA]"
                >
                  <ShieldAlert className="w-4 h-4 text-[#FF001E]" />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>

            <div className="pt-4 border-t border-[#F0F0F3] flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">{user?.name}</span>
              <button
                onClick={logout}
                className="text-xs font-bold text-[#FF001E] flex items-center gap-1.5 p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MobileBottomNav: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'children', label: 'Twins', icon: Users },
    { id: 'activities', label: 'Learn', icon: Compass },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#F0F0F3] px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-[#FF001E]' : 'text-[#6B7280] hover:text-[#010313]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
