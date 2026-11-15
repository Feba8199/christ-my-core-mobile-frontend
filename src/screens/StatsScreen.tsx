import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatsNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CLASSIFICATION_LABELS } from '../constants/classifications';
import { getStats } from '../api/stats';
import { UNASSESSED_SCORES } from '../api/journey';
import RadarChart from '../components/RadarChart';

export default function StatsScreen() {
  const navigation = useNavigation<StatsNavProp>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const stats = useMemo(
    () => getStats(user?.assessmentScores ?? UNASSESSED_SCORES),
    [user?.assessmentScores]
  );

  const chartData = useMemo(
    () =>
      stats.classifications.map((c) => ({
        label: CLASSIFICATION_LABELS[c.classification],
        level: c.currentLevel,
      })),
    [stats]
  );

  const initials = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <Text style={styles.headerTitle}>Stats</Text>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.summary}>
          {stats.completedCount} of {stats.totalCount} courses completed
        </Text>

        <View style={styles.chartWrap}>
          <RadarChart
            data={chartData}
            gridColor={colors.borderStrong}
            fillColor={colors.accent}
            strokeColor={colors.accent}
            labelColor={colors.textMuted}
          />
        </View>

        <Text style={styles.sectionLabel}>Achievement Ladder</Text>
        <View style={styles.ladderList}>
          {stats.classifications.map((c) => (
            <View key={c.classification} style={styles.ladderRow}>
              <Text style={styles.ladderLabel}>
                {CLASSIFICATION_LABELS[c.classification]}
              </Text>
              <View style={styles.badgeRow}>
                {c.badges.map((status, i) => (
                  <View
                    key={i}
                    style={[
                      styles.badge,
                      status === 'completed' && styles.badgeCompleted,
                      status === 'active' && styles.badgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        status === 'completed' && styles.badgeTextCompleted,
                      ]}
                    >
                      {status === 'completed' ? '✓' : i + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.md,
    },
    headerTitle: {
      fontFamily: FONTS.serif,
      fontSize: 22,
      color: colors.textPrimary,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'rgba(201, 168, 76, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FONTS.sansBold,
      fontSize: 15,
      color: colors.accent,
    },
    scroll: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xxl,
    },
    summary: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    chartWrap: { alignItems: 'center', marginBottom: SPACING.lg },
    sectionLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    ladderList: { gap: SPACING.md },
    ladderRow: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: SPACING.md,
      gap: SPACING.sm,
    },
    ladderLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 14,
      color: colors.textPrimary,
    },
    badgeRow: { flexDirection: 'row', gap: SPACING.sm },
    badge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeCompleted: {
      backgroundColor: 'rgba(62, 142, 90, 0.2)',
      borderColor: '#3E8E5A',
    },
    badgeActive: {
      backgroundColor: 'rgba(201, 168, 76, 0.15)',
      borderColor: colors.accent,
    },
    badgeText: {
      fontFamily: FONTS.sansBold,
      fontSize: 13,
      color: colors.textMuted,
    },
    badgeTextCompleted: { color: '#3E8E5A' },
  });
}
