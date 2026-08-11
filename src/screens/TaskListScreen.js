import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTasks, toggleTask, deleteTask } from '../services/storageService';
import TaskCard from '../components/TaskCard';
import GradientHeader from '../components/GradientHeader';
import AnimatedFab from '../components/AnimatedFab';
import EmptyState from '../components/EmptyState';
import Snackbar from '../components/Snackbar';
import { colors, spacing } from '../theme/theme';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ visible: false, message: '', type: 'success' });

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  }, []);

  // Refresh every time the screen comes into focus (e.g. after saving a new task)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const showSnack = (message, type = 'success') => {
    setSnack({ visible: true, message, type });
  };

  const handleToggle = async (id) => {
    const target = tasks.find((t) => t.id === id);
    const updated = await toggleTask(id);
    setTasks(updated);
    if (target) {
      showSnack(target.completed ? 'Marked as pending' : 'Task completed 🎉', 'success');
    }
  };

  const handleDelete = async (id) => {
    try {
      const updated = await deleteTask(id);
      setTasks(updated);
      showSnack('Task deleted', 'info');
    } catch (e) {
      showSnack('Could not delete task', 'error');
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <View style={styles.container}>
      <GradientHeader
        title="My Tasks"
        subtitle="Manage your voice reminders"
        icon="sparkles"
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        rightElement={
          tasks.length > 0 ? (
            <View style={styles.countBadge}>
              <View style={styles.countDot} />
            </View>
          ) : null
        }
      />

      {!loading && tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TaskCard item={item} onToggle={handleToggle} onDelete={handleDelete} />
          )}
        />
      )}

      <AnimatedFab icon="mic" onPress={() => navigation.navigate('Record')} />

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
  list: { padding: spacing.xl, paddingTop: spacing.xl, paddingBottom: 120 },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
});
