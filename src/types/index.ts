export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'ADMIN';
  created_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  date_of_birth: string;
  age: number;
  gender?: string;
  interests: string[];
  strengths: string[];
  learning_preferences: string[];
  bloom_points: number;
  learning_streak: number;
  avatar_color: string;
  avatar_url?: string;
  created_at: string;
}

export interface ActivityStep {
  step_number: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Science' | 'Mathematics' | 'Reading' | 'Creativity' | 'Focus' | 'Memory' | 'Calm' | 'Interactive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recommended_age: [number, number];
  duration: number;
  content: {
    overview: string;
    learning_goals: string[];
    steps: ActivityStep[];
    discussion_prompts: string[];
  };
  tags: string[];
  pedagogical_styles: string[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  recommended_age: [number, number];
  description: string;
  question_count?: number;
  questions?: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  child_id: string;
  quiz_id: string;
  quiz_title: string;
  category: string;
  score: number;
  total_questions: number;
  time_taken: number;
  answers: { question_id: string; selected_index: number; is_correct: boolean; explanation?: string }[];
  created_at: string;
}

export interface ActivitySession {
  id: string;
  child_id: string;
  activity_id: string;
  activity_title: string;
  category: string;
  duration: number;
  completion_status: 'completed' | 'in_progress' | 'paused';
  engagement_level: 'High' | 'Medium' | 'Low';
  created_at: string;
}

export interface ParentObservation {
  id: string;
  child_id: string;
  session_id?: string;
  activity_title: string;
  observation: 'Very engaged' | 'Engaged' | 'Neutral' | 'Needed support';
  engagement_level: 'Very High' | 'High' | 'Moderate' | 'Supportive';
  notes: string;
  created_at: string;
}

export interface Recommendation {
  activity_id: string;
  activity_name: string;
  category: string;
  score: number;
  match_breakdown: {
    age_match: number;
    interest_match: number;
    preference_match: number;
    performance_match: number;
    freshness: number;
  };
  reason: string;
}

export interface ProgressPrediction {
  status: string;
  message?: string;
  predicted_next_performance?: number;
  trend?: 'Improving' | 'Steady' | 'Consolidating';
  trend_description?: string;
  velocity?: number;
  confidence?: 'High' | 'Moderate' | 'Initial';
  sample_size?: number;
  feature_contributions?: {
    factor: string;
    weight: string;
    impact: string;
  }[];
}

export interface ProgressData {
  child: {
    id: string;
    name: string;
    age: number;
    bloom_points: number;
    learning_streak: number;
  };
  metrics: {
    learning_progress: number;
    activities_completed: number;
    quiz_attempts: number;
    average_score: number;
    completion_rate: number;
    average_session_duration: number;
    total_games_played: number;
    bloom_points: number;
  };
  charts: {
    quiz_score_trend: { date: string; score: number; quiz: string }[];
    activity_participation: { day: string; sessions: number; minutes: number }[];
    category_performance: { category: string; score: number }[];
  };
}

export interface GameRecord {
  id: string;
  child_id: string;
  game_id: string;
  game_category: string;
  game_title: string;
  score: number;
  level: number;
  time_taken: number;
  attempts: number;
  completion_status: string;
  engagement_level: string;
  played_at: string;
}
