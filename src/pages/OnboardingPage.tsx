import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Heart, Brain, Compass } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useChild } from '../context/ChildContext';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { createChild } = useChild();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(7);
  const [gender, setGender] = useState('Not specified');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Space', 'Science']);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(['Creativity', 'Problem solving']);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['Visual', 'Interactive']);

  const availableInterests = [
    'Science', 'Space', 'Mathematics', 'Reading', 'Art', 'Music', 'Technology', 'Sports', 'Nature', 'Robotics'
  ];

  const availableStrengths = [
    'Creativity', 'Problem solving', 'Communication', 'Memory', 'Logical thinking', 'Curiosity', 'Persistence'
  ];

  const availablePreferences = [
    'Visual', 'Interactive', 'Reading', 'Games', 'Hands-on', 'Auditory'
  ];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await createChild({
        name: name.trim() || 'My Child',
        age: Number(age) || 7,
        gender,
        date_of_birth: `201${9 - (Number(age) || 7) + 2}-05-15`,
        interests: selectedInterests,
        strengths: selectedStrengths,
        learning_preferences: selectedPreferences,
        avatar_color: '#1E3C65',
      });
      setStep(5); // Complete screen
    } catch (err) {
      console.error('Failed to create child during onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center py-12 px-6 sm:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <Logo size="md" showTagline={true} className="justify-center mb-3" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010313]">
          Welcome to TwinBloom.
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
          Let’s initialize your child’s personalized Digital Twin in 3 quick steps.
        </p>

        {/* Step Indicator */}
        {step <= 4 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-8 bg-[#FF001E]' : step > s ? 'w-4 bg-[#1E3C65]' : 'w-4 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white p-6 sm:p-10 shadow-lg border border-[#F0F0F3] rounded-3xl">
          {/* STEP 1: Child Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Step 1 of 4 • Basic Identity
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  What is your child’s name and age?
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1">
                  Child’s First Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Leo, Maya, Oliver..."
                  className="w-full px-4 py-2.5 text-xs text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#010313] mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="16"
                    value={age}
                    onChange={(e) => setAge(Math.max(3, parseInt(e.target.value) || 3))}
                    className="w-full px-4 py-2.5 text-xs text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#010313] mb-1">
                    Gender <span className="font-normal text-[#9CA3AF]">(Optional)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65]"
                  >
                    <option value="Not specified">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Step 2 of 4 • Curiosity Matrix
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  What sparks {name}’s curiosity?
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Select the subjects they naturally gravitate toward during play or reading.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleItem(selectedInterests, setSelectedInterests, interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FCEBE5] text-[#FF001E] border border-[#FF001E]/40'
                          : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB] hover:border-[#1E3C65]/30'
                      }`}
                    >
                      {interest} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#010313] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Strengths</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Strengths */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Step 3 of 4 • Natural Strengths
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  What are {name}’s core strengths?
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Where do you notice natural aptitude or spontaneous perseverance?
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableStrengths.map((strength) => {
                  const isSelected = selectedStrengths.includes(strength);
                  return (
                    <button
                      type="button"
                      key={strength}
                      onClick={() => toggleItem(selectedStrengths, setSelectedStrengths, strength)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E3C65] text-white'
                          : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB] hover:border-[#1E3C65]/30'
                      }`}
                    >
                      {strength} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#010313] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Preferences</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Learning Preferences */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  Step 4 of 4 • Modalities
                </span>
                <h3 className="text-lg font-extrabold text-[#010313]">
                  How does {name} learn best?
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Select the instructional approaches that maintain their engagement.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availablePreferences.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => toggleItem(selectedPreferences, setSelectedPreferences, pref)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FCEBE5] text-[#FF001E] border border-[#FF001E]/40'
                          : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB] hover:border-[#1E3C65]/30'
                      }`}
                    >
                      {pref} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#010313] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Initializing...' : 'Complete Setup →'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Finalized Success State */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#010313]">
                Your child’s TwinBloom profile is ready.
              </h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                We’ve created <span className="font-bold text-[#010313]">{name}’s Digital Twin</span>, initialized custom activity recommendations, and awarded 50 welcoming Bloom Points!
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-8 py-3 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Enter TwinBloom Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
