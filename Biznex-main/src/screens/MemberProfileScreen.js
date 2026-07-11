import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import EnquiryStore from '../store/EnquiryStore';

const { width } = Dimensions.get('window');

// ── Shared Components ──────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <Text style={s.sectionTitle}>{title}</Text>
);

const InfoCard = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const Chip = ({ label, outline = false, color = colors.primary }) => (
  <View style={[s.chip, outline ? { borderWidth: 1, borderColor: '#fff' } : { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
    <Text style={[s.chipTxt, { color: '#fff' }]}>{label}</Text>
  </View>
);

const GoldChip = ({ label }) => (
  <View style={s.goldChip}>
    <Text style={s.goldChipTxt}>{label}</Text>
  </View>
);

// ── Section Components ─────────────────────────────────────────────

const StatBox = ({ value, label }) => (
  <View style={s.statBox}>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const AchievementBadge = ({ icon, label }) => (
  <View style={s.badgeContainer}>
    <View style={s.badgeCircle}>
      <Ionicons name={icon} size={24} color={colors.accent} />
    </View>
    <Text style={s.badgeLabel}>{label}</Text>
  </View>
);

const TestimonialCard = ({ name, initials, rating, text }) => (
  <View style={s.testimonialCard}>
    <View style={s.testimonialTop}>
      <View style={s.reviewerAvatar}>
        <Text style={s.reviewerInitials}>{initials}</Text>
      </View>
      <View style={s.reviewerInfo}>
        <Text style={s.reviewerName}>{name}</Text>
        <View style={s.stars}>
          {[1, 2, 3, 4, 5].map(i => (
            <Ionicons key={i} name={i <= rating ? "star" : "star-outline"} size={12} color={colors.accent} />
          ))}
        </View>
      </View>
    </View>
    <Text style={s.testimonialTxt} numberOfLines={3}>"{text}"</Text>
  </View>
);

const StatusBarBackground = () => (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: Platform.OS === 'ios' ? 60 : 20, backgroundColor: colors.primary, zIndex: 10 }} />
);

const InfoItem = ({ icon, label, value }) => (
  <View style={s.infoItem}>
    <Ionicons name={icon} size={18} color={colors.accent} style={{ width: 24 }} />
    <View>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoVal}>{value}</Text>
    </View>
  </View>
);

// ── Main Screen ──────────────────────────────────────────────────

export default function MemberProfileScreen({ route, navigation }) {
  const { member } = route.params || { 
    member: { 
      id: 'BN-00000', 
      name: 'Guest Member', 
      designation: 'Professional', 
      business: 'Business Name', 
      category: 'General', 
      chapter: 'Main', 
      initials: 'GM', 
      color: colors.accent,
      offer: 'Quality services and solutions for your business needs.'
    } 
  };

  const [connectModal, setConnectModal] = useState(false);
  const [connectNote, setConnectNote]   = useState('');
  const [requested, setRequested]       = useState(false);

  const sendConnection = () => {
    if (!connectNote.trim()) {
      Alert.alert('Add a Note', 'Please write a short note with your connection request.');
      return;
    }
    EnquiryStore.sendEnquiry(member, connectNote);
    setConnectNote('');
    setConnectModal(false);
    setRequested(true);
    Alert.alert('Request Sent', `Your connection request has been sent to ${member.name}.`);
  };

  return (
    <View style={s.container}>
      <StatusBarBackground />

      {/* Connect Modal */}
      <Modal visible={connectModal} transparent animationType="slide" onRequestClose={() => setConnectModal(false)}>
        <TouchableOpacity style={m.backdrop} activeOpacity={1} onPress={() => setConnectModal(false)} />
        <View style={m.sheet}>
          <View style={m.handle} />
          <View style={m.sheetHeader}>
            <View style={[m.avatar, { backgroundColor: member.color }]}>
              <Text style={m.avatarTxt}>{member.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={m.toLabel}>Connect with</Text>
              <Text style={m.toName}>{member.name}</Text>
              <Text style={m.toBiz}>{member.business}</Text>
            </View>
            <TouchableOpacity onPress={() => setConnectModal(false)}>
              <Ionicons name="close" size={22} color="#8A9BB0" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={m.input}
            placeholder="Add a note to your connection request..."
            placeholderTextColor="#8A9BB0"
            multiline
            value={connectNote}
            onChangeText={setConnectNote}
            maxLength={300}
            autoFocus
          />
          <Text style={m.charCount}>{connectNote.length}/300</Text>
          <TouchableOpacity
            style={[m.sendBtn, !connectNote.trim() && m.sendBtnDisabled]}
            onPress={sendConnection}
          >
            <Ionicons name="person-add" size={16} color={connectNote.trim() ? colors.primary : '#8A9BB0'} />
            <Text style={[m.sendBtnTxt, !connectNote.trim() && { color: '#8A9BB0' }]}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Member Profile</Text>
          <TouchableOpacity style={s.headerBtn}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          {/* Hero Section */}
          <View style={s.hero}>
            <View style={[s.avatarLarge, { backgroundColor: member.color }]}>
              <Text style={s.avatarLargeTxt}>{member.initials}</Text>
            </View>
            <Text style={s.heroName}>{member.name}</Text>
            <Text style={s.heroDesig}>{member.designation} · {member.business}</Text>
            
            <View style={s.heroChips}>
              <Chip label={member.chapter} outline />
              <Chip label={member.category} outline />
            </View>
            
            <Text style={s.memberId}>ID: BN-{String(member.id).padStart(5, '0')}</Text>
            
            <View style={s.socialRow}>
              {['logo-whatsapp', 'logo-linkedin', 'logo-instagram', 'globe-outline'].map((icon, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.socialIcon, !requested && { opacity: 0.3 }]}
                  disabled={!requested}
                  onPress={() => !requested && Alert.alert('Connect First', 'Send a connection request to access contact details.')}
                >
                  <Ionicons name={icon} size={20} color={colors.accent} />
                </TouchableOpacity>
              ))}
            </View>
            {!requested && (
              <Text style={s.lockedHint}>Connect to unlock contact details</Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={s.actionRow}>
            {requested ? (
              <View style={[s.primaryActionBtn, { opacity: 0.6, flex: 1 }]}>
                <Text style={s.primaryActionTxt}>Request Sent</Text>
              </View>
            ) : (
              <TouchableOpacity style={[s.primaryActionBtn, { flex: 1 }]} onPress={() => setConnectModal(true)}>
                <Text style={s.primaryActionTxt}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* About Card */}
          <InfoCard>
            <SectionHeader title="About" />
            <View style={s.infoGrid}>
              <InfoItem icon="business" label="Company" value={member.business} />
              <InfoItem icon="briefcase" label="Industry" value={member.category} />
              <InfoItem icon="people" label="Employees" value="10-50" />
              <InfoItem icon="location" label="Location" value={`${member.location || 'Mumbai'}, ${member.chapter}`} />
              <InfoItem icon="globe" label="Website" value="www.biznex.app" />
              <InfoItem icon="mail" label="Email" value="contact@member.com" />
              <InfoItem icon="logo-whatsapp" label="WhatsApp" value="+91 9876543210" />
              <InfoItem icon="document-text" label="GST Status" value="Registered" />
            </View>
          </InfoCard>

          {/* What I Offer / Need */}
          <InfoCard>
            <SectionHeader title="What I Offer" />
            <Text style={s.descTxt}>{member.offer}</Text>
            <View style={s.goldChipsRow}>
              {(member.keywords || ['Business', 'Growth', 'Network']).map(k => (
                <GoldChip key={k} label={k} />
              ))}
            </View>
            
            <View style={{ marginTop: 20 }}>
              <SectionHeader title="What I'm Looking For" />
              <Text style={s.descTxt}>Looking to connect with direct decision makers, HR heads and business owners for networking and collaborations.</Text>
            </View>
          </InfoCard>

          {/* Activity Stats */}
          <InfoCard>
            <SectionHeader title="Activity Stats" />
            <View style={s.statsGrid}>
              <StatBox value="₹1,20,000" label="Business Given" />
              <StatBox value="₹85,000" label="Business Received" />
              <StatBox value="24" label="Connects Given" />
              <StatBox value="18" label="Referrals Passed" />
            </View>
          </InfoCard>

          {/* Achievements & Best Connects */}
          <InfoCard>
            <View style={{ marginBottom: 20 }}>
              <SectionHeader title="Achievements" />
              <View style={s.badgesRow}>
                <AchievementBadge icon="star" label="Star Member" />
                <AchievementBadge icon="trending-up" label="Top Referrer" />
                <AchievementBadge icon="cafe" label="Coffee Champion" />
              </View>
            </View>
            <SectionHeader title="Best Connects For" />
            <View style={s.goldChipsRow}>
              <GoldChip label="Real Estate Developers" />
              <GoldChip label="Manufacturing Units" />
              <GoldChip label="Interior Designers" />
            </View>
          </InfoCard>

          {/* Testimonials */}
          <View style={s.testimonialsSection}>
            <SectionHeader title="What Members Say 💬" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.testimonialScroll}>
              <TestimonialCard 
                name="Anjali Singh" 
                initials="AS" 
                rating={5} 
                text="Highly professional and always ready to help. Definitely a great member to connect with." 
              />
              <TestimonialCard 
                name="Vikram Joshi" 
                initials="VJ" 
                rating={4} 
                text="Great business ethics and quality work. Received amazing referrals through this connection." 
              />
              <TestimonialCard 
                name="Meera Kapoor" 
                initials="MK" 
                rating={5} 
                text="Trustworthy and reliable. Has a great network of professionals. Recommended!" 
              />
            </ScrollView>
          </View>

          {/* Media Gallery */}
          <View style={s.gallerySection}>
            <SectionHeader title="Work Gallery 📸" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.galleryScroll}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={s.galleryBox}>
                  <Ionicons name="camera" size={32} color="#ccc" />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Membership Info */}
          <InfoCard style={s.membershipCard}>
            <View style={s.membershipRow}>
              <View>
                <Text style={s.membershipLabel}>Member Since</Text>
                <Text style={s.membershipVal}>Jan 2025</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={s.membershipLabel}>Membership Status</Text>
                <Text style={s.statusActive}>Active ✅</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.membershipLabel}>Renewal Date</Text>
                <Text style={s.membershipVal}>Jan 2026</Text>
              </View>
            </View>
          </InfoCard>

          <View style={{ height: 40 }} />
        </ScrollView>
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
  
  // Hero
  hero:           { backgroundColor: colors.primary, alignItems: 'center', paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarLarge:    { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  avatarLargeTxt: { color: '#fff', fontSize: 32, fontFamily: 'Inter_700Bold' },
  heroName:       { color: '#fff', fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  heroDesig:      { color: colors.accent, fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 15 },
  heroChips:      { flexDirection: 'row', gap: 10, marginBottom: 15 },
  memberId:       { color: '#8A9BB0', fontSize: 12, marginBottom: 20 },
  lockedHint:     { color: '#4A6080', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 6, textAlign: 'center' },
  socialRow:      { flexDirection: 'row', gap: 20 },
  socialIcon:     { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  
  // Actions
  actionRow:      { flexDirection: 'row', paddingHorizontal: 16, marginTop: -25, marginBottom: 20, gap: 10 },
  primaryActionBtn: { flex: 1, backgroundColor: colors.accent, borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  primaryActionTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  secondaryActionBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary },
  secondaryActionTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  
  // Cards
  card:           { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionTitle:   { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 15 },
  infoGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  infoItem:       { width: '47%', flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  infoLabel:      { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoVal:        { fontSize: 13, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  
  descTxt:        { fontSize: 14, color: '#555', fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 12 },
  goldChipsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goldChip:       { backgroundColor: 'rgba(201,168,76,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  goldChipTxt:    { color: colors.accent, fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  
  // Stats
  statsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox:        { width: '48%', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 12, alignItems: 'center' },
  statValue:      { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.accent, marginBottom: 4 },
  statLabel:      { fontSize: 11, color: '#888', fontFamily: 'Inter_400Regular' },
  
  // Badges
  badgesRow:      { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
  badgeContainer: { alignItems: 'center', width: 80 },
  badgeCircle:    { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(201,168,76,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  badgeLabel:     { fontSize: 10, color: colors.primary, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  
  // Testimonials
  testimonialsSection: { marginBottom: 20 },
  testimonialScroll: { paddingHorizontal: 16, gap: 12 },
  testimonialCard: { width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  testimonialTop: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  reviewerInitials: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  reviewerInfo:   { marginLeft: 12 },
  reviewerName:   { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary },
  stars:          { flexDirection: 'row', gap: 2, marginTop: 2 },
  testimonialTxt: { fontSize: 13, color: '#666', fontFamily: 'Inter_400Regular', fontStyle: 'italic', lineHeight: 18 },
  
  // Gallery
  gallerySection: { paddingHorizontal: 16, marginBottom: 24 },
  galleryScroll:  { gap: 10 },
  galleryBox:     { width: 120, height: 120, borderRadius: 12, backgroundColor: '#E9ECEF', justifyContent: 'center', alignItems: 'center' },
  
  // Membership
  membershipCard: { paddingVertical: 20 },
  membershipRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  membershipLabel:{ fontSize: 10, color: '#888', marginBottom: 4 },
  membershipVal:  { fontSize: 13, color: colors.primary, fontFamily: 'Inter_700Bold' },
  statusActive:   { fontSize: 13, color: '#2E7D32', fontFamily: 'Inter_700Bold' },
  
  chip:           { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  chipTxt:        { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  
  infoItem:       { width: '47%', flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  infoLabel:      { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoVal:        { fontSize: 13, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
});

// ── Enquiry modal styles ──────────────────────────────────────────────────────
const m = StyleSheet.create({
  backdrop:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:       { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0D1F3C', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: 18 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  avatar:      { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarTxt:   { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  toLabel:     { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: 2 },
  toName:      { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  toBiz:       { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 12 },
  input:       { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14, minHeight: 110, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', marginBottom: 8, lineHeight: 22 },
  charCount:   { color: '#4A6080', fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'right', marginBottom: 16 },
  sendBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14 },
  sendBtnDisabled: { backgroundColor: 'rgba(201,168,76,0.25)' },
  sendBtnTxt:  { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 15 },
});
