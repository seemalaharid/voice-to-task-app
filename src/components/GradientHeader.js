import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

/**
 * Premium gradient header used across screens.
 * - title / subtitle
 * - optional left back button
 * - optional right element (e.g. an icon button)
 */
export default function GradientHeader({
  title,
  subtitle,
  onBack,
  rightElement,
  icon = 'sparkles',
}) {
  return (
    <LinearGradient
      colors={colors.gradientHeader}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView edges={['top']}>
        <View style={styles.decorCircleLg} />
        <View style={styles.decorCircleSm} />

        <View style={styles.row}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={10}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBadge}>
              <Ionicons name={icon} size={18} color={colors.white} />
            </View>
          )}

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.rightSlot}>{rightElement}</View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.header,
  },
  decorCircleLg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -70,
    right: -50,
  },
  decorCircleSm: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -30,
    left: -20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, marginLeft: spacing.md },
  title: { ...typography.display, color: colors.white },
  subtitle: {
    ...typography.subtitle,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  rightSlot: { minWidth: 38, alignItems: 'flex-end' },
});
