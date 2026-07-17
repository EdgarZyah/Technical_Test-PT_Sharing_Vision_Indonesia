import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/store/AuthContext';
import { GoldProvider } from './src/store/GoldContext';
import { ThemeProvider } from './src/store/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AuthProvider>
          <GoldProvider>
            <AppNavigator />
          </GoldProvider>
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
