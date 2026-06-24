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

const { width } = Dimensions.get('window');

// ── FAQ Item Component ─────────────────────────────────────────────
const FAQItem = ({ question, answer, isOpen, onPress }) => (
  <View style={s.faqItem}>
    <TouchableOpacity style={s.faqQuestionRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.faqQuestion}>{question}</Text>
      <Ionicons 
        name={isOpen ? "chevron-up" : "chevron-down"} 
        size={18} 
        color={colors.primary} 
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={s.faqAnswerContainer}>
        <Text style={s.faqAnswer}>{answer}</Text>
      </View>
    )}
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

export default function SupportScreen({ navigation }) {
  // Collapsible FAQ states
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Policy Modal state
  const [modalType, setModalType] = useState(null); // 'terms', 'privacy', 'issue', 'feedback', or null

  // Issue/Feedback input state
  const [inputText, setInputText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const faqs = [
    {
      q: "How do I verify my business profile?",
      a: "Navigate to your 'My Profile' tab, scroll down to the 'Business Verification' section, and upload a digital copy (PDF/Image) of your GST registration certificate or Business incorporation document. The verification process takes about 24-48 business hours."
    },
    {
      q: "How do I pass business referrals to other members?",
      a: "Search for a member in the 'Member Directory', click on their card to view their profile, and tap the 'Refer' action button. Fill in the referral name, contact details, and the referral type (hot, warm, or cold) to log the referral."
    },
    {
      q: "Can I transfer my profile to a different chapter?",
      a: "Yes, chapter transfers are handled by our membership committee. Please submit a request via 'Report Issue' or write to chapter-support@biznex.app detailing the reason for transfer and the destination chapter."
    },
    {
      q: "What is the BizNex Verification Badge?",
      a: "The verification badge (gold ribbon or shield checkmark) is awarded to member businesses that have successfully submitted valid registration credentials. It indicates to other members that the business is authentic and legally compliant."
    },
    {
      q: "How are my networking stats calculated?",
      a: "Your networking stats (Business Given, Received, Referrals, and Meetings) are aggregate tallies calculated dynamically from active entries logged in the system by you and your fellow chapter members."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose your preferred contact method:',
      [
        { text: 'Chat on WhatsApp', onPress: () => Alert.alert('WhatsApp Redirect', 'Opening WhatsApp Support chat (+91 90000 12345)...') },
        { text: 'Email Support', onPress: () => Alert.alert('Mail App Redirect', 'Opening email client to send message to support@biznex.app...') },
        { text: 'Call Helpdesk', onPress: () => Alert.alert('Dialer Redirect', 'Dialing support helpline: 1800-200-BIZNEX...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleReportIssueSubmit = () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Field', 'Please describe the issue before submitting.');
      return;
    }
    setModalType(null);
    setInputText('');
    Alert.alert('Issue Logged', 'Your support ticket has been created. A support executive will contact you shortly.');
  };

  const handleFeedbackSubmit = () => {
    setModalType(null);
    setInputText('');
    Alert.alert('Thank You', `We appreciate your feedback! You rated us ${feedbackRating}/5 stars.`);
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
          
          {/* Support Greeting Card */}
          <View style={s.greetingCard}>
            <Ionicons name="help-buoy-outline" size={48} color={colors.accent} style={{ marginBottom: 10 }} />
            <Text style={s.greetingTitle}>How can we help you today?</Text>
            <Text style={s.greetingText}>Our support team is available 24/7 to resolve technical issues and chapter management questions.</Text>
          </View>

          {/* Quick Actions Row */}
          <View style={s.actionGrid}>
            <TouchableOpacity style={s.actionCard} onPress={handleContactSupport}>
              <View style={[s.actionIconBg, { backgroundColor: 'rgba(201,168,76,0.12)' }]}>
                <Ionicons name="chatbubbles-outline" size={20} color={colors.accent} />
              </View>
              <Text style={s.actionTitle}>Contact Us</Text>
              <Text style={s.actionDesc}>Chat with us now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.actionCard} onPress={() => { setInputText(''); setModalType('issue'); }}>
              <View style={[s.actionIconBg, { backgroundColor: 'rgba(229,57,53,0.1)' }]}>
                <Ionicons name="bug-outline" size={20} color={colors.error} />
              </View>
              <Text style={s.actionTitle}>Report Issue</Text>
              <Text style={s.actionDesc}>Submit bug or bug details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.actionCard} onPress={() => { setInputText(''); setFeedbackRating(5); setModalType('feedback'); }}>
              <View style={[s.actionIconBg, { backgroundColor: 'rgba(33,150,243,0.1)' }]}>
                <Ionicons name="thumbs-up-outline" size={20} color="#2196F3" />
              </View>
              <Text style={s.actionTitle}>Feedback</Text>
              <Text style={s.actionDesc}>Rate your experience</Text>
            </TouchableOpacity>
          </View>

          {/* FAQs Accordion */}
          <View style={s.sectionContainer}>
            <Text style={s.sectionHeaderTitle}>Frequently Asked Questions</Text>
            <View style={s.faqList}>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaqIndex === i}
                  onPress={() => toggleFaq(i)}
                />
              ))}
            </View>
          </View>

          {/* Legal / Policy Links */}
          <View style={s.sectionContainer}>
            <Text style={s.sectionHeaderTitle}>Legal & Policies</Text>
            <View style={s.policyList}>
              <TouchableOpacity style={s.policyRow} onPress={() => setModalType('terms')}>
                <View style={s.policyRowLeft}>
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text style={s.policyText}>Terms & Conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8A9BB0" />
              </TouchableOpacity>

              <View style={s.policyDivider} />

              <TouchableOpacity style={s.policyRow} onPress={() => setModalType('privacy')}>
                <View style={s.policyRowLeft}>
                  <Ionicons name="shield-outline" size={20} color={colors.primary} />
                  <Text style={s.policyText}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8A9BB0" />
              </TouchableOpacity>
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
                </Text>
                <TouchableOpacity onPress={() => setModalType(null)}>
                  <Ionicons name="close" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={s.modalScroll}>
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
                    <TouchableOpacity style={s.formSubmitBtn} onPress={handleReportIssueSubmit}>
                      <Text style={s.formSubmitBtnTxt}>Submit Ticket</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={[s.formSubmitBtn, { backgroundColor: '#2196F3' }]} onPress={handleFeedbackSubmit}>
                      <Text style={s.formSubmitBtnTxt}>Submit Feedback</Text>
                    </TouchableOpacity>
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

  // Action Grid
  actionGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 16 },
  actionCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 3 
  },
  actionIconBg: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionTitle: { fontSize: 12.5, fontFamily: 'Inter_700Bold', color: colors.primary },
  actionDesc: { fontSize: 9.5, color: '#888', fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 2 },

  // Sections
  sectionContainer: { marginHorizontal: 16, marginTop: 24 },
  sectionHeaderTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.primary, marginBottom: 12 },
  
  // FAQ List
  faqList: { gap: 10 },
  faqItem: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  faqQuestionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  faqQuestion: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.primary, flex: 1, marginRight: 10 },
  faqAnswerContainer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', padding: 14, backgroundColor: '#F8F9FB' },
  faqAnswer: { fontSize: 12.5, color: '#555', fontFamily: 'Inter_400Regular', lineHeight: 18 },

  // Policies
  policyList: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 4 },
  policyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  policyRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  policyText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  policyDivider: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 14 },

  // Modal Structure
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalBody: { width: width * 0.9, maxHeight: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
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
  formSubmitBtn: { height: 44, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  formSubmitBtnTxt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 14 },

  // Rating Stars
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 14 }
});
