import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const OTPInput = ({ length = 6, value, onChange }) => {
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleChange = (text, index) => {
    const newValue = value.split('');
    newValue[index] = text;
    onChange(newValue.join(''));

    if (text !== '' && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !value[index]) {
      inputs.current[index - 1].focus();
      const newValue = value.split('');
      newValue[index - 1] = '';
      onChange(newValue.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => inputs.current[index] = ref}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            value[index] && styles.inputFilled
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 55,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  inputFilled: {
    borderColor: colors.accent,
  },
});

export default OTPInput;
