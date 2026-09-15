import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Quiz, QuizQuestion } from '../types';
import { useChild } from '../context/ChildContext';

export const QuizzesPage: React.FC = () => {
  const { selectedChild, refreshChildren } = useChild();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz Player State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ question_id: string; selected_index: number }[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async (quiz: Quiz) => {
    setIsLoading(true);
    try {
      const fullQuiz = await api.getQuiz(quiz.id);
      setActiveQuiz(fullQuiz);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setHasAnsweredCurrent(false);
      setUserAnswers([]);
      setQuizFinished(false);
      setFinalResult(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Failed to fetch full quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !activeQuiz?.questions) return;
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    setUserAnswers(prev => [...prev, { question_id: currentQ.id, selected_index: selectedOption }]);
    setHasAnsweredCurrent(true);
  };

  const handleNextQuestion = async () => {
    if (!activeQuiz?.questions) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnsweredCurrent(false);
    } else {
      // Final submission
      const timeTaken = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      if (!selectedChild) return;
      try {
        const res = await api.submitQuiz(activeQuiz.id, {
          child_id: selectedChild.id,
          answers: userAnswers,
          time_taken: timeTaken,
        });
        setFinalResult(res);
        setQuizFinished(true);
        await refreshChildren();
      } catch (err) {
        console.error('Failed to submit quiz:', err);
      }
    }
  };

  // Render Quiz Completed Summary
  if (quizFinished && finalResult) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FCEBE5] text-[#FF001E] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF001E]">
            Quiz Completed
          </span>
          <h2 className="text-3xl font-extrabold text-[#010313]">
            {activeQuiz?.title}
          </h2>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="text-center">
              <span className="text-xs text-[#9CA3AF] uppercase font-bold block">Score</span>
              <span className="text-3xl font-extrabold text-[#010313]">
                {finalResult.result.score}/{finalResult.result.total_questions}
              </span>
            </div>
            <div className="h-10 w-px bg-[#E5E7EB]" />
            <div className="text-center">
              <span className="text-xs text-[#9CA3AF] uppercase font-bold block">Mastery</span>
              <span className="text-3xl font-extrabold text-[#1E3C65]">
                {Math.round(finalResult.scorePct)}%
              </span>
            </div>
            <div className="h-10 w-px bg-[#E5E7EB]" />
            <div className="text-center">
              <span className="text-xs text-[#FF001E] uppercase font-bold block">Points</span>
              <span className="text-3xl font-extrabold text-[#FF001E]">
                +{finalResult.bloom_points_earned} 🌱
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#E5E7EB] text-left">
            <span className="text-xs font-bold text-[#1E3C65] block mb-1">
              Pedagogical Insight
            </span>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {finalResult.improvement_suggestion}
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => activeQuiz && startQuiz(activeQuiz)}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8F8FA] text-xs font-bold text-[#010313] flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-6 py-2.5 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Active Quiz Player
  if (activeQuiz && activeQuiz.questions && activeQuiz.questions.length > 0) {
    const currentQ: QuizQuestion = activeQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveQuiz(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#010313] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1E3C65]">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#010313] leading-snug">
            {currentQ.question}
          </h2>

          {/* 4 Choices */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isOptionSelected = selectedOption === idx;
              let choiceStyle = 'border-[#E5E7EB] hover:border-[#1E3C65]/40 bg-[#F8F8FA]/60 text-[#010313]';

              if (hasAnsweredCurrent) {
                if (idx === currentQ.correct_answer) {
                  choiceStyle = 'border-[#1E3C65] bg-[#1E3C65]/10 text-[#1E3C65] font-bold';
                } else if (isOptionSelected && !isCorrect) {
                  choiceStyle = 'border-[#FF001E] bg-[#FCEBE5] text-[#FF001E] font-bold';
                } else {
                  choiceStyle = 'border-[#E5E7EB] opacity-40 text-[#9CA3AF]';
                }
              } else if (isOptionSelected) {
                choiceStyle = 'border-[#FF001E] bg-[#FCEBE5]/50 ring-1 ring-[#FF001E] text-[#010313] font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${choiceStyle}`}
                >
                  <span>{option}</span>
                  {hasAnsweredCurrent && idx === currentQ.correct_answer && (
                    <CheckCircle2 className="w-5 h-5 text-[#1E3C65]" />
                  )}
                  {hasAnsweredCurrent && isOptionSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-[#FF001E]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {hasAnsweredCurrent && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                isCorrect
                  ? 'bg-[#F8F8FA] border-[#E5E7EB] text-[#010313]'
                  : 'bg-[#FCEBE5]/50 border-[#FF001E]/20 text-[#1E3C65]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {isCorrect ? (
                  <span className="text-[#1E3C65]">✓ Correct!</span>
                ) : (
                  <span className="text-[#FF001E]">Concept Explanation</span>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            {!hasAnsweredCurrent ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#010313] hover:bg-[#1E3C65] text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentQuestionIndex < activeQuiz.questions.length - 1
                    ? 'Next Question'
                    : 'Finish Quiz →'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Quizzes Directory View
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
          Knowledge Verification
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
          Interactive Quizzes
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Adaptive quizzes that reinforce learning concepts with gentle pedagogical explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-3xl p-6 border border-[#F0F0F3] hover:border-[#1E3C65]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]">
                  {quiz.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCEBE5] text-[#FF001E]">
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#010313] mb-2">{quiz.title}</h3>
              <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed mb-4">
                {quiz.description}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] py-3 border-t border-[#F0F0F3]">
                <span>{quiz.question_count || 4} Questions</span>
                <span>Ages {quiz.recommended_age[0]}–{quiz.recommended_age[1]}</span>
              </div>

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full py-2.5 rounded-xl bg-[#010313] hover:bg-[#FF001E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Take Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
