import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cartStore';

export default function CartButton({ style }: { style?: any }) {
  const toggle = useCartStore((s) => s.toggle);
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.qty, 0));

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => toggle(true)}
    >
      <Ionicons name="cart" size={24} color={theme.colors.background.dark} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: theme.colors.status.error,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: theme.colors.background.dark,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontWeight: '700',
    fontSize: 11,
  },
});
