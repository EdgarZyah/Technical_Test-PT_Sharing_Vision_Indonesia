import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Coins, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, Target, User } from 'lucide-react-native';
import { useAuth } from '../store/AuthContext';
import { useGold } from '../store/GoldContext';
import { useTheme } from '../store/ThemeContext';
import { formatRupiah, formatGram, formatDate } from '../utils/formatter';
import { COLORS, MOCK_TRANSACTIONS } from '../constants/theme';
import Header from '../components/Header';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { currentPrice, previousPrice, priceHistory, isLoading, loadPrices } = useGold();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const goldValue = (user?.goldBalance || 0) * (currentPrice?.buy || 0);
  const priceChange = currentPrice && previousPrice
    ? { amount: currentPrice.buy - previousPrice.buy, percent: ((currentPrice.buy - previousPrice.buy) / previousPrice.buy * 100) }
    : null;

  useEffect(() => { loadPrices(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrices();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header title="Dashboard" />
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.amber500} />}
    >
      <View style={styles.balanceCardWrap}>
        <View style={[styles.balanceCard, { shadowColor: COLORS.amber500 }]}>
          <Text style={styles.balanceWelcome}>Selamat Datang,</Text>
          <Text style={styles.balanceName}>{user?.name || 'Investor'}</Text>
          <View style={styles.balanceDivider} />
          <Text style={styles.balanceLabel}>Saldo Emas Anda</Text>
          <View style={styles.balanceRow}>
            <Coins size={22} color={COLORS.white} />
            <Text style={styles.balanceGram}>{formatGram(user?.goldBalance || 0)}</Text>
          </View>
          <View style={styles.balanceRupiahRow}>
            <Wallet size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.balanceRupiah}>{formatRupiah(goldValue)}</Text>
          </View>
          <View style={styles.balanceInfoGrid}>
            <View>
              <Text style={styles.balanceInfoLabel}>SALDO RUPIAH</Text>
              <Text style={styles.balanceInfoValue}>{formatRupiah(user?.balance || 0)}</Text>
            </View>
            <View>
              <Text style={styles.balanceInfoLabel}>HARGA BUYBACK</Text>
              <Text style={styles.balanceInfoValue}>{formatRupiah(currentPrice?.sell || 0)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.balanceCTA}
            onPress={() => navigation.navigate('BuyGold')}
          >
            <Text style={styles.balanceCTAText}>Beli Emas Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceCardWrap}>
        <View style={[styles.priceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.priceHeaderRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>HARGA EMAS 1 GRAM</Text>
            <Text style={[styles.priceDate, { color: colors.textMuted }]}>{currentPrice ? formatDate(currentPrice.date) : '-'}</Text>
          </View>
          <Text style={[styles.priceValue, { color: colors.text }]}>{formatRupiah(currentPrice?.buy || 0)}</Text>

          {previousPrice && (
            <>
              <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
              <View style={styles.priceHeaderRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>HARGA SEBELUMNYA</Text>
                <Text style={[styles.priceDate, { color: colors.textMuted }]}>{formatDate(previousPrice.date)}</Text>
              </View>
              <Text style={[styles.pricePrevValue, { color: colors.text }]}>{formatRupiah(previousPrice.buy)}</Text>
            </>
          )}

          {priceChange && (
            <>
              <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
              <View style={styles.priceHeaderRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>PERUBAHAN</Text>
              </View>
              <View style={styles.changeRow}>
                {priceChange.amount >= 0
                  ? <ArrowUpRight size={14} color={COLORS.emerald500} />
                  : <ArrowDownRight size={14} color={COLORS.red500} />
                }
                <Text style={[styles.changeValue, { color: priceChange.amount >= 0 ? COLORS.emerald500 : COLORS.red500 }]}>
                  {priceChange.amount >= 0 ? '+' : ''}{formatRupiah(priceChange.amount)} ({priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('BuyGold')}>
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.amber500 }]}>
            <BarChart3 size={20} color={COLORS.white} />
          </View>
          <Text style={[styles.quickActionLabel, { color: colors.text }]}>Beli Emas</Text>
        </TouchableOpacity>
        <View style={[styles.quickActionItem, { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 }]}>
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.emerald500 }]}>
            <TrendingDown size={20} color={COLORS.white} />
          </View>
          <Text style={[styles.quickActionLabel, { color: colors.text }]}>Riwayat</Text>
        </View>
        <View style={[styles.quickActionItem, { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 }]}>
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.blue500 }]}>
            <Target size={20} color={COLORS.white} />
          </View>
          <Text style={[styles.quickActionLabel, { color: colors.text }]}>Target</Text>
        </View>
        <View style={[styles.quickActionItem, { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 }]}>
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.purple500 }]}>
            <User size={20} color={COLORS.white} />
          </View>
          <Text style={[styles.quickActionLabel, { color: colors.text }]}>Profil</Text>
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Riwayat Terakhir</Text>
        </View>
        <View style={[styles.recentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {MOCK_TRANSACTIONS.slice(0, 3).map((tx, i) => (
            <View key={tx.id} style={[styles.recentItem, i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.recentIconWrap, { backgroundColor: tx.type === 'BUY' ? COLORS.emerald50 : COLORS.red50 }]}>
                {tx.type === 'BUY'
                  ? <TrendingUp size={16} color={COLORS.emerald600} />
                  : <TrendingDown size={16} color={COLORS.red600} />
                }
              </View>
              <View style={styles.recentInfo}>
                <View style={styles.recentTop}>
                  <Text style={[styles.recentTypeBadge, {
                    backgroundColor: tx.type === 'BUY' ? COLORS.emerald100 : COLORS.red100,
                    color: tx.type === 'BUY' ? COLORS.emerald600 : COLORS.red600,
                  }]}>{tx.type === 'BUY' ? 'Beli' : 'Jual'}</Text>
                  <Text style={[styles.recentStatus, { color: tx.status === 'SUCCESS' ? COLORS.emerald600 : tx.status === 'PENDING' ? COLORS.amber600 : COLORS.red600 }]}>
                    {tx.status === 'SUCCESS' ? 'Berhasil' : tx.status === 'PENDING' ? 'Pending' : 'Gagal'}
                  </Text>
                </View>
                <Text style={[styles.recentDate, { color: colors.textMuted }]}>{formatDate(tx.date)}</Text>
              </View>
              <View style={styles.recentAmounts}>
                <Text style={[styles.recentAmount, { color: colors.text }]}>{formatRupiah(tx.rupiahAmount)}</Text>
                <Text style={[styles.recentGram, { color: colors.textSecondary }]}>{tx.gramAmount} gr</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  balanceCardWrap: { marginBottom: 16 },
  balanceCard: {
    backgroundColor: COLORS.amber500, borderRadius: 16, padding: 20,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  balanceWelcome: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  balanceName: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 },
  balanceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  balanceGram: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  balanceRupiahRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  balanceRupiah: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  balanceInfoGrid: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)',
    marginTop: 16, paddingTop: 12,
  },
  balanceInfoLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  balanceInfoValue: { fontSize: 13, fontWeight: 'bold', color: COLORS.white },
  balanceCTA: {
    marginTop: 16, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, paddingVertical: 10, alignItems: 'center',
  },
  balanceCTAText: { fontSize: 14, fontWeight: '600', color: COLORS.white },

  priceCardWrap: { marginBottom: 16 },
  priceCard: {
    borderRadius: 16, padding: 16, borderWidth: 1,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  priceHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  priceLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  priceDate: { fontSize: 11 },
  priceValue: { fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  pricePrevValue: { fontSize: 18, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  priceDivider: { height: 1, marginVertical: 12 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  changeValue: { fontSize: 14, fontWeight: 'bold', fontVariant: ['tabular-nums'] },

  quickActionsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickActionItem: {
    flex: 1, alignItems: 'center', borderRadius: 12, padding: 12, borderWidth: 1,
  },
  quickActionIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  quickActionLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },

  recentSection: { marginBottom: 16 },
  recentHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  recentCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  recentItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  recentIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  recentInfo: { flex: 1 },
  recentTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  recentTypeBadge: { fontSize: 10, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, overflow: 'hidden' },
  recentStatus: { fontSize: 10, fontWeight: '500' },
  recentDate: { fontSize: 11 },
  recentAmounts: { alignItems: 'flex-end' },
  recentAmount: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
  recentGram: { fontSize: 11, fontVariant: ['tabular-nums'] },
});

export default DashboardScreen;
