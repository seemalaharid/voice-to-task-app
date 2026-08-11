import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  requestMicPermission,
  startRecording,
  stopRecording,
  cancelRecording,
} from '../services/audioService';
import { extractTaskFromAudio } from '../services/aiService';
import GradientHeader from '../components/GradientHeader';
import MicButton from '../components/MicButton';
import VoiceWaveform from '../components/VoiceWaveform';
import AiLoader from '../components/AiLoader';
import Snackbar from '../components/Snackbar';
import { colors, radius, spacing, typography } from '../theme/theme';

// UI states
const STATE = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
};

export default function RecordScreen({ navigation }) {
  const [state, setState] = useState(STATE.IDLE);
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'error' });
  const isMounted = useRef(true);

  const showError = (message) => setSnack({ visible: true, message, type: 'error' });

  const handlePressMic = async () => {
    if (state === STATE.IDLE) {
      const granted = await requestMicPermission();
      if (!granted) {
        showError('Microphone permission is required to record voice commands.');
        return;
      }
      try {
        await startRecording();
        setState(STATE.RECORDING);
      } catch (e) {
        showError('Could not start recording. Please try again.');
      }
      return;
    }

    if (state === STATE.RECORDING) {
      setState(STATE.PROCESSING);
      try {
        const { base64 } = await stopRecording();
        const result = await extractTaskFromAudio(base64);
        setState(STATE.IDLE);
        navigation.navigate('Confirm', { extracted: result });
      } catch (e) {
        setState(STATE.IDLE);
        showError(e.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const handleCancel = async () => {
    await cancelRecording();
    setState(STATE.IDLE);
  };

  const recording = state === STATE.RECORDING;
  const processing = state === STATE.PROCESSING;

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Voice to Task"
        subtitle="Speak it. We'll handle the rest."
        icon="mic"
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskList')}
            style={styles.listBtn}
            hitSlop={8}
          >
            <Ionicons name="list" size={20} color={colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.center}>
        {processing ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.processingWrap}>
            <AiLoader />
            <Text style={styles.statusText}>Understanding your request…</Text>
            <Text style={styles.hint}>Extracting task, date and time</Text>
          </Animated.View>
        ) : (
          <>
            <Animated.View entering={FadeInDown.duration(400)}>
              <MicButton recording={recording} processing={processing} onPress={handlePressMic} />
            </Animated.View>

            <View style={styles.waveformWrap}>
              <VoiceWaveform active={recording} color={recording ? colors.danger : colors.primary} />
            </View>

            <Text style={styles.statusText}>
              {recording ? 'Listening… tap to stop' : 'Tap to speak a reminder'}
            </Text>

            <View style={styles.hintPill}>
              <Text style={styles.hint}>"Remind me to call John tomorrow at 5 PM"</Text>
            </View>

            {recording && (
              <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <Snackbar
        visible={snack.visible}
        message={snack.message}
        type={snack.type}
        onHide={() => setSnack((s) => ({ ...s, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  processingWrap: { alignItems: 'center' },
  waveformWrap: { height: 56, marginTop: spacing.xl, justifyContent: 'center' },
  statusText: { ...typography.title, color: colors.textPrimary, marginTop: spacing.lg },
  hintPill: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    maxWidth: '92%',
  },
  hint: { ...typography.subtitle, color: colors.textSecondary, textAlign: 'center' },
  cancelBtn: { marginTop: spacing.xl, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  cancelText: { ...typography.body, color: colors.textTertiary, fontSize: 14 },
});
