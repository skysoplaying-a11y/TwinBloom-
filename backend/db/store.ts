import crypto from 'crypto';
import {
  UserRecord,
  ChildRecord,
  ActivityRecord,
  QuizRecord,
  QuizResultRecord,
  ActivitySessionRecord,
  ObservationRecord,
  GameRecord,
  RecommendationRecord,
  DEMO_USERS,
  DEMO_CHILDREN,
  DEMO_ACTIVITIES,
  DEMO_QUIZZES,
  DEMO_QUIZ_RESULTS,
  DEMO_SESSIONS,
  DEMO_OBSERVATIONS,
  DEMO_GAME_RECORDS,
} from './seedData.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'twinbloom-default-secret-development-key';

export class DataStore {
  users: UserRecord[] = [...DEMO_USERS];
  children: ChildRecord[] = [...DEMO_CHILDREN];
  activities: ActivityRecord[] = [...DEMO_ACTIVITIES];
  quizzes: QuizRecord[] = [...DEMO_QUIZZES];
  quiz_results: QuizResultRecord[] = [...DEMO_QUIZ_RESULTS];
  activity_sessions: ActivitySessionRecord[] = [...DEMO_SESSIONS];
  observations: ObservationRecord[] = [...DEMO_OBSERVATIONS];
  game_records: GameRecord[] = [...DEMO_GAME_RECORDS];
  recommendations: RecommendationRecord[] = [];

  constructor() {
    // Hash demo users passwords if needed
    for (const u of this.users) {
      if (!u.password_hash.includes(':')) {
        u.password_hash = this.hashPassword(u.password_hash);
      }
    }
  }

  // Password hashing with random salt
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, storedHash: string): boolean {
    if (!storedHash.includes(':')) {
      return password === storedHash;
    }
    const [salt, key] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    return key === hash;
  }

  // Pure JWT implementation using HMAC-SHA256
  generateJWT(payload: { userId: string; email: string; role: string; name: string }): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 86400 * 7; // 7 days
    const fullPayload = { ...payload, iat: now, exp };

    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${b64Header}.${b64Payload}`)
      .digest('base64url');

    return `${b64Header}.${b64Payload}.${signature}`;
  }

  verifyJWT(token: string): { userId: string; email: string; role: string; name: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const [b64Header, b64Payload, signature] = parts;

      const expectedSig = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${b64Header}.${b64Payload}`)
        .digest('base64url');

      if (expectedSig !== signature) return null;

      const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  // User Operations
  findUserByEmail(email: string): UserRecord | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): UserRecord | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(name: string, email: string, passwordPlain: string, role: 'PARENT' | 'ADMIN' = 'PARENT'): UserRecord {
    const user: UserRecord = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password_hash: this.hashPassword(passwordPlain),
      role,
      created_at: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  // Children Operations
  getChildrenByParent(parentId: string): ChildRecord[] {
    return this.children.filter(c => c.parent_id === parentId);
  }

  getChildById(id: string): ChildRecord | undefined {
    return this.children.find(c => c.id === id);
  }

  createChild(parentId: string, data: Partial<ChildRecord>): ChildRecord {
    const child: ChildRecord = {
      id: `child_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      parent_id: parentId,
      name: data.name || 'Child',
      date_of_birth: data.date_of_birth || '2019-01-01',
      age: data.age || 7,
      gender: data.gender || 'Not specified',
      interests: data.interests || ['Science', 'Art'],
      strengths: data.strengths || ['Creativity'],
      learning_preferences: data.learning_preferences || ['Visual'],
      bloom_points: 50, // Initial welcoming points
      learning_streak: 1,
      avatar_color: data.avatar_color || '#1E3C65',
      avatar_url: data.avatar_url || 'https://i.ibb.co/99rRhMgJ/151308084-1789448969311573.jpg',
      created_at: new Date().toISOString()
    };
    this.children.push(child);
    return child;
  }

  updateChild(id: string, updates: Partial<ChildRecord>): ChildRecord | undefined {
    const child = this.getChildById(id);
    if (!child) return undefined;
    Object.assign(child, updates);
    return child;
  }

  deleteChild(id: string): boolean {
    const idx = this.children.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.children.splice(idx, 1);
    return true;
  }

  addBloomPoints(childId: string, points: number): number {
    const child = this.getChildById(childId);
    if (!child) return 0;
    child.bloom_points = (child.bloom_points || 0) + points;
    return child.bloom_points;
  }

  // Activities Operations
  getActivities(): ActivityRecord[] {
    return this.activities;
  }

  getActivityById(id: string): ActivityRecord | undefined {
    return this.activities.find(a => a.id === id);
  }

  addActivity(activity: Omit<ActivityRecord, 'id'>): ActivityRecord {
    const act: ActivityRecord = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    };
    this.activities.push(act);
    return act;
  }

  updateActivity(id: string, updates: Partial<ActivityRecord>): ActivityRecord | undefined {
    const act = this.getActivityById(id);
    if (!act) return undefined;
    Object.assign(act, updates);
    return act;
  }

  deleteActivity(id: string): boolean {
    const idx = this.activities.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.activities.splice(idx, 1);
    return true;
  }

  // Quizzes Operations
  getQuizzes(): QuizRecord[] {
    return this.quizzes;
  }

  getQuizById(id: string): QuizRecord | undefined {
    return this.quizzes.find(q => q.id === id);
  }

  addQuiz(quiz: Omit<QuizRecord, 'id'>): QuizRecord {
    const newQuiz: QuizRecord = {
      ...quiz,
      id: `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  deleteQuiz(id: string): boolean {
    const idx = this.quizzes.findIndex(q => q.id === id);
    if (idx === -1) return false;
    this.quizzes.splice(idx, 1);
    return true;
  }

  // Quiz Results
  getQuizResultsByChild(childId: string): QuizResultRecord[] {
    return this.quiz_results
      .filter(qr => qr.child_id === childId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  recordQuizResult(data: Omit<QuizResultRecord, 'id' | 'created_at'>): QuizResultRecord {
    const record: QuizResultRecord = {
      ...data,
      id: `qr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.quiz_results.push(record);
    // Award 40 Bloom Points for completing quiz
    this.addBloomPoints(data.child_id, 40);
    return record;
  }

  // Activity Sessions
  getSessionsByChild(childId: string): ActivitySessionRecord[] {
    return this.activity_sessions.filter(s => s.child_id === childId);
  }

  recordSession(data: Omit<ActivitySessionRecord, 'id' | 'created_at'>): ActivitySessionRecord {
    const record: ActivitySessionRecord = {
      ...data,
      id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.activity_sessions.push(record);
    // Award 25 Bloom Points for completing activity
    if (data.completion_status === 'completed') {
      this.addBloomPoints(data.child_id, 25);
    }
    return record;
  }

  // Observations
  getObservationsByChild(childId: string): ObservationRecord[] {
    return this.observations
      .filter(o => o.child_id === childId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  recordObservation(data: Omit<ObservationRecord, 'id' | 'created_at'>): ObservationRecord {
    const record: ObservationRecord = {
      ...data,
      id: `obs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.observations.push(record);
    return record;
  }

  // Game Records
  getGameRecordsByChild(childId: string): GameRecord[] {
    return this.game_records
      .filter(g => g.child_id === childId)
      .sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime());
  }

  recordGame(data: Omit<GameRecord, 'id' | 'played_at'>): GameRecord {
    const record: GameRecord = {
      ...data,
      id: `gm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      played_at: new Date().toISOString()
    };
    this.game_records.push(record);
    // Award 15 Bloom Points
    this.addBloomPoints(data.child_id, 15);
    return record;
  }

  // Recommendations Cache
  setRecommendations(childId: string, recs: RecommendationRecord[]) {
    this.recommendations = this.recommendations.filter(r => r.child_id !== childId).concat(recs);
  }

  getRecommendations(childId: string): RecommendationRecord[] {
    return this.recommendations.filter(r => r.child_id === childId);
  }
}

export const store = new DataStore();
