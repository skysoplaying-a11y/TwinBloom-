/**
 * TwinBloom Relational Seed Data & Types
 * Pre-populated for instant high-fidelity demonstration
 */

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'PARENT' | 'ADMIN';
  created_at: string;
}

export interface ChildRecord {
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

export interface ActivityRecord {
  id: string;
  title: string;
  description: string;
  category: 'Science' | 'Mathematics' | 'Reading' | 'Creativity' | 'Focus' | 'Memory' | 'Calm' | 'Interactive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recommended_age: [number, number];
  duration: number; // minutes
  content: {
    overview: string;
    learning_goals: string[];
    steps: { step_number: number; title: string; instruction: string; tip?: string }[];
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

export interface QuizRecord {
  id: string;
  title: string;
  category: 'Science' | 'Mathematics' | 'Reading' | 'Creativity' | 'Logic' | 'Nature';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recommended_age: [number, number];
  description: string;
  questions: QuizQuestion[];
}

export interface QuizResultRecord {
  id: string;
  child_id: string;
  quiz_id: string;
  quiz_title: string;
  category: string;
  score: number;
  total_questions: number;
  time_taken: number; // seconds
  answers: { question_id: string; selected_index: number; is_correct: boolean }[];
  created_at: string;
}

export interface ActivitySessionRecord {
  id: string;
  child_id: string;
  activity_id: string;
  activity_title: string;
  category: string;
  duration: number; // minutes
  completion_status: 'completed' | 'in_progress' | 'paused';
  engagement_level: 'High' | 'Medium' | 'Low';
  created_at: string;
}

export interface ObservationRecord {
  id: string;
  child_id: string;
  session_id?: string;
  activity_title: string;
  observation: 'Very engaged' | 'Engaged' | 'Neutral' | 'Needed support';
  engagement_level: 'Very High' | 'High' | 'Moderate' | 'Supportive';
  notes: string;
  created_at: string;
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
  completion_status: 'completed' | 'in_progress';
  engagement_level: string;
  played_at: string;
}

export interface RecommendationRecord {
  id: string;
  child_id: string;
  activity_id: string;
  activity_name: string;
  category: string;
  score: number;
  reason: string;
  match_breakdown: {
    age_match: number;
    interest_match: number;
    preference_match: number;
    performance_match: number;
    freshness: number;
  };
  created_at: string;
}

// Fixed salt & hashed passwords for demo accounts
// "bloom123" and "admin123"
export const DEMO_USERS: UserRecord[] = [
  {
    id: 'user_parent_01',
    name: 'Dr. Eleanor Vance',
    email: 'parent@twinbloom.app',
    password_hash: 'bloom123', // Server will verify either direct match or hashed
    role: 'PARENT',
    created_at: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'user_admin_01',
    name: 'Sarah Chen (Admin)',
    email: 'admin@twinbloom.app',
    password_hash: 'admin123',
    role: 'ADMIN',
    created_at: '2026-01-01T08:00:00.000Z'
  }
];

export const DEMO_CHILDREN: ChildRecord[] = [
  {
    id: 'child_leo_01',
    parent_id: 'user_parent_01',
    name: 'Leo Vance',
    date_of_birth: '2018-05-14',
    age: 8,
    gender: 'Male',
    interests: ['Space', 'Science', 'Technology', 'Mathematics'],
    strengths: ['Creativity', 'Problem solving', 'Logical thinking'],
    learning_preferences: ['Visual', 'Interactive', 'Games'],
    bloom_points: 340,
    learning_streak: 5,
    avatar_color: '#1E3C65',
    avatar_url: 'https://i.ibb.co/99rRhMgJ/151308084-1789448969311573.jpg',
    created_at: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'child_maya_02',
    parent_id: 'user_parent_01',
    name: 'Maya Vance',
    date_of_birth: '2020-09-22',
    age: 6,
    gender: 'Female',
    interests: ['Nature', 'Art', 'Reading', 'Music'],
    strengths: ['Communication', 'Memory', 'Creativity'],
    learning_preferences: ['Hands-on', 'Visual', 'Interactive'],
    bloom_points: 210,
    learning_streak: 3,
    avatar_color: '#FF001E',
    avatar_url: 'https://i.ibb.co/99rRhMgJ/151308084-1789448969311573.jpg',
    created_at: '2026-02-01T10:00:00.000Z'
  }
];

export const DEMO_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act_01',
    title: 'Solar System Planetary Explorer',
    description: 'Investigate orbital scales, planetary compositions, and gravitational weight differences across our solar system.',
    category: 'Science',
    difficulty: 'Intermediate',
    recommended_age: [7, 11],
    duration: 20,
    content: {
      overview: 'An interactive exploration where children simulate planetary orbits and compare environmental conditions on Mars and Jupiter.',
      learning_goals: [
        'Understand relative distances from the Sun',
        'Recognize gas giants vs terrestrial rocky planets',
        'Relate gravity to planetary mass'
      ],
      steps: [
        {
          step_number: 1,
          title: 'Mapping the Inner Planets',
          instruction: 'Lay out Mercury, Venus, Earth, and Mars in sequential orbital paths using household items or digital markers.',
          tip: 'Ask: Why are inner planets solid rock while outer planets are primarily gas?'
        },
        {
          step_number: 2,
          title: 'The Asteroid Belt Divider',
          instruction: 'Place a barrier between Mars and Jupiter representing Ceres and the asteroid belt.',
          tip: 'Explain how Jupiter’s gravity prevented asteroids from coalescing into a planet.'
        },
        {
          step_number: 3,
          title: 'Gravitational Weight Jump',
          instruction: 'Calculate how high a jump would be on the Moon (6x higher) versus Jupiter (heavy pull).',
          tip: 'Encourage physical enactment with jumping on the spot!'
        }
      ],
      discussion_prompts: [
        'Which planet would you most like a robotic rover to explore next and why?',
        'How does Earth’s atmosphere protect living organisms compared to Mars?'
      ]
    },
    tags: ['Space', 'Science', 'Planets', 'Physics', 'Exploration'],
    pedagogical_styles: ['Visual', 'Interactive', 'Games']
  },
  {
    id: 'act_02',
    title: 'Fractal Nature & Geometric Patterns',
    description: 'Discover how spirals in sunflowers, tree branching, and pinecones reveal Fibonacci numerical sequences.',
    category: 'Mathematics',
    difficulty: 'Intermediate',
    recommended_age: [6, 10],
    duration: 18,
    content: {
      overview: 'Connecting real-world botanical wonders with early arithmetic and spatial pattern recognition.',
      learning_goals: [
        'Observe recurring patterns in natural botanicals',
        'Practice counting and sequence addition (1, 1, 2, 3, 5, 8)',
        'Foster curiosity in mathematical modeling'
      ],
      steps: [
        {
          step_number: 1,
          title: 'Counting Spirals',
          instruction: 'Examine the photo of a sunflower seed head or pinecone and trace clockwise spirals.',
          tip: 'Count the spirals going in both directions—they often equal consecutive Fibonacci numbers.'
        },
        {
          step_number: 2,
          title: 'Tree Branching Challenge',
          instruction: 'Draw a tree trunk that splits into 2 limbs, and each limb into 3 smaller twigs.',
          tip: 'Notice how nature repeats efficient structural formulas.'
        }
      ],
      discussion_prompts: [
        'Where else in your room or backyard can you spot repeating symmetrical patterns?'
      ]
    },
    tags: ['Mathematics', 'Geometry', 'Nature', 'Patterns', 'Logic'],
    pedagogical_styles: ['Visual', 'Hands-on', 'Interactive']
  },
  {
    id: 'act_03',
    title: 'Story Architect & Emotion Detective',
    description: 'Read an illustrated micro-narrative, identify character motives, and design an alternative creative resolution.',
    category: 'Reading',
    difficulty: 'Beginner',
    recommended_age: [5, 9],
    duration: 15,
    content: {
      overview: 'Develops deep reading comprehension, perspective taking, and vocabulary through creative scenario reconstruction.',
      learning_goals: [
        'Infer feelings from character dialogue and subtle cues',
        'Formulate alternative plot climaxes using original vocabulary',
        'Strengthen verbal articulation'
      ],
      steps: [
        {
          step_number: 1,
          title: 'Active Listening & Character Mapping',
          instruction: 'Read the short fable of the Whispering Willow Tree together and highlight feeling words.',
          tip: 'Pause on descriptive adjectives: solemn, ecstatic, perplex.'
        },
        {
          step_number: 2,
          title: 'The Branching Decision Point',
          instruction: 'Stop before the ending: what choice would you make if you were the main protagonist?',
          tip: 'Praise thoughtful reasoning over speed.'
        }
      ],
      discussion_prompts: [
        'Have you ever felt similarly misunderstood like the protagonist? How did you communicate?'
      ]
    },
    tags: ['Reading', 'Communication', 'Emotion', 'Storytelling', 'Creativity'],
    pedagogical_styles: ['Reading', 'Interactive', 'Visual']
  },
  {
    id: 'act_04',
    title: 'Circuit Builder: Code the Lighthouse',
    description: 'Learn logic gates and foundational algorithmic thinking by lighting up an ocean lighthouse sequence.',
    category: 'Interactive',
    difficulty: 'Advanced',
    recommended_age: [8, 12],
    duration: 25,
    content: {
      overview: 'An engaging computational challenge introducing IF-THEN conditions, loops, and electrical circuit safety concepts.',
      learning_goals: [
        'Grasp sequential instruction execution',
        'Understand conditional logic (IF night THEN flash beacon)',
        'Troubleshoot logic bugs with patience'
      ],
      steps: [
        {
          step_number: 1,
          title: 'The Lighthouse Keeper’s Code',
          instruction: 'Write 3 clear instructions on cards: 1. Check fog, 2. Spin reflector, 3. Sound horn every 10s.',
          tip: 'Ask: What happens if step 2 is skipped?'
        },
        {
          step_number: 2,
          title: 'Simulating the Bug',
          instruction: 'Swap the order of instructions and predict why the imaginary ship gets confused.',
          tip: 'Connect this to how computers require strict logical order.'
        }
      ],
      discussion_prompts: [
        'What machines in our kitchen use sensors and IF-THEN logic? (e.g. Microwave, refrigerator buzzer)'
      ]
    },
    tags: ['Technology', 'Logic', 'Coding', 'Problem solving', 'Interactive'],
    pedagogical_styles: ['Interactive', 'Games', 'Hands-on']
  },
  {
    id: 'act_05',
    title: 'Botanical Seed Germination Lab',
    description: 'Track how moisture, light, and soil chemistry stimulate radicle emergence and green photosynthesis.',
    category: 'Science',
    difficulty: 'Beginner',
    recommended_age: [5, 9],
    duration: 15,
    content: {
      overview: 'A hands-on biological observation activity encouraging daily scientific journaling and hypothesis testing.',
      learning_goals: [
        'Identify seed coat, embryo, and food store',
        'Observe phototropism (plants leaning toward windows)',
        'Practice daily scientific measurement'
      ],
      steps: [
        {
          step_number: 1,
          title: 'The Wet Paper Towel Hatchery',
          instruction: 'Place a bean seed against clear glass inside a damp folded paper towel.',
          tip: 'Label the date and predict which day the root will break out.'
        }
      ],
      discussion_prompts: [
        'Why does the root always grow downward while the shoot grows upward?'
      ]
    },
    tags: ['Science', 'Nature', 'Biology', 'Observation'],
    pedagogical_styles: ['Hands-on', 'Visual']
  },
  {
    id: 'act_06',
    title: 'Memory Constellation Mapper',
    description: 'Memorize star groupings in Ursa Major and Cassiopeia, then reproduce the constellations from working memory.',
    category: 'Memory',
    difficulty: 'Intermediate',
    recommended_age: [7, 11],
    duration: 15,
    content: {
      overview: 'Enhances working memory, spatial orientation, and celestial navigation through pattern memorization.',
      learning_goals: [
        'Recall 5 to 7 point geometric star patterns',
        'Apply chunking strategies for memory retention',
        'Appreciate ancient navigational methods'
      ],
      steps: [
        {
          step_number: 1,
          title: 'Observe for 30 Seconds',
          instruction: 'Study the constellation shape, counting lines and vertex points.',
          tip: 'Group the points into familiar shapes like a ladle or the letter W.'
        },
        {
          step_number: 2,
          title: 'Draw From Mind’s Eye',
          instruction: 'Cover the prompt and sketch the star points on plain paper.',
          tip: 'Count your stars to verify accuracy.'
        }
      ],
      discussion_prompts: [
        'What mnemonic did you invent in your head to remember where the tail points?'
      ]
    },
    tags: ['Memory', 'Space', 'Focus', 'Patterns'],
    pedagogical_styles: ['Visual', 'Interactive']
  }
];

export const DEMO_QUIZZES: QuizRecord[] = [
  {
    id: 'quiz_01',
    title: 'Cosmic Wonders & Solar System Quest',
    category: 'Science',
    difficulty: 'Intermediate',
    recommended_age: [7, 12],
    description: 'Test your understanding of planetary orbits, solar flares, and celestial physics.',
    questions: [
      {
        id: 'q1_1',
        quiz_id: 'quiz_01',
        question: 'Which celestial body in our solar system possesses the greatest gravitational pull?',
        options: ['Jupiter', 'The Sun', 'Earth', 'Saturn'],
        correct_answer: 1,
        explanation: 'The Sun contains 99.8% of the total mass in the Solar System, generating the dominant gravitational force that holds all planets in orbit.'
      },
      {
        id: 'q1_2',
        quiz_id: 'quiz_01',
        question: 'Why does Mars appear reddish-orange through telescopes and orbiters?',
        options: ['High atmospheric heat', 'Iron oxide (rust) on its surface', 'Reflected sunlight from volcanic lava', 'Red clouds of helium'],
        correct_answer: 1,
        explanation: 'Mars is blanketed by regolith and rocks rich in iron oxide—commonly known as rust—giving it a distinctive reddish hue.'
      },
      {
        id: 'q1_3',
        quiz_id: 'quiz_01',
        question: 'What is situated between the orbital paths of Mars and Jupiter?',
        options: ['The Kuiper Belt', 'The Main Asteroid Belt', 'Oort Cloud', 'A secondary Sun'],
        correct_answer: 1,
        explanation: 'The Main Asteroid Belt resides between Mars and Jupiter, containing millions of rocky remnants including the dwarf planet Ceres.'
      },
      {
        id: 'q1_4',
        quiz_id: 'quiz_01',
        question: 'How long does light emitted from the Sun take to reach our eyes on Earth?',
        options: ['Instantaneously (0 seconds)', 'About 8 minutes and 20 seconds', '24 hours', '1 month'],
        correct_answer: 1,
        explanation: 'Traveling at 300,000 km per second across approximately 150 million kilometers, sunlight takes roughly 8 minutes and 20 seconds to reach Earth.'
      }
    ]
  },
  {
    id: 'quiz_02',
    title: 'Mathematical Patterns & Logic Quest',
    category: 'Mathematics',
    difficulty: 'Intermediate',
    recommended_age: [7, 11],
    description: 'Solve sequence challenges, symmetry puzzles, and real-world number deductions.',
    questions: [
      {
        id: 'q2_1',
        quiz_id: 'quiz_02',
        question: 'What is the next number in this sequence: 3, 6, 12, 24, ___?',
        options: ['30', '36', '48', '52'],
        correct_answer: 2,
        explanation: 'Each number is multiplied by 2 (doubled). 24 x 2 = 48.'
      },
      {
        id: 'q2_2',
        quiz_id: 'quiz_02',
        question: 'If a triangle has two sides that are equal in length, what kind of triangle is it called?',
        options: ['Equilateral', 'Scalene', 'Isosceles', 'Right-angled'],
        correct_answer: 2,
        explanation: 'An isosceles triangle has at least two sides of equal length and two equal interior angles.'
      },
      {
        id: 'q2_3',
        quiz_id: 'quiz_02',
        question: 'Maya has 4 baskets. Each basket contains 7 apples. How many apples does Maya have in total?',
        options: ['21', '24', '28', '32'],
        correct_answer: 2,
        explanation: '4 baskets multiplied by 7 apples equals 28 apples in total (4 x 7 = 28).'
      },
      {
        id: 'q2_4',
        quiz_id: 'quiz_02',
        question: 'Which geometric shape has exactly 6 vertices and 6 straight sides?',
        options: ['Pentagon', 'Hexagon', 'Octagon', 'Decagon'],
        correct_answer: 1,
        explanation: 'A hexagon has 6 straight sides and 6 vertices (corners).'
      }
    ]
  },
  {
    id: 'quiz_03',
    title: 'Ecosystems & Biodiversity Explorers',
    category: 'Nature',
    difficulty: 'Beginner',
    recommended_age: [6, 10],
    description: 'Understand how plants, pollinators, and animal food webs sustain life on our planet.',
    questions: [
      {
        id: 'q3_1',
        quiz_id: 'quiz_03',
        question: 'What gas do green plants absorb from the air during photosynthesis to produce energy?',
        options: ['Oxygen', 'Carbon dioxide', 'Helium', 'Nitrogen'],
        correct_answer: 1,
        explanation: 'Plants absorb carbon dioxide from the atmosphere and release fresh oxygen that animals breathe.'
      },
      {
        id: 'q3_2',
        quiz_id: 'quiz_03',
        question: 'Which animal is known as a vital pollinator that helps flowering plants produce fruit and seeds?',
        options: ['Honeybee', 'Mole', 'Earthworm', 'Pelican'],
        correct_answer: 0,
        explanation: 'Honeybees transfer pollen between flowers as they gather nectar, enabling plants to reproduce.'
      },
      {
        id: 'q3_3',
        quiz_id: 'quiz_03',
        question: 'What do we call animals that eat only plants, seeds, and fruits?',
        options: ['Carnivores', 'Herbivores', 'Omnivores', 'Insectivores'],
        correct_answer: 1,
        explanation: 'Herbivores are organisms anatomically adapted to consume autotrophic plant matter.'
      }
    ]
  }
];

export const DEMO_QUIZ_RESULTS: QuizResultRecord[] = [
  {
    id: 'qr_01',
    child_id: 'child_leo_01',
    quiz_id: 'quiz_01',
    quiz_title: 'Cosmic Wonders & Solar System Quest',
    category: 'Science',
    score: 3,
    total_questions: 4,
    time_taken: 112,
    answers: [
      { question_id: 'q1_1', selected_index: 1, is_correct: true },
      { question_id: 'q1_2', selected_index: 1, is_correct: true },
      { question_id: 'q1_3', selected_index: 0, is_correct: false },
      { question_id: 'q1_4', selected_index: 1, is_correct: true }
    ],
    created_at: '2026-03-01T14:20:00.000Z'
  },
  {
    id: 'qr_02',
    child_id: 'child_leo_01',
    quiz_id: 'quiz_02',
    quiz_title: 'Mathematical Patterns & Logic Quest',
    category: 'Mathematics',
    score: 4,
    total_questions: 4,
    time_taken: 95,
    answers: [
      { question_id: 'q2_1', selected_index: 2, is_correct: true },
      { question_id: 'q2_2', selected_index: 2, is_correct: true },
      { question_id: 'q2_3', selected_index: 2, is_correct: true },
      { question_id: 'q2_4', selected_index: 1, is_correct: true }
    ],
    created_at: '2026-03-05T16:10:00.000Z'
  },
  {
    id: 'qr_03',
    child_id: 'child_leo_01',
    quiz_id: 'quiz_01',
    quiz_title: 'Cosmic Wonders & Solar System Quest',
    category: 'Science',
    score: 4,
    total_questions: 4,
    time_taken: 84,
    answers: [
      { question_id: 'q1_1', selected_index: 1, is_correct: true },
      { question_id: 'q1_2', selected_index: 1, is_correct: true },
      { question_id: 'q1_3', selected_index: 1, is_correct: true },
      { question_id: 'q1_4', selected_index: 1, is_correct: true }
    ],
    created_at: '2026-03-10T11:45:00.000Z'
  },
  {
    id: 'qr_04',
    child_id: 'child_maya_02',
    quiz_id: 'quiz_03',
    quiz_title: 'Ecosystems & Biodiversity Explorers',
    category: 'Nature',
    score: 3,
    total_questions: 3,
    time_taken: 104,
    answers: [
      { question_id: 'q3_1', selected_index: 1, is_correct: true },
      { question_id: 'q3_2', selected_index: 0, is_correct: true },
      { question_id: 'q3_3', selected_index: 1, is_correct: true }
    ],
    created_at: '2026-03-08T15:30:00.000Z'
  }
];

export const DEMO_SESSIONS: ActivitySessionRecord[] = [
  {
    id: 'sess_01',
    child_id: 'child_leo_01',
    activity_id: 'act_01',
    activity_title: 'Solar System Planetary Explorer',
    category: 'Science',
    duration: 22,
    completion_status: 'completed',
    engagement_level: 'High',
    created_at: '2026-03-09T14:00:00.000Z'
  },
  {
    id: 'sess_02',
    child_id: 'child_leo_01',
    activity_id: 'act_04',
    activity_title: 'Circuit Builder: Code the Lighthouse',
    category: 'Interactive',
    duration: 25,
    completion_status: 'completed',
    engagement_level: 'High',
    created_at: '2026-03-07T16:30:00.000Z'
  },
  {
    id: 'sess_03',
    child_id: 'child_leo_01',
    activity_id: 'act_02',
    activity_title: 'Fractal Nature & Geometric Patterns',
    category: 'Mathematics',
    duration: 18,
    completion_status: 'completed',
    engagement_level: 'Medium',
    created_at: '2026-03-04T10:15:00.000Z'
  },
  {
    id: 'sess_04',
    child_id: 'child_maya_02',
    activity_id: 'act_03',
    activity_title: 'Story Architect & Emotion Detective',
    category: 'Reading',
    duration: 16,
    completion_status: 'completed',
    engagement_level: 'High',
    created_at: '2026-03-08T11:00:00.000Z'
  }
];

export const DEMO_OBSERVATIONS: ObservationRecord[] = [
  {
    id: 'obs_01',
    child_id: 'child_leo_01',
    session_id: 'sess_01',
    activity_title: 'Solar System Planetary Explorer',
    observation: 'Very engaged',
    engagement_level: 'Very High',
    notes: 'Leo loved comparing the gravitational weights. He asked multiple self-prompted questions about black holes and solar sails.',
    created_at: '2026-03-09T14:30:00.000Z'
  },
  {
    id: 'obs_02',
    child_id: 'child_leo_01',
    session_id: 'sess_02',
    activity_title: 'Circuit Builder: Code the Lighthouse',
    observation: 'Engaged',
    engagement_level: 'High',
    notes: 'Spent 10 uninterrupted minutes troubleshooting why the beacon did not light up. Showed high resilience when fixing the logic bug.',
    created_at: '2026-03-07T17:00:00.000Z'
  }
];

export const DEMO_GAME_RECORDS: GameRecord[] = [
  {
    id: 'gm_01',
    child_id: 'child_leo_01',
    game_id: 'memory_match',
    game_category: 'Memory',
    game_title: 'Memory Match',
    score: 850,
    level: 3,
    time_taken: 48,
    attempts: 1,
    completion_status: 'completed',
    engagement_level: 'High',
    played_at: '2026-03-10T16:00:00.000Z'
  },
  {
    id: 'gm_02',
    child_id: 'child_leo_01',
    game_id: 'space_explorer',
    game_category: 'Science',
    game_title: 'Space Explorer Quest',
    score: 920,
    level: 4,
    time_taken: 65,
    attempts: 1,
    completion_status: 'completed',
    engagement_level: 'High',
    played_at: '2026-03-11T15:20:00.000Z'
  },
  {
    id: 'gm_03',
    child_id: 'child_leo_01',
    game_id: 'math_sprint',
    game_category: 'Mathematics',
    game_title: 'Math Sprint',
    score: 780,
    level: 2,
    time_taken: 60,
    attempts: 2,
    completion_status: 'completed',
    engagement_level: 'High',
    played_at: '2026-03-12T17:00:00.000Z'
  }
];
