import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    section: 'General',
    icon: 'information-circle-outline',
    items: [
      {
        q: 'What is Biznex?',
        a: 'Biznex is a business networking platform that helps professionals connect, collaborate, discover opportunities, and grow their business through events, communities, and digital tools.',
      },
      {
        q: 'Who can use Biznex?',
        a: 'Biznex is open to entrepreneurs, professionals, business owners, startups and anyone looking to expand their professional network.',
      },
      {
        q: 'Is Biznex free to use?',
        a: 'Basic features are available to all registered users. Some premium features or events may require additional payment or membership.',
      },
    ],
  },
  {
    section: 'Account & Login',
    icon: 'person-circle-outline',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Enter your mobile number or email, verify it using the OTP, and complete your profile.',
      },
      {
        q: "I didn't receive the OTP. What should I do?",
        a: 'Wait a few moments, verify your contact details, and tap Resend OTP. If the issue persists, contact Support.',
      },
      {
        q: 'Can I change my registered mobile number or email?',
        a: 'Yes. Go to Settings → Profile to update your contact information.',
      },
      {
        q: 'How do I log out?',
        a: 'Open the menu and tap Logout.',
      },
    ],
  },
  {
    section: 'Profile',
    icon: 'create-outline',
    items: [
      {
        q: 'How do I edit my profile?',
        a: 'Go to Settings → Profile to update your personal, professional, or business details.',
      },
      {
        q: 'Why should I complete my profile?',
        a: 'A complete profile helps you connect with relevant professionals and increases your visibility within the Biznex community.',
      },
    ],
  },
  {
    section: 'Events',
    icon: 'calendar-outline',
    items: [
      {
        q: 'How do I register for an event?',
        a: 'Open the Events section, choose an event, and tap Register.',
      },
      {
        q: 'Can I cancel my event registration?',
        a: "Yes, if cancellations are allowed for that event. Visit the event organizer's page to manage your registration.",
      },
    ],
  },
  {
    section: 'Support',
    icon: 'headset-outline',
    items: [
      {
        q: 'How do I contact support?',
        a: 'Go to Help & Support from the menu and submit your query.',
      },
      {
        q: 'How long does it take to receive a response?',
        a: 'Most support requests are answered within 24–48 business hours.',
      },
      {
        q: 'How can I submit feedback?',
        a: 'Open Feedback, share your suggestions or report an issue, and submit the form.',
      },
    ],
  },
  {
    section: 'Technical Issues',
    icon: 'construct-outline',
    items: [
      {
        q: "The app isn't working properly. What should I do?",
        a: '• Check your internet connection.\n• Restart the app.\n• Clear the app cache.\n• Contact Support if the issue continues.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. Biznex follows industry-standard security practices to help protect your personal information.',
      },
    ],
  },
];

function AccordionItem({ item, isLast }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(p => !p);
  };

  return (
    <View style={[s.item, isLast && s.itemLast]}>
      <TouchableOpacity style={s.question} onPress={toggle} activeOpacity={0.7}>
        <Text style={s.questionText}>{item.q}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.accent}
        />
      </TouchableOpacity>
      {open && (
        <View style={s.answer}>
          <Text style={s.answerText}>{item.a}</Text>
        </View>
      )}
    </View>
  );
}

export default function FAQScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>FAQ</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <Ionicons name="help-circle" size={36} color={colors.accent} />
          </View>
          <Text style={s.heroTitle}>Frequently Asked Questions</Text>
          <Text style={s.heroSub}>Find answers to common questions about Biznex.</Text>
        </View>

        {/* Sections */}
        {FAQ_DATA.map((section) => (
          <View key={section.section} style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name={section.icon} size={18} color={colors.accent} style={{ marginRight: 8 }} />
              <Text style={s.sectionTitle}>{section.section}</Text>
            </View>
            <View style={s.card}>
              {section.items.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  item={item}
                  isLast={idx === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Still need help */}
        <View style={s.helpBox}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.accent} style={{ marginBottom: 8 }} />
          <Text style={s.helpTitle}>Still need help?</Text>
          <Text style={s.helpSub}>Go to Help & Support from the menu to submit your query.</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_BG = '#0F2340';
const DIVIDER = 'rgba(201,168,76,0.12)';

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: DIVIDER },
  backBtn:      { padding: 6 },
  headerTitle:  { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: 0.3 },

  scroll:       { flex: 1 },
  scrollContent:{ paddingHorizontal: 16, paddingTop: 20 },

  hero:         { alignItems: 'center', marginBottom: 28 },
  heroIcon:     { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(201,168,76,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroTitle:    { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 20, textAlign: 'center', marginBottom: 6 },
  heroSub:      { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  section:      { marginBottom: 20 },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 2 },
  sectionTitle: { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase' },

  card:         { backgroundColor: CARD_BG, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: DIVIDER },

  item:         { borderBottomWidth: 1, borderBottomColor: DIVIDER },
  itemLast:     { borderBottomWidth: 0 },

  question:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15 },
  questionText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 14, flex: 1, marginRight: 10, lineHeight: 20 },

  answer:       { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 2 },
  answerText:   { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 },

  helpBox:      { backgroundColor: CARD_BG, borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: DIVIDER, marginTop: 4 },
  helpTitle:    { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 6 },
  helpSub:      { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
