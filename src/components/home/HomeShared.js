import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export const Avatar = ({ initials, color, size = 44 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: size * 0.36 }}>{initials}</Text>
  </View>
);

export const SectionHeader = ({ title, onSeeAll }) => (
  <View style={s.row}>
    <Text style={s.title}>{title}</Text>
    {onSeeAll && <TouchableOpacity onPress={onSeeAll}><Text style={s.seeAll}>See all</Text></TouchableOpacity>}
  </View>
);

export const CategoryChip = ({ label }) => (
  <View style={s.chip}><Text style={s.chipText} numberOfLines={1}>{label}</Text></View>
);

const s = StyleSheet.create({
  row:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  title:   { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
  seeAll:  { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  chip:    { backgroundColor: 'rgba(201,168,76,0.13)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 4 },
  chipText:{ color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 11 },
});
