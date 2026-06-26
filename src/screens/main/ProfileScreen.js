import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Platform, 
  Dimensions, 
  Alert, 
  Modal,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

// ── Shared UI Sub-Components ───────────────────────────────────────
const SectionHeader = ({ title }) => (
  <Text style={s.sectionTitle}>{title}</Text>
);

const InfoCard = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const InfoItem = ({ icon, label, value }) => (
  <View style={s.infoItem}>
    <Ionicons name={icon} size={18} color={colors.accent} style={{ width: 24 }} />
    <View style={{ flex: 1 }}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoVal} numberOfLines={2}>{value || 'Not Specified'}</Text>
    </View>
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

// Helper component for input fields
const EditField = ({ label, value, onChangeText, multiline = false, placeholder, keyboardType = 'default' }) => (
  <View style={s.editFieldContainer}>
    <Text style={s.editLabel}>{label}</Text>
    <TextInput
      style={[s.editInput, multiline && s.editInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

// ── Main Screen ──────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
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
    socialLinkedIn: 'linkedin.com/in/yashoswal',
    socialInstagram: 'instagram.com/yash_oswal',
    avatarColor: colors.accent,
    initials: 'YO',
    certificateName: 'BizNex_GST_Certificate.pdf',
    certificateStatus: 'Verified', // 'Verified', 'Pending Review', 'Not Uploaded'
    lastRenewedDate: 'Jan 15, 2026',
    renewalDueDate: 'Jan 15, 2027',
    savedByMembers: ['1', '2', '3', '4'],
    savedMembers: ['2', '5'],
  };

  // 1. Data Model state
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });

  // Modal display state
  const [viewCertVisible, setViewCertVisible] = useState(false);

  // Load from AsyncStorage
  const loadProfileFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...DEFAULT_PROFILE, ...parsed };
        setProfile(merged);
        setDraft(merged);
      } else {
        setProfile(DEFAULT_PROFILE);
        setDraft(DEFAULT_PROFILE);
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
      setProfile(DEFAULT_PROFILE);
      setDraft(DEFAULT_PROFILE);
    }
  };

  useEffect(() => {
    loadProfileFromStorage();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  // Sync draft when entering edit mode
  const startEditing = () => {
    setDraft({ ...profile });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!draft.fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
    if (!draft.businessName.trim()) {
      Alert.alert('Validation Error', 'Business Name is required.');
      return;
    }

    // Generate initials from full name
    const nameParts = draft.fullName.trim().split(' ');
    let newInitials = 'YO';
    if (nameParts.length > 0) {
      newInitials = nameParts.map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }

    const updatedProfile = {
      ...draft,
      initials: newInitials
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile edits:', e);
    }

    setProfile(updatedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleFieldChange = (key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  // Simulate certificate actions
  const handleViewCertificate = () => {
    if (profile.certificateStatus === 'Not Uploaded') {
      Alert.alert('No Document', 'Please upload a certificate first.');
      return;
    }
    setViewCertVisible(true);
  };

  const handleUploadCertificate = () => {
    Alert.alert(
      'Upload Certificate',
      'Select document source',
      [
        { text: 'File Manager', onPress: () => simulateUploadSuccess('File_Manager') },
        { text: 'Camera / Scan', onPress: () => simulateUploadSuccess('Camera') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const simulateUploadSuccess = (source) => {
    const mockFilename = `Biz_Reg_Certificate_${Math.floor(100 + Math.random() * 900)}.pdf`;
    
    // If in editing mode, update draft, otherwise update profile directly
    if (isEditing) {
      setDraft(prev => ({
        ...prev,
        certificateName: mockFilename,
        certificateStatus: 'Pending Review'
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        certificateName: mockFilename,
        certificateStatus: 'Pending Review'
      }));
    }
    Alert.alert('Upload Successful', `Certificate "${mockFilename}" has been uploaded via ${source} and is pending verification.`);
  };

  const handleReplaceCertificate = () => {
    handleUploadCertificate();
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Connect with Yash Oswal (Founder & CEO of Oswal Ventures) on BizNex! Download the app: https://biznex.app/profile/yashoswal`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleInviteMember = () => {
    Alert.alert(
      'Invite a New Member',
      'Share your unique invitation link with a business contact:',
      [
        {
          text: 'Copy Invite Link',
          onPress: () => {
            Alert.alert('Copied!', 'Invitation link copied to clipboard:\nhttps://biznex.app/invite/YO-9876');
          }
        },
        { text: 'Share via WhatsApp', onPress: () => Alert.alert('WhatsApp Redirect', 'Sharing invitation link on WhatsApp...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRenewNow = () => {
    Alert.alert(
      'Renew Membership',
      'Would you like to renew your membership for one year?',
      [
        {
          text: 'Renew Now',
          onPress: () => {
            const nextYear = new Date().getFullYear() + 1;
            const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            setProfile(prev => ({
              ...prev,
              lastRenewedDate: today,
              renewalDueDate: `Jan 15, ${nextYear}`
            }));
            Alert.alert('Success', 'Membership renewed successfully! Validity extended.');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of your account?',
      [
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate Account',
      'WARNING: Deactivating your account will permanently remove your business profile and stats. This action cannot be undone.\n\nAre you sure you want to proceed?',
      [
        {
          text: 'Permanently Deactivate',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deactivation',
              'Final check: Are you absolutely sure you want to delete all details?',
              [
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await AsyncStorage.removeItem('userProfile');
                    } catch (e) {
                      console.error('Failed to delete profile:', e);
                    }
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Splash' }],
                    });
                  }
                },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const displayData = isEditing ? draft : profile;

  return (
    <View style={s.container}>
      <StatusBarBackground />
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Custom Header */}
        <View style={s.header}>
          <View style={{ width: 24 }} />
          <Text style={s.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={s.headerBtn} 
            onPress={() => {
              if (isEditing) {
                Alert.alert('Unsaved Changes', 'Discard modifications?', [
                  { text: 'Yes, Discard', onPress: cancelEditing, style: 'destructive' },
                  { text: 'Keep Editing', style: 'cancel' }
                ]);
              } else {
                startEditing();
              }
            }}
          >
            {isEditing ? (
              <Text style={s.headerBtnTextCancel}>Cancel</Text>
            ) : (
              <Ionicons name="create-outline" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 100 }]}
        >
          {/* Hero Header Section */}
          <View style={s.hero}>
            <TouchableOpacity 
              activeOpacity={0.8}
              disabled={!isEditing}
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled) {
                  handleFieldChange('profilePhoto', result.assets[0].uri);
                }
              }}
              style={[s.avatarLarge, { backgroundColor: displayData.avatarColor }]}
            >
              {displayData.profilePhoto ? (
                <Image source={{ uri: displayData.profilePhoto }} style={s.imageFullCircular} />
              ) : (
                <Text style={s.avatarLargeTxt}>{displayData.initials}</Text>
              )}
              {isEditing && (
                <View style={s.avatarOverlay}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            
            {!isEditing ? (
              <>
                <Text style={s.heroName}>{profile.fullName}</Text>
                <Text style={s.heroDesig}>{profile.designation} · {profile.businessName}</Text>
                <View style={s.heroChips}>
                  <View style={s.chip}>
                    <Text style={s.chipTxt}>{profile.chapter} Chapter</Text>
                  </View>
                  <View style={s.chip}>
                    <Text style={s.chipTxt}>{profile.category}</Text>
                  </View>
                </View>
                <Text style={{ color: '#8A9BB0', fontSize: 12, marginBottom: 15 }}>Referral ID: BNX-REF-7842</Text>
                <TouchableOpacity style={s.editProfileBtn} onPress={startEditing}>
                  <Ionicons name="pencil" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={s.editProfileBtnTxt}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ width: '85%', marginTop: 10 }}>
                <EditField 
                  label="Full Name" 
                  value={draft.fullName} 
                  onChangeText={(val) => handleFieldChange('fullName', val)} 
                  placeholder="Yash Oswal"
                />
                <EditField 
                  label="Designation" 
                  value={draft.designation} 
                  onChangeText={(val) => handleFieldChange('designation', val)} 
                  placeholder="Founder & CEO"
                />
              </View>
            )}
          </View>

          {/* Quick Nav Cards */}
          {!isEditing && (
            <TouchableOpacity 
              style={s.quickNavCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Performance')}
            >
              <View style={s.quickNavLeft}>
                <View style={s.quickNavIconCircle}>
                  <Ionicons name="stats-chart" size={20} color={colors.accent} />
                </View>
                <View>
                  <Text style={s.quickNavTitle}>My Performance Overview</Text>
                  <Text style={s.quickNavSubtitle}>View referrals, business volume, and stats</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8A9BB0" />
            </TouchableOpacity>
          )}

          {/* Help & Support Nav Card */}
          {!isEditing && (
            <TouchableOpacity 
              style={[s.quickNavCard, { marginTop: 8 }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Support')}
            >
              <View style={s.quickNavLeft}>
                <View style={s.quickNavIconCircle}>
                  <Ionicons name="help-buoy-outline" size={20} color={colors.accent} />
                </View>
                <View>
                  <Text style={s.quickNavTitle}>Help & Support</Text>
                  <Text style={s.quickNavSubtitle}>Contact us, report issues, or give feedback</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8A9BB0" />
            </TouchableOpacity>
          )}

          {/* ABOUT BUSINESS SECTION */}
          <InfoCard>
            <SectionHeader title="About Business 🎯" />
            {!isEditing ? (
              <Text style={s.descTxt}>{profile.aboutBusiness || 'Add details about your company and what you do...'}</Text>
            ) : (
              <EditField 
                label="About Business Description" 
                value={draft.aboutBusiness} 
                onChangeText={(val) => handleFieldChange('aboutBusiness', val)} 
                placeholder="Describe your company and services..."
                multiline
              />
            )}
          </InfoCard>

          {/* BUSINESS VERIFICATION SECTION */}
          <InfoCard>
            <SectionHeader title="Business Verification 🛡️" />
            <View style={s.verificationContainer}>
              <View style={s.verificationRow}>
                <Ionicons 
                  name={displayData.certificateStatus === 'Verified' ? "checkmark-circle" : "alert-circle"} 
                  size={24} 
                  color={displayData.certificateStatus === 'Verified' ? '#2E7D32' : displayData.certificateStatus === 'Pending Review' ? colors.accent : colors.error} 
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={s.verificationTitle}>Verification Certificate</Text>
                  <View style={s.statusBadgeRow}>
                    <Text style={s.verificationStatusText}>Status: </Text>
                    <Text style={[
                      s.verificationStatusValue,
                      { color: displayData.certificateStatus === 'Verified' ? '#2E7D32' : displayData.certificateStatus === 'Pending Review' ? colors.accent : colors.error }
                    ]}>
                      {displayData.certificateStatus}
                    </Text>
                  </View>
                </View>
              </View>

              {displayData.certificateStatus !== 'Not Uploaded' && (
                <View style={s.certDocRow}>
                  <Ionicons name="document-text-outline" size={32} color={colors.primary} />
                  <Text style={s.certFilename} numberOfLines={1}>{displayData.certificateName}</Text>
                </View>
              )}

              <View style={s.verificationActions}>
                {displayData.certificateStatus !== 'Not Uploaded' ? (
                  <>
                    <TouchableOpacity style={s.btnViewCert} onPress={handleViewCertificate}>
                      <Ionicons name="eye-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={s.btnViewCertTxt}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnReplaceCert} onPress={handleReplaceCertificate}>
                      <Ionicons name="cloud-upload-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                      <Text style={s.btnReplaceCertTxt}>Replace</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={s.btnUploadCert} onPress={handleUploadCertificate}>
                    <Ionicons name="cloud-upload-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={s.btnUploadCertTxt}>Upload Certificate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </InfoCard>

          {/* SOCIAL LINKS SECTION */}
          <InfoCard>
            <SectionHeader title="Social Links 🌐" />
            {!isEditing ? (
              <View style={s.infoGrid}>
                <InfoItem icon="logo-linkedin" label="LinkedIn" value={profile.socialLinkedIn} />
                <InfoItem icon="logo-instagram" label="Instagram" value={profile.socialInstagram} />
                <InfoItem icon="globe-outline" label="Website" value={profile.website} />
                <InfoItem icon="logo-whatsapp" label="WhatsApp" value={profile.whatsApp} />
              </View>
            ) : (
              <View>
                <EditField 
                  label="LinkedIn URL" 
                  value={draft.socialLinkedIn} 
                  onChangeText={(val) => handleFieldChange('socialLinkedIn', val)} 
                  placeholder="linkedin.com/in/username"
                />
                <EditField 
                  label="Instagram URL" 
                  value={draft.socialInstagram} 
                  onChangeText={(val) => handleFieldChange('socialInstagram', val)} 
                  placeholder="instagram.com/username"
                />
                <EditField 
                  label="Website URL" 
                  value={draft.website} 
                  onChangeText={(val) => handleFieldChange('website', val)} 
                  placeholder="www.company.com"
                  keyboardType="url"
                />
                <EditField 
                  label="WhatsApp Number" 
                  value={draft.whatsApp} 
                  onChangeText={(val) => handleFieldChange('whatsApp', val)} 
                  placeholder="+91 XXXXX XXXXX"
                  keyboardType="phone-pad"
                />
              </View>
            )}
          </InfoCard>

          {/* BUSINESS INFORMATION SECTION */}
          <InfoCard>
            <SectionHeader title="Business Information 💼" />
            {!isEditing ? (
              <View style={s.infoGrid}>
                <InfoItem icon="business" label="Company Name" value={profile.businessName} />
                <InfoItem icon="list" label="Category" value={profile.category} />
                <InfoItem icon="briefcase" label="Industry" value={profile.industry} />
                <InfoItem icon="construct" label="Product / Service" value={profile.productService} />
                <InfoItem icon="people" label="Chapter" value={`${profile.chapter} Chapter`} />
                <InfoItem icon="globe" label="Website" value={profile.website} />
              </View>
            ) : (
              <View>
                <EditField 
                  label="Business / Company Name" 
                  value={draft.businessName} 
                  onChangeText={(val) => handleFieldChange('businessName', val)} 
                  placeholder="Oswal Ventures"
                />
                <EditField 
                  label="Business Category" 
                  value={draft.category} 
                  onChangeText={(val) => handleFieldChange('category', val)} 
                  placeholder="IT & Technology, Services, etc."
                />
                <EditField 
                  label="Industry" 
                  value={draft.industry} 
                  onChangeText={(val) => handleFieldChange('industry', val)} 
                  placeholder="Software Development"
                />
                <EditField 
                  label="Product / Service Offerings" 
                  value={draft.productService} 
                  onChangeText={(val) => handleFieldChange('productService', val)} 
                  placeholder="Mobile Apps, ERP Systems, Web Development"
                />
                <EditField 
                  label="BizNex Chapter" 
                  value={draft.chapter} 
                  onChangeText={(val) => handleFieldChange('chapter', val)} 
                  placeholder="Kandivali, Borivali, etc."
                />
              </View>
            )}
          </InfoCard>

          {/* CONTACT INFORMATION SECTION */}
          <InfoCard>
            <SectionHeader title="Contact Information 📞" />
            {!isEditing ? (
              <View style={s.infoGrid}>
                <InfoItem icon="mail" label="Email" value={profile.email} />
                <InfoItem icon="call" label="Phone" value={profile.phone} />
                <InfoItem icon="logo-whatsapp" label="WhatsApp" value={profile.whatsApp} />
                <InfoItem icon="location" label="Address" value={profile.address} />
              </View>
            ) : (
              <View>
                <EditField 
                  label="Email Address" 
                  value={draft.email} 
                  onChangeText={(val) => handleFieldChange('email', val)} 
                  placeholder="contact@company.com"
                  keyboardType="email-address"
                />
                <EditField 
                  label="Phone Number" 
                  value={draft.phone} 
                  onChangeText={(val) => handleFieldChange('phone', val)} 
                  placeholder="+91 XXXXX XXXXX"
                  keyboardType="phone-pad"
                />
                <EditField 
                  label="WhatsApp Contact" 
                  value={draft.whatsApp} 
                  onChangeText={(val) => handleFieldChange('whatsApp', val)} 
                  placeholder="+91 XXXXX XXXXX"
                  keyboardType="phone-pad"
                />
                <EditField 
                  label="Address" 
                  value={draft.address} 
                  onChangeText={(val) => handleFieldChange('address', val)} 
                  placeholder="Full office or business address"
                  multiline
                />
              </View>
            )}
          </InfoCard>

          {/* MEMBERSHIP INFO SECTION */}
          <InfoCard>
            <SectionHeader title="Membership Details 🏅" />
            <View style={s.membershipRow}>
              <View>
                <Text style={s.membershipLabel}>Member Since</Text>
                <Text style={s.membershipVal}>Jan 2025</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={s.membershipLabel}>Status</Text>
                <Text style={s.statusActive}>Active ✅</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.membershipLabel}>Renewal Due Date</Text>
                <Text style={s.membershipVal}>{profile.renewalDueDate}</Text>
              </View>
            </View>
            
            <View style={s.membershipMetaRow}>
              <Text style={s.membershipMetaLabel}>Last Renewed on: </Text>
              <Text style={s.membershipMetaVal}>{profile.lastRenewedDate}</Text>
            </View>

            {!isEditing && (
              <TouchableOpacity style={s.btnRenewNow} onPress={handleRenewNow}>
                <Ionicons name="sparkles" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={s.btnRenewNowTxt}>Renew Membership Now</Text>
              </TouchableOpacity>
            )}
          </InfoCard>

          {/* SHARE & INVITE ACTIONS SECTION */}
          {!isEditing && (
            <InfoCard>
              <SectionHeader title="Quick Actions ⚡" />
              <View style={s.actionsRow}>
                <TouchableOpacity style={s.actionRowButton} onPress={handleShareProfile}>
                  <Ionicons name="share-social-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={s.actionRowButtonText}>Share My Profile</Text>
                </TouchableOpacity>
                <View style={s.actionRowDivider} />
                <TouchableOpacity style={s.actionRowButton} onPress={handleInviteMember}>
                  <Ionicons name="person-add-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={s.actionRowButtonText}>Invite New Member</Text>
                </TouchableOpacity>
              </View>
            </InfoCard>
          )}

          {/* ACCOUNT SECURITY / SYSTEM ACTIONS SECTION */}
          {!isEditing && (
            <View style={s.dangerZone}>
              <TouchableOpacity style={s.dangerButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={s.dangerButtonText}>Logout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[s.dangerButton, s.deactivateButton]} onPress={handleDeactivate}>
                <Ionicons name="trash-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={[s.dangerButtonText, { color: colors.error }]}>Deactivate Account</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Sticky Editing Control Bar */}
        {isEditing && (
          <View style={s.editFooter}>
            <TouchableOpacity style={s.btnCancel} onPress={cancelEditing}>
              <Text style={s.btnCancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnSave} onPress={saveProfile}>
              <Text style={s.btnSaveTxt}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Beautiful Simulated Certificate Viewer Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={viewCertVisible}
          onRequestClose={() => setViewCertVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalContainer}>
              <View style={s.modalHeader}>
                <Text style={s.modalHeaderTitle}>Certificate Preview</Text>
                <TouchableOpacity onPress={() => setViewCertVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={s.modalScrollContent}>
                {/* Simulated Certificate Graphic */}
                <View style={s.certificateFrame}>
                  <View style={s.certificateBorder}>
                    <View style={s.certHeader}>
                      <Ionicons name="ribbon" size={42} color={colors.accent} />
                      <Text style={s.certTitleText}>BIZNEX VERIFIED MEMBER</Text>
                      <Text style={s.certSubtitleText}>BUSINESS NETWORK INTEGRITY CERTIFICATION</Text>
                    </View>

                    <View style={s.certDivider} />

                    <View style={s.certBody}>
                      <Text style={s.certBodyIntro}>This document certifies that the active business entity</Text>
                      <Text style={s.certEntityName}>{profile.businessName}</Text>
                      <Text style={s.certRepText}>represented by</Text>
                      <Text style={s.certRepName}>{profile.fullName}</Text>
                      <Text style={s.certChapterText}>has been thoroughly vetted and registered in the</Text>
                      <Text style={s.certChapterName}>BizNex {profile.chapter} Chapter</Text>
                      <Text style={s.certCategoryText}>under category: {profile.category}</Text>
                    </View>

                    <View style={s.certFooter}>
                      <View style={s.certStampContainer}>
                        <Ionicons name="shield-checkmark" size={32} color={colors.accent} />
                        <Text style={s.certStampText}>VERIFIED</Text>
                      </View>
                      <View style={s.certSignContainer}>
                        <Text style={s.certSignName}>Preethi Rao</Text>
                        <Text style={s.certSignTitle}>BizNex Verification Board</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <Text style={s.modalDisclaimer}>
                  * This is a secure digital verification credential registered on the BizNex ledger.
                </Text>
              </ScrollView>

              <TouchableOpacity 
                style={s.modalCloseBtn}
                onPress={() => setViewCertVisible(false)}
              >
                <Text style={s.modalCloseBtnTxt}>Close Certificate</Text>
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
  headerBtn:      { padding: 4, minWidth: 50, alignItems: 'flex-end' },
  headerBtnTextCancel: { color: colors.secondaryText, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  headerTitle:    { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18, textAlign: 'center', flex: 1 },
  scrollContent:  { backgroundColor: '#F8F9FB' },
  
  // Hero
  hero:           { backgroundColor: colors.primary, alignItems: 'center', paddingBottom: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  avatarLarge:    { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' },
  avatarLargeTxt: { color: '#fff', fontSize: 32, fontFamily: 'Inter_700Bold' },
  imageFullCircular: { width: '100%', height: '100%', borderRadius: 45 },
  avatarOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  heroName:       { color: '#fff', fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  heroDesig:      { color: colors.accent, fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 12, textAlign: 'center', paddingHorizontal: 20 },
  heroChips:      { flexDirection: 'row', gap: 10, marginBottom: 15 },
  
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  editProfileBtnTxt: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  // Quick Nav Card
  quickNavCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 16, 
    marginBottom: 8, 
    borderRadius: 12, 
    padding: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 3 
  },
  quickNavLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  quickNavIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  quickNavTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary },
  quickNavSubtitle: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#888', marginTop: 2 },
  
  // Cards
  card:           { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 12, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionTitle:   { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 12 },
  
  // Read-only Grid
  infoGrid:       { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, columnGap: '6%' },
  infoItem:       { width: '47%', flexDirection: 'row', alignItems: 'center' },
  infoLabel:      { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 },
  infoVal:        { fontSize: 13, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  
  descTxt:        { fontSize: 13.5, color: '#555', fontFamily: 'Inter_400Regular', lineHeight: 20 },
  chip:           { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  chipTxt:        { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#fff' },

  // Inputs
  editFieldContainer: { marginBottom: 12 },
  editLabel:      { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#8A9BB0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  editInput:      { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 13.5, fontFamily: 'Inter_400Regular', color: colors.primary, borderWidth: 1, borderColor: '#E5E7EB' },
  editInputMultiline: { height: 80, paddingTop: 10 },

  // Verification Section
  verificationContainer: { backgroundColor: '#F8F9FB', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  verificationRow: { flexDirection: 'row', alignItems: 'center' },
  verificationTitle: { fontSize: 13.5, fontFamily: 'Inter_700Bold', color: colors.primary },
  statusBadgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  verificationStatusText: { fontSize: 11, color: '#888' },
  verificationStatusValue: { fontSize: 11.5, fontFamily: 'Inter_700Bold' },
  certDocRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  certFilename: { marginLeft: 10, flex: 1, fontSize: 12, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  verificationActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  btnViewCert: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnViewCertTxt: { color: colors.primary, fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  btnReplaceCert: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnReplaceCertTxt: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  btnUploadCert: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignSelf: 'center' },
  btnUploadCertTxt: { color: colors.primary, fontSize: 12.5, fontFamily: 'Inter_700Bold' },

  // Footer for edit mode
  editFooter: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 72, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB',
    zIndex: 100
  },
  btnCancel: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 8, borderWidth: 1.5, borderColor: colors.primary },
  btnCancelTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  btnSave: { flex: 2, height: 44, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnSaveTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },

  // Modal styling for Certificate
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: width * 0.9, maxHeight: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10, marginBottom: 12 },
  modalHeaderTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary },
  modalScrollContent: { paddingVertical: 8 },
  modalCloseBtn: { height: 44, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 14 },
  modalCloseBtnTxt: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },
  modalDisclaimer: { color: '#888', fontSize: 10.5, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 12, paddingHorizontal: 10 },
  
  // Certificate Graphic Design
  certificateFrame: { backgroundColor: '#FDFBF7', borderWidth: 2, borderColor: colors.accent, padding: 4, borderRadius: 8 },
  certificateBorder: { borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', padding: 16, alignItems: 'center' },
  certHeader: { alignItems: 'center', marginBottom: 12 },
  certTitleText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary, letterSpacing: 1, marginTop: 6 },
  certSubtitleText: { fontSize: 8, fontFamily: 'Inter_600SemiBold', color: '#888', letterSpacing: 0.5, marginTop: 2 },
  certDivider: { width: '80%', height: 1.5, backgroundColor: 'rgba(201,168,76,0.4)', marginVertical: 10 },
  certBody: { alignItems: 'center', marginVertical: 8 },
  certBodyIntro: { fontSize: 9, fontFamily: 'Inter_400Regular', color: '#666', fontStyle: 'italic' },
  certEntityName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary, marginVertical: 6, textAlign: 'center' },
  certRepText: { fontSize: 9, fontFamily: 'Inter_400Regular', color: '#666' },
  certRepName: { fontSize: 13, fontFamily: 'Inter_700Bold', color: colors.primary, marginVertical: 2 },
  certChapterText: { fontSize: 9, fontFamily: 'Inter_400Regular', color: '#666', marginTop: 4 },
  certChapterName: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.accent, marginVertical: 2 },
  certCategoryText: { fontSize: 9.5, fontFamily: 'Inter_600SemiBold', color: '#555', marginTop: 4 },
  certFooter: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20, alignItems: 'flex-end' },
  certStampContainer: { alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,168,76,0.5)', padding: 4, borderRadius: 4, backgroundColor: 'rgba(201,168,76,0.05)' },
  certStampText: { fontSize: 8, fontFamily: 'Inter_700Bold', color: colors.accent, marginTop: 2 },
  certSignContainer: { alignItems: 'center' },
  certSignName: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: colors.primary, borderBottomWidth: 1, borderBottomColor: '#888', paddingBottom: 2, minWidth: 80, textAlign: 'center' },
  certSignTitle: { fontSize: 7, color: '#888', marginTop: 2, fontFamily: 'Inter_400Regular' },

  // Membership Card Styling
  membershipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  membershipLabel: { fontSize: 10, color: '#8A9BB0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  membershipVal: { fontSize: 13.5, color: colors.primary, fontFamily: 'Inter_700Bold' },
  statusActive: { fontSize: 13.5, color: '#2E7D32', fontFamily: 'Inter_700Bold' },
  membershipMetaRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 10, borderRadius: 6, marginBottom: 14 },
  membershipMetaLabel: { fontSize: 11, color: '#666', fontFamily: 'Inter_400Regular' },
  membershipMetaVal: { fontSize: 11.5, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  btnRenewNow: { backgroundColor: colors.accent, borderRadius: 8, height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' },
  btnRenewNowTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 12.5 },

  // Quick Actions Rows Styling
  actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 4 },
  actionRowButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  actionRowButtonText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: colors.primary },
  actionRowDivider: { width: 1.5, height: 28, backgroundColor: '#E5E7EB' },

  // Danger/Security Zone Styling
  dangerZone: { marginHorizontal: 16, marginTop: 12, marginBottom: 24, gap: 10 },
  dangerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 12, height: 48, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#E5E7EB' },
  dangerButtonText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.primary },
  deactivateButton: { borderColor: 'rgba(229,57,53,0.2)', backgroundColor: 'rgba(229,57,53,0.03)' }
});
