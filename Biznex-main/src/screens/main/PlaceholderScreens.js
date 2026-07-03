import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useSettings } from '../../context/SettingsContext';

const placeholder = (icon, label, desc) => () => {
  const { theme } = useSettings();
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <Ionicons name={icon} size={52} color={theme.accent} style={{ marginBottom: 16 }} />
      <Text style={[s.title, { color: theme.text }]}>{label}</Text>
      <Text style={[s.desc, { color: theme.mutedText }]}>{desc}</Text>
    </View>
  );
};

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
      { icon: 'person-outline',   label: 'Edit Profile',      screen: null },
      { icon: 'settings-outline', label: 'Settings',          screen: 'Settings' },
      { icon: 'shield-outline',   label: 'Privacy & Security',screen: null },
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
  const { settings, theme } = useSettings();

  return (
    <View style={[ps.safe, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[ps.header, { borderBottomColor: theme.border }]}>
        <Text style={[ps.headerTitle, { color: theme.text }]}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Avatar card */}
        <View style={ps.avatarCard}>
          <View style={ps.avatar}>
            <Text style={ps.avatarTxt}>YO</Text>
          </View>
          <Text style={[ps.name, { color: theme.text }]}>Your Name</Text>
          <Text style={[ps.role, { color: theme.mutedText }]}>
            {settings.profileVisible ? 'Public profile' : 'Private profile'} · {settings.onlineStatus ? 'Online' : 'Hidden'}
          </Text>
        </View>

        {/* Menu groups */}
        {MENU_GROUPS.map(group => (
          <View key={group.title} style={ps.group}>
            <Text style={[ps.groupLabel, { color: theme.accent }]}>{group.title}</Text>
            <View style={[ps.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[ps.row, idx < group.items.length - 1 && ps.rowBorder, { borderBottomColor: theme.border }]}
                  activeOpacity={0.7}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.danger ? '#E53935' : colors.accent}
                    style={{ marginRight: 14 }}
                  />
                  <Text style={[ps.rowLabel, { color: theme.text }, item.danger && { color: '#E53935' }]}>{item.label}</Text>
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
