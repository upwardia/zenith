import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { MockAPI } from '../../api/mock';
import { MissionCategory, Mission } from '../../types';
import { clsx } from 'clsx';
import { CheckCircle, Clock, Zap, Brain, Heart, Wallet } from 'lucide-react-native';

const CATEGORIES: MissionCategory[] = ['Health', 'Money', 'Mind'];

export const MissionsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory>('Health');

  const { data: missions } = useQuery({
    queryKey: ['missions'], // Reusing missions query for simplicity, though ideally separate library
    queryFn: MockAPI.getMissions,
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: MockAPI.getUser,
  });

  const filteredMissions = missions?.filter(m => m.category === selectedCategory) || [];

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Missions</Text>
        <Text className="text-gray-500">Complete missions to earn points</Text>
      </View>

      {/* Summary Cards */}
      <View className="flex-row gap-3 mb-6">
        <SummaryCard 
          label="Completed" 
          value={user?.missionsDone.toString() || '0'} 
          icon={<CheckCircle size={16} color="#16a34a" />} 
          color="bg-green-50 text-green-700"
        />
        <SummaryCard 
          label="Points" 
          value={user?.totalPoints.toString() || '0'} 
          icon={<Zap size={16} color="#eab308" />} 
          color="bg-yellow-50 text-yellow-700"
        />
        <SummaryCard 
          label="Streak" 
          value={`${user?.dayStreak}d`} 
          icon={<FlameIcon />} 
          color="bg-orange-50 text-orange-700"
        />
      </View>

      {/* Category Tabs */}
      <View className="flex-row mb-6 bg-gray-200 p-1 rounded-xl">
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={clsx(
              "flex-1 py-2 items-center rounded-lg",
              selectedCategory === cat ? "bg-white shadow-sm" : ""
            )}
          >
            <Text className={clsx("font-medium", selectedCategory === cat ? "text-gray-900" : "text-gray-500")}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mission List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-20">
        <View className="gap-4">
          {filteredMissions.map((mission) => (
            <LibraryMissionCard key={mission.id} mission={mission} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const SummaryCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => (
  <View className={clsx("flex-1 p-3 rounded-xl items-center justify-center", color.split(' ')[0])}>
    <View className="flex-row items-center mb-1">
      {icon}
      <Text className={clsx("font-bold ml-1", color.split(' ')[1])}>{value}</Text>
    </View>
    <Text className="text-xs text-gray-500 font-medium">{label}</Text>
  </View>
);

const LibraryMissionCard = ({ mission }: { mission: Mission }) => {
  const getIcon = () => {
    switch (mission.category) {
      case 'Health': return <Heart size={20} color="#ef4444" />;
      case 'Money': return <Wallet size={20} color="#22c55e" />;
      case 'Mind': return <Brain size={20} color="#3b82f6" />;
      default: return <Zap size={20} color="#f97316" />;
    }
  };

  return (
    <Card className="flex-row items-center p-4">
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
        {getIcon()}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-900 text-base mb-1">{mission.title}</Text>
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-3">
            <Clock size={12} color="#6b7280" />
            <Text className="text-xs text-gray-500 ml-1">{mission.durationMin} min</Text>
          </View>
          <View className="bg-orange-100 px-2 py-0.5 rounded-full">
            <Text className="text-xs font-bold text-orange-600">+{mission.points} pts</Text>
          </View>
        </View>
      </View>
      <View className={clsx(
        "px-2 py-1 rounded-lg",
        mission.difficulty === 'Easy' ? "bg-green-100" : mission.difficulty === 'Medium' ? "bg-yellow-100" : "bg-red-100"
      )}>
        <Text className={clsx(
          "text-xs font-medium",
          mission.difficulty === 'Easy' ? "text-green-700" : mission.difficulty === 'Medium' ? "text-yellow-700" : "text-red-700"
        )}>
          {mission.difficulty}
        </Text>
      </View>
    </Card>
  );
};

const FlameIcon = () => <Text>🔥</Text>;
