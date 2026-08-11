import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../theme/theme';

function FloatingDot({ style, delay = 0 }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.floatDot, style, animStyle]} />;
}

/**
 * Illustrated empty state shown when there are no tasks yet.
 */
export default function EmptyState({
  title = 'No tasks yet',
  subtitle = 'Tap the mic and speak a reminder — it will show up here.',
}) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrap}>
        <FloatingDot style={{ top: 4, left: 10, backgroundColor: colors.primarySoft }} delay={0} />
        <FloatingDot style={{ bottom: 10, right: 6, backgroundColor: colors.successBg }} delay={300} />
        <FloatingDot style={{ top: 30, right: -6, backgroundColor: '#FFF3DA' }} delay={600} />

        <LinearGradient
          colors={colors.gradientFab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Ionicons name="mic" size={40} color={colors.white} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  illustrationWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  floatDot: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  title: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});
