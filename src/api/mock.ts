import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mission, DailyMission, Transaction, Reward, Milestone } from '../types';

const STORAGE_KEYS = {
  USER: 'upwardia_user',
  MISSIONS: 'upwardia_missions',
  TRANSACTIONS: 'upwardia_transactions',
  REWARDS: 'upwardia_rewards',
  MILESTONES: 'upwardia_milestones',
};

const SEED_USER: User = {
  id: 'u1',
  name: 'Alex',
  email: 'alex@example.com',
  memberSince: 'Jan 2025',
  totalPoints: 2340,
  dayStreak: 7,
  missionsDone: 142,
  dailyPointsGoal: 100,
};

const SEED_MISSIONS: DailyMission[] = [
  { id: 'm1', category: 'Health', title: 'Morning Walk', durationMin: 15, points: 50, difficulty: 'Easy', icon: 'footprints', completed: true },
  { id: 'm2', category: 'Health', title: 'Drink Water', durationMin: 0, points: 10, difficulty: 'Easy', icon: 'droplet', completed: false },
  { id: 'm3', category: 'Mind', title: 'Meditation', durationMin: 10, points: 30, difficulty: 'Medium', icon: 'brain', completed: false },
  { id: 'm4', category: 'Money', title: 'Check Budget', durationMin: 5, points: 20, difficulty: 'Easy', icon: 'wallet', completed: false },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Daily Login Bonus', date: '2025-12-15T08:00:00Z', delta: 10 },
  { id: 't2', title: 'Morning Walk', date: '2025-12-15T08:30:00Z', delta: 50 },
  { id: 't3', title: 'Starbucks Gift Card', date: '2025-12-14T15:00:00Z', delta: -500 },
];

const SEED_REWARDS: Reward[] = [
  { id: 'r1', title: '$5 Starbucks Card', vendor: 'Starbucks', costPoints: 500 },
  { id: 'r2', title: '$10 Amazon Card', vendor: 'Amazon', costPoints: 1000 },
  { id: 'r3', title: 'Premium Feature Unlock', vendor: 'Upwardia', costPoints: 2000 },
];

const SEED_MILESTONES: Milestone[] = [
  { id: 'ms1', title: '7-Day Streak', type: 'streak', target: 7, current: 7, status: 'completed' },
  { id: 'ms2', title: 'Earn 5,000 Points', type: 'points', target: 5000, current: 2340, status: 'in_progress' },
  { id: 'ms3', title: '30-Day Streak', type: 'streak', target: 30, current: 7, status: 'in_progress' },
  { id: 'ms4', title: '60-Day Streak', type: 'streak', target: 60, current: 7, status: 'locked' },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockAPI = {
  async initialize() {
    const hasData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!hasData) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(SEED_USER));
      await AsyncStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(SEED_MISSIONS));
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
      await AsyncStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(SEED_REWARDS));
      await AsyncStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(SEED_MILESTONES));
    }
  },

  async getUser(): Promise<User> {
    await delay(500);
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : SEED_USER;
  },

  async getMissions(): Promise<DailyMission[]> {
    await delay(500);
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MISSIONS);
    return data ? JSON.parse(data) : SEED_MISSIONS;
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(500);
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : SEED_TRANSACTIONS;
  },

  async getRewards(): Promise<Reward[]> {
    await delay(500);
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REWARDS);
    return data ? JSON.parse(data) : SEED_REWARDS;
  },

  async getMilestones(): Promise<Milestone[]> {
    await delay(500);
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MILESTONES);
    return data ? JSON.parse(data) : SEED_MILESTONES;
  },

  async uncompleteMission(missionId: string): Promise<User> {
    await delay(500);
    const missionsStr = await AsyncStorage.getItem(STORAGE_KEYS.MISSIONS);
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    
    let missions: DailyMission[] = missionsStr ? JSON.parse(missionsStr) : SEED_MISSIONS;
    let user: User = userStr ? JSON.parse(userStr) : SEED_USER;

    const missionIndex = missions.findIndex(m => m.id === missionId);
    if (missionIndex > -1 && missions[missionIndex].completed) {
      missions[missionIndex].completed = false;
      user.totalPoints -= missions[missionIndex].points;
      user.missionsDone -= 1;
      
      // Remove transaction (or add a negative one)
      const transactionsStr = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      let transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
      // For simplicity, we'll add a negative transaction. A more robust solution might remove the original.
      transactions.unshift({
        id: Math.random().toString(36).substr(2, 9),
        title: `Uncompleted: ${missions[missionIndex].title}`,
        date: new Date().toISOString(),
        delta: -missions[missionIndex].points
      });

      await AsyncStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
    return user;
  },

  async completeMission(missionId: string): Promise<User> {
    await delay(500);
    const missionsStr = await AsyncStorage.getItem(STORAGE_KEYS.MISSIONS);
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    
    let missions: DailyMission[] = missionsStr ? JSON.parse(missionsStr) : SEED_MISSIONS;
    let user: User = userStr ? JSON.parse(userStr) : SEED_USER;

    const missionIndex = missions.findIndex(m => m.id === missionId);
    if (missionIndex > -1 && !missions[missionIndex].completed) {
      missions[missionIndex].completed = true;
      user.totalPoints += missions[missionIndex].points;
      user.missionsDone += 1;
      
      // Add transaction
      const transactionsStr = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      let transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
      transactions.unshift({
        id: Math.random().toString(36).substr(2, 9),
        title: missions[missionIndex].title,
        date: new Date().toISOString(),
        delta: missions[missionIndex].points
      });

      await AsyncStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
    return user;
  },

  async redeemReward(rewardId: string): Promise<User> {
    await delay(800);
    const rewardsStr = await AsyncStorage.getItem(STORAGE_KEYS.REWARDS);
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    
    const rewards: Reward[] = rewardsStr ? JSON.parse(rewardsStr) : SEED_REWARDS;
    let user: User = userStr ? JSON.parse(userStr) : SEED_USER;

    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      if (user.totalPoints >= reward.costPoints) {
        user.totalPoints -= reward.costPoints;
        
        // Add transaction
        const transactionsStr = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        let transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
        transactions.unshift({
          id: Math.random().toString(36).substr(2, 9),
          title: reward.title,
          date: new Date().toISOString(),
          delta: -reward.costPoints
        });

        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      } else {
        throw new Error("Insufficient points");
      }
    }
    return user;
  }
};
