import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Grow Your Business Network',
    description: 'Connect with serious business owners across India',
    icon: <Ionicons name="hand-left-outline" color={colors.accent} size={80} />,
  },
  {
    id: '2',
    title: 'Pass & Receive Referrals',
    description: 'Track every rupee of business you give and receive',
    icon: <Ionicons name="swap-horizontal" color={colors.accent} size={80} />,
  },
  {
    id: '3',
    title: 'Find the Right Connections',
    description: 'Search by location, industry, or product',
    icon: <Ionicons name="people-outline" color={colors.accent} size={80} />,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
         {currentIndex < slides.length - 1 && <Text style={styles.skipText}>Skip</Text>}
        </TouchableOpacity>
      </View>

      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex === slides.length - 1 ? (
            <PrimaryButton title="Get Started" onPress={handleNext} />
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
    height: 60,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    ...typography.body,
    color: colors.surface,
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    flex: 1,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    ...typography.h2,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    color: colors.surface,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    height: 120,
    justifyContent: 'space-between',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryText,
    marginHorizontal: 5,
  },
  indicatorActive: {
    backgroundColor: colors.accent,
    width: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextText: {
    ...typography.body,
    color: colors.accent,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default OnboardingScreen;
