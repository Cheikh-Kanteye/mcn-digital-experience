import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface AfricanPatternProps {
  variant?: 'mudcloth' | 'kente' | 'geometric';
  opacity?: number;
}

export function AfricanPattern({ variant = 'mudcloth', opacity = 0.1 }: AfricanPatternProps) {
  if (variant === 'mudcloth') {
    return (
      <View style={[styles.container, { opacity }]}>
        <Svg width="100%" height="100%" viewBox="0 0 200 200">
          <Path d="M 20 20 L 40 20 L 40 40 L 20 40 Z" fill="#d4844a" />
          <Path d="M 60 20 L 80 20 L 80 40 L 60 40 Z" fill="#d4844a" />
          <Path d="M 100 20 L 120 20 L 120 40 L 100 40 Z" fill="#d4844a" />
          <Path d="M 140 20 L 160 20 L 160 40 L 140 40 Z" fill="#d4844a" />
          <Path d="M 180 20 L 200 20 L 200 40 L 180 40 Z" fill="#d4844a" />

          <Path d="M 20 60 L 40 60 L 40 80 L 20 80 Z" fill="#8b7355" />
          <Path d="M 60 60 L 80 60 L 80 80 L 60 80 Z" fill="#8b7355" />
          <Path d="M 100 60 L 120 60 L 120 80 L 100 80 Z" fill="#8b7355" />
          <Path d="M 140 60 L 160 60 L 160 80 L 140 80 Z" fill="#8b7355" />
          <Path d="M 180 60 L 200 60 L 200 80 L 180 80 Z" fill="#8b7355" />

          <Circle cx="30" cy="110" r="8" fill="#d4844a" />
          <Circle cx="70" cy="110" r="8" fill="#d4844a" />
          <Circle cx="110" cy="110" r="8" fill="#d4844a" />
          <Circle cx="150" cy="110" r="8" fill="#d4844a" />
          <Circle cx="190" cy="110" r="8" fill="#d4844a" />

          <Path d="M 10 140 L 30 160 L 10 180" stroke="#8b7355" strokeWidth="3" fill="none" />
          <Path d="M 50 140 L 70 160 L 50 180" stroke="#8b7355" strokeWidth="3" fill="none" />
          <Path d="M 90 140 L 110 160 L 90 180" stroke="#8b7355" strokeWidth="3" fill="none" />
          <Path d="M 130 140 L 150 160 L 130 180" stroke="#8b7355" strokeWidth="3" fill="none" />
          <Path d="M 170 140 L 190 160 L 170 180" stroke="#8b7355" strokeWidth="3" fill="none" />
        </Svg>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
