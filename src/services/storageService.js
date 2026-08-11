import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleTaskNotification, cancelTaskNotification } from './notificationService';

const TASKS_KEY = '@voice_to_task/tasks';

/**
 * Returns all saved tasks, newest first.
 */
export async function getTasks() {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = raw ? JSON.parse(raw) : [];
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error('Failed to load tasks:', e);
    return [];
  }
}

/**
 * Saves a new task and returns the updated list.
 */
export async function addTask({ task, date, time, transcript }) {
  const tasks = await getTasks();

  const isDuplicate = tasks.some(
    (t) => t.task.toLowerCase() === task.toLowerCase() && t.date === date && t.time === time
  );
  if (isDuplicate) {
    throw new Error('This task already exists.');
  }

  const newTask = {
    id: `${Date.now()}`,
    task,
    date,
    time,
    transcript,
    completed: false,
    createdAt: Date.now(),
  };

  const updated = [newTask, ...tasks];
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));

  // Fire-and-forget: don't block saving the task on notification setup.
  scheduleTaskNotification(newTask);

  return updated;
}

/**
 * Toggles a task's completed state.
 */
export async function toggleTask(id) {
  const tasks = await getTasks();
  const updated = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));

  const target = updated.find((t) => t.id === id);
  if (target) {
    if (target.completed) {
      // Task is done — no need to remind about it anymore.
      cancelTaskNotification(id);
    } else {
      // Un-completed — reschedule a reminder if the due time is still ahead.
      scheduleTaskNotification(target);
    }
  }

  return updated;
}

/**
 * Deletes a task by id.
 */
export async function deleteTask(id) {
  const tasks = await getTasks();
  const updated = tasks.filter((t) => t.id !== id);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  cancelTaskNotification(id);
  return updated;
}
