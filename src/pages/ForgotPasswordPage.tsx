import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center py-12 px-6 sm:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo size="md" showTagline={true} className="justify-center mb-4" />
        <h2 className="text-2xl font-extrabold text-[#010313]">
          Reset Your Password
        </h2>
        <p className="mt-2 text-xs text-[#6B7280]">
          Enter the email associated with your TwinBloom parent account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg border border-[#F0F0F3] rounded-3xl">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#010313]">Reset Instructions Sent</h3>
              <p className="text-xs text-[#6B7280]">
                If an account exists for <span className="font-semibold text-[#010313]">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <button
                onClick={onBackToLogin}
                className="w-full py-2.5 rounded-xl bg-[#010313] text-white text-xs font-bold hover:bg-[#1E3C65] transition-colors cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 text-xs text-[#010313] bg-[#F8F8FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1E3C65]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full text-center text-xs font-semibold text-[#1E3C65] hover:text-[#010313] flex items-center justify-center gap-1.5 pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
