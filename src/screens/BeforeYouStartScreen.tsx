import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BeforeYouStartNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const OBJECTIVES = [
  'Identify current strengths in Christ',
  'Recognize growth opportunities in the Spirit',
  'Map your spiritual formation landscape',
];

export default function BeforeYouStartScreen() {
  const navigation = useNavigation<BeforeYouStartNavProp>();
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
          <View style={styles.introCard}>
            <Text style={styles.kicker}>Self-assessment</Text>
            <Text style={styles.title}>Before you start</Text>
            <Text style={styles.subtitle}>
              Answer each question honestly based on where you are now — not
              where you want to be.
            </Text>

            <Text style={styles.sectionLabel}>Assessment objectives</Text>
            <View style={styles.objectivesList}>
              {OBJECTIVES.map((objective, i) => (
                <View key={i} style={styles.objectiveRow}>
                  <View style={styles.bulletWrap}>
                    <Text style={styles.bullet}>{i + 1}</Text>
                  </View>
                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Assessment')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.accentLight, colors.accent, '#A8852E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Start Assessment</Text>
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
      paddingBottom: SPACING.xl,
      paddingTop: SPACING.xl,
    },
    headerLogo: {
      width: 84,
      height: 84,
      marginBottom: 0,
      ...(colors.logoTint ? { tintColor: colors.logoTint } : {}),
    },
    content: { flex: 1, justifyContent: 'flex-start' },
    introCard: {
      backgroundColor: colors.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: SPACING.lg,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    kicker: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: colors.accent,
      marginBottom: SPACING.sm,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 30,
      lineHeight: 38,
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontFamily: FONTS.sansMedium,
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: SPACING.xl,
    },
    sectionLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    objectivesList: { gap: SPACING.md },
    objectiveRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.sm,
    },
    bulletWrap: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    bullet: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      color: colors.accentText,
    },
    objectiveText: {
      flex: 1,
      fontFamily: FONTS.sans,
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    actions: { width: '100%', gap: SPACING.md },
    primaryButton: {
      width: '100%',
      borderRadius: 999,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.18,
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
      backgroundColor: colors.inputBg,
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
