import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, MapPin, Settings, Bell, HelpCircle, LogOut, ChevronRight, Wallet, Star } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { DEMO_WALLET, DEMO_BOOKINGS } from '@/data/demo';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const unreadNotifs = useNotificationStore((s) => s.unreadCount());

  const totalBookings = DEMO_BOOKINGS.filter((b) => b.status === BookingStatus.COMPLETED).length;
  const { balance, loyaltyPoints } = DEMO_WALLET;

  const menuItems: { icon: any; label: string; screen: string; badge: number }[] = [
    { icon: User,        label: 'Edit Profile',       screen: 'EditProfile',    badge: 0 },
    { icon: MapPin,       label: 'Manage Addresses',   screen: 'Addresses',      badge: 0 },
    { icon: Wallet,       label: 'My Wallet',          screen: 'Wallet',         badge: 0 },
    { icon: Bell,         label: 'Notifications',      screen: 'Notifications',  badge: unreadNotifs },
    { icon: Settings,     label: 'Settings',           screen: 'Settings',       badge: 0 },
    { icon: HelpCircle,   label: 'Help & Support',     screen: 'Help',           badge: 0 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest User'}</Text>
          <Text style={styles.phone}>+91 {user?.phone ?? '9876543210'}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statValueRow}>
              <Star size={14} color={colors.warning} fill={colors.warning} />
              <Text style={styles.statValue}>{loyaltyPoints}</Text>
            </View>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{balance}</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuIconWrap}>
                <item.icon size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              {item.badge > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge > 9 ? '9+' : item.badge}</Text>
                </View>
              )}
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0 · Hair Ahmedabad</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  profileCard: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: '700', color: 'white' },
  name: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  phone: { fontSize: 15, color: colors.textSecondary },
  email: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  statCard: { flex: 1, padding: 16, backgroundColor: colors.background, borderRadius: 14, alignItems: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  section: { paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.background, borderRadius: 12, marginBottom: 8 },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  menuBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, marginRight: 6 },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, padding: 16, backgroundColor: colors.errorLight, borderRadius: 14 },
  logoutText: { fontSize: 15, fontWeight: '700', color: colors.error },
  version: { textAlign: 'center', fontSize: 12, color: colors.textTertiary, paddingBottom: 32 },
});
