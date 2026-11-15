import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CurriculumNavProp, CurriculumRouteProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { getFreeLesson, LessonView } from '../api/curriculum';

type Page = 'content' | 'quiz';

export default function LessonScreen() {
  const navigation = useNavigation<CurriculumNavProp>();
  const route = useRoute<CurriculumRouteProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [lesson, setLesson] = useState<LessonView | null>(null);
  const [page, setPage] = useState<Page>('content');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getFreeLesson(route.params.classification).then(setLesson);
  }, [route.params.classification]);

  if (!lesson) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const quizBlock = lesson.content.find((block) => block.type === 'QUIZ');
  const quizQuestions = quizBlock?.questions ?? [];
  const allAnswered = quizQuestions.every((_, i) => selectedAnswers[i] !== undefined);
  const correctCount = quizQuestions.filter(
    (q, i) => selectedAnswers[i] === q.correctOptionIndex
  ).length;

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
        <Text style={styles.courseLabel}>{lesson.courseTitle}</Text>
        <Text style={styles.title}>{lesson.lessonTitle}</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.metaPill}>Lesson 1</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText}>Free preview</Text>
        </View>

        {page === 'content' ? (
          <>
            <Text style={styles.intro}>
              Based on the outcome of your assessment, we've prepared a
              customised journey for you. The following is the first lesson
              in that journey.
            </Text>

            {lesson.content.map((block, i) => {
              if (block.type === 'VIDEO') {
                return (
                  <View key={i} style={styles.mediaPlaceholder}>
                    <Text style={styles.mediaPlaceholderLabel}>VIDEO</Text>
                    <Text style={styles.mediaPlaceholderCaption}>
                      {block.caption}
                    </Text>
                  </View>
                );
              }
              if (block.type === 'IMAGE') {
                return (
                  <View key={i} style={styles.mediaPlaceholder}>
                    <Text style={styles.mediaPlaceholderLabel}>IMAGE</Text>
                    <Text style={styles.mediaPlaceholderCaption}>
                      {block.caption}
                    </Text>
                  </View>
                );
              }
              if (block.type === 'TEXT') {
                return (
                  <Text key={i} style={styles.bodyText}>
                    {block.content}
                  </Text>
                );
              }
              return null;
            })}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setPage('quiz')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.accentLight, colors.accent, '#A8852E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Start Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Verification of Understanding</Text>

            {quizQuestions.map((question, questionIndex) => {
              const selected = selectedAnswers[questionIndex];
              return (
                <View key={questionIndex} style={styles.questionBlock}>
                  <Text style={styles.questionPrompt}>{question.question}</Text>
                  <View style={styles.optionsList}>
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrectOption =
                        optionIndex === question.correctOptionIndex;
                      const showResult = submitted;

                      return (
                        <TouchableOpacity
                          key={optionIndex}
                          style={[
                            styles.optionRow,
                            isSelected && styles.optionRowSelected,
                            showResult &&
                              isCorrectOption &&
                              styles.optionRowCorrect,
                            showResult &&
                              isSelected &&
                              !isCorrectOption &&
                              styles.optionRowIncorrect,
                          ]}
                          disabled={submitted}
                          onPress={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [questionIndex]: optionIndex,
                            }))
                          }
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
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            {submitted && (
              <Text style={styles.outcomeText}>
                You got {correctCount} of {quizQuestions.length} correct.
              </Text>
            )}

            {!submitted ? (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !allAnswered && styles.primaryButtonDisabled,
                ]}
                onPress={() => setSubmitted(true)}
                disabled={!allAnswered}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accentLight, colors.accent, '#A8852E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Check Answers</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  navigation.navigate('RegistrationPrompt', {
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
                  <Text style={styles.primaryButtonText}>
                    Create Free Account
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setPage('content')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    scroll: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    courseLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      marginBottom: SPACING.xs,
    },
    title: {
      fontFamily: FONTS.serif,
      fontSize: 29,
      lineHeight: 35,
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
    },
    headerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      gap: SPACING.sm,
    },
    metaPill: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: colors.accentText,
      backgroundColor: colors.accent,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 6,
      borderRadius: 999,
    },
    metaDivider: {
      color: colors.textMuted,
      fontSize: 14,
    },
    metaText: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    intro: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14.5,
      lineHeight: 23,
      color: colors.textSecondary,
      marginBottom: SPACING.lg,
    },
    mediaPlaceholder: {
      height: 190,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'rgba(17, 25, 38, 0.82)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
      gap: 8,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    mediaPlaceholderLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      letterSpacing: 2,
      color: colors.accent,
    },
    mediaPlaceholderCaption: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: SPACING.lg,
      lineHeight: 18,
    },
    bodyText: {
      fontFamily: FONTS.sans,
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
      marginBottom: SPACING.lg,
    },
    sectionLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    questionBlock: { marginBottom: SPACING.lg },
    questionPrompt: {
      fontFamily: FONTS.serif,
      fontSize: 18,
      color: colors.textPrimary,
      lineHeight: 26,
      marginBottom: SPACING.md,
    },
    optionsList: { gap: SPACING.sm },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: SPACING.md,
    },
    optionRowSelected: {
      borderColor: colors.accent,
      backgroundColor: 'rgba(201, 168, 76, 0.12)',
    },
    optionRowCorrect: {
      borderColor: '#3E8E5A',
      backgroundColor: 'rgba(62, 142, 90, 0.12)',
    },
    optionRowIncorrect: {
      borderColor: colors.error,
      backgroundColor: colors.errorBg,
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
    outcomeText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14.5,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    primaryButton: {
      width: '100%',
      borderRadius: 999,
      overflow: 'hidden',
      marginTop: SPACING.sm,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    primaryButtonDisabled: { opacity: 0.5 },
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
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.md,
      backgroundColor: 'rgba(255,255,255,0.02)',
    },
    secondaryButtonText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 15,
      color: colors.textMuted,
      letterSpacing: 1,
    },
  });
}
