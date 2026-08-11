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

const BAR_COUNT = 9;
// Relative heights create an organic, non-uniform waveform silhouette.
const BASE_HEIGHTS = [10, 18, 28, 40, 52, 40, 28, 18, 10];

function Bar({ index, active, color }) {
  const height = useSharedValue(BASE_HEIGHTS[index]);

  useEffect(() => {
    if (active) {
      const base = BASE_HEIGHTS[index];
      height.value = withDelay(
        index * 45,
        withRepeat(
          withSequence(
            withTiming(base * (0.4 + Math.random() * 0.3), {
              duration: 260 + Math.random() * 160,
              easing: Easing.inOut(Easing.quad),
            }),
            withTiming(base * (0.9 + Math.random() * 0.5), {
              duration: 260 + Math.random() * 220,
              easing: Easing.inOut(Easing.quad),
            })
          ),
          -1,
          true
        )
      );
    } else {
      height.value = withTiming(6, { duration: 260 });
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

/**
 * Animated waveform used on the Record screen while listening.
 */
export default function VoiceWaveform({ active, color = colors.white }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Bar key={i} index={i} active={active} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 6,
  },
  bar: {
    width: 5,
    borderRadius: radius.pill,
  },
});
