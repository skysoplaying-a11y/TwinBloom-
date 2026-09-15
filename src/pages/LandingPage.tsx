import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Brain,
  Compass,
  FileQuestion,
  TrendingUp,
  HeartHandshake,
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle,
  Play,
  Gamepad2,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'signup') => void;
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth, onEnterApp }) => {
  const { user, loginDemoParent, loginDemoAdmin } = useAuth();

  const handleDemoParent = async () => {
    await loginDemoParent();
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-white text-[#010313] flex flex-col selection:bg-[#FCEBE5] selection:text-[#FF001E]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0F0F3] px-6 lg:px-12 py-4 flex items-center justify-between">
        <Logo size="md" showTagline={true} />
        
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 rounded-xl bg-[#010313] text-white text-xs font-bold hover:bg-[#1E3C65] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigateToAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1E3C65] hover:text-[#010313] hover:bg-[#F8F8FA] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-5 py-2.5 rounded-xl bg-[#FF001E] text-white text-xs font-bold hover:bg-[#E6001B] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#FCEBE5]/40 blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#1E3C65]/5 blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCEBE5] border border-[#FF001E]/20 text-xs font-bold text-[#FF001E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Child Development Digital Twin</span>
            </div>

            {/* Typography Hero: Understand. Support. Nurture. */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#010313] leading-[1.1]">
                Understand.
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E3C65] leading-[1.1]">
                Support.
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FF001E] leading-[1.1]">
                Nurture.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl font-medium">
              TwinBloom creates a personalized digital profile for your child, helping you understand learning patterns, track progress, and discover activities suited to their interests and strengths.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-7 py-3.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started →</span>
              </button>

              <button
                onClick={() => onNavigateToAuth('login')}
                className="px-6 py-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8F8FA] text-sm font-bold text-[#010313] transition-colors cursor-pointer"
              >
                Sign In
              </button>

              {/* 1-Click Instant Demo Evaluation Button */}
              <button
                onClick={handleDemoParent}
                className="px-5 py-3.5 rounded-xl bg-[#FCEBE5] border border-[#FF001E]/30 text-[#FF001E] hover:bg-[#FCEBE5]/80 text-xs font-extrabold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#FF001E]" />
                <span>1-Click Parent Demo Experience</span>
              </button>
            </div>

            {/* Non-medical trust label */}
            <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#1E3C65]" />
              Non-medical educational support platform. Safe, private, parent-governed.
            </p>
          </div>

          {/* Right Hero Visual: Stylized TwinBloom Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Backing Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#1E3C65]/10 via-[#FCEBE5] to-[#FF001E]/10 rounded-3xl blur-md" />

              <div className="relative bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xl space-y-4">
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between border-b border-[#F0F0F3] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF001E]"></span>
                    <span className="text-xs font-bold text-[#010313]">TwinBloom Digital Profile</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1E3C65] bg-[#F8F8FA] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
                    Active Twin • Leo (8y)
                  </span>
                </div>

                {/* Hero Showcase Cutout Graphic */}
                <div className="py-2 relative flex items-center justify-center">
                  <div className="absolute w-56 h-36 rounded-full bg-gradient-to-tr from-[#1E3C65]/10 via-[#FF001E]/10 to-transparent blur-2xl pointer-events-none -z-10" />
                  <img
                    src="https://i.ibb.co/5Xz1gkkT/20260915-104050.png"
                    alt="TwinBloom Living Digital Twin"
                    referrerPolicy="no-referrer"
                    className="w-full max-h-52 sm:max-h-60 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                  />
                </div>

                {/* Floating Card: Child Digital Twin */}
                <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB] shadow-xs hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E3C65]">
                      Child Digital Twin
                    </span>
                    <span className="text-[11px] font-extrabold text-[#FF001E]">340 pts 🌱</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#F0F0F3]">
                      <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Interests</span>
                      <span className="font-bold text-[#010313]">Space • Science • Tech</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#F0F0F3]">
                      <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Primary Strength</span>
                      <span className="font-bold text-[#010313]">Problem Solving</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card: Progress */}
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">
                      Learning Progress Index
                    </span>
                    <span className="text-3xl font-extrabold text-[#010313]">78%</span>
                    <span className="text-[11px] text-[#1E3C65] font-semibold block mt-0.5">
                      ↑ Improving trend across 4 modules
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-[#FCEBE5] border-t-[#FF001E] flex items-center justify-center font-bold text-xs text-[#010313]">
                    78%
                  </div>
                </div>

                {/* Floating Card: AI Recommendation */}
                <div className="p-4 rounded-2xl bg-[#FCEBE5] border border-[#FF001E]/20 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF001E] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Recommendation</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#010313]">
                    Solar System Planetary Explorer
                  </h4>
                  <p className="text-[11px] text-[#4B5563] mt-1 leading-snug">
                    Matches your child's interest in space and recent science performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How TwinBloom Works (Section 11) */}
      <section className="py-16 bg-[#F8F8FA] border-y border-[#F0F0F3] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-[#010313] mt-1">
              How TwinBloom Works
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              Transform daily learning engagement into actionable developmental understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                desc: 'Parent-controlled authentication with encrypted session security and role management.',
              },
              {
                step: '2',
                title: 'Build Child Profile',
                desc: 'Map interests, natural strengths, and preferred learning modalities in a 2-minute onboarding.',
              },
              {
                step: '3',
                title: 'Track Activities & Quizzes',
                desc: 'Engage with bite-sized science, math, reading, and self-regulation activities.',
              },
              {
                step: '4',
                title: 'Discover AI Insights',
                desc: 'Receive explainable ML recommendations and progress trends tailored to your child.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative"
              >
                <div className="w-8 h-8 rounded-full bg-[#1E3C65] text-white text-xs font-extrabold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-[#010313] mb-2">{item.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E3C65]">
            Comprehensive Platform
          </span>
          <h2 className="text-3xl font-extrabold text-[#010313] mt-1">
            Engineered for Modern Child Learning
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Every feature connects back to the core concept: Child + Digital Twin growing in harmony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'Child Digital Twin',
              desc: 'A living, multidimensional profile reflecting age, evolving interests, cognitive strengths, and learning modalities.',
              badge: 'Core Engine',
            },
            {
              icon: Compass,
              title: 'Learning Activities',
              desc: 'Step-by-step interactive explorations across Science, Mathematics, Reading, Memory, and Creative disciplines.',
              badge: 'Curated',
            },
            {
              icon: FileQuestion,
              title: 'Smart Quizzes',
              desc: 'Targeted multiple-choice evaluations providing instant feedback, explanations, and pedagogical suggestions.',
              badge: 'Interactive',
            },
            {
              icon: TrendingUp,
              title: 'Progress Analytics',
              desc: 'High-contrast data visualizations charting score trajectories, session consistency, and category proficiencies.',
              badge: 'Data-Driven',
            },
            {
              icon: Sparkles,
              title: 'Personalized Recommendations',
              desc: 'Python ML layer scoring activities by Age Match, Interest Match, Strength Match, and Engagement.',
              badge: 'Machine Learning',
            },
            {
              icon: HeartHandshake,
              title: 'Focus & Calm Support',
              desc: 'Non-medical self-regulation tools: 4-7-8 breathing bubble, sensory grounding, and gentle focus resetting.',
              badge: 'Regulation',
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white p-6 rounded-2xl border border-[#F0F0F3] hover:border-[#1E3C65]/30 shadow-xs transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#FCEBE5] text-[#FF001E]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#010313] mb-2">{f.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Intelligent Personalization Matrix */}
      <section className="py-16 bg-[#F8F8FA] border-y border-[#F0F0F3] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
                Responsible Personalization
              </span>
              <h2 className="text-3xl font-extrabold text-[#010313] leading-tight">
                How TwinBloom Tailors Every Step
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                TwinBloom never relies on opaque black-box assumptions. Every activity suggestion is calculated from measurable signals and explained clearly to parents.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {[
                { title: 'Chronological Age', desc: 'Ensures age-appropriate developmental challenge.' },
                { title: 'Expressed Interests', desc: 'Space, nature, logic, robotics, storytelling.' },
                { title: 'Natural Strengths', desc: 'Creativity, problem solving, working memory.' },
                { title: 'Learning Preferences', desc: 'Visual models, interactive challenges, reading.' },
                { title: 'Quiz Performance', desc: 'Adapts difficulty based on mastery retention.' },
                { title: 'Parent Observations', desc: 'Empirical reflections on child focus and joy.' },
              ].map((item) => (
                <div key={item.title} className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs">
                  <CheckCircle className="w-4 h-4 text-[#FF001E] mb-2" />
                  <h4 className="text-xs font-bold text-[#010313]">{item.title}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Attention & Self-Regulation Visual Showcase */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-[#F8F8FA] border border-[#E5E7EB] rounded-3xl p-8 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
              Non-Medical Regulation Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#010313] leading-tight">
              Calm Rhythms & Focus Grounding
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              When young minds feel overwhelmed during learning sessions, TwinBloom provides gentle transitions. Guided 4-7-8 breathing bubbles, 5-4-3-2-1 sensory grounding, and bite-sized memory focus games help restore cognitive equilibrium naturally.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-5 py-2.5 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore Focus Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center relative py-4">
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#1E3C65]/10 via-[#FF001E]/10 to-transparent blur-3xl pointer-events-none" />
            <img
              src="https://i.ibb.co/gMZC5Tgb/20260915-103815.png"
              alt="TwinBloom Attention & Self Regulation Learning Space"
              referrerPolicy="no-referrer"
              className="w-full max-h-80 sm:max-h-96 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.16)] hover:scale-102 transition-transform duration-500 select-none"
            />
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-[#010313] text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E3C65] rounded-full blur-3xl opacity-30" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
              Safety, Privacy & Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              A Safe, Non-Medical Educational Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              TwinBloom is explicitly an educational support companion. We do not provide clinical psychiatric assessments, ADHD/Autism detection, or medical treatment plans. Your child’s data is encrypted, parent-owned, and never monetized.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#FF001E]" />
                <span className="text-xs font-bold">JWT Encrypted Auth</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-[#FF001E]" />
                <span className="text-xs font-bold">Parent-Owned Profiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FF001E]" />
                <span className="text-xs font-bold">Responsible AI Guardrails</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 text-center px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#010313]">
          Let your child’s learning journey bloom.
        </h2>
        <p className="text-sm sm:text-base text-[#6B7280] mt-3 max-w-xl mx-auto">
          Join parents using TwinBloom to understand learning patterns and nurture potential with confidence.
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigateToAuth('signup')}
            className="px-8 py-4 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-sm font-extrabold transition-all shadow-md cursor-pointer"
          >
            Create Your TwinBloom Account →
          </button>
          <button
            onClick={handleDemoParent}
            className="px-6 py-4 rounded-xl bg-[#F8F8FA] border border-[#E5E7EB] text-[#010313] hover:bg-[#FCEBE5] text-sm font-bold transition-all cursor-pointer"
          >
            Test Demo Account Instantly
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#F0F0F3] py-8 px-6 lg:px-12 bg-white text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-gray-300">|</span>
            <span>Child Development Digital Twin</span>
          </div>
          <p>© 2026 TwinBloom. Understand. Support. Nurture. Educational Support Platform.</p>
        </div>
      </footer>
    </div>
  );
};
