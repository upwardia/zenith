import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';
import { clsx } from 'clsx';
import { User, ChevronRight, Settings, Users, Bell, HelpCircle, LogOut } from 'lucide-react-native';

export const ProfileScreen = () => {
  const { logout } = useAuthStore();
  const toast = useToast();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: MockAPI.getUser,
  });

  const handleLogout = () => {
    logout();
    toast.show('Logged out successfully', 'success');
  };

  const showComingSoon = () => {
    toast.show('Coming soon!', 'info');
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Profile</Text>
          <Text className="text-gray-500">Manage your account and settings</Text>
        </View>

        {/* Profile Card */}
        <Card className="mb-6 items-center p-6">
          <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-orange-600">{user?.name.charAt(0)}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">{user?.name}</Text>
          <Text className="text-gray-500 mb-6">Member since {user?.memberSince}</Text>

          <View className="flex-row w-full justify-between border-t border-gray-100 pt-4">
            <StatItem label="Day Streak" value={user?.dayStreak.toString() || '0'} />
            <View className="w-[1px] bg-gray-100 h-full" />
            <StatItem label="Missions" value={user?.missionsDone.toString() || '0'} />
            <View className="w-[1px] bg-gray-100 h-full" />
            <StatItem label="Points" value={user?.totalPoints.toString() || '0'} />
          </View>
        </Card>

        {/* Menu */}
        <View className="bg-white rounded-2xl overflow-hidden mb-6">
          <MenuItem icon={<User size={20} color="#4b5563" />} title="Personal Information" onPress={showComingSoon} />
          <MenuItem icon={<Users size={20} color="#4b5563" />} title="Household Members" onPress={showComingSoon} />
          <MenuItem icon={<Bell size={20} color="#4b5563" />} title="Notifications" onPress={showComingSoon} />
          <MenuItem icon={<HelpCircle size={20} color="#4b5563" />} title="Help & Support" onPress={showComingSoon} last />
        </View>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          className="mb-8 border-red-200"
        />
        
        <Text className="text-center text-gray-400 text-xs mb-8">Phoenix v1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <View className="items-center flex-1">
    <Text className="font-bold text-lg text-gray-900">{value}</Text>
    <Text className="text-xs text-gray-500">{label}</Text>
  </View>
);

const MenuItem = ({ icon, title, onPress, last }: { icon: React.ReactNode, title: string, onPress: () => void, last?: boolean }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={clsx(
      "flex-row items-center p-4 active:bg-gray-50",
      !last && "border-b border-gray-100"
    )}
  >
    <View className="mr-3">{icon}</View>
    <Text className="flex-1 font-medium text-gray-700">{title}</Text>
    <ChevronRight size={20} color="#9ca3af" />
  </TouchableOpacity>
);
