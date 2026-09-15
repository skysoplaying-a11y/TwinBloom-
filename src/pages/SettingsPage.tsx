import React, { useState } from 'react';
import { Bell, Lock, Download, LogOut, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { childrenList } = useChild();

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    const exportPayload = {
      parent: user,
      children: childrenList,
      export_timestamp: new Date().toISOString(),
      platform: 'TwinBloom Digital Twin v1.0',
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinbloom_data_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
          System Controls
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Settings & Privacy
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Control notifications, privacy preferences, and developmental data exports.
        </p>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-[#FCEBE5] border border-[#FF001E]/30 text-xs font-bold text-[#FF001E] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Child Digital Twin archive downloaded successfully in JSON format.</span>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[#1E3C65]" />
          <h3 className="text-base font-extrabold text-[#010313]">Communication Preferences</h3>
        </div>

        <div className="divide-y divide-[#F0F0F3]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#010313] block">Weekly Learning Digest</span>
              <span className="text-[11px] text-[#6B7280]">
                Receive a weekly summary of completed activities and quiz mastery trends.
              </span>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 accent-[#FF001E] cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#010313] block">Streak & Activity Reminders</span>
              <span className="text-[11px] text-[#6B7280]">
                Gentle reminders to maintain daily learning flow.
              </span>
            </div>
            <input
              type="checkbox"
              checked={streakReminders}
              onChange={(e) => setStreakReminders(e.target.checked)}
              className="w-4 h-4 accent-[#FF001E] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Ethics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#FF001E]" />
          <h3 className="text-base font-extrabold text-[#010313]">Child Privacy & Data Governance</h3>
        </div>

        <div className="divide-y divide-[#F0F0F3]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#010313] block">
                Anonymous Developmental Research Aggregation
              </span>
              <span className="text-[11px] text-[#6B7280]">
                Optionally allow anonymized activity completion metrics to improve recommendation algorithms.
              </span>
            </div>
            <input
              type="checkbox"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              className="w-4 h-4 accent-[#FF001E] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Data Export & Account Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#010313]">Export Digital Twin Data</h4>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Download complete records of child profiles, quiz performance, and activity logs.
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8F8FA] text-xs font-bold text-[#1E3C65] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Archive (JSON)</span>
        </button>
      </div>

      {/* Sign Out */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={logout}
          className="px-6 py-3 rounded-xl bg-[#FCEBE5] hover:bg-[#FCEBE5]/80 text-[#FF001E] text-xs font-extrabold flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of TwinBloom</span>
        </button>
      </div>
    </div>
  );
};
