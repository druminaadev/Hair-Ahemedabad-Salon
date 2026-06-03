import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react-native';
import { DEMO_TRANSACTIONS, DEMO_WALLET } from '@/data/demo';
import { WalletTransaction } from '@/types/models';
import { colors } from '@/constants/colors';

export default function TransactionHistoryScreen({ navigation }: any) {
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

  const renderItem = ({ item }: { item: WalletTransaction }) => (
    <View style={styles.txRow}>
      <View style={styles.txIconWrap}>{txIcon(item)}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txDate}>
          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color: txColor(item) }]}>
        {item.type === 'DEBIT' ? '-' : '+'}₹{item.amount.toLocaleString('en-IN')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      <View style={styles.balanceBanner}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceValue}>₹{DEMO_WALLET.balance.toLocaleString('en-IN')}</Text>
      </View>

      <FlatList
        data={DEMO_TRANSACTIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  balanceBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.primaryLight },
  balanceLabel: { fontSize: 14, color: colors.textSecondary },
  balanceValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  list: { paddingVertical: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  txIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  txDesc: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 3 },
  txDate: { fontSize: 12, color: colors.textSecondary },
  txAmount: { fontSize: 15, fontWeight: '700' },
});
