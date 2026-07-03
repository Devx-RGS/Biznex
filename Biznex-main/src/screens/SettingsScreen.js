import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_SETTINGS, useSettings } from '../context/SettingsContext';

const DIGEST_OPTIONS = ['Instant', 'Daily', 'Weekly'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi'];

const SettingRow = ({ icon, title, subtitle, value, onValueChange, theme, styles }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={19} color={theme.accent} />
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSub}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#A8B3C2', true: theme.accent }}
      thumbColor={value ? '#fff' : '#F2F4F7'}
    />
  </View>
);

const OptionGroup = ({ title, options, value, onChange, styles }) => (
  <View style={styles.optionGroup}>
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={styles.segment}>
      {options.map(option => {
        const active = value === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.segmentTxt, active && styles.segmentTxtActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export default function SettingsScreen({ navigation }) {
  const { settings, theme, savedAt, updateSetting, saveSettings, resetSettings } = useSettings();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const changedCount = useMemo(
    () => Object.keys(DEFAULT_SETTINGS).filter(key => DEFAULT_SETTINGS[key] !== settings[key]).length,
    [settings]
  );

  const save = async () => {
    await saveSettings();
    Alert.alert('Settings saved', 'Your preferences are now active across the app.');
  };

  const reset = () => {
    Alert.alert(
      'Reset settings?',
      'This will restore all settings to the default BizNex preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetSettings,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={reset} style={styles.headerBtn}>
          <Ionicons name="refresh" size={21} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Preferences</Text>
            <Text style={styles.summaryTitle}>{changedCount} changed from default</Text>
            <Text style={styles.summarySub}>Last saved: {savedAt}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name={settings.theme === 'dark' ? 'moon' : 'sunny'} size={24} color={theme.primary} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <OptionGroup
            title="Theme"
            options={['Light', 'Dark']}
            value={settings.theme === 'dark' ? 'Dark' : 'Light'}
            onChange={value => updateSetting('theme', value.toLowerCase())}
            styles={styles}
          />
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow
            icon="chatbubbles-outline"
            title="Enquiry alerts"
            subtitle="Shows an alert when a demo enquiry arrives."
            value={settings.enquiryAlerts}
            onValueChange={value => updateSetting('enquiryAlerts', value)}
            theme={theme}
            styles={styles}
          />
          <View style={styles.innerDivider} />
          <SettingRow
            icon="calendar-outline"
            title="Event reminders"
            subtitle="Controls event reminder status shown in Settings."
            value={settings.eventReminders}
            onValueChange={value => updateSetting('eventReminders', value)}
            theme={theme}
            styles={styles}
          />
          <View style={styles.innerDivider} />
          <SettingRow
            icon="git-compare-outline"
            title="Referral updates"
            subtitle="Controls referral update status shown in Settings."
            value={settings.referralUpdates}
            onValueChange={value => updateSetting('referralUpdates', value)}
            theme={theme}
            styles={styles}
          />
        </View>

        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.card}>
          <SettingRow
            icon="person-circle-outline"
            title="Public profile"
            subtitle="Changes your drawer/profile visibility status."
            value={settings.profileVisible}
            onValueChange={value => updateSetting('profileVisible', value)}
            theme={theme}
            styles={styles}
          />
          <View style={styles.innerDivider} />
          <SettingRow
            icon="lock-closed-outline"
            title="Secure chat lock"
            subtitle="When off, pending enquiries can open chat for demo."
            value={settings.secureChatLock}
            onValueChange={value => updateSetting('secureChatLock', value)}
            theme={theme}
            styles={styles}
          />
          <View style={styles.innerDivider} />
          <SettingRow
            icon="radio-outline"
            title="Online status"
            subtitle="Changes your active/hidden status in the drawer."
            value={settings.onlineStatus}
            onValueChange={value => updateSetting('onlineStatus', value)}
            theme={theme}
            styles={styles}
          />
        </View>

        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.card}>
          <OptionGroup
            title="Notification digest"
            options={DIGEST_OPTIONS}
            value={settings.digest}
            onChange={value => updateSetting('digest', value)}
            styles={styles}
          />
          <View style={styles.innerDivider} />
          <OptionGroup
            title="Language"
            options={LANGUAGE_OPTIONS}
            value={settings.language}
            onChange={value => updateSetting('language', value)}
            styles={styles}
          />
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Current behavior</Text>
          <Text style={styles.statusLine}>Events: {settings.eventReminders ? 'Reminders on' : 'Muted'}</Text>
          <Text style={styles.statusLine}>Referrals: {settings.referralUpdates ? 'Updates on' : 'Muted'}</Text>
          <Text style={styles.statusLine}>Digest: {settings.digest}</Text>
          <Text style={styles.statusLine}>Language: {settings.language}</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Ionicons name="save-outline" size={18} color={theme.primary} />
          <Text style={styles.saveTxt}>Save settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme) {
  const isLight = theme.mode === 'light';

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
    headerBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: theme.text, fontFamily: 'Inter_700Bold', fontSize: 19 },
    content: { padding: 16, paddingBottom: 34 },
    summary: { backgroundColor: theme.accent, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
    summaryLabel: { color: isLight ? 'rgba(255,255,255,0.76)' : 'rgba(10,25,49,0.7)', fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
    summaryTitle: { color: isLight ? '#fff' : theme.primary, fontFamily: 'Inter_700Bold', fontSize: 18 },
    summarySub: { color: isLight ? 'rgba(255,255,255,0.78)' : 'rgba(10,25,49,0.68)', fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
    summaryIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    sectionTitle: { color: theme.accent, fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 9 },
    card: { backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border, marginBottom: 20, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
    rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: isLight ? '#F2F0E6' : 'rgba(201,168,76,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    rowBody: { flex: 1, paddingRight: 10 },
    rowTitle: { color: theme.text, fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 3 },
    rowSub: { color: theme.mutedText, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
    innerDivider: { height: 1, backgroundColor: theme.border, marginLeft: 60 },
    optionGroup: { padding: 14 },
    optionTitle: { color: theme.text, fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 10 },
    segment: { flexDirection: 'row', borderWidth: 1, borderColor: theme.border, borderRadius: 10, overflow: 'hidden' },
    segmentItem: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, backgroundColor: isLight ? '#F6F8FC' : 'rgba(255,255,255,0.04)' },
    segmentItemActive: { backgroundColor: theme.accent },
    segmentTxt: { color: theme.mutedText, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
    segmentTxtActive: { color: isLight ? '#fff' : theme.primary },
    statusCard: { backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border, padding: 14, marginBottom: 16 },
    statusTitle: { color: theme.text, fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 8 },
    statusLine: { color: theme.mutedText, fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 5 },
    saveBtn: { height: 48, borderRadius: 10, backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    saveTxt: { color: isLight ? '#fff' : theme.primary, fontFamily: 'Inter_700Bold', fontSize: 15 },
  });
}
