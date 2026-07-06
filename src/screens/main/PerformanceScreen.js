import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { calculateProfileCompletion } from '../../utils/profileHelper';

const { width } = Dimensions.get('window');

// ── Metrics Card Component ──────────────────────────────────────────
const MetricCard = ({ icon, label, value, trend, iconColor = colors.accent }) => (
  <View style={s.metricCard}>
    <View style={s.metricHeader}>
      <View style={s.metricIconCircle}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
    </View>
    <Text style={s.metricValue}>{value}</Text>
    <Text style={s.metricLabel}>{label}</Text>
    {trend && <Text style={s.metricTrend}>{trend}</Text>}
  </View>
);

// ── Achievements Badge Component ─────────────────────────────────────
const AchievementBadge = ({ icon, title, desc }) => (
  <View style={s.badgeCard}>
    <View style={s.badgeCircle}>
      <Ionicons name={icon} size={24} color={colors.accent} />
    </View>
    <Text style={s.badgeTitle}>{title}</Text>
    <Text style={s.badgeDesc}>{desc}</Text>
  </View>
);



const StatusBarBackground = () => (
  <View style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: Platform.OS === 'ios' ? 60 : 20, 
    backgroundColor: colors.primary, 
    zIndex: 10 
  }} />
);

export default function PerformanceScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  
  const [testimonials] = useState([
    { id: '1', name: 'Anjali Singh', initials: 'AS', rating: 5, date: 'June 18, 2026', text: 'Yash and his team delivered our software portal ahead of schedule. Extremely professional and communicative!' },
    { id: '2', name: 'Vikram Joshi', initials: 'VJ', rating: 4, date: 'June 10, 2026', text: 'Highly recommended for tech consulting. Great knowledge of scalable database systems.' },
    { id: '3', name: 'Meera Kapoor', initials: 'MK', rating: 5, date: 'May 28, 2026', text: 'Always a pleasure collaborating with Yash. A core active member of the Kandivali chapter.' },
    { id: '4', name: 'Sameer Patel', initials: 'SP', rating: 5, date: 'May 15, 2026', text: 'Excellent business ethics and prompt responses. Handled our cloud migration project seamlessly.' },
  ]);

  const [testimonialsGivenList] = useState([
    { id: 'g1', name: 'Rajesh Kumar', initials: 'RK', rating: 5, date: 'June 15, 2026', text: 'Great support on IT systems setup!' },
    { id: 'g2', name: 'Anjali Singh', initials: 'AS', rating: 4, date: 'May 20, 2026', text: 'Amazing food services provided for our corporate retreat.' }
  ]);

  const [savedByMembers] = useState(['1', '2', '3', '4']);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading profile in PerformanceScreen:', e);
    }
  };

  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const displayProfile = profile || {
    fullName: 'Yash Oswal',
    initials: 'YO',
    avatarColor: colors.accent,
    chapter: 'Kandivali',
    membershipStatus: 'Active Member',
  };

  const calculatedCompletion = calculateProfileCompletion(profile || displayProfile);
  const averageRating = testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0';

  const performanceData = {
    fullName: displayProfile.fullName,
    avatarInitials: displayProfile.initials || 'YO',
    avatarColor: displayProfile.avatarColor || colors.accent,
    chapter: displayProfile.chapter || 'Kandivali',
    membershipStatus: displayProfile.membershipStatus || 'Active Member',
    
    // Grid metrics
    profileCompletion: calculatedCompletion,
    vendorSaves: displayProfile.savedByMembers ? displayProfile.savedByMembers.length : savedByMembers.length,
    
    // Reputation stats
    averageRating: averageRating,
    totalReviews: testimonials.length,
    testimonialsGiven: displayProfile.testimonialsGivenList ? displayProfile.testimonialsGivenList.length : testimonialsGivenList.length,
    testimonialsReceived: testimonials.length,
    
    // Testimonials details
    testimonials: testimonials,
    
    // Achievements list
    achievements: [
      { id: '1', title: 'Rising Networker', icon: 'trending-up', desc: 'Visibility grew by 40%' },
      { id: '2', title: 'Highly Rated', icon: 'star', desc: `Consistent ${averageRating}★ reviews` },
      { id: '3', title: 'Trusted Vendor', icon: 'shield-checkmark', desc: 'Documents verified by board' },
    ]
  };

  // Modal toggle state for testimonials list view
  const [testimonialsModalVisible, setTestimonialsModalVisible] = useState(false);

  return (
    <View style={s.container}>
      <StatusBarBackground />
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Networking Performance</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          {/* TOP SUMMARY HERO SECTION */}
          <View style={s.summaryHero}>
            <View style={s.summaryTopRow}>
              <View style={[s.avatar, { backgroundColor: performanceData.avatarColor }]}>
                <Text style={s.avatarTxt}>{performanceData.avatarInitials}</Text>
              </View>
              <View style={s.summaryInfoCol}>
                <Text style={s.summaryName}>{performanceData.fullName}</Text>
                <View style={s.badgeRow}>
                  <View style={s.statusBadge}>
                    <Text style={s.statusBadgeTxt}>{performanceData.membershipStatus}</Text>
                  </View>
                  <Text style={s.chapterTxt}>{performanceData.chapter} Chapter</Text>
                </View>
              </View>
              <View style={s.ratingPill}>
                <Ionicons name="star" size={14} color="#fff" style={{ marginRight: 4 }} />
                <Text style={s.ratingPillTxt}>{performanceData.averageRating}</Text>
              </View>
            </View>

          </View>

          {/* PERFORMANCE METRICS GRID SECTION */}
          <View style={s.sectionHeaderContainer}>
            <Text style={s.sectionHeader}>Visibility & Engagement</Text>
            <Text style={s.sectionSub}>Metrics reflecting your network presence and reach</Text>
          </View>

          <View style={s.metricsGrid}>
            <MetricCard 
              icon="checkmark-circle-outline" 
              label="Profile Completion" 
              value={`${performanceData.profileCompletion}%`}
              trend="Ready for business leads"
            />
            <MetricCard 
              icon="bookmark-outline" 
              label="Vendor Saves" 
              value={performanceData.vendorSaves === 0 ? '—' : performanceData.vendorSaves}
              trend={performanceData.vendorSaves === 0 ? 'No members have saved your profile yet.' : 'Saved as preferred vendor'}
            />
          </View>

          {/* REPUTATION & REVIEWS SECTION */}
          <View style={s.sectionHeaderContainer}>
            <Text style={s.sectionHeader}>Trust & Reputation</Text>
            <Text style={s.sectionSub}>Your ratings and testimonial feedback from members</Text>
          </View>

          <View style={s.reputationCard}>
            {performanceData.totalReviews === 0 ? (
              <View style={s.emptyState}>
                <Ionicons name="star-outline" size={28} color={colors.secondaryText} style={{ marginBottom: 8 }} />
                <Text style={s.emptyStateText}>No ratings yet.</Text>
                <Text style={s.emptyStateSubText}>Keep networking to receive your first review.</Text>
              </View>
            ) : (
              <View style={s.repTopRow}>
                <View style={s.ratingCol}>
                  <Text style={s.bigRating}>{performanceData.averageRating}</Text>
                  <View style={s.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= Math.round(performanceData.averageRating) ? "star" : "star-outline"} 
                        size={14} 
                        color={colors.accent} 
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  <Text style={s.reviewsCount}>Based on {performanceData.totalReviews} reviews</Text>
                </View>

                <View style={s.repDividerLine} />

                <View style={s.testimonialStatsCol}>
                  <View style={s.statMiniRow}>
                    <Text style={s.statMiniLabel}>Given</Text>
                    <Text style={s.statMiniValue}>{performanceData.testimonialsGiven}</Text>
                  </View>
                  <View style={s.statMiniRow}>
                    <Text style={s.statMiniLabel}>Received</Text>
                    <Text style={s.statMiniValue}>{performanceData.testimonialsReceived}</Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={s.btnViewTestimonials}
              activeOpacity={0.8}
              onPress={() => setTestimonialsModalVisible(true)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={s.btnViewTestimonialsTxt}>View Testimonials Received</Text>
            </TouchableOpacity>
          </View>

          {/* ACHIEVEMENTS SECTION */}
          <View style={s.sectionHeaderContainer}>
            <Text style={s.sectionHeader}>Earned Badges</Text>
            <Text style={s.sectionSub}>Recognitions based on community feedback</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={s.achievementsScroll}
          >
            {performanceData.achievements.map((ach) => (
              <AchievementBadge 
                key={ach.id}
                icon={ach.icon}
                title={ach.title}
                desc={ach.desc}
              />
            ))}
          </ScrollView>



          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Testimonials List Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={testimonialsModalVisible}
          onRequestClose={() => setTestimonialsModalVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalBody}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Received Testimonials ({performanceData.testimonials.length})</Text>
                <TouchableOpacity onPress={() => setTestimonialsModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={s.modalScroll}>
                {performanceData.testimonials.length === 0 ? (
                  <View style={s.emptyState}>
                    <Ionicons name="chatbubble-outline" size={32} color={colors.secondaryText} style={{ marginBottom: 10 }} />
                    <Text style={s.emptyStateText}>No testimonials yet.</Text>
                    <Text style={s.emptyStateSubText}>Keep networking to receive your first testimonial.</Text>
                  </View>
                ) : (
                  performanceData.testimonials.map((t) => (
                    <View key={t.id} style={s.testimonialItemCard}>
                      <View style={s.testiTop}>
                        <View style={s.testiAvatar}>
                          <Text style={s.testiAvatarTxt}>{t.initials}</Text>
                        </View>
                        <View style={s.testiInfo}>
                          <Text style={s.testiName}>{t.name}</Text>
                          <Text style={s.testiDate}>{t.date}</Text>
                        </View>
                        <View style={s.testiStars}>
                          {[1,2,3,4,5].map(v => (
                            <Ionicons 
                              key={v} 
                              name={v <= t.rating ? "star" : "star-outline"} 
                              size={12} 
                              color={colors.accent} 
                              style={{ marginLeft: 1 }}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={s.testiText}>"{t.text}"</Text>
                    </View>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity style={s.modalCloseBtn} onPress={() => setTestimonialsModalVisible(false)}>
                <Text style={s.modalCloseBtnTxt}>Close Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F8F9FB' },
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.primary },
  headerBtn:      { padding: 4 },
  headerTitle:    { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18 },
  scrollContent:  { backgroundColor: '#F8F9FB' },

  // Summary Banner
  summaryHero: { 
    backgroundColor: colors.primary, 
    paddingTop: 10,
    paddingBottom: 25, 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    paddingHorizontal: 20
  },
  summaryTopRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarTxt: { color: colors.primary, fontSize: 20, fontFamily: 'Inter_700Bold' },
  summaryInfoCol: { flex: 1, marginLeft: 12 },
  summaryName: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  statusBadge: { backgroundColor: 'rgba(201,168,76,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeTxt: { color: colors.accent, fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  chapterTxt: { color: colors.secondaryText, fontSize: 11, fontFamily: 'Inter_400Regular' },
  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingPillTxt: { color: colors.primary, fontSize: 12, fontFamily: 'Inter_700Bold' },
  
  completionRow: { marginTop: 18 },
  completionLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  completionTitle: { fontSize: 11, color: colors.secondaryText, fontFamily: 'Inter_600SemiBold' },
  completionPct: { fontSize: 11, color: '#fff', fontFamily: 'Inter_700Bold' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
  progressBarActive: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },

  // Grid / Sections Headers
  sectionHeaderContainer: { marginHorizontal: 16, marginTop: 22, marginBottom: 12 },
  sectionHeader: { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.primary },
  sectionSub: { fontSize: 11, color: '#888', marginTop: 2, fontFamily: 'Inter_400Regular' },

  // Metrics Grid
  metricsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 16, 
    justifyContent: 'space-between',
    rowGap: 12
  },
  metricCard: { 
    width: (width - 44) / 2, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 14, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 3 
  },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  metricIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(201,168,76,0.1)', justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 2 },
  metricLabel: { fontSize: 12, color: colors.secondaryText, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  metricTrend: { fontSize: 9.5, color: '#2E7D32', fontFamily: 'Inter_400Regular' },

  // Reputation Card
  reputationCard: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    borderRadius: 12, 
    padding: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 3 
  },
  repTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 14 },
  ratingCol: { alignItems: 'center', flex: 1 },
  bigRating: { fontSize: 32, fontFamily: 'Inter_700Bold', color: colors.primary },
  starsRow: { flexDirection: 'row', marginVertical: 4 },
  reviewsCount: { fontSize: 10, color: '#888', fontFamily: 'Inter_400Regular' },
  repDividerLine: { width: 1, height: 50, backgroundColor: '#E5E7EB' },
  testimonialStatsCol: { flex: 1, alignItems: 'center', gap: 10 },
  statMiniRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%' },
  statMiniLabel: { fontSize: 12, color: '#888', fontFamily: 'Inter_600SemiBold' },
  statMiniValue: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary },
  
  btnViewTestimonials: { backgroundColor: colors.accent, borderRadius: 8, height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' },
  btnViewTestimonialsTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 12.5 },

  // Achievements section
  achievementsScroll: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  badgeCard: { width: 120, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2 },
  badgeCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(201,168,76,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  badgeTitle: { fontSize: 11, fontFamily: 'Inter_700Bold', color: colors.primary, textAlign: 'center', marginBottom: 2 },
  badgeDesc: { fontSize: 8.5, color: '#888', fontFamily: 'Inter_400Regular', textAlign: 'center' },



  // Modal structure
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalBody: { width: width * 0.9, maxHeight: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10, marginBottom: 12 },
  modalTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary },
  modalScroll: { paddingVertical: 4 },
  modalCloseBtn: { height: 44, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 14 },
  modalCloseBtnTxt: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },

  // Testimonial modal item
  testimonialItemCard: { backgroundColor: '#F8F9FB', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  testiTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  testiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  testiAvatarTxt: { color: '#fff', fontSize: 12, fontFamily: 'Inter_700Bold' },
  testiInfo: { marginLeft: 8, flex: 1 },
  testiName: { fontSize: 12.5, fontFamily: 'Inter_700Bold', color: colors.primary },
  testiDate: { fontSize: 9.5, color: '#888', marginTop: 1 },
  testiStars: { flexDirection: 'row' },
  testiText: { fontSize: 12, color: '#555', fontFamily: 'Inter_400Regular', fontStyle: 'italic', lineHeight: 17 },

  // Empty States
  emptyState:        { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  emptyStateText:    { fontSize: 13.5, fontFamily: 'Inter_600SemiBold', color: colors.secondaryText, textAlign: 'center', marginBottom: 4 },
  emptyStateSubText: { fontSize: 11.5, fontFamily: 'Inter_400Regular', color: '#aaa', textAlign: 'center', lineHeight: 16 },
});
