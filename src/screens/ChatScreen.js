import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import EnquiryStore from '../store/EnquiryStore';

const DIVIDER = 'rgba(201,168,76,0.12)';

export default function ChatScreen({ route, navigation }) {
  const { enquiry } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const listRef = useRef(null);

  // Load + subscribe
  useEffect(() => {
    setMessages(EnquiryStore.getMessages(enquiry.id));
    const unsub = EnquiryStore.subscribe(() => {
      setMessages([...EnquiryStore.getMessages(enquiry.id)]);
    });
    return unsub;
  }, [enquiry.id]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    EnquiryStore.sendMessage(enquiry.id, text);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }) => {
    const isMe = item.from === 'me';
    return (
      <View style={[s.msgRow, isMe ? s.msgRowMe : s.msgRowThem]}>
        {!isMe && (
          <View style={[s.msgAvatar, { backgroundColor: enquiry.from.color }]}>
            <Text style={s.msgAvatarTxt}>{enquiry.from.initials}</Text>
          </View>
        )}
        <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
          <Text style={[s.bubbleTxt, isMe ? s.bubbleTxtMe : s.bubbleTxtThem]}>{item.text}</Text>
          <Text style={[s.msgTime, isMe ? s.msgTimeMe : s.msgTimeThem]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={[s.headerAvatar, { backgroundColor: enquiry.from.color }]}>
          <Text style={s.headerAvatarTxt}>{enquiry.from.initials}</Text>
        </View>
        <View style={s.headerMeta}>
          <Text style={s.headerName}>{enquiry.from.name}</Text>
          <Text style={s.headerBiz}>{enquiry.from.business}</Text>
        </View>
        <TouchableOpacity style={s.headerAction}>
          <Ionicons name="call-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={s.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color="#8A9BB0" />
        </TouchableOpacity>
      </View>

      {/* Secure notice */}
      <View style={s.secureBar}>
        <Ionicons name="lock-closed" size={11} color={colors.accent} />
        <Text style={s.secureTxt}>Messages are end-to-end secured within Biznex</Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderMessage}
          contentContainerStyle={s.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="chatbubbles-outline" size={40} color="#4A6080" style={{ marginBottom: 10 }} />
              <Text style={s.emptyTxt}>Say hello to {enquiry.from.name.split(' ')[0]}!</Text>
            </View>
          }
        />

        {/* Input */}
        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder="Type a message..."
            placeholderTextColor="#4A6080"
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <TouchableOpacity
            style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
            onPress={send}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color={input.trim() ? colors.primary : '#4A6080'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.primary },

  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: DIVIDER, gap: 8 },
  backBtn:         { padding: 4 },
  headerAvatar:    { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  headerAvatarTxt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 13 },
  headerMeta:      { flex: 1 },
  headerName:      { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  headerBiz:       { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 11 },
  headerAction:    { padding: 6 },

  secureBar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6, backgroundColor: 'rgba(201,168,76,0.07)', borderBottomWidth: 1, borderBottomColor: DIVIDER },
  secureTxt:       { color: colors.accent, fontFamily: 'Inter_400Regular', fontSize: 11 },

  messageList:     { padding: 16, gap: 12, flexGrow: 1 },

  msgRow:          { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowMe:        { justifyContent: 'flex-end' },
  msgRowThem:      { justifyContent: 'flex-start' },

  msgAvatar:       { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  msgAvatarTxt:    { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 10 },

  bubble:          { maxWidth: '72%', borderRadius: 16, padding: 10 },
  bubbleMe:        { backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  bubbleThem:      { backgroundColor: '#0F2340', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: DIVIDER },
  bubbleTxt:       { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  bubbleTxtMe:     { color: colors.primary },
  bubbleTxtThem:   { color: '#fff' },
  msgTime:         { fontSize: 10, marginTop: 4 },
  msgTimeMe:       { color: 'rgba(10,25,49,0.6)', textAlign: 'right' },
  msgTimeThem:     { color: '#4A6080' },

  empty:           { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTxt:        { color: '#4A6080', fontFamily: 'Inter_400Regular', fontSize: 14 },

  inputBar:        { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: DIVIDER, gap: 10 },
  input:           { flex: 1, backgroundColor: '#0F2340', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: DIVIDER },
  sendBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#0F2340', borderWidth: 1, borderColor: DIVIDER },
});
