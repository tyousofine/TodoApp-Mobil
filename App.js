import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import HomeScreen from './screens/HomeScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#318CE7'
          }
        }}>
        <Stack.Screen
          name="Tasks"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Add Task"
          component={AddTaskScreen}
        />
        <Stack.Screen
          name="Edit Task"
          component={TaskDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
