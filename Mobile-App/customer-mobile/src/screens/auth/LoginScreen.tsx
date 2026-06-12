import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    navigation.navigate('OTPVerification', { phone });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>️</Text>
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your phone number to continue</Text>

        <View style={styles.demoBanner}>
          <Text style={styles.demoText}> Demo mode — use any 10-digit number</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Send OTP"
          onPress={handleSendOTP}
          disabled={phone.length !== 10}
          fullWidth
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24, alignSelf: 'center' },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  demoBanner: { padding: 12, backgroundColor: '#FEF9C3', borderRadius: 10, marginBottom: 24 },
  demoText: { fontSize: 13, fontWeight: '600', color: '#92400E', textAlign: 'center' },
  form: { marginBottom: 8 },
  footer: { padding: 24 },
});
