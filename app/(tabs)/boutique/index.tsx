import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { supabase } from '@/lib/supabase';
import CartButton from '@/components/CartButton';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

export default function BoutiqueScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'XOF'>('EUR');
  const setCartCurrency = useCartStore((s) => s.setCurrency);
  const addToCart = useCartStore((s) => s.add);
  const router = useRouter();

  const RATES = {
    EUR: 1,
    USD: 1.08,
    XOF: 655.957,
  } as const;

  function formatPrice(priceEur: number, cur: typeof currency) {
    if (cur === 'EUR') return `€${priceEur.toFixed(2)}`;
    if (cur === 'USD') return `$${(priceEur * RATES.USD).toFixed(2)}`;
    return `${Math.round(priceEur * RATES.XOF)} XOF`;
  }

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true }),
          supabase
            .from('categories')
            .select('*')
            .order('id', { ascending: true }),
        ]);

        if (prodRes.error) {
          console.warn(
            'Supabase error loading products:',
            prodRes.error.message
          );
          if (mounted) setProducts([]);
        } else {
          if (mounted) setProducts(prodRes.data ?? []);
        }

        if (catRes.error) {
          console.warn(
            'Supabase error loading categories:',
            catRes.error.message
          );
          if (mounted) setCategories([]);
        } else {
          if (mounted) setCategories(catRes.data ?? []);
        }
      } catch (err: any) {
        console.warn('Error loading shop data:', err?.message || err);
        if (mounted) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoText}>MCN</Text>
            <Text style={styles.museumText}>Boutique partenaires</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.currencySelector}>
              {(['EUR', 'USD', 'XOF'] as const).map((cur) => (
                <TouchableOpacity
                  key={cur}
                  onPress={() => {
                    setCurrency(cur);
                    setCartCurrency(cur);
                  }}
                  style={[
                    styles.currencyButton,
                    currency === cur && styles.currencyButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.currencyText,
                      currency === cur && styles.currencyTextActive,
                    ]}
                  >
                    {cur}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroGradient}>
            <Ionicons
              name="storefront"
              size={40}
              color={theme.colors.accent.primary}
            />
          </View>
          <Text style={styles.heroTitle}>Sélection partenaires</Text>
          <Text style={styles.heroSubtitle}>
            Livres, éditions et créations d'artistes proposés par nos
            partenaires
          </Text>
        </View>

        {/* Categories Horizontal Scroll */}
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === null && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Ionicons
              name="grid"
              size={18}
              color={
                selectedCategory === null
                  ? theme.colors.background.dark
                  : theme.colors.accent.primary
              }
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === null && styles.categoryChipTextActive,
              ]}
            >
              Tout
            </Text>
          </TouchableOpacity>

          {categories.map((category) => {
            const active = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(active ? null : category.id)}
              >
                <Ionicons
                  name="images"
                  size={18}
                  color={
                    active
                      ? theme.colors.background.dark
                      : theme.colors.accent.primary
                  }
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? 'Résultats' : 'Produits partenaires'}
            </Text>
            <Text style={styles.productsCount}>
              {filteredProducts.length} produit
              {filteredProducts.length > 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons
              name="filter"
              size={20}
              color={theme.colors.accent.primary}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.accent.primary}
            />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cube-outline"
              size={64}
              color={theme.colors.text.tertiary}
            />
            <Text style={styles.emptyText}>
              Aucun produit partenaire disponible
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => {
              const cat = categories.find((c) => c.id === product.category_id);
              return (
                <TouchableOpacity
                  key={String(product.id)}
                  style={styles.productCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/boutique/${product.id}`)}
                >
                  <View style={styles.productImageContainer}>
                    {product.image_url ? (
                      <Image
                        source={{ uri: product.image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Ionicons
                          name="image-outline"
                          size={40}
                          color={theme.colors.text.tertiary}
                        />
                      </View>
                    )}
                    {cat && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{cat.name}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    {product.origin && (
                      <Text style={styles.productOrigin} numberOfLines={1}>
                        {product.origin}
                      </Text>
                    )}
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>
                        {formatPrice(
                          Number(product.price_eur ?? product.price ?? 0),
                          currency
                        )}
                      </Text>
                      <TouchableOpacity
                        style={styles.addToCartButton}
                        activeOpacity={0.7}
                        onPress={() =>
                          addToCart(
                            {
                              id: product.id,
                              name: product.name,
                              price_eur: Number(
                                product.price_eur ?? product.price ?? 0
                              ),
                              image_url: product.image_url,
                            },
                            1
                          )
                        }
                      >
                        <Ionicons
                          name="add"
                          size={20}
                          color={theme.colors.background.dark}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Special Offer Banner */}
        <View style={styles.offerBanner}>
          <View style={styles.offerContent}>
            <View style={styles.offerIconContainer}>
              <Ionicons
                name="gift"
                size={28}
                color={theme.colors.accent.primary}
              />
            </View>
            <View style={styles.offerTextContainer}>
              <Text style={styles.offerTitle}>Offre de Bienvenue</Text>
              <Text style={styles.offerSubtitle}>
                -20% sur votre première commande
              </Text>
            </View>
            <TouchableOpacity style={styles.offerButton} activeOpacity={0.8}>
              <Text style={styles.offerButtonText}>J'en profite</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.accent.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Cart Button (Boutique only) */}
      <View
        style={{ position: 'absolute', right: 20, bottom: 40, zIndex: 50 }}
        pointerEvents="box-none"
      >
        <CartButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 100,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 10,
    paddingBottom: theme.spacing.md,
  } as ViewStyle,
  headerLeft: {
    flex: 1,
  } as ViewStyle,
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  logoText: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: '800',
    color: theme.colors.accent.primary,
    letterSpacing: 2,
  } as TextStyle,
  museumText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  } as ViewStyle,
  heroSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background.secondary,
  } as ViewStyle,
  heroGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.special.featured,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  heroTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  } as TextStyle,
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  categoriesScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  } as ViewStyle,
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 999,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    marginRight: theme.spacing.sm,
  } as ViewStyle,
  categoryChipActive: {
    backgroundColor: theme.colors.accent.primary,
    borderColor: theme.colors.accent.primary,
  } as ViewStyle,
  categoryChipText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  } as TextStyle,
  categoryChipTextActive: {
    color: theme.colors.background.dark,
  } as TextStyle,
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  productsCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  } as TextStyle,
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  } as ViewStyle,
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
  } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  } as ViewStyle,
  emptyText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.tertiary,
  } as TextStyle,
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  } as ViewStyle,
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  } as ViewStyle,
  productImageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: theme.colors.background.tertiary,
    position: 'relative',
  } as ViewStyle,
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  categoryBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.background.dark,
    textTransform: 'uppercase',
  } as TextStyle,
  productInfo: {
    padding: theme.spacing.md,
  } as ViewStyle,
  productName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  } as TextStyle,
  productOrigin: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  } as ViewStyle,
  productPrice: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.accent.primary,
  } as TextStyle,
  addToCartButton: {
    backgroundColor: theme.colors.accent.primary,
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  } as ViewStyle,
  offerBanner: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1.5,
    borderColor: theme.colors.accent.primary,
    overflow: 'hidden',
  } as ViewStyle,
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  } as ViewStyle,
  offerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.special.featured,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  } as ViewStyle,
  offerTextContainer: {
    flex: 1,
  } as ViewStyle,
  offerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  } as TextStyle,
  offerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  } as TextStyle,
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  } as ViewStyle,
  offerButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: theme.colors.background.dark,
  } as TextStyle,
  floatingCart: {
    position: 'absolute',
    bottom: 90,
    right: theme.spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
  } as ViewStyle,
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.status.error,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: theme.colors.background.dark,
  } as ViewStyle,
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text.primary,
  } as TextStyle,
  bottomSpacer: {
    height: 40,
  } as ViewStyle,
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: 2,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  } as ViewStyle,
  currencyButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  currencyButtonActive: {
    backgroundColor: theme.colors.accent.primary,
  } as ViewStyle,
  currencyText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  } as TextStyle,
  currencyTextActive: {
    color: theme.colors.background.dark,
    fontWeight: '700',
  } as TextStyle,
});
