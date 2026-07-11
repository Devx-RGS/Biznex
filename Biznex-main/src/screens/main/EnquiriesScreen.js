import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnquiries } from '../../context/EnquiryContext';
import { useSettings } from '../../context/SettingsContext';

const CARD_BG = '#0F2340';
const DIVIDER = 'rgba(201,168,76,0.14)';

const Avatar = ({ member }) => (
  <View style={[s.avatar, { backgroundColor: member.color || colors.accent }]}>
    <Text style={s.avatarTxt}>{member.initials}</Text>
  </View>
);

const StatusPill = ({ status }) => {
  const tone = status === 'accepted' ? s.accepted : status === 'declined' ? s.declined : s.pending;
  return (
    <View style={[s.statusPill, tone]}>
      <Text style={s.statusTxt}>{status}</Text>
    </View>
  );
};

const RequestCard = ({ request, navigation, onAccept, onDecline, secureChatLock }) => {
  const person = request.direction === 'incoming' ? request.sender : request.receiver;
  const isIncomingPending = request.direction === 'incoming' && request.status === 'pending';
  const canChat = request.status === 'accepted' || !secureChatLock;

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <Avatar member={person} />
        <View style={s.cardBody}>
          <View style={s.nameRow}>
            <Text style={s.name}>{person.name}</Text>
            <StatusPill status={request.status} />
          </View>
          <Text style={s.meta} numberOfLines={1}>
            {person.business} · {person.category || 'BizNex'}
          </Text>
          <Text style={s.time}>{request.createdAt}</Text>
        </View>
      </View>

      <Text style={s.message}>{request.message}</Text>

      {isIncomingPending && (
        <View style={s.actions}>
          <TouchableOpacity style={s.declineBtn} onPress={() => onDecline(request.id)}>
            <Ionicons name="close" size={16} color="#E53935" />
            <Text style={s.declineTxt}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.acceptBtn} onPress={() => onAccept(request.id, request)}>
            <Ionicons name="checkmark" size={16} color={colors.primary} />
            <Text style={s.acceptTxt}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {canChat && (
        <TouchableOpacity
          style={s.chatBtn}
          onPress={() => navigation.navigate('SecureChat', { requestId: request.id })}
        >
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <Text style={s.chatTxt}>Open secure chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function EnquiriesScreen({ navigation }) {
  const { requests, updateRequestStatus, sendMockIncomingRequest } = useEnquiries();
  const { settings, theme } = useSettings();
  const incoming = requests.filter(request => request.direction === 'incoming');
  const outgoing = requests.filter(request => request.direction === 'outgoing');

  const acceptRequest = (id, request) => {
    updateRequestStatus(id, 'accepted');
    navigation.navigate('SecureChat', { requestId: request.id });
  };

  const createMockRequest = () => {
    const request = sendMockIncomingRequest();
    if (settings.enquiryAlerts) {
      Alert.alert('New enquiry request', `${request.sender.name} sent you an enquiry.`);
    }
  };

  return (
    <View style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={s.header}>
        <Text style={[s.headerTitle, { color: theme.text }]}>Enquiries</Text>
        <View style={s.lockBadge}>
          <Ionicons name="shield-checkmark" size={15} color={colors.accent} />
          <Text style={s.lockTxt}>{settings.secureChatLock ? 'Secure chat after accept' : 'Demo chat unlocked'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.demoBtn} onPress={createMockRequest}>
          <Ionicons name="add-circle-outline" size={17} color={colors.primary} />
          <Text style={s.demoTxt}>Send mock request</Text>
        </TouchableOpacity>

        <Text style={s.sectionTitle}>Requests sent to you</Text>
        {incoming.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="chatbubbles-outline" size={36} color="rgba(201,168,76,0.6)" />
            <Text style={s.emptyTxt}>No incoming enquiry requests yet.</Text>
          </View>
        ) : (
          incoming.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              navigation={navigation}
              onAccept={acceptRequest}
              onDecline={id => updateRequestStatus(id, 'declined')}
              secureChatLock={settings.secureChatLock}
            />
          ))
        )}

        <Text style={[s.sectionTitle, { marginTop: 22 }]}>Requests you sent</Text>
        {outgoing.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="paper-plane-outline" size={34} color="rgba(201,168,76,0.6)" />
            <Text style={s.emptyTxt}>Tap Message on a member profile to send an enquiry.</Text>
          </View>
        ) : (
          outgoing.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              navigation={navigation}
              onAccept={acceptRequest}
              onDecline={id => updateRequestStatus(id, 'declined')}
              secureChatLock={settings.secureChatLock}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: DIVIDER },
  headerTitle: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 8 },
  lockBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: DIVIDER, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  lockTxt: { color: '#B8C5D6', fontFamily: 'Inter_500Medium', fontSize: 11 },
  content: { padding: 16, paddingBottom: 34 },
  demoBtn: { height: 42, borderRadius: 9, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 16 },
  demoTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 },
  sectionTitle: { color: colors.accent, fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  card: { backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1, borderColor: DIVIDER, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  meta: { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  time: { color: '#4A6080', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  message: { color: '#D8E0EA', fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 12 },
  statusPill: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  pending: { backgroundColor: 'rgba(201,168,76,0.16)' },
  accepted: { backgroundColor: 'rgba(46,125,50,0.24)' },
  declined: { backgroundColor: 'rgba(229,57,53,0.2)' },
  statusTxt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 10, textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  declineBtn: { flex: 1, height: 40, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(229,57,53,0.55)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  declineTxt: { color: '#E53935', fontFamily: 'Inter_700Bold', fontSize: 13 },
  acceptBtn: { flex: 1, height: 40, borderRadius: 9, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  acceptTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 },
  chatBtn: { marginTop: 14, height: 42, borderRadius: 9, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  chatTxt: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 },
  empty: { backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1, borderColor: DIVIDER, alignItems: 'center', padding: 22, marginBottom: 12 },
  emptyTxt: { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 8 },
});
