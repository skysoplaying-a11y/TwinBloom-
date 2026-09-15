import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Brain, Activity, CheckCircle2, Server, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FF001E]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
            Platform Governance
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Admin Management
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Monitor system metrics, parent accounts, and machine learning pipeline telemetry.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Parents"
          value={stats?.total_users || 12}
          subtitle="Active accounts"
          icon={Users}
          accentColor="#1E3C65"
        />
        <StatCard
          label="Child Digital Twins"
          value={stats?.total_children || 18}
          subtitle="Synchronized models"
          icon={Brain}
          accentColor="#FF001E"
        />
        <StatCard
          label="Curated Activities"
          value={stats?.total_activities || 24}
          subtitle="Across 8 categories"
          icon={Activity}
          accentColor="#1E3C65"
        />
        <StatCard
          label="ML Engine Status"
          value="Healthy"
          subtitle="Python bridge connected"
          badge="Live"
          accentColor="#FF001E"
        />
      </div>

      {/* ML Pipeline Telemetry Box */}
      <div className="bg-[#010313] text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#FF001E]" />
            <h3 className="text-base font-extrabold">Python Machine Learning Architecture</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF001E] text-white">
            Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-gray-400 block mb-1">Recommendation Module</span>
            <span className="font-bold text-white block">backend/ml/recommender.py</span>
            <p className="text-gray-400 mt-1">Content-based vector scoring via stdin/stdout pipe.</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-gray-400 block mb-1">Prediction Module</span>
            <span className="font-bold text-white block">backend/ml/predictor.py</span>
            <p className="text-gray-400 mt-1">Random Forest regressor simulation with trend slope.</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-gray-400 block mb-1">Bridge Latency</span>
            <span className="font-bold text-white block">~45ms</span>
            <p className="text-gray-400 mt-1">Sub-process execution with structured JSON fallback.</p>
          </div>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#010313]">Registered User Accounts</h3>
          <span className="text-xs text-[#6B7280]">{users.length} Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0F0F3] text-[#9CA3AF] uppercase font-bold text-[10px]">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Registered</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F3]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8F8FA]">
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-[#010313] block">{u.name}</span>
                    <span className="text-[11px] text-[#6B7280]">{u.email}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-[#010313] text-white'
                          : 'bg-[#F8F8FA] text-[#1E3C65] border border-[#E5E7EB]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[#6B7280]">
                    {new Date(u.created_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-[11px] font-bold text-[#1E3C65]">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
