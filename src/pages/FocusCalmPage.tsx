import React, { useState, useEffect, useRef } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const FocusCalmPage: React.FC = () => {
  // Breathing Tool State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Audio Ambient Noise Synthesizer via Web Audio API (No external sound files required)
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Grounding Step Tracker
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { num: '5', label: 'Things you can SEE', desc: 'Look around and notice 5 distinct objects, colors, or shadows.' },
    { num: '4', label: 'Things you can TOUCH', desc: 'Feel your desk, clothes, warm mug, or smooth fingertips.' },
    { num: '3', label: 'Things you can HEAR', desc: 'Listen carefully for distant birds, room hum, or your own breath.' },
    { num: '2', label: 'Things you can SMELL', desc: 'Notice faint aromas in the air, paper, or fresh breeze.' },
    { num: '1', label: 'Thing you can TASTE', desc: 'Sip fresh water or notice the clean taste in your mouth.' },
  ];

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            setCyclesCompleted(c => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  // Gentle Pink Noise Synthesizer
  const toggleAmbientSound = () => {
    if (soundPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Buffer for gentle soft pink/brown ocean noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.08;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // gentle warm soothing hum

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNodeRef.current = gainNode;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        setSoundPlaying(true);
      } catch (err) {
        console.error('Web Audio API not permitted in current context:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-[#FF001E]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
            Emotional Equilibrium
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Focus & Calm
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Non-medical self-regulation tools for focus, calming, and mindful grounding.
        </p>
      </div>

      {/* Mandatory Non-Medical Disclaimer Banner (Section 35) */}
      <div className="bg-[#F8F8FA] border-l-4 border-[#1E3C65] rounded-2xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-[#1E3C65] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <span className="font-extrabold text-[#010313] block">
            Educational & Self-Regulation Advisory
          </span>
          <p className="text-[#6B7280] leading-relaxed">
            TwinBloom’s Focus & Calm tools are designed exclusively for educational and self-regulation support. They are not intended to diagnose, treat, or replace professional care for ADHD, anxiety, sensory processing differences, or clinical psychiatric conditions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tool 1: Interactive 4-7-8 Breathing Bubble */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0F0F3] shadow-xs flex flex-col items-center justify-between min-h-[460px]">
          <div className="w-full flex items-center justify-between border-b border-[#F0F0F3] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                Rhythmic Pacing
              </span>
              <h3 className="text-lg font-extrabold text-[#010313]">
                4-7-8 Calming Breath
              </h3>
            </div>
            <span className="text-xs font-bold text-[#6B7280]">
              Cycles Completed: {cyclesCompleted}
            </span>
          </div>

          {/* Animated Visual Breathing Orb */}
          <div className="relative my-8 flex flex-col items-center justify-center">
            {/* Pulsing Aura Rings */}
            <div
              className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'scale-110 bg-[#FCEBE5]/80 shadow-[0_0_60px_rgba(255,0,30,0.15)]'
                  : breathPhase === 'Hold'
                  ? 'scale-110 bg-[#1E3C65]/10 shadow-[0_0_40px_rgba(30,60,101,0.15)]'
                  : 'scale-90 bg-[#F8F8FA] shadow-none'
              }`}
            >
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center transition-all duration-700 shadow-md ${
                  breathPhase === 'Inhale'
                    ? 'bg-[#FF001E] text-white'
                    : breathPhase === 'Hold'
                    ? 'bg-[#1E3C65] text-white'
                    : 'bg-[#010313] text-white'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {breathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="text-4xl font-extrabold my-1">
                  {breathingActive ? breathTimer : '4'}s
                </span>
                <span className="text-[10px] opacity-80">
                  {breathPhase === 'Inhale'
                    ? 'Breathe in softly'
                    : breathPhase === 'Hold'
                    ? 'Hold gently'
                    : 'Slow, steady exhale'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBreathingActive(!breathingActive);
                if (!breathingActive) {
                  setBreathPhase('Inhale');
                  setBreathTimer(4);
                }
              }}
              className="px-6 py-3 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{breathingActive ? 'Pause Breath' : 'Start 4-7-8 Breathing'}</span>
            </button>

            <button
              onClick={() => {
                setBreathingActive(false);
                setBreathPhase('Inhale');
                setBreathTimer(4);
                setCyclesCompleted(0);
              }}
              className="p-3 rounded-xl border border-[#E5E7EB] hover:bg-[#F8F8FA] text-[#6B7280] hover:text-[#010313] transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 2: Sensory Grounding & Ambient Sound */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ambient Sound Player */}
          <div className="bg-white rounded-3xl p-6 border border-[#F0F0F3] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F8F8FA] text-[#1E3C65]">
                  {soundPlaying ? <Volume2 className="w-5 h-5 text-[#FF001E]" /> : <VolumeX className="w-5 h-5 text-[#9CA3AF]" />}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#010313]">Warm Ambient Pink Noise</h4>
                  <p className="text-[11px] text-[#6B7280]">Soft frequency loop for cognitive focus</p>
                </div>
              </div>

              <button
                onClick={toggleAmbientSound}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  soundPlaying
                    ? 'bg-[#FF001E] text-white'
                    : 'bg-[#F8F8FA] border border-[#E5E7EB] text-[#010313] hover:bg-[#FCEBE5]'
                }`}
              >
                {soundPlaying ? 'Mute' : 'Play Sound'}
              </button>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Synthesizes a calming low-frequency white/pink noise stream directly in-browser to mask room distractions during reading and problem solving.
            </p>
          </div>

          {/* 5-4-3-2-1 Sensory Grounding Guide */}
          <div className="bg-white rounded-3xl p-6 border border-[#F0F0F3] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F0F3] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3C65]">
                  Present-Moment Anchor
                </span>
                <h4 className="text-base font-extrabold text-[#010313]">
                  5-4-3-2-1 Sensory Grounding
                </h4>
              </div>
              <span className="text-xs font-bold text-[#FF001E]">
                Step {groundingStep + 1} of 5
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#1E3C65] text-white text-sm font-extrabold flex items-center justify-center">
                  {groundingSteps[groundingStep].num}
                </span>
                <h5 className="text-sm font-bold text-[#010313]">
                  {groundingSteps[groundingStep].label}
                </h5>
              </div>
              <p className="text-xs text-[#6B7280] pl-11 leading-relaxed">
                {groundingSteps[groundingStep].desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={groundingStep === 0}
                onClick={() => setGroundingStep(s => s - 1)}
                className="text-xs font-bold text-[#6B7280] hover:text-[#010313] disabled:opacity-30 cursor-pointer"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setGroundingStep(s => (s + 1) % 5)}
                className="px-4 py-2 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {groundingStep === 4 ? 'Cycle to Start' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
