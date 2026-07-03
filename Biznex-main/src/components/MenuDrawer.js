import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import EnquiryStore from '../store/EnquiryStore';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.72;
const DIVIDER = 'rgba(201,168,76,0.15)';

const MENU_ITEMS = [
  { icon: 'person-outline',          label: 'My Profile',     screen: null         },
  { icon: 'notifications-outline',   label: 'Updates',        screen: null         },
  { icon: 'calendar-outline',        label: 'Events',         screen: null         },
  { icon: 'chatbubbles-outline',     label: 'Enquiries',      screen: 'Enquiries', badge: true },
  { icon: 'git-compare-outline',     label: 'Referrals',      screen: null         },
  { divider: true },
  { icon: 'help-circle-outline',     label: 'FAQ',            screen: 'FAQ'        },
  { icon: 'headset-outline',         label: 'Help & Support', screen: null         },
  { icon: 'star-outline',            label: 'Rate the App',   screen: null         },
  { divider: true },
  { icon: 'log-out-outline',         label: 'Logout',         screen: null, danger: true },
];

export default function MenuDrawer({ visible, onClose, navigation }) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const [pendingCount, setPendingCount] = useState(EnquiryStore.getPending().length);

  useEffect(() => {
    const unsub = EnquiryStore.subscribe(() => setPendingCount(EnquiryStore.getPending().length));
    return unsub;
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleNav = (screen) => {
    onClose();
    if (screen) {
      setTimeout(() => navigation.navigate(screen), 250);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[s.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View style={[s.drawer, { transform: [{ translateX: slideAnim }] }]}>
        {/* Drawer header */}
        <View style={s.drawerHeader}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>YO</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName}>Your Name</Text>
            <Text style={s.userRole}>BizNex Member</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Ionicons name="close" size={22} color="#8A9BB0" />
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* Menu items */}
        <View style={s.menuList}>
          {MENU_ITEMS.map((item, idx) => {
            if (item.divider) {
              return <View key={`div-${idx}`} style={s.divider} />;
            }
            return (
              <TouchableOpacity
                key={item.label}
                style={s.menuItem}
                activeOpacity={0.7}
                onPress={() => handleNav(item.screen)}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.danger ? '#E53935' : colors.accent}
                  style={{ marginRight: 14 }}
                />
                <Text style={[s.menuLabel, item.danger && { color: '#E53935' }]}>
                  {item.label}
                </Text>
                {item.badge && pendingCount > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeTxt}>{pendingCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={s.drawerFooter}>
          <Text style={s.footerText}>Biznex v1.0.0</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawer: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0D1F3C',
    paddingTop: 52,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarTxt:  { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  userName:   { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 2 },
  userRole:   { color: '#8A9BB0', fontFamily: 'Inter_400Regular', fontSize: 12 },
  closeBtn:   { padding: 4 },

  divider: { height: 1, backgroundColor: DIVIDER, marginVertical: 8 },

  menuList:   { flex: 1, paddingHorizontal: 12, paddingTop: 4 },
  menuItem:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 12, borderRadius: 10 },
  menuLabel:  { color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 15 },

  drawerFooter: { paddingHorizontal: 20, paddingBottom: 32 },
  footerText:   { color: '#4A6080', fontFamily: 'Inter_400Regular', fontSize: 12 },
  badge:        { marginLeft: 'auto', backgroundColor: '#E53935', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  badgeTxt:     { color: '#fff', fontSize: 11, fontFamily: 'Inter_700Bold' },
});
