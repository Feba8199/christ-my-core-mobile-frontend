import React, { useCallback } from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_400Regular_Italic,
} from '@expo-google-fonts/merriweather';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppInner() {
  const { colors } = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && Platform.OS !== 'web') {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const app = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <NavigationContainer documentTitle={{ enabled: false }}>
            <RootNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  // Web — show inside a phone frame for demos
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOuter}>
        <View style={styles.webPhone}>{app}</View>
      </View>
    );
  }

  return app;
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    backgroundColor: '#070C14',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
    paddingVertical: 12,
  },
  webPhone: {
    width: 390,
    height: '100vh' as any,
    maxHeight: 844,
    maxWidth: '100vw' as any,
    overflow: 'hidden',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(216, 177, 100, 0.35)',
    backgroundColor: '#0A1018',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
});
