import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, FadeInDown, Layout, useSharedValue } from 'react-native-reanimated';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';
import { Flame, CheckCircle, Circle, Clock } from 'lucide-react-native';
import { clsx } from 'clsx';
import { DailyMission, User } from '../../types';
// Import only what is needed

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
    onMutate: async (missionId) => {
      // Cancel data refetches
      await queryClient.cancelQueries({ queryKey: ['user'] });
      await queryClient.cancelQueries({ queryKey: ['missions'] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(['user']);
      const previousMissions = queryClient.getQueryData<DailyMission[]>(['missions']);

      // Optimistically update missions
      if (previousMissions) {
        queryClient.setQueryData<DailyMission[]>(['missions'], (old) => 
          old?.map(m => m.id === missionId ? { ...m, completed: true } : m)
        );
      }

      // Optimistically update user
      if (previousUser && previousMissions) {
        const mission = previousMissions.find(m => m.id === missionId);
        if (mission) {
          queryClient.setQueryData<User>(['user'], (old) => old ? ({
            ...old,
            totalPoints: old.totalPoints + mission.points,
            missionsDone: old.missionsDone + 1,
          }) : old);
        }
      }

      return { previousUser, previousMissions };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['user'], context?.previousUser);
      queryClient.setQueryData(['missions'], context?.previousMissions);
      toast.show('Failed to sync. Reverted.', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onSuccess: () => {
       toast.show('Mission completed! Points added.', 'success');
    }
  });

  const uncompleteMissionMutation = useMutation({
    mutationFn: MockAPI.uncompleteMission,
    onMutate: async (missionId) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      await queryClient.cancelQueries({ queryKey: ['missions'] });

      const previousUser = queryClient.getQueryData<User>(['user']);
      const previousMissions = queryClient.getQueryData<DailyMission[]>(['missions']);

      if (previousMissions) {
        queryClient.setQueryData<DailyMission[]>(['missions'], (old) => 
          old?.map(m => m.id === missionId ? { ...m, completed: false } : m)
        );
      }

      if (previousUser && previousMissions) {
        const mission = previousMissions.find(m => m.id === missionId);
        if (mission) {
           queryClient.setQueryData<User>(['user'], (old) => old ? ({
            ...old,
            totalPoints: old.totalPoints - mission.points,
            missionsDone: old.missionsDone - 1,
          }) : old);
        }
      }

      return { previousUser, previousMissions };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['user'], context?.previousUser);
      queryClient.setQueryData(['missions'], context?.previousMissions);
      toast.show('Failed to sync. Reverted.', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onSuccess: () => {
      toast.show('Mission undone. Points reverted.', 'info');
    }
  });

  const onRefresh = async () => {
    await Promise.all([refetchUser(), refetchMissions()]);
  };

  const completedMissions = missions?.filter(m => m.completed).length || 0;
  const totalMissions = missions?.length || 0;
  const progress = totalMissions > 0 ? (completedMissions / totalMissions) : 0;
  const remainingMissions = totalMissions - completedMissions;

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, { damping: 60, stiffness: 90 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
    };
  });

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
                {completedMissions} / {totalMissions} missions
              </Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <Animated.View 
                className="h-full bg-orange-500 rounded-full" 
                style={animatedProgressStyle} 
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
          {missions?.map((mission, index) => (
            <Animated.View 
              key={mission.id}
              entering={FadeInDown.delay(index * 100).springify()}
              layout={Layout.springify()}
            >
              <MissionCard 
                mission={mission} 
                onComplete={() => completeMissionMutation.mutate(mission.id)}
                onUndo={() => uncompleteMissionMutation.mutate(mission.id)}
                isCompleting={completeMissionMutation.isPending && completeMissionMutation.variables === mission.id}
                isUndoing={uncompleteMissionMutation.isPending && uncompleteMissionMutation.variables === mission.id}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const MissionCard = ({ mission, onComplete, onUndo, isCompleting, isUndoing }: { mission: DailyMission, onComplete: () => void, onUndo: () => void, isCompleting: boolean, isUndoing: boolean }) => {
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

      {!mission.completed ? (
        <Animated.View entering={FadeInDown.springify()} exiting={FadeInDown.springify()}>
          <Button
            title="Mark Done"
            onPress={onComplete}
            isLoading={isCompleting}
            variant="secondary"
            className="h-9 px-3 rounded-lg"
          />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.springify()} exiting={FadeInDown.springify()}>
          <Button
            title="Undo"
            onPress={onUndo}
            isLoading={isUndoing}
            variant="ghost"
            className="h-9 px-3 rounded-lg bg-gray-100"
          />
        </Animated.View>
      )}
    </Card>
  );
};
