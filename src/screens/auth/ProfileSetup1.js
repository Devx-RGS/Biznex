import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';

const CATEGORIES = ['New Innovations', 'Food & Manufacturing', 'Services', 'IT & Technology', 'Others'];
const MUMBAI_CHAPTERS = ['Kandivali', 'Borivali', 'Andheri', 'Thane', 'Dadar'];

const ProfileSetup1 = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    designation: '',
    category: '',
    city: '',
    chapter: ''
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);

  const isMumbai = form.city.toLowerCase().trim() === 'mumbai';
  const hasCity  = form.city.trim() !== '';

  useEffect(() => {
    if (form.city.toLowerCase().trim() === 'mumbai') {
      // Reset chapter so user picks from dropdown
      setForm(prev => ({ ...prev, chapter: '' }));
    } else if (form.city.trim() !== '') {
      // Auto-select: whole city is one chapter
      setForm(prev => ({ ...prev, chapter: form.city.trim() }));
    } else {
      setForm(prev => ({ ...prev, chapter: '' }));
    }
  }, [form.city]);

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleNext = () => {
    navigation.navigate('ProfileSetup2', { setupData: form });
  };

  const isFormValid = form.fullName && form.businessName && form.designation && form.category && form.city && form.chapter;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <StepIndicator currentStep={1} totalSteps={3} />
            <Text style={styles.title}>Tell us about your business</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={form.fullName} onChangeText={(v) => updateForm('fullName', v)} placeholder="John Doe" placeholderTextColor={colors.placeholder} />

              <Text style={styles.label}>Business Name</Text>
              <TextInput style={styles.input} value={form.businessName} onChangeText={(v) => updateForm('businessName', v)} placeholder="Acme Corp" placeholderTextColor={colors.placeholder} />

              <Text style={styles.label}>Designation</Text>
              <TextInput style={styles.input} value={form.designation} onChangeText={(v) => updateForm('designation', v)} placeholder="Founder / CEO" placeholderTextColor={colors.placeholder} />

              <Text style={styles.label}>Business Category</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setShowCategoryModal(true)}>
                <Text style={[styles.pickerText, !form.category && {color: colors.placeholder}]}>
                  {form.category || 'Select a category'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={form.city} onChangeText={(v) => updateForm('city', v)} placeholder="Enter city name" placeholderTextColor={colors.placeholder} />

              <Text style={styles.label}>Chapter</Text>
              {!hasCity ? (
                // No city entered yet — disabled
                <View style={[styles.pickerButton, styles.pickerDisabled]}>
                  <Text style={[styles.pickerText, { color: colors.placeholder }]}>Enter city first</Text>
                </View>
              ) : isMumbai ? (
                // Mumbai — show chapter dropdown
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowChapterModal(true)}>
                  <Text style={[styles.pickerText, !form.chapter && { color: colors.placeholder }]}>
                    {form.chapter || 'Select a chapter'}
                  </Text>
                </TouchableOpacity>
              ) : (
                // Any other city — chapter = city name (auto-filled, read-only)
                <View style={[styles.pickerButton, styles.pickerAutoFilled]}>
                  <Text style={styles.pickerText}>{form.chapter}</Text>
                  <Text style={styles.autoFilledBadge}>Auto</Text>
                </View>
              )}
            </View>

            <View style={styles.spacer} />
            <PrimaryButton title="Next" onPress={handleNext} disabled={!isFormValid} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Selectors */}
      <Modal visible={!!showCategoryModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} style={styles.modalOption} onPress={() => { updateForm('category', cat); setShowCategoryModal(false); }}>
                <Text style={styles.modalOptionText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showChapterModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Select Chapter</Text>
            {MUMBAI_CHAPTERS.map((chap) => (
              <TouchableOpacity key={chap} style={styles.modalOption} onPress={() => { updateForm('chapter', chap); setShowChapterModal(false); }}>
                <Text style={styles.modalOptionText}>{chap}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowChapterModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1 },
  title: { ...typography.h2, color: colors.surface, marginBottom: 24, textAlign: 'center' },
  formGroup: { marginBottom: 20 },
  label: { ...typography.bodySmall, color: colors.secondaryText, marginBottom: 8 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    ...typography.body,
    color: colors.primary,
    marginBottom: 16,
  },
  pickerButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    marginBottom: 16,
  },
  pickerText: { ...typography.body, color: colors.primary },
  pickerDisabled: {
    backgroundColor: 'rgba(10, 25, 49, 0.15)',
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.6,
  },
  pickerAutoFilled: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.35)',
    backgroundColor: 'rgba(201, 168, 76, 0.07)',
  },
  autoFilledBadge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: colors.accent,
    backgroundColor: 'rgba(201, 168, 76, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  spacer: { flex: 1 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBody: { backgroundColor: colors.surface, padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { ...typography.h3, marginBottom: 16, textAlign: 'center' },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { ...typography.body, textAlign: 'center' },
  modalCancel: { paddingVertical: 16, marginTop: 10 },
  modalCancelText: { ...typography.body, textAlign: 'center', color: colors.error, fontFamily: 'Inter_600SemiBold' },
});

export default ProfileSetup1;
