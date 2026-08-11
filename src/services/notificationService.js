import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Action button identifier shown on the notification itself.
export const DONE_ACTION_ID = 'MARK_DONE';
const CATEGORY_ID = 'task-reminder';

// Controls how notifications behave while the app is open/foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registers the "Mark as done" quick-action button on task reminder
 * notifications. Must run once at app startup, before any notification
 * using this category is scheduled.
 */
export async function initNotificationCategories() {
  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: DONE_ACTION_ID,
      buttonTitle: '✅ Mark as done',
      options: { opensAppToForeground: false },
    },
  ]);
}

/**
 * Requests Android/iOS notification permission. Safe to call repeatedly —
 * it only prompts the user the first time.
 */
export async function requestNotificationPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('task-reminders', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5B4BFF',
    });
  }

  return finalStatus === 'granted';
}

function buildTriggerDate(date, time) {
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return null;

  let hh = 9;
  let mm = 0;
  if (time) {
    const [h, min] = time.split(':').map(Number);
    if (!Number.isNaN(h)) hh = h;
    if (!Number.isNaN(min)) mm = min;
  }

  return new Date(y, m - 1, d, hh, mm, 0);
}

/**
 * Schedules a local notification for a task's due date/time.
 * Uses the task's own id as the notification identifier so it can be
 * looked up and cancelled later (on delete or manual completion).
 * Silently no-ops if permission isn't granted or the time is in the past.
 */
export async function scheduleTaskNotification(task) {
  alert('scheduleTaskNotification CALLED');
  try {
    const granted = await requestNotificationPermission();
    alert('Permission granted: ' + granted);
    if (!granted) return null;

    const triggerDate = buildTriggerDate(task.date, task.time);
    if (!triggerDate || triggerDate.getTime() <= Date.now()) return null;
    alert('Scheduling for: ' + triggerDate.toString());

    // Replace any existing notification for this task before scheduling anew.
    await cancelTaskNotification(task.id);

    await Notifications.scheduleNotificationAsync({
      identifier: task.id,
      content: {
        title: 'Task Reminder ⏰',
        body: `${task.task} now!`,
        categoryIdentifier: CATEGORY_ID,
        data: { taskId: task.id },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: 'task-reminders',
      },
    });

    return task.id;
  } catch (e) {
    console.error('Failed to schedule notification:', e);
    alert('NOTIFY ERROR: ' + e.message);
    return null;
  }
}

/**
 * Cancels a task's scheduled notification, if one exists.
 */
export async function cancelTaskNotification(taskId) {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
  } catch (e) {
    // No-op: nothing was scheduled for this id.
  }
}
