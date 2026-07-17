import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react-native';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { COLORS, DEMO_USER } from '../constants/theme';

const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email wajib diisi';
    else if (!email.includes('@')) e.email = 'Format email tidak valid';
    if (!password) e.password = 'Password wajib diisi';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    const result = await login(email.trim(), password);
    if (!result.success) Alert.alert('Login Gagal', result.error);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setErrors({});
    login(DEMO_USER.email, DEMO_USER.password);
  };

  const bgGradient = isDark
    ? [COLORS.gray900, COLORS.gray800, COLORS.gray900]
    : [COLORS.amber50, COLORS.white, COLORS.amber100];

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <LinearGradient colors={bgGradient} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>Au</Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>HaloEmas</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Investasi Emas Digital Anda</Text>
          </View>

          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Masuk</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Silakan masuk ke akun Anda</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: errors.email ? COLORS.red500 : colors.inputBorder }]}>
                <Mail size={16} color={COLORS.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="contoh@email.com"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={email}
                  onChangeText={(t) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: null }); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: errors.password ? COLORS.red500 : colors.inputBorder }]}>
                <Lock size={16} color={COLORS.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.text, flex: 1 }]}
                  placeholder="Masukkan password"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={password}
                  onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: null }); }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} color={COLORS.gray400} /> : <Eye size={16} color={COLORS.gray400} />}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.loginBtnText}>Masuk</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>Atau masuk dengan akun demo</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.demoCard, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <View style={styles.demoAvatar}>
                <UserCircle size={22} color={COLORS.amber600} />
              </View>
              <View style={styles.demoInfo}>
                <Text style={[styles.demoName, { color: colors.text }]}>{DEMO_USER.name}</Text>
                <Text style={[styles.demoEmail, { color: colors.textSecondary }]}>{DEMO_USER.email}</Text>
              </View>
              <Text style={styles.demoLoginLabel}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  header: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: COLORS.amber500,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.amber500, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  card: {
    borderRadius: 16, padding: 24, borderWidth: 1,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1, paddingHorizontal: 12, height: 48, gap: 8,
  },
  input: { flex: 1, fontSize: 14, height: '100%' },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: COLORS.red500, marginTop: 4 },
  loginBtn: {
    backgroundColor: COLORS.amber500, borderRadius: 12,
    height: 48, justifyContent: 'center', alignItems: 'center',
    marginTop: 8, shadowColor: COLORS.amber500,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  loginBtnText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20, gap: 8,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  demoCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 12,
  },
  demoAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.amber100,
    justifyContent: 'center', alignItems: 'center',
  },
  demoInfo: { flex: 1 },
  demoName: { fontSize: 14, fontWeight: '600' },
  demoEmail: { fontSize: 12 },
  demoLoginLabel: { fontSize: 12, fontWeight: '600', color: COLORS.amber600 },
});

export default LoginScreen;
