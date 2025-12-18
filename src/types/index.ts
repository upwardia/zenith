export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  totalPoints: number;
  dayStreak: number;
  missionsDone: number;
  dailyPointsGoal: number;
}

export type MissionCategory = 'Health' | 'Money' | 'Mind' | 'Family';

export interface Mission {
  id: string;
  category: MissionCategory;
  title: string;
  durationMin: number;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string; // Lucide icon name
}

export interface DailyMission extends Mission {
  completed: boolean;
  addedToToday?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  delta: number; // positive for earning, negative for spending
}

export interface Reward {
  id: string;
  title: string;
  vendor: string;
  costPoints: number;
}

export type MilestoneStatus = 'locked' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  type: 'points' | 'streak' | 'onboarding';
  target: number;
  current: number;
  status: MilestoneStatus;
}
