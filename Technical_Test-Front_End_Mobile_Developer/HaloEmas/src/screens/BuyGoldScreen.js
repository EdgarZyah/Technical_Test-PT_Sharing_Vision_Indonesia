import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { Coins, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useAuth } from '../store/AuthContext';
import { useGold } from '../store/GoldContext';
import { useTheme } from '../store/ThemeContext';
import { formatRupiah, formatGram, calculateGramFromRupiah } from '../utils/formatter';
import { COLORS } from '../constants/theme';
import Header from '../components/Header';

const QUICK_RUPIAH = [100000, 500000, 1000000, 5000000];
const QUICK_GRAM = [0.1, 0.5, 1, 5];

const formatQuickLabel = (val, mode) => {
  if (mode === 'rupiah') {
    return val >= 1000000 ? `${val / 1000000}jt` : `${val / 1000}rb`;
  }
  return `${val}gr`;
};

const BuyGoldScreen = ({ navigation }) => {
  const { user, updateGoldBalance, updateBalance } = useAuth();
  const { currentPrice, buyGold, sellGold, isLoading } = useGold();
  const { colors } = useTheme();
  const [tab, setTab] = useState('buy');
  const [inputMode, setInputMode] = useState('rupiah');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const parsedAmount = parseInt(amount) || 0;
  const calculatedGram = inputMode === 'rupiah'
    ? calculateGramFromRupiah(parsedAmount, currentPrice?.buy || 0)
    : parsedAmount;
  const displayGram = inputMode === 'gram' ? parsedAmount : calculatedGram;
  const displayAmount = inputMode === 'gram' ? calculatedGram * (currentPrice?.buy || 0) : parsedAmount;

  useEffect(() => { if (error && amount) setError(''); }, [amount]);

  const handleAmountChange = (text) => {
    const numeric = text.replace(/[^0-9.]/g, '');
    if (inputMode === 'gram') {
      const parts = numeric.split('.');
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 4) return;
    }
    setAmount(numeric);
  };

  const handleQuickAmount = (qa) => {
    setAmount(qa.toString());
    setError('');
  };

  const handleBalanceTap = () => {
    if (tab === 'buy') {
      setInputMode('rupiah');
      setAmount(String(user?.balance || 0));
    } else {
      setInputMode('gram');
      setAmount(String(user?.goldBalance || 0));
    }
    setError('');
  };

  const handleConfirm = () => {
    if (!amount || (inputMode === 'rupiah' && parsedAmount <= 0) || (inputMode === 'gram' && parseFloat(amount) <= 0)) {
      setError('Masukan harus lebih dari 0');
      return;
    }
    if (tab === 'buy' && inputMode === 'rupiah' && parsedAmount < 10000) {
      setError('Minimal pembelian Rp10.000');
      return;
    }
    if (tab === 'sell') {
      const sellGram = inputMode === 'gram' ? parsedAmount : calculatedGram;
      if (sellGram <= 0) {
        setError('Jumlah emas harus lebih dari 0');
        return;
      }
      if (sellGram > (user?.goldBalance || 0)) {
        setError(`Saldo emas tidak mencukupi. Saldo Anda: ${formatGram(user?.goldBalance || 0)}`);
        return;
      }
    }
    setShowConfirm(true);
  };

  const executeBuy = async () => {
    setShowConfirm(false);

    if (tab === 'sell') {
      const sellGram = inputMode === 'gram' ? parsedAmount : calculatedGram;
      const result = await sellGold(sellGram, user?.goldBalance || 0);
      if (result.success) {
        await updateGoldBalance(result.newGoldBalance);
        await updateBalance(result.rupiahReceived);
        setLastTx(result.transaction);
        setShowSuccess(true);
      } else {
        Alert.alert('Penjualan Gagal', result.error);
      }
      return;
    }

    const buyAmount = inputMode === 'gram' ? displayAmount : parsedAmount;
    const result = await buyGold(buyAmount, user?.goldBalance || 0);
    if (result.success) {
      await updateGoldBalance(result.newBalance);
      setLastTx(result.transaction);
      setShowSuccess(true);
    } else {
      Alert.alert('Pembelian Gagal', result.error);
    }
  };

  const accent = tab === 'buy' ? COLORS.emerald500 : COLORS.red500;
  const accentLight = tab === 'buy' ? COLORS.emerald50 : COLORS.red50;
  const accentText = tab === 'buy' ? COLORS.emerald600 : COLORS.red600;

  const quickValues = inputMode === 'rupiah' ? QUICK_RUPIAH : QUICK_GRAM;
  const filteredQuick = tab === 'sell' && inputMode === 'gram'
    ? quickValues.filter((v) => v <= (user?.goldBalance || 0))
    : quickValues;

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.bg }]}>
      <Header title={tab === 'buy' ? 'Beli Emas' : 'Jual Emas'} />
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.marketHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.marketLeft}>
          <View style={styles.marketIconWrap}>
            <Coins size={18} color={COLORS.white} />
          </View>
          <View>
            <Text style={[styles.marketTitle, { color: colors.text }]}>GOLD/IDR</Text>
            <Text style={[styles.marketSub, { color: colors.textSecondary }]}>Halo Emas Antam</Text>
          </View>
        </View>
        <View style={styles.marketPrices}>
          <View style={styles.marketPriceRow}>
            <TrendingUp size={12} color={COLORS.emerald500} />
            <Text style={[styles.marketPriceValue, { color: COLORS.emerald600 }]}>{formatRupiah(currentPrice?.buy || 0)}</Text>
            <Text style={[styles.marketPriceLabel, { color: colors.textSecondary }]}>/gram</Text>
          </View>
          <View style={styles.marketPriceRow}>
            <TrendingDown size={12} color={COLORS.red500} />
            <Text style={[styles.marketPriceValue, { color: COLORS.red600 }]}>{formatRupiah(currentPrice?.sell || 0)}</Text>
            <Text style={[styles.marketPriceLabel, { color: colors.textSecondary }]}>/gram</Text>
          </View>
        </View>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, tab === 'buy' && { borderBottomWidth: 2, borderBottomColor: COLORS.emerald500, backgroundColor: 'rgba(16,185,129,0.05)' }]}
          onPress={() => { setTab('buy'); setAmount(''); setError(''); }}
        >
          <Text style={[styles.tabText, { color: tab === 'buy' ? COLORS.emerald600 : colors.textMuted }]}>Beli Emas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'sell' && { borderBottomWidth: 2, borderBottomColor: COLORS.red500, backgroundColor: 'rgba(239,68,68,0.05)' }]}
          onPress={() => { setTab('sell'); setAmount(''); setError(''); setInputMode('rupiah'); }}
        >
          <Text style={[styles.tabText, { color: tab === 'sell' ? COLORS.red600 : colors.textMuted }]}>Jual Emas</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.balanceBar, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}
          onPress={handleBalanceTap}
          activeOpacity={0.7}
        >
          <Coins size={14} color={COLORS.amber500} />
          <Text style={[styles.balanceBarLabel, { color: colors.textSecondary }]}>
            {tab === 'buy' ? 'Saldo Rupiah' : 'Saldo Emas'}
          </Text>
          <Text style={[styles.balanceBarValue, { color: COLORS.amber500 }]}>
            {tab === 'buy' ? formatRupiah(user?.balance || 0) : formatGram(user?.goldBalance || 0)}
          </Text>
        </TouchableOpacity>

        <View style={[styles.modeToggle, { backgroundColor: colors.surfaceHover }]}>
          <TouchableOpacity
            style={[styles.modeBtn, inputMode === 'rupiah' && { backgroundColor: colors.surface, shadowColor: COLORS.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }]}
            onPress={() => { setInputMode('rupiah'); setAmount(''); setError(''); }}
          >
            <Text style={[styles.modeBtnText, { color: inputMode === 'rupiah' ? colors.text : colors.textMuted }]}>Rupiah</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, inputMode === 'gram' && { backgroundColor: colors.surface, shadowColor: COLORS.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }]}
            onPress={() => { setInputMode('gram'); setAmount(''); setError(''); }}
          >
            <Text style={[styles.modeBtnText, { color: inputMode === 'gram' ? colors.text : colors.textMuted }]}>Gram</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.amountInputWrap, { backgroundColor: colors.surfaceHover, borderColor: error ? COLORS.red500 : colors.border }]}>
          <Text style={[styles.amountPrefix, { color: colors.textSecondary }]}>{inputMode === 'rupiah' ? 'Rp' : 'gr'}</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0"
            placeholderTextColor={colors.inputPlaceholder}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            editable={!isLoading}
          />
          <Text style={[styles.amountSuffix, { color: colors.textMuted }]}>{inputMode === 'rupiah' ? 'IDR' : 'GR'}</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : <View style={{ height: 8 }} />}

        {filteredQuick.length > 0 && (
          <View style={styles.quickGrid}>
            {filteredQuick.map((qa) => (
              <TouchableOpacity
                key={qa}
                style={[styles.quickBtn, { backgroundColor: accentLight }]}
                onPress={() => handleQuickAmount(qa)}
                disabled={isLoading}
              >
                <Text style={[styles.quickBtnText, { color: accentText }]}>{formatQuickLabel(qa, inputMode)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.summaryBox, { borderTopColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Harga Emas</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatRupiah(currentPrice?.buy || 0)}/gram</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {tab === 'buy' ? 'Emas yang Didapat' : 'Nominal Diterima'}
            </Text>
            <Text style={[styles.summaryValue, { color: accent, fontWeight: 'bold' }]}>
              {tab === 'buy' ? formatGram(displayGram) : formatRupiah(displayAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.summaryValueTotal, { color: colors.text }]}>
              {tab === 'buy' ? formatRupiah(displayAmount) : formatGram(displayGram)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: accent, opacity: (!amount || isLoading) ? 0.5 : 1 }]}
          onPress={handleConfirm}
          disabled={!amount || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitBtnText}>{tab === 'buy' ? 'Beli Emas' : 'Jual Emas'}</Text>
          )}
        </TouchableOpacity>

        <View style={[styles.infoBox, { backgroundColor: colors.surfaceHover }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {tab === 'buy' ? 'Saldo Rupiah' : 'Saldo Emas'}
            </Text>
            <Text style={[styles.infoValue, { color: COLORS.amber500 }]}>
              {tab === 'buy' ? formatRupiah(user?.balance || 0) : formatGram(user?.goldBalance || 0)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Harga beli</Text>
            <Text style={[styles.infoValue, { color: COLORS.emerald600 }]}>{formatRupiah(currentPrice?.buy || 0)}/gram</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Harga jual</Text>
            <Text style={[styles.infoValue, { color: COLORS.red600 }]}>{formatRupiah(currentPrice?.sell || 0)}/gram</Text>
          </View>
        </View>
      </View>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIcon, { backgroundColor: accentLight }]}>
              <Coins size={28} color={accent} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Konfirmasi {tab === 'buy' ? 'Pembelian' : 'Penjualan'}</Text>
            <View style={[styles.modalSummary, { backgroundColor: colors.surfaceHover }]}>
              <View style={styles.modalSummaryRow}>
                <Text style={[styles.modalSummaryLabel, { color: colors.textSecondary }]}>Nominal</Text>
                <Text style={[styles.modalSummaryValue, { color: colors.text }]}>{formatRupiah(displayAmount)}</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={[styles.modalSummaryLabel, { color: colors.textSecondary }]}>Emas</Text>
                <Text style={[styles.modalSummaryValue, { color: accent, fontWeight: 'bold' }]}>{formatGram(displayGram)}</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.surfaceHover }]} onPress={() => setShowConfirm(false)}>
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: accent }]} onPress={executeBuy}>
                <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Konfirmasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIcon, { backgroundColor: COLORS.emerald50 }]}>
              <CheckCircle2 size={32} color={COLORS.emerald500} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {tab === 'sell' ? 'Penjualan Berhasil!' : 'Transaksi Berhasil!'}
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              {tab === 'sell'
                ? `Anda telah menjual ${lastTx ? formatGram(lastTx.gramAmount) : '-'} emas`
                : `Anda telah membeli ${lastTx ? formatGram(lastTx.gramAmount) : '-'} emas`
              }
            </Text>
            <TouchableOpacity
              style={[styles.modalBtnFull, { backgroundColor: COLORS.amber500 }]}
              onPress={() => { setShowSuccess(false); navigation.goBack(); }}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Kembali ke Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  marketHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1,
  },
  marketLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  marketIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.amber500, justifyContent: 'center', alignItems: 'center',
  },
  marketTitle: { fontSize: 14, fontWeight: '700' },
  marketSub: { fontSize: 11 },
  marketPrices: { alignItems: 'flex-end', gap: 3 },
  marketPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  marketPriceValue: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
  marketPriceLabel: { fontSize: 10 },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },

  panel: { margin: 16, borderRadius: 16, padding: 16, borderWidth: 1 },

  balanceBar: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12, gap: 8, borderWidth: 1,
  },
  balanceBarLabel: { fontSize: 12, flex: 1 },
  balanceBarValue: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },

  modeToggle: {
    flexDirection: 'row', borderRadius: 10, padding: 2, marginBottom: 12,
  },
  modeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  modeBtnText: { fontSize: 13, fontWeight: '600' },

  amountInputWrap: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1, paddingHorizontal: 12, height: 52, marginBottom: 0,
  },
  amountPrefix: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 20, fontWeight: 'bold' },
  amountSuffix: { fontSize: 12, fontWeight: '600' },
  errorText: { fontSize: 12, color: COLORS.red500, marginBottom: 8, marginTop: 4 },

  quickGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 16,
  },
  quickBtn: {
    width: '23%', paddingVertical: 8, borderRadius: 8, alignItems: 'center',
  },
  quickBtnText: { fontSize: 11, fontWeight: '600' },

  summaryBox: { borderTopWidth: 1, paddingTop: 12, marginBottom: 16, gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: '500', fontVariant: ['tabular-nums'] },
  summaryValueTotal: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },

  submitBtn: {
    borderRadius: 10, height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  submitBtnText: { fontSize: 15, fontWeight: 'bold', color: COLORS.white },

  infoBox: { borderRadius: 10, padding: 12, gap: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 11, fontWeight: '500', fontVariant: ['tabular-nums'] },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalCard: {
    width: '100%', maxWidth: 360, borderRadius: 16, padding: 24, alignItems: 'center',
  },
  modalIcon: {
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalSummary: { width: '100%', borderRadius: 10, padding: 12, marginBottom: 20, gap: 8 },
  modalSummaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalSummaryLabel: { fontSize: 13 },
  modalSummaryValue: { fontSize: 13, fontVariant: ['tabular-nums'] },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnFull: { width: '100%', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnText: { fontSize: 14, fontWeight: '600' },
});

export default BuyGoldScreen;
