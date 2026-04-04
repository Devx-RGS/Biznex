import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const placeholder = (icon, label, desc) => () => (
  <View style={s.container}>
    <Ionicons name={icon} size={52} color={colors.accent} style={{ marginBottom: 16 }} />
    <Text style={s.title}>{label}</Text>
    <Text style={s.desc}>{desc}</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 10 },
  desc:  { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export const UpdatesScreen   = placeholder('notifications-outline', 'Updates',    'Your notifications and alerts will appear here.');
export const WorldFeedScreen = placeholder('globe-outline',         'World Feed', 'Discover business activity from across India.');
export const EnquiriesScreen = placeholder('chatbubbles-outline',   'Enquiries',  'All your business enquiries will appear here.');
export const ProfileScreen   = placeholder('person-outline',        'My Profile', 'Your BizNex profile will be displayed here.');
