import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography, colors, fonts } from '../constants/design';

interface StyledTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: string;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold' | 'black' | 'light';
  italic?: boolean;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  fontFamily?: string;
}

export const StyledText: React.FC<StyledTextProps> = ({
  variant = 'body',
  color,
  weight,
  italic,
  align,
  style,
  children,
  numberOfLines,
  fontFamily,
  ...props
}) => {
  const baseStyle = typography[variant];
  
  // Determine the correct font family based on the variant and weight
  let fontFamilyStyle;
  if (fontFamily) {
    fontFamilyStyle = { fontFamily };
  } else if (['h1', 'h2', 'h3'].includes(variant)) {
    // For headings, use the Rethink Sans font
    if (weight === 'bold' || variant === 'h1' || variant === 'h2') {
      fontFamilyStyle = { fontFamily: fonts.headingBold };
    } else if (weight === 'semiBold' || variant === 'h3') {
      fontFamilyStyle = { fontFamily: fonts.headingSemiBold };
    } else if (weight === 'medium') {
      fontFamilyStyle = { fontFamily: fonts.headingMedium };
    } else {
      fontFamilyStyle = { fontFamily: fonts.headingRegular };
    }
  } else {
    // For non-headings, use the corresponding Geist Sans font
    if (weight === 'bold') {
      fontFamilyStyle = { fontFamily: fonts.bold };
    } else if (weight === 'semiBold') {
      fontFamilyStyle = { fontFamily: fonts.semiBold };
    } else if (weight === 'medium') {
      fontFamilyStyle = { fontFamily: fonts.medium };
    } else if (weight === 'light') {
      fontFamilyStyle = { fontFamily: fonts.light };
    } else if (weight === 'black') {
      fontFamilyStyle = { fontFamily: fonts.black };
    } else {
      fontFamilyStyle = { fontFamily: fonts.regular };
    }
  }
  
  // Create a style array to combine all styles
  const styleArray = [
    baseStyle,
    fontFamilyStyle, // Apply the font family (will override baseStyle if set)
    color && { color },
    weight && styles[weight],
    italic && styles.italic,
    align && { textAlign: align },
    style, // Custom styles passed as props
  ].filter(Boolean); // Filter out undefined values
  
  return (
    <Text style={styleArray} numberOfLines={numberOfLines} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  black: {
    fontWeight: '900',
  },
  light: {
    fontWeight: '300',
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default StyledText; 