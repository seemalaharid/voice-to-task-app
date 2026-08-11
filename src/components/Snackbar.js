import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

const ICONS = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const TONES = {
  success: { bg: '#1F2430', accent: colors.success, iconBg: colors.successBg },
  error: { bg: '#2B1E22', accent: '#FF6B6B', iconBg: '#3A2226' },
  info: { bg: '#1F2237', accent: colors.primaryLight, iconBg: '#2A2A45' },
};

/**
 * Controlled snackbar. Pass `visible` + `message` + `type`.
 * Auto-hides after `duration` ms and calls onHide.
 */
export default function Snackbar({ visible, message, type = 'success', onHide, duration = 2400 }) {
  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.exp) });
      opacity.value = withTiming(1, { duration: 250 });

      const timer = setTimeout(() => {
        translateY.value = withTiming(80, { duration: 260, easing: Easing.in(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 220 }, (finished) => {
          if (finished && onHide) {
            runOnJS(onHide)();
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  const tone = TONES[type] || TONES.info;

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
      <Animated.View style={[styles.bar, { backgroundColor: tone.bg }]}>
        <Animated.View style={[styles.iconCircle, { backgroundColor: tone.iconBg }]}>
          <Ionicons name={ICONS[type] || ICONS.info} size={16} color={tone.accent} />
        </Animated.View>
        <Text style={styles.text} numberOfLines={2}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: 34,
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...shadow.card,
    shadowOpacity: 0.28,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  text: { ...typography.body, color: '#fff', flex: 1, fontSize: 13.5 },
});
