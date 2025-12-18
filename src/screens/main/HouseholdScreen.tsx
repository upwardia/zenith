import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';
import { User as UserIcon, Plus, Mail } from 'lucide-react-native';

export const HouseholdScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [inviteEmail, setInviteEmail] = useState('');

  // Dummy household data since we don't have it in the user model yet
  const [members, setMembers] = useState([
    { id: '1', name: 'Partner', email: 'partner@example.com', role: 'Admin' },
    { id: '2', name: 'Kid 1', email: 'kid1@example.com', role: 'Member' },
  ]);

  const inviteMutation = useMutation({
    mutationFn: MockAPI.inviteMember,
    onSuccess: () => {
      toast.show(`Invite sent to ${inviteEmail}`, 'success');
      setInviteEmail('');
    },
    onError: () => {
      toast.show('Failed to send invite', 'error');
    }
  });

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.show('Please enter a valid email', 'error');
      return;
    }
    inviteMutation.mutate(inviteEmail);
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <View className="mb-6 flex-row justify-between items-center">
        <View>
            <Text className="text-3xl font-bold text-gray-900 mb-1">Household</Text>
            <Text className="text-gray-500">Manage your family members</Text>
        </View>
        <Button title="Done" variant="ghost" onPress={() => navigation.goBack()} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-gray-900 mb-3">Members</Text>
        <View className="gap-3 mb-8">
            {members.map(member => (
                <Card key={member.id} className="flex-row items-center p-4">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                        <UserIcon size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-900">{member.name}</Text>
                        <Text className="text-xs text-gray-500">{member.email}</Text>
                    </View>
                    <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-xs font-medium text-gray-600">{member.role}</Text>
                    </View>
                </Card>
            ))}
        </View>

        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <View className="flex-row items-center mb-4">
                <Plus size={20} color="#f97316" />
                <Text className="font-bold text-lg text-gray-900 ml-2">Invite New Member</Text>
            </View>
            <Text className="text-gray-500 text-sm mb-3">
                Send an invitation to add someone to your household.
            </Text>
            
            <View className="flex-row gap-2">
                <View className="flex-1">
                    <TextInput
                        value={inviteEmail}
                        onChangeText={setInviteEmail}
                        placeholder="email@example.com"
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 h-12"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                <Button
                    title="Invite"
                    onPress={handleInvite}
                    isLoading={inviteMutation.isPending}
                    className="h-12 px-4"
                />
            </View>
        </View>
      </ScrollView>

    </ScreenWrapper>
  );
};
