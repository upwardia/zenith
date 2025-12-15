import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';
import { Flame, CheckCircle, Circle, Clock } from 'lucide-react-native';
import { clsx } from 'clsx';
import { DailyMission } from '../../types';

export const TodayScreen = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: MockAPI.getUser,
    initialData: user || undefined,
  });

  const { data: missions, isLoading: isLoadingMissions, refetch: refetchMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: MockAPI.getMissions,
  });

  const completeMissionMutation = useMutation({
    mutationFn: MockAPI.completeMission,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.show('Mission completed! Points added.', 'success');
    },
  });

  const onRefresh = async () => {
    await Promise.all([refetchUser(), refetchMissions()]);
  };

  const completedMissions = missions?.filter(m => m.completed).length || 0;
  const totalMissions = missions?.length || 0;
  const progress = totalMissions > 0 ? (completedMissions / totalMissions) : 0;
  const remainingMissions = totalMissions - completedMissions;

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoadingMissions} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">Good morning, {userData?.name}!</Text>
          <Text className="text-gray-500">Let's build on yesterday's momentum</Text>
        </View>

        {/* Progress Card */}
        <Card className="mb-6 bg-white shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-lg text-gray-900">Today's Progress</Text>
            <View className="flex-row items-center bg-orange-100 px-2 py-1 rounded-full">
              <Flame size={16} color="#f97316" />
              <Text className="text-orange-600 font-bold ml-1">{userData?.dayStreak} days</Text>
            </View>
          </View>
          
          <View className="mb-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600 font-medium">
                {userData?.dailyPointsGoal ? Math.min(userData.totalPoints % 1000, userData.dailyPointsGoal) : 0} / {userData?.dailyPointsGoal} points
              </Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <View 
                className="h-full bg-orange-500 rounded-full" 
                style={{ width: `${Math.min((userData?.totalPoints || 0) % 1000 / (userData?.dailyPointsGoal || 100) * 100, 100)}%` }} 
              />
            </View>
          </View>
          
          <Text className="text-gray-500 text-sm">
            {remainingMissions} missions remaining
          </Text>
        </Card>

        {/* Banner */}
        <View className="bg-blue-600 p-4 rounded-2xl mb-6">
          <Text className="text-white font-bold text-lg mb-1">Keep it up!</Text>
          <Text className="text-blue-100">
            You're only 150 points away from your next milestone!
          </Text>
        </View>

        {/* Missions List */}
        <Text className="text-xl font-bold text-gray-900 mb-4">Today's Missions</Text>
        
        <View className="gap-4 pb-8">
          {missions?.map((mission) => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              onComplete={() => completeMissionMutation.mutate(mission.id)}
              isCompleting={completeMissionMutation.isPending && completeMissionMutation.variables === mission.id}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const MissionCard = ({ mission, onComplete, isCompleting }: { mission: DailyMission, onComplete: () => void, isCompleting: boolean }) => {
  return (
    <Card className={clsx("flex-row items-center p-4", mission.completed && "opacity-60 bg-gray-50")}>
      <View className={clsx("w-10 h-10 rounded-full items-center justify-center mr-3", mission.completed ? "bg-green-100" : "bg-orange-100")}>
        {mission.completed ? (
          <CheckCircle size={20} color="#16a34a" />
        ) : (
          <Circle size={20} color="#f97316" />
        )}
      </View>
      
      <View className="flex-1 mr-2">
        <Text className={clsx("font-bold text-base", mission.completed ? "text-gray-500 line-through" : "text-gray-900")}>
          {mission.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Clock size={12} color="#6b7280" />
          <Text className="text-xs text-gray-500 ml-1 mr-3">{mission.durationMin} min</Text>
          <Text className="text-xs font-bold text-orange-500">+{mission.points} pts</Text>
        </View>
      </View>

      {!mission.completed && (
        <Button
          title="Start"
          onPress={onComplete}
          isLoading={isCompleting}
          variant="secondary"
          className="h-9 px-3 rounded-lg"
        />
      )}
    </Card>
  );
};
