import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AssessmentNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { getAssessmentQuestions, AssessmentQuestionView } from '../api/assessments';

// Brief pause after tapping an answer before auto-advancing, so the
// selection highlight is visible before the next question appears.
const AUTO_ADVANCE_DELAY_MS = 450;

export default function AssessmentScreen() {
  const navigation = useNavigation<AssessmentNavProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [questions, setQuestions] = useState<AssessmentQuestionView[] | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getAssessmentQuestions().then(setQuestions);
  }, []);

  const total = questions?.length ?? 0;
  const currentQuestion = questions?.[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: total > 0 ? answeredCount / total : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [answeredCount, total]);

  function goToNextQuestion() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleSelectOption(optionId: string) {
    if (!currentQuestion) return;
    // Lock selection during the auto-advance transition, except on the
    // last question where there's no auto-advance and the user can
    // change their mind before tapping "Show Results".
    if (selectedOptionId && !isLastQuestion) return;

    setSelectedOptionId(optionId);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));

    if (!isLastQuestion) {
      setTimeout(goToNextQuestion, AUTO_ADVANCE_DELAY_MS);
    }
  }

  if (!questions || !currentQuestion) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const showResultsButton = isLastQuestion && Boolean(answers[currentQuestion.id]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.safe, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          Question {currentIndex + 1} of {total}
        </Text>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

          <View style={styles.optionsList}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                  ]}
                  onPress={() => handleSelectOption(option.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {showResultsButton && (
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => navigation.navigate('AssessmentResults', { answers })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.accentLight, colors.accent, '#A8852E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.resultsButtonGradient}
            >
              <Text style={styles.resultsButtonText}>Show Results</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    loadingRoot: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    safe: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
      paddingTop: SPACING.xl,
    },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.inputBg,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    progressLabel: {
      fontFamily: FONTS.sansMedium,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: SPACING.sm,
      marginBottom: SPACING.lg,
    },
    content: { flex: 1 },
    prompt: {
      fontFamily: FONTS.serif,
      fontSize: 20,
      color: colors.textPrimary,
      lineHeight: 28,
      marginBottom: SPACING.lg,
    },
    optionsList: { gap: SPACING.sm },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.inputBg,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: SPACING.md,
    },
    optionRowSelected: {
      borderColor: colors.accent,
      backgroundColor: 'rgba(201, 168, 76, 0.12)',
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    radioSelected: { borderColor: colors.accent },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
    },
    optionText: {
      flex: 1,
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    resultsButton: {
      width: '100%',
      borderRadius: 50,
      overflow: 'hidden',
      marginTop: SPACING.lg,
    },
    resultsButtonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultsButtonText: {
      fontFamily: FONTS.sansBold,
      fontSize: 15,
      color: colors.accentText,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
  });
}
