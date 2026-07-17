import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { COLORS } from '../constants/theme';

const NAV_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', icon: '\u2302' },
  { key: 'BuyGold', label: 'Beli Emas', icon: '\u25B2' },
];

const Sidebar = (props) => {
  const { logout, user } = useAuth();
  const { colors, isDark } = useTheme();
  const currentRoute = props.state?.routes[props.state?.index]?.name;

  return (
    <View style={[styles.container, { backgroundColor: colors.sidebarBg, borderRightColor: colors.sidebarBorder }]}>
      <View style={[styles.logoSection, { borderBottomColor: colors.sidebarBorder }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>Au</Text>
          </View>
          <View>
            <Text style={[styles.logoTitle, { color: colors.text }]}>HaloEmas</Text>
            <Text style={[styles.logoSubtitle, { color: colors.textSecondary }]}>Investasi Emas Digital</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} style={styles.navScroll} contentContainerStyle={styles.navContent}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentRoute === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.navItem,
                isActive && { backgroundColor: colors.navActive },
              ]}
              onPress={() => props.navigation.navigate(item.key)}
            >
              <Text style={[
                styles.navIcon,
                { color: isActive ? colors.navActiveText : colors.navInactive },
              ]}>{item.icon}</Text>
              <Text style={[
                styles.navLabel,
                { color: isActive ? colors.navActiveText : colors.navInactive },
              ]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <View style={[styles.logoutSection, { borderTopColor: colors.sidebarBorder }]}>
        <Text style={[styles.userLabel, { color: colors.textMuted }]}>Masuk sebagai</Text>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutIcon}>{'\u2190'}</Text>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
  },
  logoSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.amber500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoSubtitle: {
    fontSize: 12,
  },
  navScroll: {
    flex: 1,
  },
  navContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 12,
  },
  navIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  userLabel: {
    fontSize: 11,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.red50,
    gap: 12,
  },
  logoutIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    color: COLORS.red600,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.red600,
  },
});

export default Sidebar;
