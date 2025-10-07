import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cartStore';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const currency = useCartStore((s) => s.currency);
  const addToCart = useCartStore((s) => s.add);
  const toggle = useCartStore((s) => s.toggle);

  const RATES = { EUR: 1, USD: 1.08, XOF: 655.957 } as const;
  function formatPrice(priceEur: number) {
    if (currency === 'EUR') return `€${priceEur.toFixed(2)}`;
    if (currency === 'USD') return `$${(priceEur * RATES.USD).toFixed(2)}`;
    return `${Math.round(priceEur * RATES.XOF)} XOF`;
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', Number(id))
          .maybeSingle();
        if (error) throw error;
        if (mounted) setProduct(data ?? null);
      } catch (err: any) {
        console.error('Error loading product', err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text.tertiary }}>
          Produit introuvable
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.image,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          />
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{product.name}</Text>
          {product.origin && (
            <Text style={styles.origin}>{product.origin}</Text>
          )}
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          <View style={styles.buyRow}>
            <Text style={styles.price}>
              {formatPrice(Number(product.price_eur ?? 0))}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    price_eur: Number(product.price_eur ?? 0),
                    image_url: product.image_url,
                  },
                  1
                );
                // open cart modal to show feedback
                toggle(true);
              }}
            >
              <Text style={styles.addText}>Ajouter au panier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.dark },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.dark,
  },
  content: { paddingBottom: 40 },
  image: { width: '100%', height: 360 },
  info: { padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  origin: { color: theme.colors.text.tertiary, marginBottom: 12 },
  description: {
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  buyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.accent.primary,
  },
  addButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addText: { color: theme.colors.background.dark, fontWeight: '700' },
});
