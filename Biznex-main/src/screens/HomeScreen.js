import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import BannerSection from '../components/home/BannerSection';
import { WelcomeMembersSection, FeaturedMembersSection } from '../components/home/MemberSections';
import { BusinessGiversSection } from '../components/home/FeedSections';
import { FAB_ACTIONS } from '../data/homeData';
import MenuDrawer from '../components/MenuDrawer';
import EnquiryStore from '../store/EnquiryStore';

export default function HomeScreen({ navigation }) {
  const [fabOpen, setFabOpen]     = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [pendingCount, setPending] = useState(EnquiryStore.getPending().length);
  const fabAnim = useRef(new Animated.Value(0)).current;

  // Live pending enquiry count for hamburger badge
  useEffect(() => {
    const unsub = EnquiryStore.subscribe(() =>
      setPending(EnquiryStore.getPending().length)
    );
    return unsub;
  }, []);

  const toggleFab = () => {
    Animated.spring(fabAnim, {
      toValue: fabOpen ? 0 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setFabOpen(p => !p);
  };

  const closeFab = () => {
    Animated.spring(fabAnim, { toValue: 0, friction: 5, tension: 40, useNativeDriver: true }).start();
    setFabOpen(false);
  };

  const handleFabAction = (action) => {
    closeFab();
    if (action.label === 'Enquiry') {
      navigation.navigate('Enquiries');
    }
  };

  const rotate = fabAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <SafeAreaView style={s.safe}>
      <MenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} navigation={navigation} />

      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={s.header}>
        {/* Hamburger with pending badge */}
        <TouchableOpacity style={s.iconBtn} onPress={() => setMenuOpen(true)}>
          <Ionicons name="menu" size={24} color="#fff" />
          {pendingCount > 0 && (
            <View style={s.hamBadge}>
              <Text style={s.hamBadgeTxt}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={s.logo}>BizNex</Text>

        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => navigation.navigate('MemberDirectory')}
          >
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.avatarCircle} onPress={() => navigation.navigate('Profile')}>
            <Text style={s.avatarTxt}>YO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Feed ──────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        <BannerSection />
        <WelcomeMembersSection />
        <FeaturedMembersSection />
        <BusinessGiversSection />
      </ScrollView>

      {/* FAB backdrop */}
      {fabOpen && (
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={closeFab} />
      )}

      {/* FAB Actions */}
      {FAB_ACTIONS.map((action, i) => {
        const translateY = fabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(64 * (i + 1))],
        });
        const opacity = fabAnim.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0, 0, 1],
        });
        return (
          <Animated.View
            key={action.label}
            style={[s.fabAction, { transform: [{ translateY }], opacity }]}
          >
            <Text style={s.fabLabel}>{action.label}</Text>
            <TouchableOpacity
              style={[s.fabMini, { backgroundColor: action.color }]}
              onPress={() => handleFabAction(action)}
            >
              <Ionicons name={action.icon} size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* FAB Main */}
      <TouchableOpacity style={s.fab} onPress={toggleFab} activeOpacity={0.85}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.2)' },
  logo:         { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: 0.5 },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn:      { padding: 6 },

  // Hamburger badge
  hamBadge:     { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E53935' },
  hamBadgeTxt:  { display: 'none' },

  enquiryIconBtn: { padding: 6 },
  headerBadge:    { position: 'absolute', top: 2, right: 2, backgroundColor: '#E53935', borderRadius: 9, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  headerBadgeTxt: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' },

  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  avatarTxt:    { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 11 },

  scroll:       { flex: 1 },

  // FAB
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 5 },
  fab:          { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  fabAction:    { position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', alignItems: 'center', zIndex: 9 },
  fabMini:      { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  fabLabel:     { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13, marginRight: 10, backgroundColor: 'rgba(10,25,49,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
});
