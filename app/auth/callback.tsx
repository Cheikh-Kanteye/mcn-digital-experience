import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const type = params.type as string;

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the email link
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Auth callback error:', error);
            router.replace('/auth/login?error=auth_callback_failed');
            return;
          }

          if (data.session) {
            console.log('Email confirmed successfully');
            router.replace('/(tabs)');
          }
        } else if (type === 'signup') {
          // Handle signup confirmation without tokens (some flows)
          const { data, error } = await supabase.auth.getSession();

          if (error || !data.session) {
            console.error('Email confirmation failed');
            router.replace('/auth/login?error=email_not_confirmed');
          } else {
            console.log('Email confirmed successfully');
            router.replace('/(tabs)');
          }
        } else {
          // No valid parameters, redirect to login
          router.replace('/auth/login?error=invalid_callback');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        router.replace('/auth/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Confirming your email...</Text>
    </View>
  );
}
