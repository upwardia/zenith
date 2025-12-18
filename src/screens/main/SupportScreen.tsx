import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';

export const SupportScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [message, setMessage] = useState('');

  const sendMutation = useMutation({
    mutationFn: MockAPI.contactSupport,
    onSuccess: () => {
      toast.show('Message sent! We will reply shortly.', 'success');
      navigation.goBack();
    },
    onError: () => {
      toast.show('Failed to send message.', 'error');
    }
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast.show('Please write a message first', 'error');
      return;
    }
    sendMutation.mutate(message);
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Help & Support</Text>
        <Text className="text-gray-500">How can we help you today?</Text>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6 flex-1 max-h-[400px]">
        <Text className="text-sm font-bold text-gray-700 mb-2">Your Message</Text>
        <TextInput
            multiline
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue or suggestion..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 text-base"
        />
      </View>

      <Button
        title="Send Message"
        onPress={handleSend}
        isLoading={sendMutation.isPending}
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
