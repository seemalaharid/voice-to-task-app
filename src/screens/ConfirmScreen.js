import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { addTask } from '../services/storageService';
import GradientHeader from '../components/GradientHeader';
import Snackbar from '../components/Snackbar';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

function Field({ label, icon, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIcon}>
          <Ionicons name={icon} size={17} color={colors.primary} />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

export default function ConfirmScreen({ route, navigation }) {
  const { extracted } = route.params;

  const [task, setTask] = useState(extracted.task || '');
  const [date, setDate] = useState(extracted.date || '');
  const [time, setTime] = useState(extracted.time || '');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'error' });

  const handleSave = async () => {
    if (!task.trim() || !date.trim()) {
      setSnack({ visible: true, message: 'Task and date are required.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const capitalizedTask = task.trim().charAt(0).toUpperCase() + task.trim().slice(1);
      await addTask({
        task: capitalizedTask,
        date: date.trim(),
        time: time.trim() || null,
        transcript: extracted.transcript,
      });
      setSnack({ visible: true, message: 'Task saved 🎉', type: 'success' });
      setTimeout(() => navigation.replace('TaskList'), 500);
    } catch (e) {
      setSaving(false);
      setSnack({ visible: true, message: e.message || 'Could not save the task.', type: 'error' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <GradientHeader
        title="Review Task"
        subtitle="Edit anything before saving"
        icon="checkmark-done"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {extracted.transcript ? (
          <Animated.View entering={FadeInUp.duration(350)} style={styles.transcriptCard}>
            <View style={styles.transcriptIcon}>
              <Ionicons name="mic" size={14} color={colors.primary} />
            </View>
            <Text style={styles.transcriptText}>"{extracted.transcript}"</Text>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(80).duration(350)} style={styles.formCard}>
          <Field
            label="Task"
            icon="checkbox-outline"
            value={task}
            onChangeText={setTask}
            placeholder="e.g. Call John"
          />
          <Field
            label="Date"
            icon="calendar-outline"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
          <Field
            label="Time (optional)"
            icon="time-outline"
            value={time}
            onChangeText={setTime}
            placeholder="HH:MM"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(350)}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            style={styles.saveBtnWrap}
          >
            <LinearGradient
              colors={colors.gradientFab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Task'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Discard</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Snackbar
        visible={snack.visible}
        message={snack.message}
        type={snack.type}
        onHide={() => setSnack((s) => ({ ...s, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 60 },
  transcriptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  transcriptIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  transcriptText: {
    ...typography.subtitle,
    color: colors.primaryDark,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
    marginBottom: spacing.xl,
  },
  fieldWrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm, fontSize: 12.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  saveBtnWrap: { marginTop: spacing.sm },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: 16,
    ...shadow.fab,
    shadowOpacity: 0.25,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { ...typography.body, color: colors.white, fontSize: 15.5, marginLeft: 8 },
  cancelBtn: { alignItems: 'center', marginTop: spacing.lg, paddingVertical: spacing.sm },
  cancelText: { ...typography.body, color: colors.textTertiary, fontSize: 14, fontWeight: '600' },
});
