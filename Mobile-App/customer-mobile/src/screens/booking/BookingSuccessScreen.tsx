import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingSuccess'>;

export default function BookingSuccessScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { salonId, selectedServices, selectedDate, selectedSlot, selectedStaff, clearBooking } = useBookingStore();
  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];

  const handleDone = () => {
    clearBooking();
    navigation.navigate('Home');
  };

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const finalAmount = Math.round(totalAmount * 1.18);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.iconWrap}>
          <CheckCircle2 size={88} color={colors.success} />
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your appointment has been successfully booked</Text>

        {/* Booking Card */}
        <View style={styles.card}>
          <Text style={styles.bookingId}>Booking ID: #{bookingId.toUpperCase()}</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowIcon}><MapPin size={18} color={colors.primary} /></View>
            <View>
              <Text style={styles.rowLabel}>Salon</Text>
              <Text style={styles.rowValue}>{salon.name}</Text>
              <Text style={styles.rowSub}>{salon.addressLine1}, {salon.city}</Text>
            </View>
          </View>

          {selectedDate && (
            <View style={styles.row}>
              <View style={styles.rowIcon}><Calendar size={18} color={colors.primary} /></View>
              <View>
                <Text style={styles.rowLabel}>Date</Text>
                <Text style={styles.rowValue}>
                  {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
          )}

          {selectedSlot && (
            <View style={styles.row}>
              <View style={styles.rowIcon}><Clock size={18} color={colors.primary} /></View>
              <View>
                <Text style={styles.rowLabel}>Time</Text>
                <Text style={styles.rowValue}>{selectedSlot.startTime} · {totalDuration} min</Text>
              </View>
            </View>
          )}

          {selectedStaff && (
            <View style={styles.row}>
              <View style={styles.rowIcon}><User size={18} color={colors.primary} /></View>
              <View>
                <Text style={styles.rowLabel}>Staff</Text>
                <Text style={styles.rowValue}>{selectedStaff.name}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />
          <Text style={styles.services}>{selectedServices.map((s) => s.name).join(' · ')}</Text>
          <Text style={styles.amount}>Total Paid: ₹{finalAmount}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📱 Confirmation sent to your phone</Text>
          <Text style={styles.infoText}>🔔 Reminder 1 hour before your appointment</Text>
          <Text style={styles.infoText}>❌ Cancel up to 2 hours before for full refund</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="View My Bookings" onPress={handleDone} fullWidth />
        <Button title="Back to Home" onPress={handleDone} variant="outline" fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 24, alignItems: 'center' },
  iconWrap: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 28 },
  card: { width: '100%', padding: 20, backgroundColor: colors.background, borderRadius: 18, marginBottom: 20 },
  bookingId: { fontSize: 14, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 14 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  rowLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  rowValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  rowSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  services: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 6 },
  amount: { fontSize: 17, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  infoCard: { width: '100%', padding: 16, backgroundColor: colors.successLight, borderRadius: 14, gap: 8, marginBottom: 24 },
  infoText: { fontSize: 13, color: colors.textPrimary, lineHeight: 20 },
  footer: { padding: 16, gap: 10, borderTopWidth: 1, borderTopColor: colors.border },
});
