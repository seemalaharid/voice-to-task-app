import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import {
  initNotificationCategories,
  requestNotificationPermission,
  DONE_ACTION_ID,
} from './src/services/notificationService';
import { getTasks, toggleTask } from './src/services/storageService';

export default function App() {
  const responseListener = useRef();

  useEffect(() => {
    // Set up the "Mark as done" action button and ask for permission once
    // on startup. Both are safe to call every launch — they no-op if
    // already configured/granted.
    initNotificationCategories();
    requestNotificationPermission();

    // Handles taps on the notification itself and its "Mark as done" button,
    // whether the app is foregrounded, backgrounded, or was killed.
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const taskId = response.notification.request.content.data?.taskId;
        if (!taskId) return;

        if (response.actionIdentifier === DONE_ACTION_ID) {
          const tasks = await getTasks();
          const target = tasks.find((t) => t.id === taskId);
          if (target && !target.completed) {
            await toggleTask(taskId);
          }
        }
      }
    );

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
