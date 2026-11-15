import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import BeforeYouStartScreen from '../screens/BeforeYouStartScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import AssessmentResultsScreen from '../screens/AssessmentResultsScreen';
import LessonScreen from '../screens/LessonScreen';
import RegistrationPromptScreen from '../screens/RegistrationPromptScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="BeforeYouStart"
        component={BeforeYouStartScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="AssessmentResults"
        component={AssessmentResultsScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Curriculum"
        component={LessonScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="RegistrationPrompt"
        component={RegistrationPromptScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}
