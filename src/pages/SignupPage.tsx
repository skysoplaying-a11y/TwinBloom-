import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User, AlertCircle, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

interface SignupPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToLanding: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBackToLanding,
}) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#FCEBE5] selection:text-[#FF001E]">
      {/* Background ambient lighting */}
      <div className="absolute -top-36 -right-36 w-96 h-96 rounded-full bg-[#FCEBE5]/60 blur-3xl -z-10" />
      <div className="absolute top-1/2 -left-36 w-96 h-96 rounded-full bg-[#1E3C65]/5 blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Navigation & Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLanding}
            className="cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
          >
            <Logo size="md" showTagline={true} />
          </button>
          <button
            onClick={onBackToLanding}
            className="text-xs font-bold text-[#1E3C65] hover:text-[#FF001E] px-3.5 py-1.5 rounded-full bg-[#F8F8FA] border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>

        {/* Main Split Grid: Hero Visual & Sign Up Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Highlight Card with Image */}
          <div className="lg:col-span-5 bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[11px] font-extrabold text-[#1E3C65] mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF001E]" />
                <span>Begin Your Child's Journey</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#010313] leading-snug tracking-tight">
                Create Your Digital Twin Space
              </h2>
              <p className="text-xs text-[#6B7280] mt-2 font-medium leading-relaxed">
                Join parents who use TwinBloom to track milestones, discover personalized learning activities, and nurture emotional self-regulation.
              </p>

              {/* Cutout Feature Graphic - No enclosing box */}
              <div className="my-5 relative flex items-center justify-center">
                <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#1E3C65]/10 via-[#FF001E]/10 to-transparent blur-2xl pointer-events-none" />
                <img
                  src="https://i.ibb.co/5Xz1gkkT/20260915-104050.png"
                  alt="TwinBloom Child Development Platform"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-52 sm:max-h-60 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E7EB]/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#010313]">
                <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0" />
                <span>Instant profile setup for multiple children</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#010313]">
                <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0" />
                <span>Personalized activity recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#010313]">
                <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0" />
                <span>Non-medical calming and focus exercises</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign Up Form Card */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-[#F0F0F3] shadow-lg flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#010313] tracking-tight">
                Create parent account
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-medium">
                Set up your credentials to manage your family's Digital Twins.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#FCEBE5] border border-[#FF001E]/30 flex items-center gap-2.5 text-xs font-bold text-[#FF001E]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-extrabold text-[#010313] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Parent or Guardian name"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#010313] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#010313] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#010313] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create TwinBloom Account →'}</span>
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#6B7280] font-medium">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-extrabold text-[#FF001E] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Requested Image Section Below Sign Up Page - Cutout presentation */}
        <div className="mt-8 bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-5/12 flex items-center justify-center relative py-2 shrink-0">
            <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#1E3C65]/10 via-[#FF001E]/10 to-transparent blur-2xl pointer-events-none" />
            <img
              src="https://i.ibb.co/gMZC5Tgb/20260915-103815.png"
              alt="TwinBloom Attention & Self-Regulation Space"
              referrerPolicy="no-referrer"
              className="w-full max-h-56 sm:max-h-64 object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.14)] hover:scale-105 transition-transform duration-500 select-none"
            />
          </div>
          <div className="flex-1 space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCEBE5] text-[#FF001E] text-[10px] font-extrabold uppercase tracking-wide">
              <HeartHandshake className="w-3 h-3" />
              <span>Attention & Self-Regulation Space</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#010313]">
              Non-Medical Developmental Support for Growing Minds
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
              TwinBloom pairs academic learning journeys with calming breathing rhythms, grounding check-ins, and focus micro-activities to build self-regulation and healthy cognitive habits.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] font-bold text-[#1E3C65]">
              <span>🔒 100% Private & Encrypted</span>
              <span>•</span>
              <span>🌱 Non-Diagnostic Growth Guidance</span>
              <span>•</span>
              <span>⚡ Zero Token Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
