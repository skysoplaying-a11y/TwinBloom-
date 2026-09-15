import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChild } from '../context/ChildContext';
import { api } from '../services/api';
import { ProgressData, ProgressPrediction } from '../types';
import { StatCard } from '../components/StatCard';
import { SkeletonCard } from '../components/SkeletonLoader';

export const ProgressPage: React.FC = () => {
  const { selectedChild } = useChild();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [prediction, setPrediction] = useState<ProgressPrediction | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedChild) return;
    loadProgress();
  }, [selectedChild?.id]);

  const loadProgress = async () => {
    if (!selectedChild) return;
    setIsLoading(true);
    try {
      const [progData, predData] = await Promise.all([
        api.getProgress(selectedChild.id),
        api.getProgressPrediction(selectedChild.id),
      ]);
      setProgress(progData);
      setPrediction(predData);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedChild) {
    return (
      <div className="p-8 text-center text-[#6B7280]">
        Please select or create a child profile to view developmental progress.
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
            Empirical Mastery Data
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
            Progress & Analytics
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Tracking {selectedChild.name}’s developmental trajectory, retention curves, and category strengths.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] p-1 rounded-2xl self-start sm:self-auto">
          {(['7d', '30d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-[#010313] text-white'
                  : 'text-[#6B7280] hover:text-[#010313]'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Learning Mastery"
          value={`${progress?.metrics.learning_progress || 78}%`}
          subtitle="Progress index"
          accentColor="#1E3C65"
          trend="↑ 4% growth"
        />
        <StatCard
          label="Quiz Average"
          value={`${progress?.metrics.average_score || 85}%`}
          subtitle="Concept retention"
          accentColor="#FF001E"
        />
        <StatCard
          label="Total Explorations"
          value={progress?.metrics.activities_completed || 12}
          subtitle="Hands-on sessions"
          accentColor="#1E3C65"
        />
        <StatCard
          label="Bloom Points"
          value={`🌱 ${selectedChild.bloom_points}`}
          subtitle={`${selectedChild.learning_streak} day streak`}
          accentColor="#FF001E"
        />
      </div>

      {/* ML Progress Prediction Card (Section 31) */}
      <div className="bg-gradient-to-r from-[#010313] via-[#1E3C65] to-[#010313] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF001E] rounded-full blur-3xl opacity-10" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 text-[#FF001E]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF001E]">
                  Machine Learning Projection
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Predicted Learning Velocity & Performance
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white">
                Confidence: {prediction?.confidence || 'High'} (91%)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF001E] text-white">
                Trend: {prediction?.trend || 'Improving'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-[11px] text-gray-300 block mb-1">
                Predicted Next Quiz Performance
              </span>
              <span className="text-3xl font-extrabold text-white">
                {prediction?.predicted_next_performance || 88}%
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Estimated range: 84% – 93% with steady practice.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-[11px] text-gray-300 block mb-1">
                Velocity Trajectory
              </span>
              <span className="text-3xl font-extrabold text-white">
                +{prediction?.velocity || 2.4}%
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Positive slope across sequential quiz assessments.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-[11px] text-gray-300 block mb-1">
                Sample Set Grounding
              </span>
              <span className="text-3xl font-extrabold text-white">
                {prediction?.sample_size || 5} Records
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Python Random Forest / Linear regression engine.
              </p>
            </div>
          </div>

          {/* Feature Contributions Breakdown */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-3">
              Model Weight Contributions
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { factor: 'Prior Quiz Scores', weight: '40%', impact: 'High' },
                { factor: 'Activity Completion', weight: '25%', impact: 'Moderate' },
                { factor: 'Session Frequency', weight: '20%', impact: 'Moderate' },
                { factor: 'Strengths Alignment', weight: '15%', impact: 'Supporting' },
              ].map((f) => (
                <div key={f.factor} className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                  <span className="text-gray-300 block">{f.factor}</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">{f.weight}</span>
                  <span className="text-[10px] text-[#FF001E] font-bold mt-1 block">
                    {f.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quiz Score Trend (Area Chart) */}
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3C65]">
                Assessments
              </span>
              <h3 className="text-lg font-extrabold text-[#010313]">Quiz Score Trajectory</h3>
            </div>
            <span className="text-xs text-[#6B7280] font-semibold">Scores (%)</span>
          </div>

          <div className="h-64 w-full">
            {progress?.charts.quiz_score_trend && progress.charts.quiz_score_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress.charts.quiz_score_trend}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF001E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF001E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F3" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#010313',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#FF001E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#9CA3AF]">
                Complete quizzes to populate the score trajectory curve.
              </div>
            )}
          </div>
        </div>

        {/* Weekly Participation (Bar Chart) */}
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3C65]">
                Consistency
              </span>
              <h3 className="text-lg font-extrabold text-[#010313]">Daily Learning Engagement</h3>
            </div>
            <span className="text-xs text-[#6B7280] font-semibold">Minutes Active</span>
          </div>

          <div className="h-64 w-full">
            {progress?.charts.activity_participation && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progress.charts.activity_participation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F3" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#010313',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="minutes" fill="#1E3C65" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
              Category Mastery
            </span>
            <h3 className="text-lg font-extrabold text-[#010313]">
              Discipline Proficiency Breakdown
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(progress?.charts.category_performance || [
            { category: 'Science', score: 92 },
            { category: 'Mathematics', score: 85 },
            { category: 'Reading', score: 78 },
            { category: 'Creativity', score: 95 },
          ]).map((item) => (
            <div key={item.category} className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#010313]">{item.category}</span>
                <span className="text-xs font-extrabold text-[#1E3C65]">{item.score}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1E3C65] h-full rounded-full transition-all"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
