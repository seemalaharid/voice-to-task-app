import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, radius } from '../theme/theme';

function Dot({ delay }) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0.6, { duration: 420, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420 }),
          withTiming(0.4, { duration: 420 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * Three-dot pulsing loader used while the AI extracts a task from audio.
 */
export default function AiLoader() {
  return (
    <View style={styles.row}>
      <Dot delay={0} />
      <Dot delay={140} />
      <Dot delay={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
