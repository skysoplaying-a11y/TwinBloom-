import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  Brain,
  Target,
  Hash,
  Type,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useChild } from '../context/ChildContext';
import { api } from '../services/api';

export const GameZonePage: React.FC = () => {
  const { selectedChild, refreshChildren } = useChild();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // 1. Memory Match State
  const memoryIcons = ['🚀', '🪐', '🌱', '🔬', '🎨', '🧩'];
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  // 2. Focus Target State
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [targetScore, setTargetScore] = useState(0);
  const [targetTimer, setTargetTimer] = useState(15);
  const [targetGameActive, setTargetGameActive] = useState(false);

  // 3. Number Sequence Rush State
  const [sequenceNumbers, setSequenceNumbers] = useState<number[]>([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState<number>(1);
  const [sequenceWon, setSequenceWon] = useState(false);
  const [sequenceStartTime, setSequenceStartTime] = useState<number>(0);

  // 4. Word Scramble State
  const scrambleWords = [
    { word: 'PLANET', hint: 'Celestial body orbiting a star' },
    { word: 'BLOOM', hint: 'To grow and flourish beautifully' },
    { word: 'GALAXY', hint: 'Vast system of billions of stars' },
    { word: 'ENERGY', hint: 'The capacity for doing work' },
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [userWordGuess, setUserWordGuess] = useState('');
  const [wordFeedback, setWordFeedback] = useState<string | null>(null);

  // Initialize Memory Match
  const initMemoryGame = () => {
    const symbols = [...memoryIcons, ...memoryIcons];
    // Fisher-Yates shuffle
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    setMemoryCards(symbols.map((s, idx) => ({ id: idx, symbol: s, isFlipped: false, isMatched: false })));
    setFlippedIndexes([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  const handleCardClick = (idx: number) => {
    if (flippedIndexes.length === 2 || memoryCards[idx].isFlipped || memoryCards[idx].isMatched) return;
    const newCards = [...memoryCards];
    newCards[idx].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndexes, idx];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setFlippedIndexes([]);

        if (newCards.every(c => c.isMatched)) {
          setMemoryWon(true);
          recordGameCompletion('memory_match', 'Memory & Focus', 'Memory Match', 100, 1);
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndexes([]);
        }, 800);
      }
    }
  };

  // Initialize Number Sequence
  const initSequenceGame = () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    setSequenceNumbers(nums);
    setNextExpectedNumber(1);
    setSequenceWon(false);
    setSequenceStartTime(Date.now());
  };

  const handleSequenceClick = (num: number) => {
    if (num === nextExpectedNumber) {
      if (num === 9) {
        setSequenceWon(true);
        const timeTaken = Math.round((Date.now() - sequenceStartTime) / 1000);
        recordGameCompletion('number_rush', 'Logic & Math', 'Number Sequence Rush', 100, 1, timeTaken);
      } else {
        setNextExpectedNumber(prev => prev + 1);
      }
    }
  };

  // Initialize Focus Target Tracker
  const startFocusTargetGame = () => {
    setTargetScore(0);
    setTargetTimer(15);
    setTargetGameActive(true);
    moveTarget();
  };

  const moveTarget = () => {
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 80) + 10;
    setTargetPosition({ x, y });
  };

  const handleTargetClick = () => {
    if (!targetGameActive) return;
    setTargetScore(s => s + 1);
    moveTarget();
  };

  useEffect(() => {
    if (!targetGameActive) return;
    const interval = setInterval(() => {
      setTargetTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTargetGameActive(false);
          recordGameCompletion('focus_target', 'Self-Regulation', 'Focus Target Tracker', targetScore * 10, 1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetGameActive, targetScore]);

  // Initialize Word Scramble
  const initScrambleGame = () => {
    const current = scrambleWords[wordIndex % scrambleWords.length];
    const letters = current.word.split('').sort(() => Math.random() - 0.5).join('');
    setScrambled(letters);
    setUserWordGuess('');
    setWordFeedback(null);
  };

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = scrambleWords[wordIndex % scrambleWords.length];
    if (userWordGuess.trim().toUpperCase() === current.word) {
      setWordFeedback('✓ Excellent! You unscrambled the word!');
      recordGameCompletion('word_scramble', 'Reading & Vocabulary', 'Word Bloom', 100, 1);
    } else {
      setWordFeedback('Not quite, try again!');
    }
  };

  // Record to backend API
  const recordGameCompletion = async (
    gameId: string,
    category: string,
    title: string,
    score: number,
    level: number,
    timeTaken: number = 20
  ) => {
    if (!selectedChild) return;
    try {
      await api.recordGame({
        child_id: selectedChild.id,
        game_id: gameId,
        game_category: category,
        game_title: title,
        score,
        level,
        time_taken: timeTaken,
        attempts: 1,
        completion_status: 'completed',
        engagement_level: 'High',
      });
      await refreshChildren();
    } catch (err) {
      console.error('Failed to log game score:', err);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Game Zone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#FF001E]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
              Cognitive & Attention Play
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
            Game Zone
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Short, focused mini-games that strengthen memory, visual attention, and processing speed.
          </p>
        </div>

        {selectedChild && (
          <div className="flex items-center gap-2 bg-[#FCEBE5] border border-[#FF001E]/20 px-4 py-2 rounded-2xl self-start sm:self-auto">
            <span className="text-sm">🌱</span>
            <span className="text-xs font-bold text-[#FF001E]">
              {selectedChild.bloom_points} Bloom Points
            </span>
          </div>
        )}
      </div>

      {/* If a game is currently selected */}
      {activeGame ? (
        <div className="bg-white border border-[#F0F0F3] rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E3C65] hover:text-[#FF001E] mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game Zone</span>
          </button>

          {/* 1. MEMORY MATCH */}
          {activeGame === 'memory' && (
            <div className="text-center space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#010313]">Memory Match</h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Flip and match pairs of space and science symbols. Moves: {memoryMoves}
                </p>
              </div>

              {memoryWon ? (
                <div className="p-6 rounded-2xl bg-[#FCEBE5]/50 border border-[#FF001E]/20 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h4 className="text-lg font-extrabold text-[#010313]">Pair Discovery Complete!</h4>
                  <p className="text-xs text-[#6B7280]">
                    You matched all pairs in {memoryMoves} moves. +20 Bloom Points earned!
                  </p>
                  <button
                    onClick={initMemoryGame}
                    className="px-5 py-2.5 rounded-xl bg-[#FF001E] text-white text-xs font-bold"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-sm mx-auto">
                  {memoryCards.map((card, idx) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className={`h-20 rounded-2xl text-2xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        card.isFlipped || card.isMatched
                          ? 'bg-[#FCEBE5] border-2 border-[#FF001E]'
                          : 'bg-[#010313] hover:bg-[#1E3C65] text-transparent'
                      }`}
                    >
                      {card.isFlipped || card.isMatched ? card.symbol : '🌱'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. FOCUS TARGET */}
          {activeGame === 'focus' && (
            <div className="text-center space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#010313]">Focus Target Tracker</h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Click the target dot before it moves. Remaining Time: {targetTimer}s • Score: {targetScore}
                </p>
              </div>

              <div className="relative w-full h-72 bg-[#F8F8FA] border border-[#E5E7EB] rounded-2xl overflow-hidden">
                {targetGameActive ? (
                  <button
                    onClick={handleTargetClick}
                    style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FF001E] text-white shadow-lg flex items-center justify-center animate-ping cursor-pointer"
                  >
                    🎯
                  </button>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                    <Target className="w-12 h-12 text-[#1E3C65]" />
                    <p className="text-xs text-[#6B7280]">
                      {targetTimer === 0
                        ? `Time up! You caught ${targetScore} targets!`
                        : 'Ready to test your reaction time and visual attention?'}
                    </p>
                    <button
                      onClick={startFocusTargetGame}
                      className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold cursor-pointer"
                    >
                      {targetTimer === 0 ? 'Play Again' : 'Start Target Run'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. NUMBER SEQUENCE */}
          {activeGame === 'numbers' && (
            <div className="text-center space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#010313]">Number Sequence Rush</h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Click the numbers in ascending order: Next expected: <span className="font-extrabold text-[#FF001E]">{nextExpectedNumber}</span>
                </p>
              </div>

              {sequenceWon ? (
                <div className="p-6 rounded-2xl bg-[#FCEBE5]/50 border border-[#FF001E]/20 space-y-3">
                  <span className="text-4xl">⚡</span>
                  <h4 className="text-lg font-extrabold text-[#010313]">Sequence Perfect!</h4>
                  <p className="text-xs text-[#6B7280]">
                    Great working memory and number sequencing speed. +20 Bloom points awarded!
                  </p>
                  <button
                    onClick={initSequenceGame}
                    className="px-5 py-2.5 rounded-xl bg-[#FF001E] text-white text-xs font-bold cursor-pointer"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {sequenceNumbers.map((num) => {
                    const isPassed = num < nextExpectedNumber;
                    return (
                      <button
                        key={num}
                        onClick={() => handleSequenceClick(num)}
                        disabled={isPassed}
                        className={`h-16 rounded-2xl text-xl font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                          isPassed
                            ? 'bg-[#E5E7EB] opacity-30 text-[#9CA3AF]'
                            : 'bg-[#F8F8FA] border border-[#E5E7EB] hover:border-[#FF001E] text-[#010313]'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. WORD SCRAMBLE */}
          {activeGame === 'word' && (
            <div className="text-center space-y-5 max-w-sm mx-auto">
              <div>
                <h3 className="text-xl font-extrabold text-[#010313]">Word Bloom</h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Hint: {scrambleWords[wordIndex % scrambleWords.length].hint}
                </p>
              </div>

              <div className="p-4 bg-[#F8F8FA] rounded-2xl border border-[#E5E7EB]">
                <span className="text-2xl font-extrabold tracking-widest text-[#1E3C65]">
                  {scrambled}
                </span>
              </div>

              <form onSubmit={handleWordSubmit} className="space-y-3">
                <input
                  type="text"
                  value={userWordGuess}
                  onChange={(e) => setUserWordGuess(e.target.value.toUpperCase())}
                  placeholder="Type word..."
                  className="w-full text-center text-sm font-bold p-2.5 rounded-xl border border-[#E5E7EB] uppercase tracking-wider focus:outline-none focus:border-[#1E3C65]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF001E] text-white text-xs font-bold cursor-pointer"
                >
                  Submit Answer
                </button>
              </form>

              {wordFeedback && (
                <div className="text-xs font-bold text-[#1E3C65] p-2 bg-[#FCEBE5] rounded-xl">
                  {wordFeedback}
                </div>
              )}

              <button
                onClick={() => {
                  setWordIndex(i => i + 1);
                  initScrambleGame();
                }}
                className="text-xs text-[#6B7280] hover:text-[#010313] underline cursor-pointer"
              >
                Next Word →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Directory Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'memory',
              title: 'Memory Match',
              desc: 'Flip cards and find pairs. Boosts short-term visual working memory.',
              category: 'Memory & Focus',
              icon: Brain,
              initFn: initMemoryGame,
            },
            {
              id: 'focus',
              title: 'Focus Target Tracker',
              desc: 'Rapid target recognition game for sustained visual attention.',
              category: 'Self-Regulation',
              icon: Target,
              initFn: () => {
                setTargetTimer(15);
                setTargetScore(0);
                setTargetGameActive(false);
              },
            },
            {
              id: 'numbers',
              title: 'Number Sequence Rush',
              desc: 'Order numbers sequentially. Enhances cognitive processing speed.',
              category: 'Logic & Math',
              icon: Hash,
              initFn: initSequenceGame,
            },
            {
              id: 'word',
              title: 'Word Bloom',
              desc: 'Unscramble mixed letters to reveal science and space vocabulary.',
              category: 'Reading & Vocab',
              icon: Type,
              initFn: initScrambleGame,
            },
          ].map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-white rounded-3xl p-6 border border-[#F0F0F3] hover:border-[#1E3C65]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-[#FCEBE5] text-[#FF001E] w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-1">
                    {game.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#010313] mb-2">{game.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{game.desc}</p>
                </div>

                <button
                  onClick={() => {
                    game.initFn();
                    setActiveGame(game.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#010313] hover:bg-[#FF001E] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Play Game →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
