import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ClassificationSlug } from '../constants/classifications';

// All screens in the auth flow (before login)
export type AuthStackParamList = {
  Landing: undefined;
  Login:
    | {
        initialMode?: 'login' | 'signup';
        scores?: Record<ClassificationSlug, number>;
      }
    | undefined;
  BeforeYouStart: undefined;
  Assessment: undefined;
  AssessmentResults: { answers: Record<string, string> };
  Curriculum: {
    classification: ClassificationSlug;
    scores: Record<ClassificationSlug, number>;
  };
  RegistrationPrompt: { scores: Record<ClassificationSlug, number> };
};

// Bottom tabs in the main app (after login/registration)
export type MainTabParamList = {
  Journey: undefined;
  Library: undefined;
  Stats: undefined;
  Bible: undefined;
};

// Wraps MainTabParamList so screens reached from the header (e.g. Profile,
// tapped from the top-right avatar per the UX spec) push on top of the tabs
// instead of living in the tab bar themselves.
export type MainStackParamList = {
  Tabs: undefined;
  Profile: undefined;
};

// Root navigator — switches between auth and main
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Navigation prop types — import these in each screen
export type LandingNavProp = StackNavigationProp<AuthStackParamList, 'Landing'>;
export type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;
export type BeforeYouStartNavProp = StackNavigationProp<
  AuthStackParamList,
  'BeforeYouStart'
>;
export type AssessmentNavProp = StackNavigationProp<
  AuthStackParamList,
  'Assessment'
>;
export type AssessmentResultsNavProp = StackNavigationProp<
  AuthStackParamList,
  'AssessmentResults'
>;
export type AssessmentResultsRouteProp = RouteProp<
  AuthStackParamList,
  'AssessmentResults'
>;
export type CurriculumNavProp = StackNavigationProp<
  AuthStackParamList,
  'Curriculum'
>;
export type CurriculumRouteProp = RouteProp<AuthStackParamList, 'Curriculum'>;
export type RegistrationPromptNavProp = StackNavigationProp<
  AuthStackParamList,
  'RegistrationPrompt'
>;
export type RegistrationPromptRouteProp = RouteProp<
  AuthStackParamList,
  'RegistrationPrompt'
>;

// Dashboard nav prop types — composite so tab screens can also push the
// header-reached Profile screen from the wrapping MainStackParamList.
export type JourneyNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Journey'>,
  StackNavigationProp<MainStackParamList>
>;
export type LibraryNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Library'>,
  StackNavigationProp<MainStackParamList>
>;
export type StatsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Stats'>,
  StackNavigationProp<MainStackParamList>
>;
export type BibleNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Bible'>,
  StackNavigationProp<MainStackParamList>
>;
export type ProfileNavProp = StackNavigationProp<MainStackParamList, 'Profile'>;
