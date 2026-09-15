import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles, UserCheck, Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onBackToLanding,
}) => {
  const { login, loginDemoParent, loginDemoAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoParent = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginDemoParent();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginDemoAdmin();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#FCEBE5] selection:text-[#FF001E]">
      {/* Background ambient lighting */}
      <div className="absolute -top-36 -left-36 w-96 h-96 rounded-full bg-[#FCEBE5]/60 blur-3xl -z-10" />
      <div className="absolute top-1/2 -right-36 w-96 h-96 rounded-full bg-[#1E3C65]/5 blur-3xl -z-10" />

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

        {/* Main Split Grid: Hero Visual & Sign In Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Highlight Card with Image */}
          <div className="lg:col-span-5 bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[11px] font-extrabold text-[#1E3C65] mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF001E]" />
                <span>Child Development Digital Twin</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#010313] leading-snug tracking-tight">
                Understand. Support. Nurture.
              </h2>
              <p className="text-xs text-[#6B7280] mt-2 font-medium leading-relaxed">
                Connect daily activities, quizzes, and self-regulation exercises to a real-time developmental profile.
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
                <span>AI developmental recommendations & insights</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#010313]">
                <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0" />
                <span>Focus, calming & interactive regulation support</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#010313]">
                <CheckCircle2 className="w-4 h-4 text-[#FF001E] shrink-0" />
                <span>Secure parent custody & encrypted data storage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form Card */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-[#F0F0F3] shadow-lg flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#010313] tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-medium">
                Sign in to securely access your parent dashboard and child twin.
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
                  Parent Email Address
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-[#010313]">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="text-[11px] font-bold text-[#1E3C65] hover:text-[#FF001E] cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to TwinBloom →'}</span>
              </button>
            </form>

            {/* 1-Click Demo Evaluation Accounts */}
            <div className="mt-6 pt-5 border-t border-[#F0F0F3]">
              <span className="block text-center text-[10px] uppercase font-extrabold tracking-wider text-[#9CA3AF] mb-2.5">
                Instant Evaluator Access (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDemoParent}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-[#FCEBE5] hover:bg-[#FCEBE5]/80 text-[#FF001E] border border-[#FF001E]/20 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Demo Parent</span>
                </button>
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#E5E7EB] text-[#1E3C65] border border-[#E5E7EB] text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-[#6B7280] font-medium">
              Don’t have an account yet?{' '}
              <button
                onClick={onNavigateToSignup}
                className="font-extrabold text-[#FF001E] hover:underline cursor-pointer"
              >
                Create parent account
              </button>
            </div>
          </div>
        </div>

        {/* Requested Image Section Below Login Page - Cutout presentation */}
        <div className="mt-8 bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-5/12 flex items-center justify-center relative py-2 shrink-0">
            <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#1E3C65]/10 via-[#FF001E]/10 to-transparent blur-2xl pointer-events-none" />
            <img
              src="https://i.ibb.co/gMZC5Tgb/20260915-103815.png"
              alt="TwinBloom Focus & Child Development Space"
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
