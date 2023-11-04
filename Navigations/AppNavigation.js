import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import { HomeIcon, MusicalNoteIcon } from 'react-native-heroicons/solid';
import { Theme } from '../Theme/Index';
import Library from '../Screens/Library';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            if (route.name === 'Home') {
              return <HomeIcon color={focused ? '#F43F5E' : '#9CA3AF'} size={focused ? 35 : 28} />;
            } else {
              return <MusicalNoteIcon color={focused ? '#F43F5E' : '#9CA3AF'} size={focused ? 35 : 28} />
            }
          },
          tabBarActiveTintColor: '#F43F5E',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: Theme.bgSecondary.primary,
            borderRadius: 70,
            position: 'absolute',
            borderTopColor: 'transparent'
          },
          tabBarItemStyle: {
            fontFamily: 'Inter_400Regular',
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_400Regular',
            fontSize: 10,
            fontWeight: 500,
          },
        })}
      >


        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Library" component={Library} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  )

}
