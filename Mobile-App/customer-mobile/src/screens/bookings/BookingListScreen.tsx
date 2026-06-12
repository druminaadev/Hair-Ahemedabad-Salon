import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Calendar, Clock } from 'lucide-react-native';
import { BookingsStackParamList } from '@/types/navigation';
import { Card } from '@/components/common/Card';
import { DEMO_BOOKINGS } from '@/data/demo';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingList'>;

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const STATUS_COLOR: Record<string, string> = {
  [BookingStatus.CONFIRMED]: colors.success,
  [BookingStatus.PENDING_PAYMENT]: colors.warning,
  [BookingStatus.COMPLETED]: colors.primary,
  [BookingStatus.CANCELLED]: colors.error,
  [BookingStatus.CHECKED_IN]: colors.info,
  [BookingStatus.NO_SHOW]: colors.textSecondary,
};

const STATUS_LABEL: Record<string, string> = {
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.PENDING_PAYMENT]: 'Pending',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled',
  [BookingStatus.CHECKED_IN]: 'Checked In',
  [BookingStatus.NO_SHOW]: 'No Show',
};

export default function BookingListScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const bookings = DEMO_BOOKINGS.filter((b) => {
    if (activeTab === 'Upcoming') return [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT, BookingStatus.CHECKED_IN].includes(b.status);
    if (activeTab === 'Completed') return b.status === BookingStatus.COMPLETED;
    return b.status === BookingStatus.CANCELLED || b.status === BookingStatus.NO_SHOW;
  });

  const renderBooking = ({ item }: { item: typeof DEMO_BOOKINGS[0] }) => {
    const statusColor = STATUS_COLOR[item.status] ?? colors.textSecondary;
    return (
      <Card onPress={() => navigation.navigate('BookingDetail', { id: item.id })} style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.salonName}>{item.salonName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_LABEL[item.status]}</Text>
          </View>
        </View>

        <Text style={styles.services}>{item.serviceNames.join(', ')}</Text>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Calendar size={15} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {new Date(item.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={15} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.startTime}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>₹{item.finalAmount}</Text>
          <View style={styles.actions}>
            {activeTab === 'Upcoming' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('BookingDetail', { id: item.id })}
              >
                <Text style={styles.actionText}>Manage</Text>
              </TouchableOpacity>
            )}
            {activeTab === 'Completed' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('WriteReview', { bookingId: item.id })}
              >
                <Text style={styles.actionText}>Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}></Text>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, backgroundColor: colors.background, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: 'white' },
  list: { padding: 16 },
  bookingCard: { marginBottom: 14, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  salonName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  services: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  amount: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primaryLight, borderRadius: 8 },
  actionText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  empty: { paddingTop: 64, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
