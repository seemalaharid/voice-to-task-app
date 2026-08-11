import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecordScreen from '../screens/RecordScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
