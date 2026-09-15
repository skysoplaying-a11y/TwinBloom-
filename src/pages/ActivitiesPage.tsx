import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageSquareHeart,
  ChevronRight,
  Play,
} from 'lucide-react';
import { api } from '../services/api';
import { Activity } from '../types';
import { useChild } from '../context/ChildContext';
import { ParentObservationModal } from '../components/ParentObservationModal';

interface ActivitiesPageProps {
  initialActivityId?: string;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ initialActivityId }) => {
  const { selectedChild, refreshChildren } = useChild();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Active step in player
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [observationModalOpen, setObservationModalOpen] = useState(false);

  const categories = ['All', 'Science', 'Mathematics', 'Reading', 'Creativity', 'Focus', 'Memory', 'Calm'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadActivities();
  }, [activeCategory, activeDifficulty]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getActivities(activeCategory, activeDifficulty);
      setActivities(data);
      if (initialActivityId) {
        const found = data.find(a => a.id === initialActivityId);
        if (found) {
          setSelectedActivity(found);
          setCurrentStepIndex(0);
        }
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStartActivity = (act: Activity) => {
    setSelectedActivity(act);
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  const handleCompleteActivity = async () => {
    if (!selectedChild || !selectedActivity) return;
    try {
      await api.recordSession({
        child_id: selectedChild.id,
        activity_id: selectedActivity.id,
        duration: selectedActivity.duration,
        completion_status: 'completed',
        engagement_level: 'High',
      });
      setIsCompleted(true);
      await refreshChildren();
    } catch (err) {
      console.error('Failed to record activity completion:', err);
      setIsCompleted(true);
    }
  };

  // Render Activity Player View
  if (selectedActivity) {
    const steps = selectedActivity.content?.steps || [];
    const currentStep = steps[currentStepIndex];

    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedActivity(null)}
          className="flex items-center gap-2 text-xs font-bold text-[#1E3C65] hover:text-[#FF001E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Activities</span>
        </button>

        {/* Activity Player Header */}
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
              {selectedActivity.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
              {selectedActivity.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#6B7280] ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {selectedActivity.duration} mins
            </span>
            <span className="text-xs text-[#6B7280]">
              Ages {selectedActivity.recommended_age[0]}–{selectedActivity.recommended_age[1]}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#010313]">
            {selectedActivity.title}
          </h1>
          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
            {selectedActivity.content?.overview || selectedActivity.description}
          </p>

          {/* Learning Goals */}
          {selectedActivity.content?.learning_goals && (
            <div className="mt-5 p-4 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3C65] block mb-2">
                Core Developmental Goals
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#010313]">
                {selectedActivity.content.learning_goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Interactive Step-by-Step Experience */}
        {steps.length > 0 && (
          <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F0F3] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Guided Exploration
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentStepIndex === idx
                        ? 'bg-[#FF001E] text-white'
                        : idx < currentStepIndex
                        ? 'bg-[#1E3C65] text-white'
                        : 'bg-[#F8F8FA] text-[#6B7280]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Body */}
            <div className="space-y-4">
              <p className="text-base text-[#010313] leading-relaxed font-medium">
                {currentStep.instruction}
              </p>

              {currentStep.tip && (
                <div className="p-4 rounded-2xl bg-[#FCEBE5]/50 border border-[#FF001E]/20 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#FF001E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#FF001E] block">Parent Facilitation Tip</span>
                    <p className="text-xs text-[#1E3C65] mt-0.5 leading-relaxed">{currentStep.tip}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0F0F3]">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#010313] disabled:opacity-30 cursor-pointer"
              >
                Previous Step
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteActivity}
                  disabled={isCompleted}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Completed! (+25 pts)' : 'Mark as Completed'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Parent Discussion Prompts */}
        {selectedActivity.content?.discussion_prompts && (
          <div className="bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareHeart className="w-4 h-4 text-[#FF001E]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#010313]">
                Parent Discussion Prompts
              </h4>
            </div>
            <div className="space-y-2">
              {selectedActivity.content.discussion_prompts.map((prompt, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#010313]">
                  💬 "{prompt}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#010313]">
                {isCompleted ? 'Activity Finished & Synced!' : 'Complete this activity to earn points'}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                Syncs with {selectedChild?.name}’s Digital Twin model.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setObservationModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#E5E7EB] text-xs font-bold text-[#1E3C65] transition-colors cursor-pointer"
            >
              Log Observation
            </button>
            <button
              onClick={handleCompleteActivity}
              className="px-5 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isCompleted ? '✓ Completed' : 'Finish Activity'}
            </button>
          </div>
        </div>

        {/* Observation Modal */}
        {selectedChild && (
          <ParentObservationModal
            childId={selectedChild.id}
            activityTitle={selectedActivity.title}
            isOpen={observationModalOpen}
            onClose={() => setObservationModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // Render Activity Directory List View
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Directory Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
          Curated Discovery
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Learning Activities
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Bite-sized, developmentally targeted challenges designed for child curiosity and parent facilitation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities by topic, skill, or tags (e.g. Space, Physics, Origami)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-[#010313] bg-white border border-[#E5E7EB] rounded-2xl focus:outline-none focus:border-[#1E3C65]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#9CA3AF] shrink-0">Difficulty:</span>
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  activeDifficulty === diff
                    ? 'bg-[#010313] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#010313]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#FCEBE5] text-[#FF001E] border border-[#FF001E]/30'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#010313]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-6 border border-[#F0F0F3] hover:border-[#1E3C65]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
                  {act.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
                  {act.difficulty}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#010313] mb-2 leading-snug">
                {act.title}
              </h3>
              <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed mb-4">
                {act.description}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] py-3 border-t border-[#F0F0F3]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {act.duration} mins
                </span>
                <span>Ages {act.recommended_age[0]}–{act.recommended_age[1]}</span>
              </div>

              <button
                onClick={() => handleStartActivity(act)}
                className="w-full py-2.5 rounded-xl bg-[#010313] hover:bg-[#FF001E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Start Activity</span>
                <Play className="w-3 h-3 fill-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
