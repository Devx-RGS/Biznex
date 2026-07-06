import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const { width } = Dimensions.get('window');

export default function CustomAlertModal({ visible, title, message, buttons = [], onClose }) {
  const defaultButtons = buttons.length > 0 ? buttons : [{ text: 'OK', onPress: onClose }];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.card}>
          {!!title && <Text style={s.title}>{title}</Text>}
          {!!message && (
            <ScrollView style={s.msgScroll} contentContainerStyle={s.msgContainer} bounces={false}>
              <Text style={s.message}>{message}</Text>
            </ScrollView>
          )}
          <View style={s.btnContainer}>
            {defaultButtons.map((btn, index) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              
              let btnStyle = s.btnDefault;
              let txtStyle = s.txtDefault;
              
              if (isDestructive) {
                btnStyle = s.btnDestructive;
                txtStyle = s.txtDestructive;
              } else if (isCancel) {
                btnStyle = s.btnCancel;
                txtStyle = s.txtCancel;
              }

              const handlePress = () => {
                onClose();
                if (btn.onPress) {
                  btn.onPress();
                }
              };

              return (
                <TouchableOpacity
                  key={index}
                  style={[s.btn, btnStyle]}
                  onPress={handlePress}
                  activeOpacity={0.8}
                >
                  <Text style={[s.btnText, txtStyle]}>{btn.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 49, 0.7)', // Deep navy transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  msgScroll: {
    maxHeight: 150,
    marginBottom: 20,
  },
  msgContainer: {
    paddingVertical: 4,
  },
  message: {
    ...typography.bodySmall,
    color: '#4B5563',
    lineHeight: 20,
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
    gap: 10,
  },
  btn: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  btnDefault: {
    backgroundColor: colors.accent,
  },
  txtDefault: {
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  btnDestructive: {
    backgroundColor: colors.error,
  },
  txtDestructive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  btnCancel: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  txtCancel: {
    color: colors.primary,
  },
});
