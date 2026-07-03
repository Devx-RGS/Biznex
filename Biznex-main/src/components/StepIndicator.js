import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const StepIndicator = ({ currentStep, totalSteps = 3 }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.barContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              { width: `${100 / totalSteps}%` },
              index < currentStep ? styles.barActive : styles.barInactive,
              index === 0 && styles.firstBar,
              index === totalSteps - 1 && styles.lastBar
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    marginBottom: 20,
  },
  text: {
    ...typography.bodySmall,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  barActive: {
    backgroundColor: colors.accent,
  },
  barInactive: {
    backgroundColor: colors.border,
  },
  firstBar: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  lastBar: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default StepIndicator;
