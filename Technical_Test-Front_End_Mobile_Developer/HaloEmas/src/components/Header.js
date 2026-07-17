import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../store/ThemeContext';
import { useDrawer } from '../navigation/AppNavigator';
import { COLORS } from '../constants/theme';

const Header = ({ title }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { toggleDrawer } = useDrawer();

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
      <View style={styles.left}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.surfaceHover }]}
          onPress={toggleDrawer}
        >
          <Menu size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surfaceHover }]}
          onPress={toggleTheme}
        >
          {isDark ? <Sun size={18} color={COLORS.amber400} /> : <Moon size={18} color={COLORS.gray400} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
