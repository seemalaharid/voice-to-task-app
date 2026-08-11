import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOutRight, LinearTransition } from 'react-native-reanimated';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    if (isSameDay(d, today)) return 'Today';
    if (isSameDay(d, tomorrow)) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function TaskCard({ item, onToggle, onDelete }) {
  const swipeRef = useRef(null);

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => {
        swipeRef.current?.close();
        onDelete(item.id);
      }}
    >
      <View style={styles.deleteIconCircle}>
        <Ionicons name="trash-outline" size={20} color={colors.white} />
      </View>
      <Text style={styles.deleteActionText}>Delete</Text>
    </Pressable>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOutRight.duration(220)}
      layout={LinearTransition.springify().damping(18)}
      style={styles.wrap}
    >
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        rightThreshold={36}
        friction={2}
      >
        <View style={styles.card}>
          <Pressable
            onPress={() => onToggle(item.id)}
            hitSlop={8}
            style={[
              styles.statusDot,
              item.completed ? styles.statusDotDone : styles.statusDotPending,
            ]}
          >
            {item.completed ? (
              <Ionicons name="checkmark" size={16} color={colors.success} />
            ) : (
              <View style={styles.pendingInnerDot} />
            )}
          </Pressable>

          <View style={styles.info}>
            <Text
              numberOfLines={2}
              style={[styles.taskText, item.completed && styles.taskTextDone]}
            >
              {item.task}
            </Text>

            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Ionicons name="calendar-clear-outline" size={11} color={colors.primary} />
                <Text style={styles.chipText}>{formatDate(item.date)}</Text>
              </View>

              {item.time ? (
                <View style={[styles.chip, styles.chipAlt]}>
                  <Ionicons name="time-outline" size={11} color={colors.textSecondary} />
                  <Text style={[styles.chipText, styles.chipTextAlt]}>{formatTime(item.time)}</Text>
                </View>
              ) : null}

              <View
                style={[
                  styles.statusPill,
                  item.completed ? styles.statusPillDone : styles.statusPillPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    item.completed ? styles.statusPillTextDone : styles.statusPillTextPending,
                  ]}
                >
                  {item.completed ? 'Completed' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  statusDot: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  statusDotDone: { backgroundColor: colors.successBg },
  statusDotPending: {
    backgroundColor: colors.pendingBg,
    borderWidth: 1.5,
    borderColor: '#DCDCE8',
  },
  pendingInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  info: { flex: 1 },
  taskText: { ...typography.body, color: colors.textPrimary, lineHeight: 21 },
  taskTextDone: { textDecorationLine: 'line-through', color: colors.textTertiary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: spacing.sm, gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipAlt: { backgroundColor: colors.surfaceMuted },
  chipText: { ...typography.caption, color: colors.primaryDark, marginLeft: 4, fontSize: 11.5 },
  chipTextAlt: { color: colors.textSecondary },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusPillDone: { backgroundColor: colors.successBg },
  statusPillPending: { backgroundColor: colors.pendingBg },
  statusPillText: { ...typography.caption, fontSize: 11.5 },
  statusPillTextDone: { color: colors.success },
  statusPillTextPending: { color: colors.pending },

  deleteAction: {
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 84,
    borderRadius: radius.lg,
    marginBottom: 0,
    marginLeft: spacing.sm,
  },
  deleteIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  deleteActionText: { ...typography.caption, color: colors.white, fontSize: 11 },
});
