import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GIVERS, TOP_MEMBERS, MEETS } from '../../data/homeData';
import { Avatar, SectionHeader } from './HomeShared';
import { colors } from '../../constants/colors';

const RANK_COLORS = ['#C9A84C', '#9ba5ad', '#cd7f32', '#8A9BB0', '#8A9BB0'];

export function BusinessGiversSection() {
  return (
    <View style={s.section}>
      <SectionHeader title="💰 Recent Business Givers" onSeeAll={() => {}} />
      <View style={s.vList}>
        {GIVERS.map(g => (
          <View key={g.id} style={s.giverCard}>
            <View style={s.giverTop}>
              <View style={s.giverParty}>
                <Avatar initials={g.gI} color={g.gC} size={38} />
                <Text style={s.giverName} numberOfLines={1}>{g.giver}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.accent} style={{ marginHorizontal: 6 }} />
              <View style={s.giverParty}>
                <Avatar initials={g.rI} color={g.rC} size={38} />
                <Text style={s.giverName} numberOfLines={1}>{g.receiver}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <Text style={s.amount}>{g.amount}</Text>
            </View>
            <View style={s.giverBottom}>
              <View style={s.catChip}><Text style={s.catChipTxt}>{g.cat}</Text></View>
              <Text style={s.time}>{g.time}</Text>
              <TouchableOpacity style={s.thanksBtn}><Text style={s.thanksTxt}>Say Thanks 🙏</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function TopMembersSection() {
  return (
    <View style={s.section}>
      <SectionHeader title="🏆 Top Active Members" onSeeAll={() => {}} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={s.hList}>
        {TOP_MEMBERS.map(m => (
          <View key={m.id} style={s.topCard}>
            <View style={[s.rankBadge, { backgroundColor: RANK_COLORS[m.rank - 1] }]}>
              <Text style={s.rankTxt}>#{m.rank}</Text>
            </View>
            <Avatar initials={m.initials} color={m.color} size={50} />
            <Text style={s.topName} numberOfLines={1}>{m.name}</Text>
            <View style={s.scoreBadge}><Text style={s.scoreTxt}>★ {m.score}</Text></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function RecentMeetsSection() {
  return (
    <View style={[s.section, { marginBottom: 100 }]}>
      <SectionHeader title="☕ Recent Meets" onSeeAll={() => {}} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={s.hList}>
        {MEETS.map(m => (
          <View key={m.id} style={s.meetCard}>
            <View style={s.meetTypeBadge}>
              <Ionicons name={m.type === 'Coffee Meet' ? 'cafe-outline' : 'laptop-outline'} size={14} color={colors.accent} />
              <Text style={s.meetTypeTxt}>{m.type}</Text>
            </View>
            <View style={s.meetMembers}>
              <Avatar initials={m.m1I} color={m.m1C} size={38} />
              <Text style={s.vsText}>↔</Text>
              <Avatar initials={m.m2I} color={m.m2C} size={38} />
            </View>
            <Text style={s.meetNames} numberOfLines={1}>{m.m1} & {m.m2}</Text>
            <Text style={s.meetDate}>{m.date}</Text>
            <Text style={s.meetChapter}>{m.chapter}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section:     { marginBottom: 24 },
  hList:       { paddingLeft: 16, paddingRight: 8 },
  vList:       { paddingHorizontal: 16 },
  // Business Givers
  giverCard:   { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  giverTop:    { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  giverParty:  { alignItems: 'center', width: 60 },
  giverName:   { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.primary, marginTop: 4, textAlign: 'center' },
  amount:      { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#27ae60' },
  giverBottom: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  catChip:     { backgroundColor: '#eef2f7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  catChipTxt:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#555' },
  time:        { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', flex: 1 },
  thanksBtn:   { borderWidth: 1.5, borderColor: colors.accent, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 12 },
  thanksTxt:   { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  // Top Members
  topCard:     { width: 110, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginRight: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  rankBadge:   { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 8 },
  rankTxt:     { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 11 },
  topName:     { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary, marginTop: 8, textAlign: 'center' },
  scoreBadge:  { marginTop: 6, backgroundColor: 'rgba(201,168,76,0.12)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  scoreTxt:    { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  // Meets
  meetCard:    { width: 210, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  meetTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,168,76,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  meetTypeTxt: { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  meetMembers: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  vsText:      { fontFamily: 'Inter_700Bold', color: '#ccc', marginHorizontal: 8, fontSize: 16 },
  meetNames:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary, marginBottom: 4 },
  meetDate:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#666', marginBottom: 2 },
  meetChapter: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.accent },
});
