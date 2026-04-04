import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';
import { UpdatesScreen, WorldFeedScreen, EnquiriesScreen, ProfileScreen } from '../screens/main/PlaceholderScreens';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home',      label: 'Home',       ai: 'home',              ii: 'home-outline',              component: HomeScreen      },
  { name: 'Updates',   label: 'Updates',    ai: 'notifications',     ii: 'notifications-outline',     component: UpdatesScreen   },
  { name: 'WorldFeed', label: 'World Feed', ai: 'globe',             ii: 'globe-outline',             component: WorldFeedScreen },
  { name: 'Enquiries', label: 'Enquiries',  ai: 'chatbubbles',       ii: 'chatbubbles-outline',       component: EnquiriesScreen },
  { name: 'Profile',   label: 'Profile',    ai: 'person',            ii: 'person-outline',            component: ProfileScreen   },
];

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TAB_CONFIG.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopColor: 'rgba(201,168,76,0.2)',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
          tabBarLabelStyle: { fontFamily: 'Inter_400Regular', fontSize: 10 },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tab.ai : tab.ii} size={22} color={color} />
          ),
        };
      }}
    >
      {TAB_CONFIG.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} options={{ tabBarLabel: tab.label }} />
      ))}
    </Tab.Navigator>
  );
}
