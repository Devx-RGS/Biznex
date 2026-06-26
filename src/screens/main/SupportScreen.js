import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import PrimaryButton from '../../components/PrimaryButton';

const { width } = Dimensions.get('window');

// ── Reusable Styling Components ─────────────────────────────────────

const SectionHeader = ({ title }) => (
  <Text style={s.sectionTitle}>{title}</Text>
);

const InfoCard = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const ContactInfoItem = ({ icon, label, value }) => (
  <View style={s.contactInfoItem}>
    <View style={s.contactIconCircle}>
      <Ionicons name={icon} size={18} color={colors.accent} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.contactLabel}>{label}</Text>
      <Text style={s.contactVal}>{value}</Text>
    </View>
  </View>
);

const BenefitItem = ({ text }) => (
  <View style={s.benefitItem}>
    <Ionicons name="checkmark-circle" size={18} color={colors.accent} style={{ marginRight: 8, marginTop: 1 }} />
    <Text style={s.benefitTxt}>{text}</Text>
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

const AD_PACKAGES = [
  {
    name: 'Starter Package',
    duration: '7 Days',
    price: '₹2,499',
    benefits: [
      'Home screen banner visibility',
      'Increased profile exposure',
      'Priority business discovery',
      'Enhanced brand awareness'
    ]
  },
  {
    name: 'Growth Package',
    duration: '15 Days',
    price: '₹4,999',
    benefits: [
      'Home screen banner visibility',
      'Increased profile exposure (2x)',
      'Priority business discovery',
      'Enhanced brand awareness'
    ]
  },
  {
    name: 'Premium Package',
    duration: '30 Days',
    price: '₹8,999',
    benefits: [
      'Home screen banner visibility (Featured)',
      'Increased profile exposure (5x)',
      'Priority business discovery (Top tier)',
      'Enhanced brand awareness'
    ]
  }
];

export default function SupportScreen({ navigation }) {
  // Modal state
  const [modalType, setModalType] = useState(null); // 'issue', 'feedback', 'advertise', 'terms', 'privacy', or null

  // Issue/Feedback inputs
  const [inputText, setInputText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const handleEmailUs = () => {
    Alert.alert(
      'Email Us',
      'Opening your mail client to send a message to support@biznex.app...',
      [{ text: 'OK' }]
    );
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      'Dialing customer support: +1 (800) 200-BIZNEX...',
      [{ text: 'OK' }]
    );
  };

  const handleReportIssueSubmit = () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Field', 'Please describe the issue before submitting.');
      return;
    }
    setModalType(null);
    setInputText('');
    Alert.alert(
      'Issue Logged',
      'Your support ticket has been created. A support executive will contact you shortly.',
      [{ text: 'OK' }]
    );
  };

  const handleFeedbackSubmit = () => {
    setModalType(null);
    setInputText('');
    Alert.alert(
      'Thank You',
      `We appreciate your feedback! You rated us ${feedbackRating}/5 stars.`,
      [{ text: 'OK' }]
    );
  };

  const handleBookPackage = (packageName) => {
    setModalType(null);
    Alert.alert(
      'Booking Request Received',
      `Thank you for booking the ${packageName}!\n\nOur advertising support team will contact you within 24 hours to confirm your business details and set up your Home screen banner.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={s.container}>
      <StatusBarBackground />
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Help & Support</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          
          {/* Section 1: HELP & SUPPORT HEADER MESSAGE */}
          <View style={s.greetingCard}>
            <Ionicons name="help-buoy-outline" size={48} color={colors.accent} style={{ marginBottom: 10 }} />
            <Text style={s.greetingTitle}>How can we help you today?</Text>
            <Text style={s.greetingText}>Our support team is available to assist you with account verification, chapter listings, and networking queries.</Text>
          </View>

          {/* Section 2: CONTACT SUPPORT CARD */}
          <InfoCard>
            <SectionHeader title="Contact Support" />
            <View style={s.contactInfoList}>
              <ContactInfoItem 
                icon="mail-outline" 
                label="Support Email" 
                value="support@biznex.app" 
              />
              <ContactInfoItem 
                icon="call-outline" 
                label="Support Phone Number" 
                value="+1 (800) 200-BIZNEX" 
              />
              <ContactInfoItem 
                icon="time-outline" 
                label="Office Hours" 
                value="Mon - Sat, 9:00 AM - 6:00 PM" 
              />
            </View>
            <View style={s.contactActionsRow}>
              <TouchableOpacity style={s.contactBtnLeft} onPress={handleEmailUs}>
                <Ionicons name="mail" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={s.contactBtnTxtLeft}>Email Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.contactBtnRight} onPress={handleCallSupport}>
                <Ionicons name="call" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={s.contactBtnTxtRight}>Call Support</Text>
              </TouchableOpacity>
            </View>
          </InfoCard>

          {/* Section 3: REPORT ISSUE SECTION */}
          <InfoCard>
            <SectionHeader title="Report an Issue" />
            <Text style={s.descTxt}>
              Encountered a bug, crash, or account issue? Provide details of the problem so our engineering team can resolve it.
            </Text>
            <TouchableOpacity style={s.btnAccent} onPress={() => { setInputText(''); setModalType('issue'); }}>
              <Ionicons name="bug-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={s.btnAccentTxt}>Report an Issue</Text>
            </TouchableOpacity>
          </InfoCard>

          {/* Section 4: FEEDBACK SECTION */}
          <InfoCard>
            <SectionHeader title="Feedback" />
            <Text style={s.descTxt}>
              We are constantly working to improve BizNex. Share your suggestions, ideas, or overall app experience with us.
            </Text>
            <TouchableOpacity style={s.btnOutline} onPress={() => { setInputText(''); setFeedbackRating(5); setModalType('feedback'); }}>
              <Ionicons name="thumbs-up-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={s.btnOutlineTxt}>Send Feedback</Text>
            </TouchableOpacity>
          </InfoCard>

          {/* Section 5: ADVERTISE WITH BIZNEX SECTION */}
          <InfoCard style={s.advertiseCard}>
            <View style={s.advertiseCardHeader}>
              <View style={s.advertiseIconCircle}>
                <Ionicons name="megaphone" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.advertiseCardTitle}>Advertise with BizNex</Text>
                <Text style={s.advertiseCardSubtitle}>Grow Your Brand Presence</Text>
              </View>
            </View>
            <Text style={s.descTxt}>
              Feature your business banner prominently on the HomeScreen. Reach more businesses, increase profile exposure, and generate direct networking opportunities.
            </Text>
            <TouchableOpacity style={s.btnGold} onPress={() => setModalType('advertise')}>
              <Ionicons name="ribbon-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
              <Text style={s.btnGoldTxt}>View Banner Packages</Text>
            </TouchableOpacity>
          </InfoCard>



          {/* Section 7: SUPPORT STATUS SECTION */}
          <View style={s.statusContainer}>
            <View style={s.statusRow}>
              <View style={s.statusItem}>
                <Text style={s.statusLabel}>App Version</Text>
                <Text style={s.statusVal}>v1.4.2</Text>
              </View>
              <View style={s.statusDivider} />
              <View style={s.statusItem}>
                <Text style={s.statusLabel}>Last Updated</Text>
                <Text style={s.statusVal}>June 2026</Text>
              </View>
              <View style={s.statusDivider} />
              <View style={s.statusItem}>
                <Text style={s.statusLabel}>Support SLA</Text>
                <Text style={s.statusVal}>Within 24 Hrs</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Action/Policy Modals */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalType !== null}
          onRequestClose={() => setModalType(null)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalBody}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>
                  {modalType === 'terms' && "Terms & Conditions"}
                  {modalType === 'privacy' && "Privacy Policy"}
                  {modalType === 'issue' && "Report an Issue"}
                  {modalType === 'feedback' && "Submit Feedback"}
                  {modalType === 'advertise' && "Banner Promotion Packages"}
                </Text>
                <TouchableOpacity onPress={() => setModalType(null)}>
                  <Ionicons name="close" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={s.modalScroll} showsVerticalScrollIndicator={false}>
                {/* 1. Terms & Conditions Content */}
                {modalType === 'terms' && (
                  <View style={s.legalTextContainer}>
                    <Text style={s.legalTitle}>1. Acceptance of Terms</Text>
                    <Text style={s.legalParagraph}>
                      By registering and creating a profile on the BizNex platform, you agree to comply with and be bound by the following Terms & Conditions. These terms govern your participation in local chapters, feed posts, and member directories.
                    </Text>
                    <Text style={s.legalTitle}>2. Member Code of Conduct</Text>
                    <Text style={s.legalParagraph}>
                      All business interactions, connections, referrals, and communication must follow professional standards. Harassment, spamming, listing fraudulent credentials, or soliciting unauthorized commercial products is strictly prohibited.
                    </Text>
                    <Text style={s.legalTitle}>3. Business Verification</Text>
                    <Text style={s.legalParagraph}>
                      You guarantee that all documents and information provided in the verification section are accurate and authentic. Uploading fake documentation may result in immediate suspension of membership without a refund.
                    </Text>
                  </View>
                )}

                {/* 2. Privacy Policy Content */}
                {modalType === 'privacy' && (
                  <View style={s.legalTextContainer}>
                    <Text style={s.legalTitle}>Data Collection</Text>
                    <Text style={s.legalParagraph}>
                      BizNex collects details such as your business name, designation, industry category, certificate documents, phone numbers, and social links to build a searchable member directory and verification credentials.
                    </Text>
                    <Text style={s.legalTitle}>Data Visibility</Text>
                    <Text style={s.legalParagraph}>
                      By default, your profile details (except private verification documents) are searchable by other logged-in members of BizNex to foster networking. Uploaded business certificates are only accessible by the Verification Board.
                    </Text>
                    <Text style={s.legalTitle}>Third-Party Sharing</Text>
                    <Text style={s.legalParagraph}>
                      We do not sell, rent, or lease your business details to third-party marketing companies. Data is exclusively utilized to maintain chapter performance metrics and messaging facilities.
                    </Text>
                  </View>
                )}

                {/* 3. Issue Submission Content */}
                {modalType === 'issue' && (
                  <View style={s.formContainer}>
                    <Text style={s.fieldLabel}>Describe the issue / bug</Text>
                    <TextInput 
                      style={s.formTextarea}
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Explain what happened, including any steps to reproduce the error. Mention details about screens, buttons, or broken links..."
                      placeholderTextColor={colors.placeholder}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                    />
                    <PrimaryButton title="Submit Ticket" onPress={handleReportIssueSubmit} />
                  </View>
                )}

                {/* 4. Feedback Submission Content */}
                {modalType === 'feedback' && (
                  <View style={s.formContainer}>
                    <Text style={s.fieldLabel}>Rate your BizNex experience</Text>
                    <View style={s.starsContainer}>
                      {[1, 2, 3, 4, 5].map(val => (
                        <TouchableOpacity key={val} onPress={() => setFeedbackRating(val)}>
                          <Ionicons 
                            name={val <= feedbackRating ? "star" : "star-outline"} 
                            size={36} 
                            color={colors.accent} 
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <Text style={s.fieldLabel}>Share your suggestions or review</Text>
                    <TextInput 
                      style={s.formTextarea}
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="What do you like? What can we improve? Feel free to suggest features!"
                      placeholderTextColor={colors.placeholder}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    <PrimaryButton title="Submit Feedback" onPress={handleFeedbackSubmit} />
                  </View>
                )}

                {/* 5. Advertising Banner Packages Content */}
                {modalType === 'advertise' && (
                  <View style={s.packagesContainer}>
                    <Text style={s.packagesSubtitle}>Select a banner promotion tier. Our advertising coordinator will guide you through graphic sizes and launch scheduling.</Text>
                    {AD_PACKAGES.map((pkg) => (
                      <View key={pkg.name} style={s.packageCard}>
                        <View style={s.packageHeaderRow}>
                          <View>
                            <Text style={s.packageName}>{pkg.name}</Text>
                            <Text style={s.packageDuration}>Duration: {pkg.duration}</Text>
                          </View>
                          <View style={s.packagePriceBadge}>
                            <Text style={s.packagePrice}>{pkg.price}</Text>
                          </View>
                        </View>
                        
                        <View style={s.packageDivider} />
                        
                        <Text style={s.packageBenefitsTitle}>Benefits Included:</Text>
                        <View style={s.packageBenefitsList}>
                          {pkg.benefits.map((benefit, bIndex) => (
                            <View key={bIndex} style={s.packageBenefitRow}>
                              <Ionicons name="checkmark" size={14} color={colors.accent} style={{ marginRight: 6 }} />
                              <Text style={s.packageBenefitTxt}>{benefit}</Text>
                            </View>
                          ))}
                        </View>
                        
                        <TouchableOpacity style={s.pkgBookBtn} onPress={() => handleBookPackage(pkg.name)}>
                          <Text style={s.pkgBookBtnTxt}>Book Now</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={s.modalCloseBtn} onPress={() => setModalType(null)}>
                <Text style={s.modalCloseBtnTxt}>Go Back</Text>
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
  scrollContent:  { backgroundColor: '#F8F9FB', paddingBottom: 20 },

  // Greeting
  greetingCard: { 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    paddingTop: 10,
    paddingBottom: 25, 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  greetingTitle: { color: '#fff', fontSize: 18, fontFamily: 'Inter_700Bold', marginVertical: 6, textAlign: 'center' },
  greetingText: { color: colors.secondaryText, fontSize: 12.5, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 18 },

  // Cards & General Section Styling
  card:           { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionTitle:   { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 15 },
  descTxt:        { fontSize: 13.5, color: '#555', fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 14 },

  // Buttons
  btnAccent: { backgroundColor: colors.accent, borderRadius: 8, height: 44, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%', shadowColor: colors.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  btnAccentTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  btnOutline: { backgroundColor: '#fff', borderRadius: 8, height: 44, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%', borderWidth: 1.5, borderColor: colors.primary },
  btnOutlineTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },

  // Contact Info
  contactInfoList: { gap: 12, marginBottom: 14 },
  contactInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(201,168,76,0.1)', justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  contactVal: { fontSize: 13.5, color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  contactActionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  contactBtnLeft: { flex: 1, height: 40, backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  contactBtnTxtLeft: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 },
  contactBtnRight: { flex: 1, height: 40, backgroundColor: 'rgba(10,25,49,0.06)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#E0E0E0' },
  contactBtnTxtRight: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 },

  // Advertise Card
  advertiseCard: { borderWidth: 1.5, borderColor: colors.accent, backgroundColor: '#FFFDF9' },
  advertiseCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  advertiseIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.15)', justifyContent: 'center', alignItems: 'center' },
  advertiseCardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary },
  advertiseCardSubtitle: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: colors.accent },
  btnGold: { backgroundColor: colors.primary, borderRadius: 8, height: 44, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%', borderWidth: 1.5, borderColor: colors.accent },
  btnGoldTxt: { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 14 },

  // Benefits List
  benefitsContainer: { gap: 10 },
  benefitItem: { flexDirection: 'row', alignItems: 'flex-start' },
  benefitTxt: { fontSize: 13, color: '#444', fontFamily: 'Inter_400Regular', lineHeight: 18, flex: 1 },

  // Policies List
  policyList: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 4 },
  policyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  policyRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  policyText: { fontSize: 13.5, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  policyDivider: { height: 1, backgroundColor: '#E5E7EB' },

  // Status Info Footer
  statusContainer: { marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  statusItem: { alignItems: 'center', flex: 1 },
  statusLabel: { fontSize: 9, color: '#8A9BB0', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  statusVal: { fontSize: 11, color: colors.primary, fontFamily: 'Inter_700Bold' },
  statusDivider: { width: 1, height: 20, backgroundColor: '#E5E7EB' },

  // Modals Structure
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalBody: { width: width * 0.9, maxHeight: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10, marginBottom: 12 },
  modalTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary },
  modalScroll: { paddingVertical: 8 },
  modalCloseBtn: { height: 44, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 14 },
  modalCloseBtnTxt: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },

  // Legal Content styling
  legalTextContainer: { paddingHorizontal: 4 },
  legalTitle: { fontSize: 13.5, fontFamily: 'Inter_700Bold', color: colors.primary, marginTop: 12, marginBottom: 4 },
  legalParagraph: { fontSize: 12.5, color: '#555', fontFamily: 'Inter_400Regular', lineHeight: 18, marginBottom: 8 },

  // Form Container styling
  formContainer: { paddingHorizontal: 4 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: colors.primary, marginBottom: 6 },
  formTextarea: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.primary, borderWidth: 1, borderColor: '#E5E7EB', minHeight: 100, marginBottom: 16 },

  // Rating Stars
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 14 },

  // Advertising Packages
  packagesSubtitle: { fontSize: 12.5, color: '#666', fontFamily: 'Inter_400Regular', lineHeight: 18, marginBottom: 16 },
  packageCard: { backgroundColor: '#F8F9FA', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginBottom: 16 },
  packageHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageName: { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.primary },
  packageDuration: { fontSize: 11.5, color: '#666', fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  packagePriceBadge: { backgroundColor: 'rgba(201,168,76,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)' },
  packagePrice: { fontSize: 14, fontFamily: 'Inter_700Bold', color: colors.accent },
  packageDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  packageBenefitsTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 6 },
  packageBenefitsList: { gap: 6, marginBottom: 12 },
  packageBenefitRow: { flexDirection: 'row', alignItems: 'center' },
  packageBenefitTxt: { fontSize: 11.5, color: '#555', fontFamily: 'Inter_400Regular' },
  pkgBookBtn: { height: 36, backgroundColor: colors.accent, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  pkgBookBtnTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }
});
