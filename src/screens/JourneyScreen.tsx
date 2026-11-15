import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { JourneyNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CLASSIFICATION_LABELS, ClassificationSlug } from '../constants/classifications';
import {
  getJourneyCourses,
  getJourneyModules,
  UNASSESSED_SCORES,
  JourneyCourse,
  JourneyLesson,
} from '../api/journey';

const AnimatedPath = Animated.createAnimatedComponent(Path);

function groupByClassification(
  courses: JourneyCourse[]
): [ClassificationSlug, JourneyCourse[]][] {
  const groups = new Map<ClassificationSlug, JourneyCourse[]>();
  for (const course of courses) {
    const group = groups.get(course.classification) ?? [];
    group.push(course);
    groups.set(course.classification, group);
  }
  return Array.from(groups.entries());
}

export default function JourneyScreen() {
  const navigation = useNavigation<JourneyNavProp>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { width: viewportWidth } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const graphWidth = Math.min(Math.max(viewportWidth - 32, 280), 360);
  const graphScale = graphWidth / 280;

  const courses = useMemo(
    () => getJourneyCourses(user?.assessmentScores ?? UNASSESSED_SCORES),
    [user?.assessmentScores]
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses.find((c) => c.status === 'active')?.id ??
      courses.find((c) => c.status !== 'locked')?.id ??
      courses[0].id
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const pathProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pathProgress, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(pathProgress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pathProgress]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)!;
  const modules = useMemo(
    () => getJourneyModules(selectedCourse),
    [selectedCourse]
  );
  const groupedCourses = useMemo(() => groupByClassification(courses), [courses]);

  function handleLessonPress(lesson: JourneyLesson) {
    if (lesson.status === 'locked') return;
    Alert.alert(lesson.title, 'Lesson player coming soon.');
  }

  const initials = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#03060F', '#060B18', '#0A1428', '#03060F']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.8}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.courseSelector}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.courseSelectorLabel}>{selectedCourse.title}</Text>
          <Text style={styles.courseSelectorCaret}>▾</Text>
        </TouchableOpacity>

        <Text style={styles.pageEyebrow}>Your discipleship path</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.graphCanvas,
            { width: graphWidth, height: 390 * graphScale },
          ]}
        >
          <Svg
            width={graphWidth}
            height={390 * graphScale}
            viewBox="0 0 280 390"
            style={styles.graphPaths}
            pointerEvents="none"
          >
            <AnimatedPath
              d="M 89 78 H 185"
              stroke={colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="5 4"
              strokeDashoffset={pathProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              })}
              fill="none"
            />
            <Polygon points="181,74 188,78 181,82" fill={colors.textMuted} />
            <AnimatedPath
              d="M 218 111 V 122 H 161 V 138"
              stroke={colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="5 4"
              strokeDashoffset={pathProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              })}
              fill="none"
            />
            <Polygon points="157,134 164,138 157,142" fill={colors.textMuted} />
            <AnimatedPath
              d="M 95 138 H 56 V 206"
              stroke={colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="5 4"
              strokeDashoffset={pathProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              })}
              fill="none"
            />
            <Polygon points="52,202 56,209 60,202" fill={colors.textMuted} />
            <AnimatedPath
              d="M 89 206 H 185"
              stroke={colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="5 4"
              strokeDashoffset={pathProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              })}
              fill="none"
            />
            <Polygon points="181,202 188,206 181,210" fill={colors.textMuted} />
            <AnimatedPath
              d="M 89 311 H 185"
              stroke={colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="5 4"
              strokeDashoffset={pathProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              })}
              fill="none"
            />
            <Polygon points="181,307 188,311 181,315" fill={colors.textMuted} />
          </Svg>

          {modules.map((module, moduleIndex) => {
            const positions =
              moduleIndex === 0
                ? [
                    { left: 23, top: 45 },
                    { left: 185, top: 45 },
                    { left: 95, top: 105 },
                    { left: 23, top: 173 },
                    { left: 185, top: 173 },
                  ]
                : [
                    { left: 23, top: 278 },
                    { left: 185, top: 278 },
                  ];

            return (
              <React.Fragment key={module.id}>
                <Text
                  style={[
                    styles.mapModuleTitle,
                    {
                      top: (moduleIndex === 0 ? 4 : 238) * graphScale,
                      width: graphWidth,
                    },
                  ]}
                >
                  {module.title}
                </Text>
                <Text
                  style={[
                    styles.mapModuleSubtitle,
                    {
                      top: (moduleIndex === 0 ? 22 : 256) * graphScale,
                      width: graphWidth,
                    },
                  ]}
                >
                  Module Title
                </Text>
                {module.lessons.map((lesson, index) => {
                  const position = positions[index];
                  if (!position) return null;

                  const completed = lesson.status === 'completed';
                  const locked = lesson.status === 'locked';

                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.mapNode,
                        {
                          left: position.left * graphScale,
                          top: position.top * graphScale,
                          width: 66 * graphScale,
                          height: 66 * graphScale,
                          borderRadius: 33 * graphScale,
                        },
                        completed && styles.mapNodeCompleted,
                        locked && styles.mapNodeLocked,
                      ]}
                      onPress={() => handleLessonPress(lesson)}
                      disabled={locked}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.mapNodeTitle,
                          locked && styles.lessonTitleLocked,
                        ]}
                        numberOfLines={2}
                      >
                        {lesson.title}
                      </Text>
                      <Text style={styles.mapNodeStatus}>
                        {completed ? '✓' : locked ? '🔒' : String(index + 1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select a Course</Text>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {groupedCourses.map(([classification, group]) => (
                <View key={classification} style={styles.modalGroup}>
                  <Text style={styles.modalGroupLabel}>
                    {CLASSIFICATION_LABELS[classification]}
                  </Text>
                  {group.map((course) => {
                    const locked = course.status === 'locked';
                    return (
                      <TouchableOpacity
                        key={course.id}
                        style={styles.modalRow}
                        disabled={locked}
                        onPress={() => {
                          setSelectedCourseId(course.id);
                          setPickerOpen(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.modalRowText,
                            locked && styles.modalRowTextLocked,
                          ]}
                        >
                          {course.title}
                        </Text>
                        {locked && <Text style={styles.modalRowIcon}>🔒</Text>}
                        {course.status === 'completed' && (
                          <Text style={styles.modalRowIcon}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.md,
    },
    topBar: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    menuButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuIcon: { color: colors.textPrimary, fontSize: 20 },
    courseSelector: {
      alignSelf: 'flex-start',
      width: '82%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: SPACING.md,
      marginLeft: 40,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    courseSelectorLabel: {
      flex: 1,
      fontFamily: FONTS.sansBold,
      fontSize: 14,
      color: colors.textPrimary,
    },
    courseSelectorCaret: { color: colors.accent, fontSize: 14 },
    pageEyebrow: {
      fontFamily: FONTS.sans,
      fontSize: 11,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: colors.textMuted,
      marginLeft: 42,
      marginBottom: SPACING.sm,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(216, 177, 100, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    avatarText: {
      fontFamily: FONTS.sansBold,
      fontSize: 14,
      color: colors.accent,
    },
    scroll: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: SPACING.xxl,
    },
    graphCanvas: {
      height: 390,
      position: 'relative',
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },
    graphPaths: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    mapModuleTitle: {
      position: 'absolute',
      fontFamily: FONTS.serif,
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    mapModuleSubtitle: {
      position: 'absolute',
      fontFamily: FONTS.sans,
      fontSize: 10,
      color: colors.textMuted,
      textAlign: 'center',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    mapNode: {
      position: 'absolute',
      width: 66,
      height: 66,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(17, 25, 38, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      zIndex: 1,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 8 },
    },
    mapNodeCompleted: {
      backgroundColor: 'rgba(84, 166, 118, 0.14)',
      borderColor: 'rgba(84, 166, 118, 0.6)',
    },
    mapNodeLocked: { opacity: 0.45 },
    mapNodeTitle: {
      fontFamily: FONTS.sansBold,
      fontSize: 10,
      lineHeight: 12,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    mapNodeStatus: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      color: colors.accent,
      marginTop: 2,
    },
    lessonTitleLocked: { color: colors.textMuted },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.xl,
      maxHeight: '75%',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: -10 },
    },
    modalTitle: {
      fontFamily: FONTS.serif,
      fontSize: 20,
      color: colors.textPrimary,
      marginBottom: SPACING.md,
    },
    modalScroll: { maxHeight: 440 },
    modalGroup: { marginBottom: SPACING.md },
    modalGroupLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: SPACING.sm,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalRowText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14.5,
      color: colors.textPrimary,
    },
    modalRowTextLocked: { color: colors.textMuted },
    modalRowIcon: { fontSize: 13, color: colors.textMuted, marginLeft: SPACING.sm },
  });
}
