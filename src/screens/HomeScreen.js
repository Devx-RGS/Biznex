import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import BannerSection from '../components/home/BannerSection';
import { WelcomeMembersSection, FeaturedMembersSection } from '../components/home/MemberSections';
import { BusinessGiversSection, TopMembersSection, RecentMeetsSection } from '../components/home/FeedSections';
import { FAB_ACTIONS } from '../data/homeData';
import { calculateProfileCompletion, getMissingFields } from '../utils/profileHelper';

export default function HomeScreen({ navigation }) {
  const [fabOpen, setFabOpen] = useState(false);
  const fabAnim = useRef(new Animated.Value(0)).current;
  const [profile, setProfile] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedPercentage, setDismissedPercentage] = useState(null);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error('Error loading profile in HomeScreen:', e);
    }
  };

  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const completionPercentage = calculateProfileCompletion(profile);
  const missingFields = getMissingFields(profile);

  useEffect(() => {
    if (isDismissed && dismissedPercentage !== null && completionPercentage !== dismissedPercentage) {
      setIsDismissed(false);
      setDismissedPercentage(null);
    }
  }, [completionPercentage, isDismissed, dismissedPercentage]);

  const toggleFab = () => {
    Animated.spring(fabAnim, { toValue: fabOpen ? 0 : 1, friction: 5, tension: 40, useNativeDriver: true }).start();
    setFabOpen(p => !p);
  };

  const rotate = fabAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>BizNex</Text>
        <View style={s.headerRight}>
          {['bookmark-outline', 'calendar-outline'].map(icon => (
            <TouchableOpacity key={icon} style={s.iconBtn}>
              <Ionicons name={icon} size={22} color="#fff" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('MemberDirectory')}>
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.avatarCircle} onPress={() => navigation.navigate('MemberProfile', { isPreview: true })}>
            {profile?.profilePhoto ? (
              <Image source={{ uri: profile.profilePhoto }} style={s.avatarImg} />
            ) : (
              <Text style={s.avatarTxt}>{profile?.initials || 'YO'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        <BannerSection />
        {completionPercentage < 100 && !isDismissed && (
          <View style={s.cardContainer}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>Complete Your Profile</Text>
              <TouchableOpacity 
                style={s.closeBtn} 
                onPress={() => {
                  setIsDismissed(true);
                  setDismissedPercentage(completionPercentage);
                }}
              >
                <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            
            <View style={s.progressRow}>
              <Text style={s.progressLabel}>Profile Completion</Text>
              <Text style={s.progressValue}>{completionPercentage}%</Text>
            </View>
            
            <View style={s.progressTrack}>
              <View style={[s.progressBar, { width: `${completionPercentage}%` }]} />
            </View>
            
            {missingFields.length > 0 && (
              <View style={s.missingList}>
                <Text style={s.missingLabel}>Missing: </Text>
                <Text style={s.missingText} numberOfLines={1}>
                  {missingFields.slice(0, 4).join(' • ')}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={s.completeBtn} 
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={s.completeBtnTxt}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        <WelcomeMembersSection />
        <FeaturedMembersSection />
        <BusinessGiversSection />
        <TopMembersSection />
        <RecentMeetsSection />
      </ScrollView>

      {/* FAB backdrop */}
      {fabOpen && (
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={toggleFab} />
      )}

      {/* FAB Actions */}
      {FAB_ACTIONS.map((action, i) => {
        const translateY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -(64 * (i + 1))] });
        const opacity = fabAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });
        return (
          <Animated.View key={action.label} style={[s.fabAction, { transform: [{ translateY }], opacity }]}>
            <Text style={s.fabLabel}>{action.label}</Text>
            <TouchableOpacity style={[s.fabMini, { backgroundColor: action.color }]}>
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
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.2)' },
  logo:        { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn:     { padding: 6 },
  avatarCircle:{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginLeft: 4, overflow: 'hidden' },
  avatarTxt:   { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 11 },
  avatarImg:   { width: 32, height: 32, borderRadius: 16 },
  scroll:      { flex: 1 },
  // Card Complete Your Profile
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.15)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  closeBtn: {
    padding: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressValue: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: colors.accent,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  missingList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  missingLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.accent,
  },
  missingText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  completeBtn: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnTxt: {
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  // FAB
  backdrop:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 5 },
  fab:         { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  fabAction:   { position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', alignItems: 'center', zIndex: 9 },
  fabMini:     { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  fabLabel:    { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13, marginRight: 10, backgroundColor: 'rgba(10,25,49,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
});
