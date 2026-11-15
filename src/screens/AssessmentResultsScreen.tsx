import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  AssessmentResultsNavProp,
  AssessmentResultsRouteProp,
} from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { computeAssessmentResult } from '../api/assessments';
import {
  getCategoryLevels,
  generateSummary,
  getReflection,
  getGrowthClassification,
} from '../utils/assessmentResult';
import {
  CLASSIFICATION_LABELS,
  CLASSIFICATION_ORDER,
  ClassificationSlug,
} from '../constants/classifications';
import RadarChart from '../components/RadarChart';

function AreaIcon({ slug }: { slug: ClassificationSlug }) {
  switch (slug) {
    case 'abiding-upwards':
      return (
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <Path
            d="M21 4c2 6-3 8-1.7 12 .5 1.6 2 2 3 1.2.9-.7 1.2-2.2.7-3.5 4.4 2.7 7 6.1 6.2 11.1-.7 5.5-4.5 9.2-10 9.2-5.6 0-9.7-4-9.7-9.2 0-3.8 2.1-6.8 5.4-10-.3 3.6.7 5 2.3 4.8 1.8-.2 2-2.5 1-4.8C16.8 11.7 17.5 7.6 21 4Z"
            fill="#E98543"
          />
          <Path
            d="M20.2 21c.7 2.4-1.8 3.5-1.2 5.2.2.7.8 1 1.4.6.5-.3.7-1 .6-1.7 2.2 1.5 3.3 3.2 2.8 5.2-.5 1.8-1.8 2.8-3.8 2.8-2.2 0-3.7-1.4-3.7-3.5 0-1.5.8-2.8 2.2-4.1-.1 1.3.2 1.8.8 1.7.8-.1.8-.9.4-1.8-.5-1.2-.2-2.8.5-4.4Z"
            fill="#FFD36E"
          />
        </Svg>
      );
    case 'discipling-downwards-deep':
      return (
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <Path
            d="M11 17c0-5 4-9 9-9s9 4 9 9c0 3.1-1.7 4.8-3.4 7.1-.8 1.1-1.1 2-1.1 3.4h-9c0-1.4-.3-2.3-1.1-3.4C12.7 21.8 11 20.1 11 17Z"
            fill="#F2CB66"
          />
          <Rect x={15} y={28} width={10} height={3} rx={1.5} fill="#D59A48" />
          <Rect x={16.5} y={32} width={7} height={2.5} rx={1.25} fill="#E8B65D" />
          <Path d="M20 3v3M8 8l2.5 2M32 8l-2.5 2M5 18h3M32 18h3" stroke="#F6D982" strokeWidth={2} strokeLinecap="round" />
          <Path d="M17 16.5c.6-2 2.2-3.3 4.5-3.3" stroke="#FFF2BF" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'private-life-inwards':
      return (
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <Path d="M20 5c-1.2 7.2-.4 13.8 0 22" stroke="#70A978" strokeWidth={3} strokeLinecap="round" />
          <Path d="M19.7 18C11 18 9 12.7 10 9c6.2.1 10.2 2.8 9.7 9Z" fill="#8CC58A" />
          <Path d="M20.1 23c.3-7.5 5.2-10.3 10-9.7-.2 6.4-3.3 10.2-10 9.7Z" fill="#B3D88F" />
          <Path d="M12 31c4.8-2.7 11.2-2.7 16 0" stroke="#D8B164" strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={20} cy={30} r={2.3} fill="#F2CB66" />
        </Svg>
      );
    case 'relationships-outwards-sideways':
      return (
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <Circle cx={14} cy={14} r={5} fill="#E9A39B" />
          <Circle cx={26} cy={14} r={5} fill="#F2CB66" />
          <Path d="M5 31c.5-6.4 3.5-9.5 9-9.5s8.5 3.1 9 9.5H5Z" fill="#E9A39B" />
          <Path d="M17 31c.5-6.4 3.5-9.5 9-9.5s8.5 3.1 9 9.5H17Z" fill="#F2CB66" />
          <Path d="M20 25.5c-1.6-2-5-4.1-5-6.7 0-2.8 3.6-3.7 5-1.1 1.5-2.6 5-1.7 5 1.1 0 2.6-3.4 4.7-5 6.7Z" fill="#FFF1D4" />
        </Svg>
      );
    case 'kingdom-building-forwards':
      return (
        <Svg width={38} height={38} viewBox="0 0 40 40">
          <Rect x={8} y={13} width={20} height={22} rx={3} fill="#D8B164" />
          <Path d="M13 35V17h14v18" fill="#26385A" />
          <Circle cx={23} cy={26} r={1.3} fill="#F6D982" />
          <Path d="m31 10 1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.7 1.9.7-4.1-3-2.9 4.1-.6L31 10Z" fill="#F6D982" />
          <Path d="M4 35h32" stroke="#E9C97B" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
  }
}

export default function AssessmentResultsScreen() {
  const navigation = useNavigation<AssessmentResultsNavProp>();
  const route = useRoute<AssessmentResultsRouteProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const result = useMemo(
    () => computeAssessmentResult(route.params.answers),
    [route.params.answers],
  );
  const scores = useMemo(() => getCategoryLevels(result), [result]);
  const summary = useMemo(() => generateSummary(scores), [scores]);
  const chartData = useMemo(
    () =>
      CLASSIFICATION_ORDER.map((slug) => ({
        label: CLASSIFICATION_LABELS[slug],
        level: scores[slug],
      })),
    [scores],
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          Platform.OS === 'web' && { paddingTop: 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Assessment Results</Text>

        <View style={styles.chartWrap}>
          <RadarChart
            data={chartData}
            gridColor={colors.borderStrong}
            fillColor={colors.accent}
            strokeColor={colors.accent}
            labelColor={colors.textMuted}
          />
        </View>

        <Text style={styles.summary}>{summary}</Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() =>
            navigation.navigate('Curriculum', {
              classification: getGrowthClassification(scores),
              scores,
            })
          }
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.accentLight, colors.accent, '#A8852E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButtonGradient}
          >
            <Text style={styles.ctaButtonText}>View Curriculum</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>In-Depth Analysis</Text>
        <View style={styles.analysisList}>
          {CLASSIFICATION_ORDER.map((slug) => (
            <View key={slug} style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <View style={styles.areaIdentity}>
                  <LinearGradient
                    colors={[colors.glow, colors.surface]}
                    style={styles.iconTile}
                  >
                    <AreaIcon slug={slug} />
                  </LinearGradient>
                  <View style={styles.areaNames}>
                    <Text style={styles.areaTitle}>
                      {CLASSIFICATION_LABELS[slug]}
                    </Text>
                  </View>
                </View>
                <View style={styles.levelIndicator}>
                  <View style={styles.levelDots}>
                    {Array.from({ length: 4 }, (_, index) => (
                      <View
                        key={`${slug}-${index}`}
                        style={[
                          styles.levelDot,
                          index < scores[slug] && styles.levelDotActive,
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.levelScore}>{scores[slug]}/4</Text>
                </View>
              </View>
              <Text style={styles.analysisText}>
                {getReflection(slug, scores[slug])}
              </Text>
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
    scroll: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 24,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    chartWrap: { alignItems: 'center', marginBottom: SPACING.lg },
    summary: {
      fontFamily: FONTS.sansMedium,
      fontSize: 15,
      lineHeight: 23,
      color: colors.textSecondary,
      marginBottom: SPACING.lg,
    },
    ctaButton: {
      width: '100%',
      borderRadius: 50,
      overflow: 'hidden',
      marginBottom: SPACING.xl,
    },
    ctaButtonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ctaButtonText: {
      fontFamily: FONTS.sansBold,
      fontSize: 15,
      color: colors.accentText,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    sectionLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    analysisList: { gap: SPACING.md },
    analysisCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: SPACING.md,
    },
    analysisHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    areaIdentity: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    iconTile: {
      width: 52,
      height: 52,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    areaNames: { flex: 1 },
    areaTitle: {
      fontFamily: FONTS.serif,
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    levelIndicator: {
      alignItems: 'flex-end',
      gap: 5,
    },
    levelDots: {
      flexDirection: 'row',
      gap: 4,
    },
    levelDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.borderStrong,
    },
    levelDotActive: {
      backgroundColor: colors.accent,
    },
    levelScore: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      color: colors.accent,
    },
    analysisText: {
      fontFamily: FONTS.sans,
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.textSecondary,
    },
  });
}
