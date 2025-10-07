import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { useCartStore } from '@/lib/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';

const { height } = Dimensions.get('window');

export default function CartModal() {
  const open = useCartStore((s) => s.open);
  const toggle = useCartStore((s) => s.toggle);
  const items = useCartStore((s) => s.items);
  const currency = useCartStore((s) => s.currency);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const anim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(open);

  // mount when opening, unmount after animation when closing
  useEffect(() => {
    if (open) setMounted(true);
    else {
      const id = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const total = items.reduce((s, it) => s + (it.price_eur || 0) * it.qty, 0);

  const RATES = {
    EUR: 1,
    USD: 1.08,
    XOF: 655.957,
  } as const;

  function formatPriceEUR(priceEur: number) {
    if (currency === 'EUR') return `€${priceEur.toFixed(2)}`;
    if (currency === 'USD') return `$${(priceEur * RATES.USD).toFixed(2)}`;
    return `${Math.round(priceEur * RATES.XOF)} XOF`;
  }

  if (!mounted && !open) return null;

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Panier</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => clear()} style={styles.iconBtn}>
            <Ionicons
              name="trash"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggle(false)}
            style={styles.iconBtn}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, { backgroundColor: '#222' }]} />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {formatPriceEUR(item.price_eur * item.qty)}
              </Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => updateQty(item.id, item.qty - 1)}
                style={styles.qtyBtn}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
              <Text style={styles.qty}>{item.qty}</Text>
              <TouchableOpacity
                onPress={() => updateQty(item.id, item.qty + 1)}
                style={styles.qtyBtn}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => remove(item.id)}
              style={styles.removeBtn}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text.tertiary }}>
              Votre panier est vide
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: {formatPriceEUR(total)}</Text>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(10,10,10,0.95)',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  name: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  price: {
    color: theme.colors.accent.primary,
    marginTop: 6,
    fontWeight: '700',
  },
  qtyContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  qtyBtn: {
    padding: 6,
  },
  qty: {
    color: theme.colors.text.primary,
    marginVertical: 4,
  },
  removeBtn: {
    marginLeft: 10,
    padding: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: theme.colors.background.secondary,
  },
  total: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  checkoutBtn: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkoutText: {
    color: theme.colors.background.dark,
    fontWeight: '700',
  },
});
