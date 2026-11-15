import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FONTS, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

type LogoStyles = ReturnType<typeof createStyles>;

// Animated rays that pulse outward from the cross
function GlowRays({
  opacity,
  styles,
}: {
  opacity: Animated.Value;
  styles: LogoStyles;
}) {
  return (
    <Animated.View style={[styles.raysContainer, { opacity }]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View
          key={i}
          style={[styles.ray, { transform: [{ rotate: `${i * 30}deg` }] }]}
        />
      ))}
    </Animated.View>
  );
}

// The cross shape
function Cross({
  scale,
  styles,
}: {
  scale: Animated.Value;
  styles: LogoStyles;
}) {
  return (
    <Animated.View style={[styles.crossContainer, { transform: [{ scale }] }]}>
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
    </Animated.View>
  );
}

export default function AnimatedLogo() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const rayOpacity = useRef(new Animated.Value(0)).current;
  const rayPulse = useRef(new Animated.Value(0.8)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: cross appears → rays burst → text fades in
    Animated.sequence([
      // 1. Cross scales in
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      // 2. Rays burst out
      Animated.timing(rayOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // 3. Text slides up and fades in
      Animated.parallel([
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Continuous gentle ray pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(rayPulse, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rayPulse, {
            toValue: 0.85,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Glow halo behind cross */}
      <Animated.View style={[styles.halo, { opacity: rayOpacity }]} />

      {/* Pulsing rays */}
      <Animated.View
        style={[
          styles.raysWrap,
          { opacity: rayOpacity, transform: [{ scale: rayPulse }] },
        ]}
      >
        <GlowRays opacity={rayOpacity} styles={styles} />
      </Animated.View>

      {/* Cross */}
      <Animated.View style={{ opacity: fadeIn }}>
        <Cross scale={scale} styles={styles} />
      </Animated.View>

      {/* Logo wordmark */}
      <Animated.View
        style={[
          styles.wordmark,
          {
            opacity: textOpacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        <Text style={styles.christText}>Christ</Text>
        <Text style={styles.coriText}>CORI</Text>
      </Animated.View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      width: 200,
    },
    halo: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: colors.glow,
    },
    raysWrap: {
      position: 'absolute',
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
    },
    raysContainer: {
      width: 160,
      height: 160,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ray: {
      position: 'absolute',
      width: 1.5,
      height: 80,
      backgroundColor: 'rgba(201, 168, 76, 0.35)',
      borderRadius: 2,
      top: 0,
      left: '50%',
      transformOrigin: 'bottom',
    },
    crossContainer: {
      width: 44,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    crossVertical: {
      position: 'absolute',
      width: 8,
      height: 60,
      backgroundColor: colors.textPrimary,
      borderRadius: 3,
    },
    crossHorizontal: {
      position: 'absolute',
      width: 36,
      height: 8,
      backgroundColor: colors.textPrimary,
      borderRadius: 3,
      top: 14,
    },
    wordmark: {
      marginTop: 16,
      alignItems: 'center',
    },
    christText: {
      fontFamily: FONTS.serif,
      fontSize: 28,
      color: colors.textPrimary,
      letterSpacing: 1,
    },
    coriText: {
      fontFamily: FONTS.sansBold,
      fontSize: 13,
      color: colors.accent,
      letterSpacing: 6,
      marginTop: -2,
    },
  });
}
