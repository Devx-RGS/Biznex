import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NEW_MEMBERS, FEATURED } from '../../data/homeData';
import { Avatar, SectionHeader, CategoryChip } from './HomeShared';
import { colors } from '../../constants/colors';

export function WelcomeMembersSection() {
  const navigation = useNavigation();
  return (
    <View style={s.section}>
      <SectionHeader title="👋 Welcome New Members" onSeeAll={() => {}} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={s.hList}>
        {NEW_MEMBERS.map(m => (
          <TouchableOpacity key={m.id} style={s.memberCard} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
            <Avatar initials={m.initials} color={m.color} size={58} />
            <Text style={s.name} numberOfLines={1}>{m.name}</Text>
            <CategoryChip label={m.category} />
            <Text style={s.chapter}>{m.chapter}</Text>
            <TouchableOpacity style={s.connectBtn} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
              <Text style={s.connectTxt}>Connect</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function FeaturedMembersSection() {
  const navigation = useNavigation();
  return (
    <View style={s.section}>
      <SectionHeader title="⭐ Featured Members" onSeeAll={() => {}} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={s.hList}>
        {FEATURED.map(m => (
          <TouchableOpacity key={m.id} style={s.featCard} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
            <Avatar initials={m.initials} color={m.color} size={54} />
            <Text style={s.name} numberOfLines={1}>{m.name}</Text>
            <Text style={s.business} numberOfLines={1}>{m.business}</Text>
            <CategoryChip label={m.category} />
            <TouchableOpacity style={s.profileBtn} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
              <Text style={s.profileTxt}>View Profile</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section:    { marginBottom: 24 },
  hList:      { paddingLeft: 16, paddingRight: 8 },
  memberCard: { width: 148, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginRight: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  featCard:   { width: 164, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginRight: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  name:       { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary, marginTop: 10, marginBottom: 2, textAlign: 'center' },
  business:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 2 },
  chapter:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginTop: 4 },
  connectBtn: { marginTop: 10, borderWidth: 1.5, borderColor: colors.accent, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 20, width: '100%', alignItems: 'center' },
  connectTxt: { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  profileBtn: { marginTop: 10, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, width: '100%', alignItems: 'center' },
  profileTxt: { color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
