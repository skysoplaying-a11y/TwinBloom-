import React, { useState } from 'react';
import { Child } from '../types';
import { Sparkles, Brain, Compass, Star, Target, Compass as PreferencesIcon } from 'lucide-react';
import { KidAvatar } from './KidAvatar';

interface DigitalTwinVisualProps {
  child: Child;
  onSelectNode?: (nodeCategory: string) => void;
}

export const DigitalTwinVisual: React.FC<DigitalTwinVisualProps> = ({ child, onSelectNode }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden bg-white border border-[#F0F0F3] rounded-3xl p-6 md:p-10 shadow-xs">
      {/* Subtle Background Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#FCEBE5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FCEBE5]/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#1E3C65]/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#F0F0F3] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF001E] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3C65]">
              Living Digital Twin Model
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#010313] mt-0.5">
            {child.name}’s Neural Learning Map
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6B7280]">Real-time synchronization</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FCEBE5] text-[#FF001E]">
            {child.bloom_points} Bloom Points 🌱
          </span>
        </div>
      </div>

      {/* Interactive Visual Network Stage */}
      <div className="relative z-10 w-full min-h-[440px] md:min-h-[500px] flex items-center justify-center">
        {/* SVG Animated Connector Vectors */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineNavyRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3C65" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF001E" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="lineBlushNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF001E" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1E3C65" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Center to Top (Interests) */}
          <line
            x1="400"
            y1="250"
            x2="400"
            y2="75"
            stroke="url(#lineNavyRed)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-[pulse_3s_ease-in-out_infinite]"
          />

          {/* Center to Left (Strengths) */}
          <line
            x1="400"
            y1="250"
            x2="150"
            y2="250"
            stroke="url(#lineBlushNavy)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Center to Right (Activities) */}
          <line
            x1="400"
            y1="250"
            x2="650"
            y2="250"
            stroke="url(#lineNavyRed)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Center to Bottom (Preferences & Modalities) */}
          <line
            x1="400"
            y1="250"
            x2="400"
            y2="425"
            stroke="url(#lineBlushNavy)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Dynamic connection node dots */}
          <circle cx="400" cy="160" r="3" fill="#FF001E" opacity="0.8" />
          <circle cx="275" cy="250" r="3" fill="#1E3C65" opacity="0.8" />
          <circle cx="525" cy="250" r="3" fill="#FF001E" opacity="0.8" />
          <circle cx="400" cy="340" r="3" fill="#1E3C65" opacity="0.8" />
        </svg>

        {/* TOP NODE: Interests */}
        <div
          onClick={() => {
            setActiveNode('interests');
            onSelectNode?.('interests');
          }}
          onMouseEnter={() => setActiveNode('interests')}
          className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 cursor-pointer transition-all hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <div className="px-4 py-2.5 rounded-2xl bg-[#FCEBE5] border border-[#FF001E]/30 text-[#010313] shadow-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF001E]" />
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#FF001E] uppercase tracking-wider">
                  Interests ({child.interests.length})
                </p>
                <p className="text-xs font-bold text-[#010313] max-w-[200px] truncate">
                  {child.interests.join(' • ')}
                </p>
              </div>
            </div>
            <div className="flex gap-1 mt-1.5 flex-wrap justify-center max-w-xs">
              {child.interests.map(item => (
                <span
                  key={item}
                  className="text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#1E3C65] px-2 py-0.5 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT NODE: Strengths */}
        <div
          onClick={() => {
            setActiveNode('strengths');
            onSelectNode?.('strengths');
          }}
          onMouseEnter={() => setActiveNode('strengths')}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-105"
        >
          <div className="flex flex-col items-start max-w-[170px] md:max-w-[210px]">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-[#010313] shadow-xs flex items-center gap-2.5">
              <Brain className="w-4 h-4 text-[#1E3C65] shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-[#1E3C65] uppercase tracking-wider">
                  Core Strengths
                </p>
                <p className="text-xs font-bold text-[#010313]">
                  {child.strengths[0] || 'Inquisitive'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2 pl-2 border-l-2 border-[#1E3C65]/30">
              {child.strengths.map(s => (
                <span key={s} className="text-[11px] font-medium text-[#4B5563]">
                  • {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER NUCLEUS: Child Digital Twin Core */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="relative group">
            {/* Outer Breathing Orbit Ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#1E3C65]/15 to-[#FF001E]/20 animate-spin [animation-duration:12s]" />
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-[#010313] shadow-lg flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-105 cursor-pointer">
              <KidAvatar child={child} size="md" shape="circle" className="mb-1 ring-2 ring-[#FF001E]/30" />
              <h4 className="text-xs md:text-sm font-extrabold text-[#010313] leading-tight truncate max-w-[90px]">
                {child.name}
              </h4>
              <span className="text-[10px] font-bold text-[#6B7280]">{child.age} Years Old</span>
            </div>
          </div>
          <span className="mt-3 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#010313] text-white">
            Digital Twin Core
          </span>
        </div>

        {/* RIGHT NODE: Activities & Quizzes */}
        <div
          onClick={() => {
            setActiveNode('activities');
            onSelectNode?.('activities');
          }}
          onMouseEnter={() => setActiveNode('activities')}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-105"
        >
          <div className="flex flex-col items-end max-w-[170px] md:max-w-[210px]">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-[#010313] shadow-xs flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[11px] font-bold text-[#FF001E] uppercase tracking-wider">
                  Active Mastery
                </p>
                <p className="text-xs font-bold text-[#010313]">
                  {child.learning_streak} Day Streak 🔥
                </p>
              </div>
              <Star className="w-4 h-4 text-[#FF001E] shrink-0" />
            </div>
            <div className="mt-2 text-right text-[11px] text-[#6B7280]">
              <p>Reinforced via interactive quizzes</p>
              <p className="text-[#FF001E] font-bold mt-0.5">High retention</p>
            </div>
          </div>
        </div>

        {/* BOTTOM NODE: Learning Preferences & Modalities */}
        <div
          onClick={() => {
            setActiveNode('preferences');
            onSelectNode?.('preferences');
          }}
          onMouseEnter={() => setActiveNode('preferences')}
          className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 cursor-pointer transition-all hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <div className="px-4 py-2.5 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB] text-[#010313] shadow-xs flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1E3C65]" />
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#1E3C65] uppercase tracking-wider">
                  Learning Modalities
                </p>
                <p className="text-xs font-bold text-[#010313]">
                  {child.learning_preferences.join(' • ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contextual Insights Bar below Visual */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#F0F0F3] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#F0F0F3]">
          <span className="font-bold text-[#010313] block mb-1">Empirical Observation</span>
          <p className="text-[#6B7280] leading-relaxed">
            Consistently displays highest flow in visual, interactive challenges with hands-on loops.
          </p>
        </div>
        <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#F0F0F3]">
          <span className="font-bold text-[#010313] block mb-1">Growth Direction</span>
          <p className="text-[#6B7280] leading-relaxed">
            Gradually expanding abstract mathematical sequences through celestial physics simulations.
          </p>
        </div>
        <div className="bg-[#FCEBE5]/40 p-3 rounded-xl border border-[#FCEBE5]">
          <span className="font-bold text-[#FF001E] block mb-1">ML Personalization Signal</span>
          <p className="text-[#1E3C65] leading-relaxed">
            Next recommended module matches {child.interests[0] || 'Space'} with 92% confidence index.
          </p>
        </div>
      </div>
    </div>
  );
};
