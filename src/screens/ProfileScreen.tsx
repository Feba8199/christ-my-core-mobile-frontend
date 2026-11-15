import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavProp } from '../navigation/types';
import { FONTS, SPACING, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavProp>();
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={colors.backgroundGradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.safe, Platform.OS === 'web' && { paddingTop: 40 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? '?').trim().charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        <TouchableOpacity
          onPress={logout}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    safe: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
      paddingTop: SPACING.xl,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: SPACING.lg,
      alignSelf: 'flex-start',
    },
    backArrow: { color: colors.accent, fontSize: 20 },
    backText: { fontFamily: FONTS.sans, fontSize: 15, color: colors.textMuted },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'rgba(201, 168, 76, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    avatarText: {
      fontFamily: FONTS.sansBold,
      fontSize: 28,
      color: colors.accent,
    },
    name: {
      fontFamily: FONTS.serif,
      fontSize: 22,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    email: {
      fontFamily: FONTS.sans,
      fontSize: 14,
      color: colors.textMuted,
    },
    secondaryButton: {
      width: '100%',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.borderStrong,
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
