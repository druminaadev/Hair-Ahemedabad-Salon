import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, CreditCard, Wallet, Building2, QrCode } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay securely with your card' },
  { id: 'upi', name: 'UPI', icon: QrCode, description: 'PhonePe, GPay, Paytm' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Balance: ₹500' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'Pay via your bank' },
];

export default function PaymentScreen({ navigation, route }: Props) {
  const { bookingData } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      
      // In production, integrate with Razorpay here
      // const order = await bookingsApi.createPaymentOrder(bookingId);
      // Process payment with Razorpay SDK
      
      navigation.navigate('BookingSuccess', { bookingId: 'BOOK123' });
    } catch (error) {
      Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹{bookingData.total}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.methodCardSelected]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIcon}>
                <method.icon size={24} color={selectedMethod === method.id ? colors.primary : colors.textPrimary} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
                {selectedMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.secureNote}>
            <Text style={styles.secureText}>🔒 Your payment is secured with 256-bit encryption</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={processing ? 'Processing...' : `Pay ₹${bookingData.total}`}
          onPress={handlePayment}
          loading={processing}
          disabled={!selectedMethod || processing}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  placeholder: { width: 32 },
  amountCard: { margin: 16, padding: 24, backgroundColor: colors.primary, borderRadius: 16, alignItems: 'center' },
  amountLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  amountValue: { fontSize: 32, fontWeight: '700', color: 'white' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.background, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  methodCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  methodIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  methodInfo: { flex: 1, marginLeft: 12 },
  methodName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  methodDescription: { fontSize: 13, color: colors.textSecondary },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  secureNote: { padding: 16, backgroundColor: colors.successLight, borderRadius: 12 },
  secureText: { fontSize: 13, color: colors.success, textAlign: 'center' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
});
