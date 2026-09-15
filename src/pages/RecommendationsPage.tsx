import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, SlidersHorizontal, Play } from 'lucide-react';
import { useChild } from '../context/ChildContext';
import { api } from '../services/api';
import { Recommendation } from '../types';

interface RecommendationsPageProps {
  onStartActivity: (activityId: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onStartActivity }) => {
  const { selectedChild } = useChild();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedChild) return;
    loadRecommendations();
  }, [selectedChild?.id]);

  const loadRecommendations = async () => {
    if (!selectedChild) return;
    setIsLoading(true);
    try {
      const data = await api.getRecommendations(selectedChild.id);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedChild) {
    return (
      <div className="p-8 text-center text-[#6B7280]">
        Please select a child profile to view personalized recommendations.
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF001E]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
            Explainable AI Engine
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Personalized Recommendations
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Tailored to {selectedChild.name}’s interests in {selectedChild.interests.join(', ')}, natural strengths, and quiz retention history.
        </p>
      </div>

      {/* Model Overview Banner */}
      <div className="bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3C65]">
            Content-Based Filtering Matrix
          </span>
          <h4 className="text-sm font-extrabold text-[#010313]">
            How TwinBloom Computes Compatibility
          </h4>
          <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">
            Every candidate activity undergoes feature scoring against {selectedChild.name}’s Digital Twin: Chronological Age (30%), Topic Interests (30%), Modality Preferences (20%), and Historical Quiz Performance (20%).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#1E3C65]">
            Live ML Bridge: Python 3.x
          </span>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const matchPercent = Math.round(rec.score * 100);
          return (
            <div
              key={rec.activity_id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] hover:border-[#1E3C65]/30 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
                      {rec.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
                      {matchPercent}% Match Score
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#010313]">
                    {rec.activity_name}
                  </h3>
                </div>

                <button
                  onClick={() => onStartActivity(rec.activity_id)}
                  className="px-6 py-2.5 rounded-xl bg-[#010313] hover:bg-[#FF001E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <span>Start Activity</span>
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>

              {/* Explainability Callout */}
              <div className="p-4 rounded-2xl bg-[#FCEBE5]/40 border border-[#FCEBE5] text-xs leading-relaxed">
                <span className="font-bold text-[#FF001E] block mb-0.5">
                  Why this was recommended:
                </span>
                <p className="text-[#1E3C65] font-medium">{rec.reason}</p>
              </div>

              {/* Match Factors Breakdown */}
              {rec.match_breakdown && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-2">
                    Feature Match Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">Age Alignment</span>
                      <span className="text-sm font-extrabold text-[#010313]">
                        {Math.round(rec.match_breakdown.age_match * 100)}%
                      </span>
                    </div>

                    <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">Interest Relevance</span>
                      <span className="text-sm font-extrabold text-[#010313]">
                        {Math.round(rec.match_breakdown.interest_match * 100)}%
                      </span>
                    </div>

                    <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">Modality Preference</span>
                      <span className="text-sm font-extrabold text-[#010313]">
                        {Math.round(rec.match_breakdown.preference_match * 100)}%
                      </span>
                    </div>

                    <div className="bg-[#F8F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">Quiz Retention Sync</span>
                      <span className="text-sm font-extrabold text-[#010313]">
                        {Math.round(rec.match_breakdown.performance_match * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
