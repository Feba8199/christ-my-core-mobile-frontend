import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BibleNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { BIBLE_BOOKS } from '../constants/bibleBooks';
import {
  BIBLE_TRANSLATIONS,
  getChapter,
  BibleChapter,
  BibleFetchError,
} from '../api/bible';

type ReferencePickerStep = 'books' | 'chapters';

export default function BibleScreen() {
  const navigation = useNavigation<BibleNavProp>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  const [translationId, setTranslationId] = useState('kjv');

  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [referencePickerOpen, setReferencePickerOpen] = useState(false);
  const [referencePickerStep, setReferencePickerStep] = useState<ReferencePickerStep>('books');
  const [pickerBook, setPickerBook] = useState(book);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getChapter(book, chapter, translationId)
      .then((data) => {
        if (!cancelled) setChapterData(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof BibleFetchError ? err.message : 'Something went wrong.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [book, chapter, translationId]);

  const selectedTranslation = BIBLE_TRANSLATIONS.find((t) => t.id === translationId);
  const initials = (user?.name ?? '?').trim().charAt(0).toUpperCase() || '?';

  function openReferencePicker() {
    setPickerBook(book);
    setReferencePickerStep('books');
    setReferencePickerOpen(true);
  }

  function handleBookSelected(name: string) {
    setPickerBook(name);
    setReferencePickerStep('chapters');
  }

  function handleChapterSelected(chapterNumber: number) {
    setBook(pickerBook);
    setChapter(chapterNumber);
    setReferencePickerOpen(false);
  }

  const pickerBookMeta = BIBLE_BOOKS.find((b) => b.name === pickerBook);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <Text style={styles.headerTitle}>Bible</Text>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={openReferencePicker}
          activeOpacity={0.8}
        >
          <Text style={styles.controlButtonLabel} numberOfLines={1}>
            {book} {chapter}
          </Text>
          <Text style={styles.controlButtonCaret}>▾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setTranslationPickerOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.controlButtonLabel} numberOfLines={1}>
            {selectedTranslation?.id.toUpperCase() ?? translationId.toUpperCase()}
          </Text>
          <Text style={styles.controlButtonCaret}>▾</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.statusWrap}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.statusWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && chapterData && (
          <>
            <Text style={styles.reference}>{chapterData.reference}</Text>
            <View style={styles.verseList}>
              {chapterData.verses.map((v) => (
                <Text key={v.verse} style={styles.verseText}>
                  <Text style={styles.verseNumber}>{v.verse} </Text>
                  {v.text}
                </Text>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Book / chapter picker */}
      <Modal
        visible={referencePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setReferencePickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setReferencePickerOpen(false)}
        >
          <View style={styles.modalSheet}>
            {referencePickerStep === 'books' ? (
              <>
                <Text style={styles.modalTitle}>Select a Book</Text>
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  {(['OT', 'NT'] as const).map((testament) => (
                    <View key={testament} style={styles.modalGroup}>
                      <Text style={styles.modalGroupLabel}>
                        {testament === 'OT' ? 'Old Testament' : 'New Testament'}
                      </Text>
                      {BIBLE_BOOKS.filter((b) => b.testament === testament).map((b) => (
                        <TouchableOpacity
                          key={b.name}
                          style={styles.modalRow}
                          onPress={() => handleBookSelected(b.name)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.modalRowText}>{b.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.modalStepHeader}>
                  <TouchableOpacity onPress={() => setReferencePickerStep('books')}>
                    <Text style={styles.modalBack}>← Books</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{pickerBook}</Text>
                </View>
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.chapterGrid}>
                    {Array.from({ length: pickerBookMeta?.chapterCount ?? 0 }, (_, i) => i + 1).map(
                      (n) => (
                        <TouchableOpacity
                          key={n}
                          style={styles.chapterCell}
                          onPress={() => handleChapterSelected(n)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.chapterCellText}>{n}</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Translation picker */}
      <Modal
        visible={translationPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTranslationPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setTranslationPickerOpen(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select a Translation</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {BIBLE_TRANSLATIONS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.modalRow}
                  onPress={() => {
                    setTranslationId(t.id);
                    setTranslationPickerOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalRowText}>{t.name}</Text>
                  <Text style={styles.modalRowMuted}>{t.id.toUpperCase()}</Text>
                </TouchableOpacity>
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
    controls: {
      flexDirection: 'row',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.md,
    },
    controlButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.inputBg,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: SPACING.md,
    },
    controlButtonLabel: {
      flex: 1,
      fontFamily: FONTS.sansBold,
      fontSize: 13.5,
      color: colors.textPrimary,
    },
    controlButtonCaret: { color: colors.accent, fontSize: 14 },
    scroll: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xxl,
    },
    statusWrap: { alignItems: 'center', paddingVertical: SPACING.xxl },
    errorText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14,
      color: colors.error,
      textAlign: 'center',
    },
    reference: {
      fontFamily: FONTS.serif,
      fontSize: 20,
      color: colors.textPrimary,
      marginBottom: SPACING.lg,
    },
    verseList: { gap: SPACING.md },
    verseText: {
      fontFamily: FONTS.serifRegular,
      fontSize: 16,
      lineHeight: 26,
      color: colors.textSecondary,
    },
    verseNumber: {
      fontFamily: FONTS.sansBold,
      fontSize: 12,
      color: colors.accent,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.xl,
      maxHeight: '75%',
    },
    modalStepHeader: { marginBottom: SPACING.md },
    modalBack: {
      fontFamily: FONTS.sansMedium,
      fontSize: 13,
      color: colors.accent,
      marginBottom: SPACING.sm,
    },
    modalTitle: {
      fontFamily: FONTS.serif,
      fontSize: 18,
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
    },
    modalRowText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14.5,
      color: colors.textPrimary,
    },
    modalRowMuted: {
      fontFamily: FONTS.sans,
      fontSize: 12,
      color: colors.textMuted,
    },
    chapterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
      paddingBottom: SPACING.sm,
    },
    chapterCell: {
      width: 44,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chapterCellText: {
      fontFamily: FONTS.sansMedium,
      fontSize: 14,
      color: colors.textPrimary,
    },
  });
}
