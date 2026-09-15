import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { api } from '../services/api';
import { KidAvatar } from '../components/KidAvatar';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { childrenList, setSelectedChild } = useChild();
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    if (childrenList.length > 0) {
      api.getObservations(childrenList[0].id).then(setObservations).catch(() => {});
    }
  }, [childrenList]);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
          Account Credentials
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Parent Profile
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Review your account status and family profiles linked to TwinBloom.
        </p>
      </div>

      {/* Parent Account Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3C65] text-white flex items-center justify-center text-2xl font-extrabold shadow-sm">
            {user?.name.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#010313]">{user?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#F8F8FA] border border-[#E5E7EB] p-3 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Linked Twins</span>
            <span className="text-sm font-extrabold text-[#010313]">{childrenList.length}</span>
          </div>
        </div>
      </div>

      {/* Children Quick Jump */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-[#010313]">Linked Children</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {childrenList.map((child) => (
            <div
              key={child.id}
              className="bg-white p-5 rounded-2xl border border-[#F0F0F3] flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <KidAvatar child={child} size="md" shape="rounded" />
                <div>
                  <h4 className="text-sm font-bold text-[#010313]">{child.name}</h4>
                  <span className="text-xs text-[#6B7280]">
                    {child.age} yrs • {child.bloom_points} Bloom Points
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observations Log */}
      <div className="bg-white rounded-3xl p-6 border border-[#F0F0F3] shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#010313]">Logged Parent Observations</h3>
        {observations.length > 0 ? (
          <div className="space-y-3">
            {observations.map((obs) => (
              <div
                key={obs.id}
                className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-[#010313]">{obs.activity_title}</span>
                  <span className="ml-2 text-[#FF001E] font-semibold">• {obs.observation}</span>
                  {obs.notes && <p className="text-[#6B7280] mt-1 italic">"{obs.notes}"</p>}
                </div>
                <span className="text-[10px] text-[#9CA3AF] shrink-0">
                  {new Date(obs.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9CA3AF]">
            No parent observations recorded yet. Complete activities and log reflections to build your observation history.
          </p>
        )}
      </div>
    </div>
  );
};
