import { View, Text, StyleSheet } from 'react-native';

export default function BoutiqueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boutique</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#c9b8a8',
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 16,
    color: '#8a7d70',
    marginTop: 8,
  },
});
