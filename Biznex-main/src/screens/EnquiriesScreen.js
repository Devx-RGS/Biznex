import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import EnquiryStore from '../store/EnquiryStore';

const DIVIDER = 'rgba(201,168,76,0.12)';
const CARD_BG  = '#0F2340';

// ── Received card (with accept/decline) ──────────────────────────────────────

function ReceivedCard({ item, onAccept, onDecline }) {
  const isPending  = item.status === 'pending';
  const isAccepted = item.status === 'accepted';
  const isDeclined = item.status === 'declined';

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={[s.avatar, { backgroundColor: item.from.color }]}>
          <Text style={s.avatarTxt}>{item.from.initials}</Text>
        </View>
        <View style={s.meta}>
          <Text style={s.nameText}>{item.from.name}</Text>
          <Text style={s.bizText}>{item.from.business} · {item.from.category}</Text>
        </View>
        <Text style={s.time}>{item.time}</Text>
      </View>

      <View style={s.messageBox}>
        <Text style={s.message}>{item.message}</Text>
      </View>

      {isAccepted && (
        <View style={s.statusRow}>
          <Ionicons name="checkmark-circle" size={15} color="#27ae60" />
          <Text style={s.acceptedTxt}>Accepted</Text>
        </View>
      )}
      {isAccepted && item.from.phone && (
        <View style={s.contactBox}>
          <Text style={s.contactLabel}>Sender's Contact</Text>
          <View style={s.contactRow}>
            <Ionicons name="call-outline" size={14} color={colors.accent} />
            <Text style={s.contactTxt}>{item.from.phone}</Text>
          </View>
          <View style={s.contactRow}>
            <Ionicons name="mail-outline" size={14} color={colors.accent} />
            <Text style={s.contactTxt}>{item.from.email}</Text>
          </View>
        </View>
      )}
      {isDeclined && (
        <View style={s.statusRow}>
          <Ionicons name="close-circle" size={15} color="#E53935" />
          <Text style={s.declinedStatusTxt}>Declined</Text>
        </View>
      )}
      {isPending && (
        <View style={s.actions}>
          <TouchableOpacity style={s.declineBtn} onPress={() => onDecline(item.id)}>
            <Ionicons name="close" size={15} color="#E53935" />
            <Text style={s.declineBtnTxt}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.acceptBtn} onPress={() => onAccept(item.id)}>
            <Ionicons name="checkmark" size={15} color="#fff" />
            <Text style={s.acceptBtnTxt}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Sent card (read-only, shows status) ──────────────────────────────────────

function SentCard({ item }) {
  const statusMap = {
    pending:  { icon: 'time-outline',      color: '#8A9BB0', label: 'Awaiting response' },
    accepted: { icon: 'checkmark-circle',  color: '#27ae60', label: 'Accepted'          },
    declined: { icon: 'close-circle',      color: '#E53935', label: 'Declined'          },
  };
  const st = statusMap[item.status];

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={[s.avatar, { backgroundColor: item.to.color }]}>
          <Text style={s.avatarTxt}>{item.to.initials}</Text>
        </View>
        <View style={s.meta}>
          <Text style={s.nameText}>{item.to.name}</Text>
          <Text style={s.bizText}>{item.to.business} · {item.to.category}</Text>
        </View>
        <Text style={s.time}>{item.time}</Text>
      </View>

      <View style={s.messageBox}>
        <Text style={s.message}>{item.message}</Text>
      </View>

      <View style={s.statusRow}>
        <Ionicons name={st.icon} size={15} color={st.color} />
        <Text style={[s.statusTxt, { color: st.color }]}>{st.label}</Text>
      </View>
    </View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function Empty({ tab }) {
  const msgs = {
    pending:  { title: 'No pending enquiries',  sub: 'Enquiry requests from other members will appear here.' },
    accepted: { title: 'No accepted enquiries', sub: 'Enquiries you accept will appear here.'               },
    sent:     { title: 'No sent enquiries',     sub: 'Enquiries you send from a member profile will appear here.' },
  };
  const { title, sub } = msgs[tab];
  return (
    <View style={s.empty}>
      <Ionicons name="chatbubbles-outline" size={48} color="#4A6080" style={{ marginBottom: 12 }} />
      <Text style={s.emptyTitle}>{title}</Text>
      <Text style={s.emptySub}>{sub}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'pending',  label: 'Pending'  },
  { key: 'accepted', label: 'Accepted' },
  { key: 'sent',     label: 'Sent'     },
];

export default function EnquiriesScreen({ navigation }) {
  const [tab, setTab]   = useState('pending');
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsub = EnquiryStore.subscribe(() => forceUpdate(n => n + 1));
    return unsub;
  }, []);

  const pendingCount = EnquiryStore.getPending().length;

  const list =
    tab === 'pending'  ? EnquiryStore.getPending()  :
    tab === 'accepted' ? EnquiryStore.getAccepted() :
                         EnquiryStore.getSent();

  const handleAccept = (id) => {
    Alert.alert('Accept Enquiry', 'Accept this enquiry request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => EnquiryStore.acceptEnquiry(id) },
    ]);
  };

  const handleDecline = (id) => {
    Alert.alert('Decline Enquiry', 'Decline this request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => EnquiryStore.declineEnquiry(id) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Enquiries</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, tab === t.key && s.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[s.tabTxt, tab === t.key && s.tabTxtActive]}>{t.label}</Text>
            {t.key === 'pending' && pendingCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeTxt}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {list.length === 0 ? (
          <Empty tab={tab} />
        ) : (
          list.map(item =>
            tab === 'sent' ? (
              <SentCard key={item.id} item={item} />
            ) : (
              <ReceivedCard
                key={item.id}
                item={item}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )
          )
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.primary },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: DIVIDER },
  backBtn:         { padding: 6 },
  headerTitle:     { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18 },

  tabs:            { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, gap: 8 },
  tab:             { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: CARD_BG, gap: 6 },
  tabActive:       { backgroundColor: colors.accent },
  tabTxt:          { color: '#8A9BB0', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  tabTxtActive:    { color: colors.primary },
  badge:           { backgroundColor: '#E53935', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeTxt:        { color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold' },

  scroll:          { flex: 1 },
  scrollContent:   { padding: 16, gap: 12 },

  card:            { backgroundColor: CARD_BG, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: DIVIDER },
  cardTop:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar:          { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTxt:       { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  meta:            { flex: 1 },
  nameText:        { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 2 },
  bizText:         { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 12 },
  time:            { color: '#4A6080', fontFamily: 'Inter_400Regular', fontSize: 11 },

  messageBox:      { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: colors.accent },
  message:         { color: '#C0CFDF', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 },

  contactBox:      { backgroundColor: 'rgba(201,168,76,0.08)', borderRadius: 8, padding: 10, marginTop: 10, gap: 6, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  contactLabel:    { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  contactRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactTxt:      { color: '#C0CFDF', fontFamily: 'Inter_400Regular', fontSize: 13 },
  statusTxt:       { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  acceptedTxt:     { color: '#27ae60', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  declinedStatusTxt: { color: '#E53935', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  actions:         { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 4 },
  declineBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E53935' },
  declineBtnTxt:   { color: '#E53935', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  acceptBtn:       { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 9, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#27ae60' },
  acceptBtnTxt:    { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  empty:           { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle:      { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 17, marginBottom: 8 },
  emptySub:        { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
