import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { MEMBERS, FILTER_OPTIONS } from '../data/memberData';

// ── Avatar ──────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 52 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: size * 0.36 }}>{initials}</Text>
  </View>
);

// ── Filter Bottom Sheet ──────────────────────────────────────────
const FilterModal = ({ type, value, onSelect, onClose }) => (
  <Modal visible={!!type} transparent={true} animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={fm.backdrop} activeOpacity={1} onPress={onClose} />
    <View style={fm.sheet}>
      <View style={fm.handle} />
      <Text style={fm.title}>
        {type === 'location' ? 'Location' : type === 'category' ? 'Category' : type === 'chapter' ? 'Chapter' : 'Product / Service'}
      </Text>
      {type && FILTER_OPTIONS[type].map(opt => (
        <TouchableOpacity key={opt} style={[fm.option, value === opt && fm.optionActive]} onPress={() => { onSelect(opt); onClose(); }}>
          <Text style={[fm.optTxt, value === opt && fm.optTxtActive]}>{opt}</Text>
          {value === opt && <Ionicons name="checkmark" size={16} color={colors.accent} />}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={fm.clearBtn} onPress={() => { onSelect(null); onClose(); }}>
        <Text style={fm.clearTxt}>Clear Filter</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const fm = StyleSheet.create({
  backdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:         { backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 34, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  handle:        { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  title:         { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.primary, marginBottom: 8 },
  option:        { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f2f2f2', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionActive:  { backgroundColor: 'rgba(201,168,76,0.09)', marginHorizontal: -20, paddingHorizontal: 20 },
  optTxt:        { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.primary },
  optTxtActive:  { fontFamily: 'Inter_600SemiBold' },
  clearBtn:      { marginTop: 18, alignItems: 'center', paddingVertical: 13, borderWidth: 1.5, borderColor: colors.accent, borderRadius: 10 },
  clearTxt:      { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});

// ── Member Card ──────────────────────────────────────────────────
const MemberCard = ({ member: m, navigation }) => (
  <TouchableOpacity style={mc.card} activeOpacity={0.7} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
    <Avatar initials={m.initials} color={m.color} size={52} />
    <View style={mc.body}>
      <View style={mc.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={mc.name}>{m.name}</Text>
          <Text style={mc.desig} numberOfLines={1}>{m.designation} · {m.business}</Text>
        </View>
        <TouchableOpacity style={mc.connectBtn} onPress={() => navigation.navigate('MemberProfile', { member: m })}>
          <Text style={mc.connectTxt}>Connect</Text>
        </TouchableOpacity>
      </View>
      <View style={mc.chipRow}>
        <View style={mc.catChip}><Text style={mc.catTxt} numberOfLines={1}>{m.category}</Text></View>
        <View style={mc.chapChip}><Text style={mc.chapTxt}>{m.chapter}</Text></View>
      </View>
      <Text style={mc.offer} numberOfLines={1}>{m.offer}</Text>
    </View>
  </TouchableOpacity>
);

const mc = StyleSheet.create({
  card:       { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3, gap: 12 },
  body:       { flex: 1 },
  topRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  name:       { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.primary },
  desig:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', marginTop: 2 },
  chipRow:    { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  catChip:    { borderWidth: 1.5, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  catTxt:     { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  chapChip:   { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  chapTxt:    { color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  offer:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#777' },
  connectBtn: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 13, marginLeft: 8 },
  connectTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 11 },
});

// ── Empty State ──────────────────────────────────────────────────
const EmptyState = ({ onClear }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <Ionicons name="search-circle-outline" size={88} color="rgba(201,168,76,0.25)" />
    <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 16, marginBottom: 8 }}>No members found</Text>
    <Text style={{ color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>Try a different search term or clear the active filters</Text>
    <TouchableOpacity style={{ backgroundColor: colors.accent, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 10 }} onPress={onClear}>
      <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 }}>Clear Filters</Text>
    </TouchableOpacity>
  </View>
);

// ── Filter Chip Definitions ───────────────────────────────────────
const FILTER_DEFS = [
  { key: 'location', icon: 'location-outline', label: 'Location' },
  { key: 'category', icon: 'pricetag-outline', label: 'Category' },
  { key: 'chapter',  icon: 'business-outline', label: 'Chapter'  },
  { key: 'service',  icon: 'search-outline', label: 'Product/Service' },
];

// ── Main Screen ──────────────────────────────────────────────────
export default function MemberDirectoryScreen({ navigation }) {
  const [query,     setQuery]     = useState('');
  const [filters,   setFilters]   = useState({ location: null, category: null, chapter: null, service: null });
  const [modalType, setModalType] = useState(null);
  const searchRef = useRef(null);

  const filtered = useMemo(() => MEMBERS.filter(m => {
    const q = query.toLowerCase().trim();
    const matchQ  = !q || [m.name, m.business, m.offer, ...(m.keywords || [])].some(t => t.toLowerCase().includes(q));
    const matchL  = !filters.location || m.location === filters.location;
    const matchC  = !filters.category || m.category === filters.category;
    const matchCh = !filters.chapter  || m.chapter  === filters.chapter;
    const svc     = filters.service ? filters.service.toLowerCase().split(' / ')[0] : null;
    const matchS  = !svc || [m.offer, ...(m.keywords || [])].some(t => t.toLowerCase().includes(svc));
    return matchQ && matchL && matchC && matchCh && matchS;
  }), [query, filters]);

  const setFilter   = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const clearFilter = key => setFilter(key, null);
  const clearAll    = () => { setQuery(''); setFilters({ location: null, category: null, chapter: null, service: null }); };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Find Members</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={19} color={colors.accent} style={{ marginRight: 10 }} />
        <TextInput
          ref={searchRef}
          style={s.searchInput}
          placeholder="Search by name, product or service..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#bbb" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={s.filterRowContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {FILTER_DEFS.map(f => {
            const val = filters[f.key];
            const active = !!val;
            return (
              <TouchableOpacity
                key={f.key}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setModalType(f.key)}
              >
                <Ionicons name={f.icon} size={14} color={active ? colors.primary : '#fff'} style={{ marginRight: 4 }} />
                <Text style={[s.chipTxt, active && s.chipTxtActive]} numberOfLines={1}>
                  {val || f.label}
                </Text>
                {active && (
                  <TouchableOpacity onPress={() => clearFilter(f.key)} style={{ marginLeft: 5 }}>
                    <Ionicons name="close" size={14} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results count */}
      <Text style={s.count}>Showing {filtered.length} member{filtered.length !== 1 ? 's' : ''}</Text>

      {/* List or Empty */}
      {filtered.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={m => m.id}
          renderItem={({ item }) => <MemberCard member={item} navigation={navigation} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        type={modalType}
        value={filters[modalType]}
        onSelect={val => setFilter(modalType, val)}
        onClose={() => setModalType(null)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.2)' },
  backBtn:     { padding: 4 },
  headerTitle: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18 },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 14, marginBottom: 12, borderRadius: 25, paddingHorizontal: 16, paddingVertical: Platform_padding() },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.primary, paddingVertical: 0 },
  filterRowContainer: { maxHeight: 44, marginBottom: 16 },
  filterRow:   { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.07)' },
  chipActive:  { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTxt:     { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  chipTxtActive: { color: colors.primary },
  count:       { paddingHorizontal: 16, marginBottom: 8, color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 13 },
  list:        { paddingHorizontal: 16, paddingBottom: 24 },
});

function Platform_padding() { return 11; }
