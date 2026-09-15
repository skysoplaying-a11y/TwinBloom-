import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  FileQuestion,
  TrendingUp,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  RefreshCw,
  Brain,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { api } from '../services/api';
import { Recommendation, ProgressData } from '../types';
import { StatCard } from '../components/StatCard';
import { DigitalTwinVisual } from '../components/DigitalTwinVisual';
import { ParentObservationModal } from '../components/ParentObservationModal';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { KidAvatar } from '../components/KidAvatar';

interface DashboardPageProps {
  onNavigate: (tab: string, extraId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { selectedChild, childrenList } = useChild();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parent Observation Modal
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [lastActivityTitle, setLastActivityTitle] = useState('Constellation Mapping Lab');

  const loadDashboardData = async () => {
    if (!selectedChild) return;
    setIsLoading(true);
    try {
      const [recsData, progData] = await Promise.all([
        api.getRecommendations(selectedChild.id),
        api.getProgress(selectedChild.id),
      ]);
      setRecommendations(recsData.recommendations || []);
      setProgress(progData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedChild?.id]);

  if (!selectedChild && !isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#010313]">No Child Profiles Found</h2>
        <p className="text-sm text-[#6B7280] mt-2 mb-6 max-w-md mx-auto">
          Create your first child profile to initialize their TwinBloom Digital Twin and begin discovering activities.
        </p>
        <button
          onClick={() => onNavigate('children')}
          className="px-6 py-3 rounded-xl bg-[#FF001E] text-white font-bold text-xs hover:bg-[#E6001B] transition-all flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Child Profile</span>
        </button>
      </div>
    );
  }

  if (isLoading && !progress) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner: Child Profile Summary */}
      <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <KidAvatar child={selectedChild} size="xl" shape="rounded" showBadge={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF001E]">
                Active Digital Twin
              </span>
              <span className="text-xs text-[#9CA3AF]">•</span>
              <span className="text-xs font-semibold text-[#6B7280]">
                {selectedChild?.age} Years Old
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
              Hello, {user?.name.split(' ')[0]}! Here is {selectedChild?.name}’s space.
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Interests in {selectedChild?.interests.join(', ')} • Learning preference:{' '}
              {selectedChild?.learning_preferences[0]}
            </p>
          </div>
        </div>

        {/* Action badges: Bloom Points & Learning Streak */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#F8F8FA] border border-[#E5E7EB] px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#9CA3AF] block">
                Bloom Points
              </span>
              <span className="text-base font-extrabold text-[#010313]">
                {selectedChild?.bloom_points}
              </span>
            </div>
          </div>

          <div className="bg-[#FCEBE5] border border-[#FF001E]/20 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#FF001E]" />
            <div>
              <span className="text-[10px] font-bold uppercase text-[#FF001E] block">
                Daily Streak
              </span>
              <span className="text-base font-extrabold text-[#010313]">
                {selectedChild?.learning_streak} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Learning Progress"
          value={`${progress?.metrics.learning_progress || 78}%`}
          subtitle="Overall mastery index"
          trend="↑ +4% this week"
          accentColor="#1E3C65"
        />
        <StatCard
          label="Activities Done"
          value={progress?.metrics.activities_completed || 12}
          subtitle="Explorations logged"
          icon={BookOpen}
          accentColor="#FF001E"
        />
        <StatCard
          label="Quizzes Completed"
          value={progress?.metrics.quiz_attempts || 5}
          subtitle="Retention checks"
          icon={FileQuestion}
          accentColor="#1E3C65"
        />
        <StatCard
          label="Average Score"
          value={`${progress?.metrics.average_score || 85}%`}
          subtitle="Across all categories"
          badge="High Retention"
          accentColor="#FF001E"
        />
      </div>

      {/* Living Digital Twin Visualizer */}
      {selectedChild && (
        <div>
          <DigitalTwinVisual
            child={selectedChild}
            onSelectNode={(node) => {
              if (node === 'activities') onNavigate('activities');
              if (node === 'interests' || node === 'strengths') onNavigate('children');
              if (node === 'preferences') onNavigate('progress');
            }}
          />
        </div>
      )}

      {/* Main Grid: Recommended For You & Continue Learning / Quick Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: AI Recommended Activities */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF001E]" />
              <h2 className="text-lg font-extrabold text-[#010313]">
                Personalized Recommendations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-bold text-[#FF001E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.activity_id}
                className="bg-white border border-[#F0F0F3] hover:border-[#1E3C65]/30 rounded-2xl p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
                      {rec.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
                      {Math.round(rec.score * 100)}% Match
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#010313]">
                    {rec.activity_name}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onNavigate('activities', rec.activity_id)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Start Activity</span>
                    <Play className="w-3 h-3 fill-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Parent Observation CTA */}
          <div className="bg-[#FCEBE5]/40 border border-[#FCEBE5] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h4 className="text-xs font-bold text-[#010313]">Log Recent Activity Observation</h4>
                <p className="text-[11px] text-[#6B7280]">
                  Record how {selectedChild?.name} engaged with today’s learning to refine ML signals.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setLastActivityTitle(recommendations[0]?.activity_name || 'Hands-on Learning');
                setObservationModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF001E] text-xs font-bold text-[#FF001E] transition-colors cursor-pointer shrink-0"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Self-Regulation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Focus & Calm Quick Access */}
          <div className="bg-gradient-to-br from-[#1E3C65] to-[#010313] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="w-4 h-4 text-[#FF001E]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Self-Regulation
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">Focus & Calm Space</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Take a gentle 2-minute break with guided breathing, sensory grounding, or attention resetting.
            </p>

            <button
              onClick={() => onNavigate('focus-calm')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Calming Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Quiz Challenge */}
          <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Quick Check
              </span>
              <span className="text-[10px] font-bold text-[#1E3C65] bg-[#F8F8FA] px-2 py-0.5 rounded-full">
                5 min
              </span>
            </div>
            <h4 className="text-base font-extrabold text-[#010313]">Solar System Explorer Quiz</h4>
            <p className="text-xs text-[#6B7280] mt-1">
              Reinforce planet sizes and orbital trivia to earn 30 Bloom Points.
            </p>

            <button
              onClick={() => onNavigate('quizzes')}
              className="mt-4 w-full py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8F8FA] text-xs font-bold text-[#010313] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Take Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Game Zone Shortcut */}
          <div className="bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-6">
            <div className="flex items-center gap-2 text-[#FF001E] mb-2 font-bold text-xs uppercase tracking-wider">
              <span>🎮 Game Zone</span>
            </div>
            <h4 className="text-base font-extrabold text-[#010313]">Brain Training Mini-Games</h4>
            <p className="text-xs text-[#6B7280] mt-1">
              Play card matching, focus target tracker, and sequence recall.
            </p>
            <button
              onClick={() => onNavigate('games')}
              className="mt-4 w-full py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#1E3C65] text-xs font-bold text-[#1E3C65] transition-colors cursor-pointer"
            >
              Open Game Zone →
            </button>
          </div>
        </div>
      </div>

      {/* Parent Observation Modal */}
      {selectedChild && (
        <ParentObservationModal
          childId={selectedChild.id}
          activityTitle={lastActivityTitle}
          isOpen={observationModalOpen}
          onClose={() => setObservationModalOpen(false)}
          onSaved={() => loadDashboardData()}
        />
      )}
    </div>
  );
};
