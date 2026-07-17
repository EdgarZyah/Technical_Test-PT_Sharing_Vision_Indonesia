import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import { LayoutDashboard, BarChart3, LogOut, Coins } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BuyGoldScreen from '../screens/BuyGoldScreen';
import Header from '../components/Header';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 260;

const DrawerContext = createContext(null);

const NAV_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', IconComponent: LayoutDashboard },
  { key: 'BuyGold', label: 'Beli Emas', IconComponent: BarChart3 },
];

function CustomDrawer({ visible, onClose, onNavigate, currentRoute }) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={drawerStyles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={drawerStyles.backdrop} />
      </TouchableWithoutFeedback>
      <Animated.View style={[drawerStyles.panel, { backgroundColor: colors.sidebarBg, borderRightColor: colors.sidebarBorder, transform: [{ translateX }] }]}>
        <View style={[drawerStyles.logoSection, { borderBottomColor: colors.sidebarBorder }]}>
          <View style={drawerStyles.logoRow}>
            <View style={drawerStyles.logoIcon}>
              <Coins size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={[drawerStyles.logoTitle, { color: colors.text }]}>HaloEmas</Text>
              <Text style={[drawerStyles.logoSubtitle, { color: colors.textSecondary }]}>Investasi Emas Digital</Text>
            </View>
          </View>
        </View>

        <View style={drawerStyles.navSection}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[drawerStyles.navItem, isActive && { backgroundColor: colors.navActive }]}
                onPress={() => { onNavigate(item.key); onClose(); }}
              >
                <item.IconComponent size={20} color={isActive ? colors.navActiveText : colors.navInactive} />
                <Text style={[drawerStyles.navLabel, { color: isActive ? colors.navActiveText : colors.navInactive }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[drawerStyles.logoutSection, { borderTopColor: colors.sidebarBorder }]}>
          <Text style={[drawerStyles.userLabel, { color: colors.textMuted }]}>Masuk sebagai</Text>
          <Text style={[drawerStyles.userName, { color: colors.text }]}>{user?.name}</Text>
          <TouchableOpacity style={drawerStyles.logoutBtn} onPress={logout}>
            <LogOut size={16} color={COLORS.red600} />
            <Text style={drawerStyles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function DrawerProvider({ children }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigationRef = useRef(null);
  const [currentRoute, setCurrentRoute] = useState('Dashboard');

  const toggleDrawer = useCallback(() => {
    setDrawerVisible((v) => !v);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const navigateTo = useCallback((routeName) => {
    navigationRef.current?.navigate(routeName);
    setCurrentRoute(routeName);
  }, []);

  return (
    <DrawerContext.Provider value={{ toggleDrawer, currentRoute, setCurrentRoute }}>
      {children}
      <CustomDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        onNavigate={navigateTo}
        currentRoute={currentRoute}
      />
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
};

const drawerStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: {
    position: 'absolute', top: 0, bottom: 0, left: 0,
    width: DRAWER_WIDTH, borderRightWidth: 1,
  },
  logoSection: { paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.amber500, justifyContent: 'center', alignItems: 'center',
  },
  logoTitle: { fontSize: 18, fontWeight: 'bold' },
  logoSubtitle: { fontSize: 12 },
  navSection: { flex: 1, paddingHorizontal: 12, paddingVertical: 16, gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, gap: 12 },
  navLabel: { fontSize: 14, fontWeight: '500' },
  logoutSection: { paddingHorizontal: 12, paddingVertical: 16, borderTopWidth: 1 },
  userLabel: { fontSize: 11, paddingHorizontal: 12, marginBottom: 2 },
  userName: { fontSize: 14, fontWeight: '600', paddingHorizontal: 12, marginBottom: 10 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, backgroundColor: COLORS.red50, gap: 12,
  },
  logoutText: { fontSize: 14, fontWeight: '500', color: COLORS.red600 },
});

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={loadingStyles.container}>
        <View style={loadingStyles.spinner}>
          <View style={loadingStyles.spinnerInner} />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <DrawerProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          )}
          {isAuthenticated && (
            <Stack.Screen name="BuyGold" component={BuyGoldScreen} />
          )}
        </Stack.Navigator>
      </DrawerProvider>
    </NavigationContainer>
  );
};

const loadingStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gray50 },
  spinner: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 4,
    borderColor: COLORS.amber500, borderTopColor: 'transparent',
  },
  spinnerInner: {},
});

export default AppNavigator;
