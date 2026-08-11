import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, shadow } from '../theme/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PulseRing({ delay, active }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      scale.value = 1;
      opacity.value = 0.5;
      scale.value = withRepeat(
        withTiming(1.9, { duration: 1800, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 50 }),
          withTiming(0, { duration: 1750, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

/**
 * Large gradient microphone button. Shows radiating pulse rings while
 * `recording` is true, and switches icon/color when processing.
 */
export default function MicButton({ recording, processing, onPress }) {
  const press = useSharedValue(1);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (recording) {
      iconScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      iconScale.value = withTiming(1, { duration: 200 });
    }
  }, [recording]);

  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));

  return (
    <Animated.View style={styles.wrap}>
      <PulseRing active={recording} delay={0} />
      <PulseRing active={recording} delay={500} />

      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => (press.value = withTiming(0.94, { duration: 100 }))}
        onPressOut={() => (press.value = withTiming(1, { duration: 150 }))}
        style={pressStyle}
        disabled={processing}
      >
        <LinearGradient
          colors={recording ? ['#FF7A7A', '#F0453F'] : colors.gradientFab}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.button, shadow.fab, { shadowColor: recording ? '#F0453F' : colors.primary }]}
        >
          <Animated.View style={iconStyle}>
            <Ionicons name={recording ? 'stop' : 'mic'} size={44} color={colors.white} />
          </Animated.View>
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
