import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList, MainStackParamList } from './types';
import { FONTS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import JourneyScreen from '../screens/JourneyScreen';
import LibraryScreen from '../screens/LibraryScreen';
import StatsScreen from '../screens/StatsScreen';
import BibleScreen from '../screens/BibleScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

// Tab icon using text symbols — replace with icons library later
function TabIcon({
  label,
  focused,
  colors,
}: {
  label: string;
  focused: boolean;
  colors: ThemeColors;
}) {
  const icons: Record<string, string> = {
    Journey: '⌂',
    Library: '⚏',
    Stats: '◈',
    Bible: '✝',
  };
  return (
    <Text
      style={{ fontSize: 20, color: focused ? colors.accent : colors.textMuted }}
    >
      {icons[label]}
    </Text>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderStrong,
          borderTopWidth: 1,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          paddingBottom: insets.bottom + 8,
          paddingTop: 7,
          height: 72 + insets.bottom,
          overflow: 'hidden',
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: FONTS.sans,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} colors={colors} />
        ),
      })}
    >
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Bible" component={BibleScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}
