import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { width: W, height: H } = Dimensions.get('window');

type NavProp = StackNavigationProp<AuthStackParamList, 'Landing'>;

export default function LandingScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors, mode, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'Christ My Core';
    }
  }, []);

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(16)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyY = useRef(new Animated.Value(16)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(0.92)).current;
  const loginOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const introAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bodyOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bodyY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(ctaScale, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(loginOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);
    introAnimation.start();

    return () => {
      introAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />
      <StarField color={colors.star} />

      <TouchableOpacity
        onPress={toggleTheme}
        style={styles.themeToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.themeToggleText}>
          {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.safe, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <View style={styles.logoSection}>
          <View style={styles.glow} />
          <View style={styles.logoStage} pointerEvents="none">
            <Animated.View
              style={[
                styles.logoArt,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <Image
                source={require('../../assets/Leaves_grow_on_tree.gif')}
                style={styles.video}
                contentFit="contain"
                autoplay
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.content}>
          <Animated.View
            style={{
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            }}
          >
            <Text style={styles.tagline}>
              "Life tests your application of the{'\n'}Word, not your memory"
            </Text>
          </Animated.View>
          <Animated.View
            style={{ opacity: bodyOpacity, transform: [{ translateY: bodyY }] }}
          >
            <Text style={styles.subhead}>A place to grow</Text>
          </Animated.View>
          <View style={styles.divider} />
          <Animated.View
            style={{ opacity: bodyOpacity, transform: [{ translateY: bodyY }] }}
          >
            <Text style={styles.body}>
              Your journey to apply the Bible to{'\n'}make everyday decisions
              starts here.
            </Text>
          </Animated.View>
        </View>

        <View style={styles.ctaSection}>
          <Animated.View
            style={{
              opacity: ctaOpacity,
              transform: [{ scale: ctaScale }],
              width: '100%',
            }}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('BeforeYouStart')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.accentLight, colors.accent, '#A8852E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: loginOpacity }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>I already have an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const STARS: { top: number; left: number; size: number }[] = [
  { top: H * 0.04, left: W * 0.1, size: 1.5 },
  { top: H * 0.08, left: W * 0.78, size: 2 },
  { top: H * 0.03, left: W * 0.5, size: 1 },
  { top: H * 0.12, left: W * 0.33, size: 1 },
  { top: H * 0.06, left: W * 0.88, size: 1.5 },
  { top: H * 0.15, left: W * 0.62, size: 1 },
  { top: H * 0.02, left: W * 0.22, size: 2 },
  { top: H * 0.09, left: W * 0.92, size: 1 },
  { top: H * 0.18, left: W * 0.05, size: 1.5 },
  { top: H * 0.05, left: W * 0.55, size: 1 },
];

function StarField({ color }: { color: string }) {
  return (
    <>
      {STARS.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: s.size,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    safe: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
      paddingTop: SPACING.xl,
    },
    glow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 280,
      height: 280,
      marginLeft: -140,
      marginTop: -140,
      borderRadius: 140,
      backgroundColor: colors.glow,
      opacity: 0.12,
    },
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'web' ? 16 : 50,
      right: SPACING.md,
      zIndex: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    themeToggleText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 12,
      color: colors.textMuted,
    },
    logoSection: {
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoStage: {
      width: 220,
      height: 220,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoArt: {
      width: 220,
      height: 220,
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    content: {
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: SPACING.md,
    },
    tagline: {
      fontFamily: FONTS.serifItalic,
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
      letterSpacing: 1.2,
      lineHeight: 22,
      textTransform: 'uppercase',
    },
    subhead: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: colors.accent,
      textAlign: 'center',
      marginBottom: SPACING.sm,
    },
    divider: {
      width: 44,
      height: 2,
      backgroundColor: colors.accent,
      borderRadius: 2,
      marginVertical: SPACING.md,
      opacity: 0.85,
    },
    body: {
      fontFamily: FONTS.serifRegular,
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 30,
    },
    ctaSection: {
      width: '100%',
      alignItems: 'center',
      gap: SPACING.md,
      marginTop: SPACING.lg,
    },
    primaryButton: {
      width: '100%',
      borderRadius: 999,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    primaryButtonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontFamily: FONTS.sansBold,
      fontSize: 15,
      color: colors.accentText,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    loginLink: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
    loginText: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}
