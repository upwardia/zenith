import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { MockAPI } from '../../api/mock';
import { Milestone } from '../../types';
import { clsx } from 'clsx';
import { Trophy, Lock, CheckCircle, HelpCircle } from 'lucide-react-native';

export const ProgressScreen = () => {
  const { data: milestones, isLoading, refetch } = useQuery({
    queryKey: ['milestones'],
    queryFn: MockAPI.getMilestones,
  });

  const completedCount = milestones?.filter(m => m.status === 'completed').length || 0;
  const totalCount = milestones?.length || 0;

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Progress</Text>
          <Text className="text-gray-500">Track your achievements</Text>
        </View>

        {/* Summary Card */}
        <Card className="mb-6 bg-white shadow-sm p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-lg text-gray-900">Milestones</Text>
            <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
              <Trophy size={16} color="#16a34a" />
              <Text className="text-green-700 font-bold ml-1">{completedCount} / {totalCount}</Text>
            </View>
          </View>
          
          <View className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <View 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }} 
            />
          </View>
          <Text className="text-gray-500 text-sm">
            You're making great progress! Keep going.
          </Text>
        </Card>

        {/* How it works */}
        <View className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
          <View className="flex-row items-center mb-2">
            <HelpCircle size={18} color="#2563eb" />
            <Text className="font-bold text-blue-700 ml-2">How it works</Text>
          </View>
          <Text className="text-blue-600 text-sm mb-1">• Complete daily missions to earn points</Text>
          <Text className="text-blue-600 text-sm mb-1">• Maintain your streak to unlock bonuses</Text>
          <Text className="text-blue-600 text-sm">• Reach milestones to level up</Text>
        </View>

        {/* Milestones List */}
        <Text className="text-xl font-bold text-gray-900 mb-4">Your Milestones</Text>
        <View className="gap-4 pb-20">
          {milestones?.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </View>

        {/* Support */}
        <Card className="mb-8 items-center p-6 bg-gray-100">
          <Text className="font-bold text-gray-700 mb-1">Questions about your progress?</Text>
          <Text className="text-orange-500 font-medium">Contact Support</Text>
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const MilestoneCard = ({ milestone }: { milestone: Milestone }) => {
  const isLocked = milestone.status === 'locked';
  const isCompleted = milestone.status === 'completed';
  const progress = Math.min((milestone.current / milestone.target) * 100, 100);

  return (
    <Card className={clsx("p-4", isLocked && "opacity-60 bg-gray-50")}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-4">
          <Text className={clsx("font-bold text-base mb-1", isCompleted ? "text-green-700" : "text-gray-900")}>
            {milestone.title}
          </Text>
          {isLocked ? (
            <Text className="text-xs text-gray-500">Complete previous milestones to unlock</Text>
          ) : (
            <Text className="text-xs text-gray-500">
              {milestone.current} / {milestone.target} {milestone.type === 'streak' ? 'days' : 'points'}
            </Text>
          )}
        </View>
        {isCompleted ? (
          <CheckCircle size={24} color="#16a34a" />
        ) : isLocked ? (
          <Lock size={24} color="#9ca3af" />
        ) : (
          <View className="w-6 h-6 rounded-full border-2 border-orange-200" />
        )}
      </View>

      {!isLocked && !isCompleted && (
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View 
            className="h-full bg-orange-500 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </View>
      )}
    </Card>
  );
};
