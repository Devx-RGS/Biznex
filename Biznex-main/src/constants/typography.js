import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: colors.primary,
  },
  h2: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: colors.primary,
  },
  h3: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: colors.primary,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.primary,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.secondaryText,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.primary,
  },
});
