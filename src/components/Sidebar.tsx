import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  FileQuestion,
  Gamepad2,
  TrendingUp,
  Sparkles,
  HeartHandshake,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { KidAvatar } from './KidAvatar';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();
  const { selectedChild, childrenList, setSelectedChild } = useChild();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'children', label: 'My Children', icon: Users, badge: childrenList.length },
    { id: 'activities', label: 'Activities', icon: Compass },
    { id: 'quizzes', label: 'Quizzes', icon: FileQuestion },
    { id: 'games', label: 'Game Zone', icon: Gamepad2, highlight: true },
    { id: 'progress', label: 'Progress Analytics', icon: TrendingUp },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'focus-calm', label: 'Focus & Calm', icon: HeartHandshake },
  ];

  const bottomNavItems = [
    { id: 'profile', label: 'Parent Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    bottomNavItems.unshift({ id: 'admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F0F0F3] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#F0F0F3]">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="text-left cursor-pointer focus:outline-none"
        >
          <Logo size="md" showTagline={true} />
        </button>
      </div>

      {/* Child Profile Quick Pill Switcher */}
      {childrenList.length > 0 && (
        <div className="px-4 py-3 border-b border-[#F0F0F3] bg-[#F8F8FA]/60">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-2 flex items-center justify-between">
            <span>Active Digital Twin</span>
            <span className="text-[#FF001E] font-extrabold">{selectedChild?.bloom_points || 0} pts</span>
          </div>
          <div className="flex items-center gap-2.5">
            <KidAvatar child={selectedChild} size="sm" shape="rounded" />
            <div className="relative flex-1">
              <select
                value={selectedChild?.id || ''}
                onChange={(e) => {
                  const found = childrenList.find(c => c.id === e.target.value);
                  if (found) setSelectedChild(found);
                }}
                className="w-full text-xs font-bold text-[#010313] bg-white border border-[#E5E7EB] rounded-xl px-2 py-1.5 focus:outline-none focus:border-[#1E3C65] transition-colors cursor-pointer"
              >
                {childrenList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.age}y)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Learning Journey
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-[#FCEBE5] text-[#FF001E]'
                  : 'text-[#1E3C65] hover:bg-[#F8F8FA] hover:text-[#010313]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-[#FF001E]' : 'text-[#1E3C65] group-hover:text-[#010313]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.highlight ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#FF001E]/10 text-[#FF001E]">
                  Play
                </span>
              ) : item.badge !== undefined ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F0F0F3] text-[#1E3C65]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}

        <div className="pt-5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Account & Preferences
        </div>
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-[#FCEBE5] text-[#FF001E]'
                  : 'text-[#1E3C65] hover:bg-[#F8F8FA] hover:text-[#010313]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-[#FF001E]' : 'text-[#1E3C65] group-hover:text-[#010313]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
            </button>
          );
        })}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-[#F0F0F3] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1E3C65] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name.charAt(0) || 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#010313] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-[#6B7280] hover:text-[#FF001E] hover:bg-[#FCEBE5]/50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
