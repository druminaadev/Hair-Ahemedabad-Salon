import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export default function OTPScreen({ route }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(phone, otp);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to +91 {phone}</Text>

        <View style={styles.demoBanner}>
          <Text style={styles.demoText}> Demo mode — use OTP: 123456</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="OTP"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            error={error}
          />
          <Button title="Resend OTP" onPress={() => setError('')} variant="ghost" />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Verify & Continue"
          onPress={handleVerifyOTP}
          loading={loading}
          disabled={otp.length !== 6}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  demoBanner: { padding: 12, backgroundColor: '#FEF9C3', borderRadius: 10, marginBottom: 24 },
  demoText: { fontSize: 13, fontWeight: '600', color: '#92400E', textAlign: 'center' },
  form: { marginBottom: 24 },
  footer: { padding: 24 },
});
