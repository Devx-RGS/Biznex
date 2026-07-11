import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

// ── Profile Screen ────────────────────────────────────────────────────────────

const CARD_BG  = '#0F2340';
const DIVIDER  = 'rgba(201,168,76,0.12)';

const MENU_GROUPS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline',   label: 'Edit Profile',       screen: null  },
      { icon: 'settings-outline', label: 'Settings',           screen: null, stub: true },
      { icon: 'shield-outline',   label: 'Privacy & Security', screen: null  },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline',     label: 'FAQ',               screen: 'FAQ'  },
      { icon: 'chatbubble-ellipses-outline', label: 'Help & Support', screen: null  },
      { icon: 'star-outline',            label: 'Rate the App',      screen: null   },
    ],
  },
  {
    title: 'More',
    items: [
      { icon: 'document-text-outline', label: 'Terms & Privacy', screen: null },
      { icon: 'log-out-outline',       label: 'Logout',          screen: null, danger: true },
    ],
  },
];

export function ProfileScreen({ navigation }) {
  return (
    <View style={ps.safe}>
      {/* Header */}
      <View style={ps.header}>
        <Text style={ps.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Avatar card */}
        <View style={ps.avatarCard}>
          <View style={ps.avatar}>
            <Text style={ps.avatarTxt}>YO</Text>
          </View>
          <Text style={ps.name}>Your Name</Text>
          <Text style={ps.role}>BizNex Member</Text>
        </View>

        {/* Menu groups */}
        {MENU_GROUPS.map(group => (
          <View key={group.title} style={ps.group}>
            <Text style={ps.groupLabel}>{group.title}</Text>
            <View style={ps.card}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[ps.row, idx < group.items.length - 1 && ps.rowBorder]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.stub) {
                      Alert.alert('Coming Soon', 'This feature will be available in the next update.');
                      return;
                    }
                    item.screen && navigation.navigate(item.screen);
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.danger ? '#E53935' : colors.accent}
                    style={{ marginRight: 14 }}
                  />
                  <Text style={[ps.rowLabel, item.danger && { color: '#E53935' }]}>{item.label}</Text>
                  {!item.danger && (
                    <Ionicons name="chevron-forward" size={16} color="#4A6080" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const ps = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: DIVIDER },
  headerTitle: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 20 },

  avatarCard:  { alignItems: 'center', paddingVertical: 28 },
  avatar:      { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarTxt:   { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 22 },
  name:        { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 4 },
  role:        { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 13 },

  group:       { paddingHorizontal: 16, marginBottom: 20 },
  groupLabel:  { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 2 },
  card:        { backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1, borderColor: DIVIDER, overflow: 'hidden' },
  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: DIVIDER },
  rowLabel:    { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 14 },
});
