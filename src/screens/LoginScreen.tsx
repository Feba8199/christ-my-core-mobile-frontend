import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type NavProp = StackNavigationProp<AuthStackParamList, 'Login'>;
type RouteProps = RouteProp<AuthStackParamList, 'Login'>;
type Mode = 'login' | 'signup';

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { colors } = useTheme();
  const { login } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mode, setMode] = useState<Mode>(route.params?.initialMode ?? 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(30)).current;
  const nameHeight = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  // Set browser tab title
  React.useEffect(() => {
    // Update browser tab title when mode changes
    if (Platform.OS === 'web') {
      document.title =
        mode === 'login'
          ? 'Sign In — Christ My Core'
          : 'Sign Up — Christ My Core';
    }
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (mode === 'signup') {
      Animated.parallel([
        Animated.timing(nameHeight, {
          toValue: 72,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(nameHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(nameOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [mode]);

  function shakeError() {
    Animated.sequence([
      Animated.timing(shakeX, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function handleSubmit() {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      shakeError();
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your name.');
      shakeError();
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      shakeError();
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      shakeError();
      return;
    }

    setIsLoading(true);
    // TODO: replace with real API call — api.post('/auth/login', { email, password })
    setTimeout(() => {
      setIsLoading(false);
      login({
        name: mode === 'signup' ? name : email.split('@')[0],
        email,
        assessmentScores: route.params?.scores,
      });
    }, 1500);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideY }, { translateX: shakeX }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.crossSmall}>
                <View style={styles.crossV} />
                <View style={styles.crossH} />
              </View>
              <Text style={styles.title}>
                {mode === 'login' ? 'Welcome back' : 'Start your journey'}
              </Text>
              <Text style={styles.subtitle}>
                {mode === 'login'
                  ? 'Sign in to continue your walk with the Word'
                  : 'Create an account to begin your assessment'}
              </Text>
            </View>

            {/* Toggle */}
            <View style={styles.toggle}>
              {(['login', 'signup'] as Mode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.toggleBtn, mode === m && styles.toggleActive]}
                  onPress={() => {
                    setMode(m);
                    setError('');
                  }}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === m && styles.toggleTextActive,
                    ]}
                  >
                    {m === 'login' ? 'Sign in' : 'Sign up'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name — signup only */}
              <Animated.View
                style={{
                  height: nameHeight,
                  opacity: nameOpacity,
                  overflow: 'hidden',
                }}
              >
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Your name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Grace Okafor"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </Animated.View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    <Text style={styles.eyeText}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {mode === 'login' && (
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {error !== '' && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.accentLight, colors.accent, '#A8852E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.accentText} />
                  ) : (
                    <Text style={styles.submitText}>
                      {mode === 'login' ? 'Sign in' : 'Create account'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                style={styles.switchBtn}
              >
                <Text style={styles.switchText}>
                  {mode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <Text style={styles.switchLink}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Text style={styles.scripture}>
            "Your word is a lamp to my feet"{'\n'}— Psalm 119:105
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: SPACING.md,
      paddingTop: Platform.OS === 'web' ? 40 : 60,
      paddingBottom: SPACING.xl,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: SPACING.lg,
      alignSelf: 'flex-start',
    },
    backArrow: { color: colors.accent, fontSize: 20 },
    backText: { fontFamily: FONTS.sans, fontSize: 15, color: colors.textMuted },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SPACING.lg,
      width: '100%',
      maxWidth: 420,
      alignSelf: 'center',
    },
    header: { alignItems: 'center', marginBottom: SPACING.lg },
    crossSmall: {
      width: 28,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    crossV: {
      position: 'absolute',
      width: 5,
      height: 36,
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    crossH: {
      position: 'absolute',
      width: 22,
      height: 5,
      backgroundColor: colors.accent,
      borderRadius: 2,
      top: 8,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    toggle: {
      flexDirection: 'row',
      backgroundColor: colors.inputBg,
      borderRadius: 12,
      padding: 4,
      marginBottom: SPACING.lg,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    toggleActive: {
      backgroundColor: 'rgba(201, 168, 76, 0.15)',
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14,
      color: colors.textMuted,
    },
    toggleTextActive: { color: colors.accent },
    form: { gap: SPACING.sm },
    inputWrapper: { gap: 6, marginBottom: 4 },
    inputLabel: {
      fontFamily: FONTS.sansMedium,
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 2,
    },
    input: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: FONTS.sans,
      fontSize: 15,
      color: colors.textPrimary,
    },
    passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    eyeBtn: { padding: 8 },
    eyeText: { fontSize: 18 },
    forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
    forgotText: { fontFamily: FONTS.sans, fontSize: 13, color: colors.accent },
    errorBox: {
      backgroundColor: colors.errorBg,
      borderWidth: 1,
      borderColor: colors.errorBorder,
      borderRadius: 10,
      padding: 12,
    },
    errorText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.error,
      textAlign: 'center',
    },
    submitButton: {
      borderRadius: 50,
      overflow: 'hidden',
      marginTop: SPACING.sm,
    },
    submitGradient: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: {
      fontFamily: FONTS.sansBold,
      fontSize: 16,
      color: colors.accentText,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.borderStrong,
    },
    dividerText: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      color: colors.textMuted,
    },
    switchBtn: { alignItems: 'center', paddingVertical: 4 },
    switchText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMuted,
    },
    switchLink: { color: colors.accent, fontFamily: FONTS.sansMedium },
    scripture: {
      fontFamily: FONTS.serifItalic,
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: SPACING.xl,
      lineHeight: 22,
      opacity: 0.7,
    },
  });
}
