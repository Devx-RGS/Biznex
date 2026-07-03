import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useEnquiries } from '../context/EnquiryContext';
import { useSettings } from '../context/SettingsContext';

export default function SecureChatScreen({ route, navigation }) {
  const { requestId } = route.params || {};
  const { requests, chats, sendChatMessage } = useEnquiries();
  const { settings, theme } = useSettings();
  const [draft, setDraft] = useState('');

  const request = requests.find(item => item.id === requestId);
  const messages = chats[requestId] || [];

  const chatPartner = useMemo(() => {
    if (!request) return null;
    return request.direction === 'incoming' ? request.sender : request.receiver;
  }, [request]);

  const sendMessage = () => {
    sendChatMessage(requestId, draft);
    setDraft('');
  };

  if (!request || (settings.secureChatLock && request.status !== 'accepted')) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
            <Ionicons name="arrow-back" size={23} color="#fff" />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: theme.text }]}>Secure Chat</Text>
          <View style={s.iconBtn} />
        </View>
        <View style={s.locked}>
          <Ionicons name="lock-closed" size={48} color={colors.accent} />
          <Text style={s.lockedTitle}>Chat locked</Text>
          <Text style={s.lockedTxt}>Accept the enquiry request before opening this conversation.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
            <Ionicons name="arrow-back" size={23} color="#fff" />
          </TouchableOpacity>
          <View style={s.partner}>
            <View style={[s.avatar, { backgroundColor: chatPartner.color || colors.accent }]}>
              <Text style={s.avatarTxt}>{chatPartner.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.partnerName}>{chatPartner.name}</Text>
              <View style={s.secureRow}>
                <Ionicons name="lock-closed" size={11} color={colors.accent} />
                <Text style={s.secureTxt}>Secure enquiry chat</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.messages} showsVerticalScrollIndicator={false}>
          {messages.map(message => {
            const isMine = message.from === 'me';
            const isSystem = message.from === 'system';
            if (isSystem) {
              return (
                <View key={message.id} style={s.systemBubble}>
                  <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
                  <Text style={s.systemTxt}>{message.text}</Text>
                </View>
              );
            }

            return (
              <View key={message.id} style={[s.bubble, isMine ? s.myBubble : s.theirBubble]}>
                <Text style={[s.bubbleTxt, isMine && s.myBubbleTxt]}>{message.text}</Text>
                <Text style={[s.bubbleTime, isMine && s.myBubbleTime]}>{message.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={s.composer}>
          <TextInput
            style={s.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a secure message..."
            placeholderTextColor="#8A9BB0"
            multiline
          />
          <TouchableOpacity style={s.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.16)' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18 },
  partner: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 13 },
  partnerName: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  secureTxt: { color: '#8A9BB0', fontFamily: 'Inter_500Medium', fontSize: 11 },
  messages: { padding: 16, paddingBottom: 24 },
  bubble: { maxWidth: '82%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 10 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#0F2340', borderWidth: 1, borderColor: 'rgba(201,168,76,0.14)', borderBottomLeftRadius: 4 },
  bubbleTxt: { color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 19 },
  myBubbleTxt: { color: colors.primary },
  bubbleTime: { color: '#8A9BB0', fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  myBubbleTime: { color: 'rgba(10,25,49,0.65)' },
  systemBubble: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(201,168,76,0.12)', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6, marginBottom: 14 },
  systemTxt: { color: '#D8E0EA', fontFamily: 'Inter_500Medium', fontSize: 11 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: 'rgba(201,168,76,0.16)' },
  input: { flex: 1, maxHeight: 110, minHeight: 44, borderRadius: 12, backgroundColor: '#fff', color: colors.primary, fontFamily: 'Inter_400Regular', fontSize: 14, paddingHorizontal: 14, paddingVertical: 11 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  lockedTitle: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 14, marginBottom: 8 },
  lockedTxt: { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
