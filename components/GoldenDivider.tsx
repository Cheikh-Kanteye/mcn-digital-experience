import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface GoldenDividerProps {
  width?: number;
  color?: string;
}

export function GoldenDivider({ width = 100, color = '#d4844a' }: GoldenDividerProps) {
  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height="20" viewBox="0 0 100 20">
        <Path
          d="M 0 10 L 30 10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <Circle cx="50" cy="10" r="3" fill={color} />
        <Path
          d="M 70 10 L 100 10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
