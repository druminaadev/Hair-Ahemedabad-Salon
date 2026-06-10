import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Plus, ArrowUpRight, ArrowDownLeft, Gift, RefreshCw } from 'lucide-react-native';
import { DEMO_WALLET, DEMO_TRANSACTIONS } from '@/data/demo';
import { WalletTransaction } from '@/types/models';
import { colors } from '@/constants/colors';

export default function WalletHomeScreen({ navigation }: any) {
  const { balance, loyaltyPoints } = DEMO_WALLET;
  const recentTransactions = DEMO_TRANSACTIONS.slice(0, 4);

  const txIcon = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return <ArrowDownLeft size={18} color={colors.success} />;
    if (t.type === 'REFUND') return <RefreshCw size={18} color={colors.info} />;
    return <ArrowUpRight size={18} color={colors.error} />;
  };

  const txColor = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return colors.success;
    if (t.type === 'REFUND') return colors.info;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMoney')}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Loyalty Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loyalty Points</Text>
          <View style={styles.pointsCard}>
            <Gift size={28} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.points}>{loyaltyPoints} Points</Text>
              <Text style={styles.pointsNote}>≈ ₹{loyaltyPoints / 10} redeemable value</Text>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('AddMoney')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                <Plus size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('TransactionHistory')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
                <ArrowUpRight size={22} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Referral')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Gift size={22} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Refer & Earn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txIcon}>{txIcon(tx)}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc}>{tx.description}</Text>
                <Text style={styles.txDate}>
                  {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: txColor(tx) }]}>
                {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  balanceCard: { margin: 16, padding: 28, backgroundColor: colors.primary, borderRadius: 20, alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 6 },
  balanceAmount: { fontSize: 40, fontWeight: '700', color: 'white', marginBottom: 20 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20 },
  addButtonText: { fontSize: 15, fontWeight: '700', color: 'white' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
  pointsCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: colors.primaryLight, borderRadius: 14 },
  points: { fontSize: 20, fontWeight: '700', color: colors.primary },
  pointsNote: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  redeemButton: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.primary, borderRadius: 10 },
  redeemText: { fontSize: 13, fontWeight: '700', color: 'white' },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, alignItems: 'center', gap: 8 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  txIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  txDesc: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 2 },
  txDate: { fontSize: 12, color: colors.textSecondary },
  txAmount: { fontSize: 15, fontWeight: '700' },
});
