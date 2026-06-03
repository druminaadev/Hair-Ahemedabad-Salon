import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import { AuthStackParamList } from '@/types/navigation';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const isAuth = await checkAuth();
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      if (!isAuth) {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SalonBooking</Text>
        </View>
        <Text style={styles.tagline}>Your beauty, our priority</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoText: { fontSize: 24, fontWeight: '700', color: colors.primary },
  tagline: { fontSize: typography.fontSize.lg, color: 'white', fontWeight: '500' },
  footer: { paddingBottom: 48, alignItems: 'center' },
  version: { fontSize: typography.fontSize.sm, color: 'white', marginTop: 12, opacity: 0.8 },
});
