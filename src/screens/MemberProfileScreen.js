import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions, Linking, Modal, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useUser } from '../context/UserContext';

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
  const { profile } = useUser();
  const isPreview = route.params?.isPreview || false;
  const [member, setMember] = useState(null);
  const [galleryPreviewUri, setGalleryPreviewUri] = useState(null);

  useEffect(() => {
    if (!isPreview) {
      const passedMember = route.params?.member || { 
        id: 'BN-00000', 
        name: 'Guest Member', 
        designation: 'Professional', 
        business: 'Business Name', 
        category: 'General', 
        chapter: 'Main', 
        initials: 'GM', 
        color: colors.accent,
        offer: 'Quality services and solutions for your business needs.'
      };
      const gallery = passedMember.workGallery || (passedMember.id === profile?.id ? profile?.workGallery : []) || [];
      setMember({
        ...passedMember,
        workGallery: gallery,
      });
    } else {
      const DEFAULT_PROFILE = {
        fullName: 'Yash Oswal',
        designation: 'Founder & Managing Director',
        businessName: 'Oswal Ventures',
        category: 'IT & Technology',
        industry: 'Software Development',
        productService: 'Mobile Apps, Cloud ERP Systems',
        chapter: 'Kandivali',
        website: 'www.oswalventures.com',
        email: 'yash@oswalventures.com',
        phone: '+91 98765 43210',
        whatsApp: '+91 98765 43210',
        address: '102, Innovation Hub, S.V. Road, Kandivali West, Mumbai - 400067',
        aboutBusiness: 'Oswal Ventures is a technology solutions company specializing in building scalable mobile applications, customized ERP solutions, and cloud migration services for growing enterprises.',
        lookingFor: 'Seeking strategic partnerships with tech startups, investors, and corporate clients looking for software development services.',
        socialLinkedIn: 'linkedin.com/in/yashoswal',
        socialInstagram: 'instagram.com/yash_oswal',
        avatarColor: colors.accent,
        initials: 'YO',
        profilePhoto: null,
        lastRenewedDate: 'Jan 15, 2026',
        renewalDueDate: 'Jan 15, 2027',
        workGallery: [],
      };
      const mergedProfile = profile ? { ...DEFAULT_PROFILE, ...profile } : DEFAULT_PROFILE;
      
      setMember({
        id: mergedProfile.id || '00000',
        name: mergedProfile.fullName,
        designation: mergedProfile.designation,
        business: mergedProfile.businessName,
        category: mergedProfile.category,
        location: mergedProfile.location || 'Mumbai',
        chapter: mergedProfile.chapter,
        initials: mergedProfile.initials,
        color: mergedProfile.avatarColor || colors.accent,
        offer: mergedProfile.aboutBusiness,
        keywords: mergedProfile.productService ? mergedProfile.productService.split(',').map(s => s.trim()) : ['Business', 'Growth', 'Network'],
        whatsApp: mergedProfile.whatsApp || mergedProfile.phone || '',
        linkedin: mergedProfile.socialLinkedIn || '',
        instagram: mergedProfile.socialInstagram || '',
        website: mergedProfile.website || '',
        email: mergedProfile.email || '',
        lookingFor: mergedProfile.lookingFor || 'Looking to connect with direct decision makers, HR heads and business owners for networking and collaborations.',
        profilePhoto: mergedProfile.profilePhoto || null,
        memberSince: mergedProfile.lastRenewedDate,
        renewalDate: mergedProfile.renewalDueDate,
        workGallery: mergedProfile.workGallery || [],
      });
    }
  }, [route.params?.member, isPreview, profile]);

  // Open a social link safely; silently does nothing if URL is unavailable
  const openSocialLink = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
    } catch (_) {}
  };

  const handleShare = async () => {
    if (!member) return;
    try {
      const name = member.name || 'Member';
      const designation = member.designation || '';
      const businessName = member.business || '';
      
      let titleSection = '';
      if (designation && businessName) {
        titleSection = ` (${designation} of ${businessName})`;
      } else if (designation) {
        titleSection = ` (${designation})`;
      } else if (businessName) {
        titleSection = ` (of ${businessName})`;
      }

      const slug = name.toLowerCase().replace(/\s+/g, '');
      
      await Share.share({
        message: `Connect with ${name}${titleSection} on BizNex! View profile: https://biznex.app/profile/${slug}`,
      });
    } catch (error) {
      console.error('Error sharing member profile:', error);
    }
  };

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  const whatsappUrl  = member.whatsApp  ? `https://wa.me/${member.whatsApp.replace(/\D/g, '')}` : null;
  const linkedinUrl  = member.linkedin   ? (member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`) : null;
  const instagramUrl = member.instagram  ? (member.instagram.startsWith('http') ? member.instagram : `https://${member.instagram}`) : null;
  const websiteUrl   = member.website    ? (member.website.startsWith('http') ? member.website : `https://${member.website}`) : null;

  const socialLinks = [
    { icon: 'logo-whatsapp',  url: whatsappUrl  },
    { icon: 'logo-linkedin',  url: linkedinUrl  },
    { icon: 'logo-instagram', url: instagramUrl },
    { icon: 'globe-outline',  url: websiteUrl   },
  ];

  return (
    <View style={s.container}>
      <StatusBarBackground />
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.headerTitle}>{isPreview ? "My Profile" : "Member Profile"}</Text>
            {isPreview && (
              <Text style={s.headerSubtitle}>Preview your public profile</Text>
            )}
          </View>
          <TouchableOpacity style={s.headerBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          {/* Hero Section */}
          <View style={s.hero}>
            <View style={[s.avatarLarge, { backgroundColor: member.color }]}>
              {member.profilePhoto ? (
                <Image source={{ uri: member.profilePhoto }} style={s.avatarLargeImg} />
              ) : (
                <Text style={s.avatarLargeTxt}>{member.initials}</Text>
              )}
            </View>
            <Text style={s.heroName}>{member.name}</Text>
            <Text style={s.heroDesig}>{member.designation} · {member.business}</Text>
            
            <View style={s.heroChips}>
              <Chip label={member.chapter} outline />
              <Chip label={member.category} outline />
            </View>
            
            <Text style={s.memberId}>ID: BN-{String(member.id).padStart(5, '0')}</Text>
            
            <View style={s.socialRow}>
              {socialLinks.map(({ icon, url }, i) => (
                <TouchableOpacity 
                  key={i}
                  style={[s.socialIcon, !url && s.socialIconDisabled]}
                  onPress={() => openSocialLink(url)}
                  activeOpacity={url ? 0.7 : 1}
                  disabled={!url}
                >
                  <Ionicons name={icon} size={20} color={url ? colors.accent : 'rgba(138,155,176,0.45)'} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={s.actionRow}>
            {isPreview ? (
              <TouchableOpacity 
                style={s.primaryActionBtn} 
                onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
              >
                <Text style={s.primaryActionTxt}>Edit My Profile</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={s.primaryActionBtn}>
                  <Text style={s.primaryActionTxt}>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.secondaryActionBtn}>
                  <Text style={s.secondaryActionTxt}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.secondaryActionBtn}>
                  <Text style={s.secondaryActionTxt}>Refer</Text>
                </TouchableOpacity>
              </>
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
              <InfoItem icon="globe" label="Website" value={member.website || "www.biznex.app"} />
              <InfoItem icon="mail" label="Email" value={member.email || "contact@member.com"} />
              <InfoItem icon="logo-whatsapp" label="WhatsApp" value={member.whatsApp || "+91 9876543210"} />
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
              <Text style={s.descTxt}>{member.lookingFor || 'Looking to connect with direct decision makers, HR heads and business owners for networking and collaborations.'}</Text>
            </View>
          </InfoCard>

          {/* Activity Stats */}
          <InfoCard>
            <SectionHeader title="Activity Stats" />
            <View style={s.statsGrid}>
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
            <SectionHeader title="What Members Say" />
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
            <SectionHeader title="Work Gallery" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.galleryScroll}>
              {member.workGallery && member.workGallery.length > 0 ? (
                member.workGallery.map((imgUri, i) => (
                  <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setGalleryPreviewUri(imgUri)}>
                    <Image source={{ uri: imgUri }} style={s.galleryImage} />
                  </TouchableOpacity>
                ))
              ) : (
                [1, 2, 3, 4].map(i => (
                  <View key={i} style={s.galleryBox}>
                    <Ionicons name="camera" size={32} color="#ccc" />
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Membership Info */}
          <InfoCard style={s.membershipCard}>
            <View style={s.membershipRow}>
              <View>
                <Text style={s.membershipLabel}>Member Since</Text>
                <Text style={s.membershipVal}>{member.memberSince || 'Jan 2025'}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={s.membershipLabel}>Membership Status</Text>
                <Text style={s.statusActive}>Active</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.membershipLabel}>Renewal Date</Text>
                <Text style={s.membershipVal}>{member.renewalDate || 'Jan 2026'}</Text>
              </View>
            </View>
          </InfoCard>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Full-Screen Image Preview Modal */}
        <Modal
          visible={!!galleryPreviewUri}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setGalleryPreviewUri(null)}
        >
          <View style={s.imagePreviewOverlay}>
            <TouchableOpacity 
              style={s.imagePreviewCloseBtn} 
              onPress={() => setGalleryPreviewUri(null)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            {!!galleryPreviewUri && (
              <Image 
                source={{ uri: galleryPreviewUri }} 
                style={s.imagePreviewFull} 
                resizeMode="contain" 
              />
            )}
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
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  scrollContent:  { backgroundColor: '#F8F9FB' },
  
  // Hero
  hero:           { backgroundColor: colors.primary, alignItems: 'center', paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarLarge:    { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  avatarLargeTxt: { color: '#fff', fontSize: 32, fontFamily: 'Inter_700Bold' },
  avatarLargeImg: { width: '100%', height: '100%', borderRadius: 45 },
  heroName:       { color: '#fff', fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  heroDesig:      { color: colors.accent, fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 15 },
  heroChips:      { flexDirection: 'row', gap: 10, marginBottom: 15 },
  memberId:       { color: '#8A9BB0', fontSize: 12, marginBottom: 20 },
  socialRow:      { flexDirection: 'row', gap: 20 },
  socialIcon:     { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  socialIconDisabled: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  
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
  galleryImage:   { width: 120, height: 120, borderRadius: 12 },

  // Image Preview Modal Styles
  imagePreviewOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  imagePreviewCloseBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 25, right: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 20 },
  imagePreviewFull: { width: '100%', height: '80%' },
  
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
