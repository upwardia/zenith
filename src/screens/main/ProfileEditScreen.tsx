import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';

export const ProfileEditScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const toast = useToast();
  
  const [name, setName] = useState('');
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: MockAPI.getUser,
    // When data loads, set the local state. 
    // Note: In a real app we'd use `useEffect` or `initialData` carefully, but this is simple.
  });

  // Sync state once user loads
  React.useEffect(() => {
    if (user && !name) {
      setName(user.name);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: MockAPI.updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      toast.show('Profile updated!', 'success');
      navigation.goBack();
    },
    onError: () => {
      toast.show('Failed to update profile.', 'error');
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.show('Name cannot be empty', 'error');
      return;
    }
    updateMutation.mutate({ name });
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Edit Profile</Text>
        <Text className="text-gray-500">Update your personal details</Text>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-sm font-bold text-gray-700 mb-2">Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 mb-4"
          placeholder="Enter your name"
        />

        <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
        <View className="bg-gray-100 border border-gray-200 rounded-lg p-3">
          <Text className="text-gray-500">{user?.email}</Text>
        </View>
        <Text className="text-xs text-gray-400 mt-1">Email cannot be changed.</Text>
      </View>

      <Button
        title="Save Changes"
        onPress={handleSave}
        isLoading={updateMutation.isPending}
        className="rounded-xl"
      />
      
      <Button
        title="Cancel"
        variant="ghost"
        onPress={() => navigation.goBack()}
        className="mt-2"
      />
    </ScreenWrapper>
  );
};
