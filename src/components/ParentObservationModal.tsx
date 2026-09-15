import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { api } from '../services/api';

interface ParentObservationModalProps {
  childId: string;
  activityTitle: string;
  sessionId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ParentObservationModal: React.FC<ParentObservationModalProps> = ({
  childId,
  activityTitle,
  sessionId,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [observation, setObservation] = useState<'Very engaged' | 'Engaged' | 'Neutral' | 'Needed support'>('Very engaged');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const options: { level: 'Very engaged' | 'Engaged' | 'Neutral' | 'Needed support'; emoji: string; label: string; desc: string }[] = [
    { level: 'Very engaged', emoji: '😊', label: 'Very engaged', desc: 'Deep focus, curious questions, self-driven' },
    { level: 'Engaged', emoji: '🙂', label: 'Engaged', desc: 'Completed steps smoothly with good attention' },
    { level: 'Neutral', emoji: '😐', label: 'Neutral', desc: 'Compliant but modest enthusiasm' },
    { level: 'Needed support', emoji: '😕', label: 'Needed support', desc: 'Required guidance or gentle pacing assistance' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.recordObservation({
        child_id: childId,
        session_id: sessionId,
        activity_title: activityTitle,
        observation,
        notes,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onSaved?.();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to save observation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010313]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#F0F0F3]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#9CA3AF] hover:text-[#010313] rounded-full hover:bg-[#F8F8FA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#010313]">Observation Recorded!</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Your empirical notes help TwinBloom’s ML layer personalize future recommendations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-[#FCEBE5] text-[#FF001E]">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Parent Observation
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  How did the activity go?
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#6B7280] mb-5">
              Reflecting on <span className="font-semibold text-[#1E3C65]">{activityTitle}</span>.
              Parent reflections become gentle personalization signals for future activities.
            </p>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {options.map((opt) => (
                <button
                  type="button"
                  key={opt.level}
                  onClick={() => setObservation(opt.level)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    observation === opt.level
                      ? 'border-[#FF001E] bg-[#FCEBE5]/40 ring-1 ring-[#FF001E]'
                      : 'border-[#E5E7EB] hover:border-[#1E3C65]/30 bg-[#F8F8FA]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-sm font-bold text-[#010313]">{opt.label}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-tight">{opt.desc}</p>
                </button>
              ))}
            </div>

            {/* Optional Notes */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#010313] mb-1.5">
                What did you notice? <span className="font-normal text-[#9CA3AF]">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="E.g., Enjoyed constructing the steps; asked great questions about orbital gravity..."
                className="w-full text-xs text-[#010313] p-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#1E3C65] resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#010313] transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Observation →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
