import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../Screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator tabBarOptions={{ style: { marginTop: 20 }, labelStyle: { fontSize: 16 } }}>
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}
