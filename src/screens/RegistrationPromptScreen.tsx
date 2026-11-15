import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  RegistrationPromptNavProp,
  RegistrationPromptRouteProp,
} from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function RegistrationPromptScreen() {
  const navigation = useNavigation<RegistrationPromptNavProp>();
  const route = useRoute<RegistrationPromptRouteProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.safe, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text style={styles.eyebrow}>Keep going</Text>
          <Text style={styles.title}>Hope you enjoyed that lesson</Text>
          <Text style={styles.subtitle}>
            Before we can proceed further, create a free account so your
            progress can be saved and more personalised content can be
            provided for your journey.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('Login', {
                initialMode: 'signup',
                scores: route.params.scores,
              })
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.accentLight, colors.accent, '#A8852E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Create Free Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    safe: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
      paddingTop: SPACING.xl,
    },
    headerLogo: {
      width: 72,
      height: 72,
      marginBottom: SPACING.lg,
      ...(colors.logoTint ? { tintColor: colors.logoTint } : {}),
    },
    content: { flex: 1, justifyContent: 'center' },
    eyebrow: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: colors.accent,
      marginBottom: SPACING.sm,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 28,
      lineHeight: 35,
      color: colors.textPrimary,
      marginBottom: SPACING.md,
    },
    subtitle: {
      fontFamily: FONTS.sansMedium,
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    actions: { width: '100%', gap: SPACING.md },
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
    secondaryButton: {
      width: '100%',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(255,255,255,0.02)',
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 15,
      color: colors.textMuted,
      letterSpacing: 1,
    },
  });
}
