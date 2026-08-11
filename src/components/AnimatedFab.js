import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radius, shadow } from '../theme/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Large circular gradient FAB with a soft glow halo and gentle breathing
 * animation, used on the task list to launch the recorder.
 */
export default function AnimatedFab({ onPress, icon = 'mic', size = 64 }) {
  const glow = useSharedValue(0.55);
  const press = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.55, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.5,
    transform: [{ scale: 1 + glow.value * 0.18 }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const handlePressIn = () => {
    press.value = withTiming(0.92, { duration: 100 });
  };
  const handlePressOut = () => {
    press.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={styles.wrap} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.glow,
          { width: size * 1.8, height: size * 1.8, borderRadius: size },
          glowStyle,
        ]}
      />
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={pressStyle}
        hitSlop={6}
      >
        <LinearGradient
          colors={colors.gradientFab}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[
            styles.fab,
            { width: size, height: size, borderRadius: size / 2 },
            shadow.fab,
          ]}
        >
          <Ionicons name={icon} size={size * 0.42} color={colors.white} />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
