import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { LibraryNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  getFoundationalCourse,
  getLibraryResources,
  LibraryAccessLevel,
  LibraryResource,
} from '../api/library';

const ACCESS_LABELS: Record<LibraryAccessLevel, string> = {
  PUBLIC: 'Free',
  REGISTERED: 'Included',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
};

export default function LibraryScreen() {
  const navigation = useNavigation<LibraryNavProp>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const foundationalCourse = useMemo(() => getFoundationalCourse(), []);
  const resources = useMemo(() => getLibraryResources(), []);
  const [foundationalExpanded, setFoundationalExpanded] = useState(false);

  function handleResourcePress(resource: LibraryResource) {
    Alert.alert(resource.title, 'Resource content coming soon.');
  }

  function handleLessonPress(lessonTitle: string) {
    Alert.alert(lessonTitle, 'Lesson player coming soon.');
  }

  const initials = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <Text style={styles.headerTitle}>Library</Text>
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
        <Text style={styles.sectionLabel}>Foundational Course</Text>
        <TouchableOpacity
          style={styles.foundationalCard}
          onPress={() => setFoundationalExpanded((v) => !v)}
          activeOpacity={0.85}
        >
          <View style={styles.foundationalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foundationalTitle}>{foundationalCourse.title}</Text>
              <Text style={styles.foundationalDescription}>
                {foundationalCourse.description}
              </Text>
            </View>
            <Text style={styles.foundationalCaret}>
              {foundationalExpanded ? '▾' : '▸'}
            </Text>
          </View>

          {foundationalExpanded && (
            <View style={styles.moduleList}>
              {foundationalCourse.modules.map((module) => (
                <View key={module.id} style={styles.moduleBlock}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  {module.lessons.map((lesson) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={styles.lessonRow}
                      onPress={() => handleLessonPress(lesson.title)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Resources</Text>
        <View style={styles.resourceList}>
          {resources.map((resource) => (
            <TouchableOpacity
              key={resource.slug}
              style={styles.resourceRow}
              onPress={() => handleResourcePress(resource)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription} numberOfLines={2}>
                  {resource.description}
                </Text>
              </View>
              <View style={styles.accessBadge}>
                <Text style={styles.accessBadgeText}>
                  {ACCESS_LABELS[resource.accessLevel]}
                </Text>
              </View>
            </TouchableOpacity>
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
      fontSize: 24,
      color: colors.textPrimary,
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
      shadowOpacity: 0.14,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    avatarText: {
      fontFamily: FONTS.sansBold,
      fontSize: 14,
      color: colors.accent,
    },
    scroll: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xxl,
    },
    sectionLabel: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    foundationalCard: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: SPACING.md,
      marginBottom: SPACING.xl,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    foundationalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
    foundationalTitle: {
      fontFamily: FONTS.sansBold,
      fontSize: 17,
      color: colors.textPrimary,
      marginBottom: 6,
    },
    foundationalDescription: {
      fontFamily: FONTS.sans,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
    },
    foundationalCaret: { color: colors.accent, fontSize: 16, marginTop: 2 },
    moduleList: { marginTop: SPACING.md, gap: SPACING.md },
    moduleBlock: { gap: SPACING.sm },
    moduleTitle: {
      fontFamily: FONTS.sansBold,
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    lessonRow: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: SPACING.md,
    },
    lessonTitle: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14,
      color: colors.textPrimary,
    },
    resourceList: { gap: SPACING.sm },
    resourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: SPACING.md,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 6 },
    },
    resourceTitle: {
      fontFamily: FONTS.sansBold,
      fontSize: 14.5,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    resourceDescription: {
      fontFamily: FONTS.sans,
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    accessBadge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'rgba(216, 177, 100, 0.12)',
      borderWidth: 1,
      borderColor: colors.border,
      flexShrink: 0,
    },
    accessBadgeText: {
      fontFamily: FONTS.sansBold,
      fontSize: 10.5,
      color: colors.accent,
      letterSpacing: 0.5,
    },
  });
}
