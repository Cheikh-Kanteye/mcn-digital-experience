import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, ArrowRight, Search } from 'lucide-react-native';
import { DataService } from '@/lib/dataService';
import { theme, getThemeColor } from '@/lib/theme';

const { width } = Dimensions.get('window');

interface Collection {
  id: string;
  name_fr: string;
  description_fr: string;
  theme?: string;
  icon?: string;
  is_featured?: boolean;
  image_url?: string;
}

interface FeaturedCollection extends Collection {
  artworks_count: number;
}

export default function CollectionsScreen() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredCollection, setFeaturedCollection] =
    useState<FeaturedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const categories = [
    'Toutes',
    'Sculptures',
    'Textil',
    'Céramiques',
    'Masques',
  ];

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await DataService.getAllCollections();
      setCollections(data);

      // Charger la collection vedette (première ou celle marquée featured)
      const featured = data.find((c: Collection) => c.is_featured) || data[0];
      if (featured) {
        // Compter les œuvres de cette collection
        const artworks = await DataService.getArtworksByCollectionId(
          featured.id
        );
        setFeaturedCollection({
          ...featured,
          artworks_count: artworks.length,
        });
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = (theme?: string): string => {
    if (!theme) return '#d4a574';
    switch (theme.toLowerCase()) {
      case 'histoire':
        return '#d4a574';
      case 'art':
        return '#c9914d';
      case 'culture':
        return '#b8905f';
      case 'musique':
        return '#a67c52';
      default:
        return '#d4a574';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collections</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtres catégories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Carte collection vedette */}
        {featuredCollection && (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => router.push(`/collection/${featuredCollection.id}`)}
            activeOpacity={0.9}
          >
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredBadge}>COLLECTION VEDETTE</Text>
              <Crown size={20} color="#d4a574" strokeWidth={2} fill="#d4a574" />
            </View>

            <Text style={styles.featuredTitle}>
              {featuredCollection.name_fr}
            </Text>
            <Text style={styles.featuredDescription}>
              {featuredCollection.description_fr ||
                'Découvrez les symboles du pouvoir et les regalia des grands royaumes africains'}
            </Text>

            <View style={styles.featuredFooter}>
              <Text style={styles.artworkCount}>
                {featuredCollection.artworks_count} œuvres
              </Text>
              <View style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explorer</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Titre section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Toutes les collections</Text>
          <Text style={styles.sectionSubtitle}>
            {collections.length} collections disponibles
          </Text>
        </View>

        {/* Grille de collections */}
        <View style={styles.collectionsGrid}>
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              style={styles.collectionCard}
              onPress={() => router.push(`/collection/${collection.id}`)}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.collectionIconContainer,
                  { backgroundColor: getThemeColor(collection.theme) },
                ]}
              >
                <Text style={styles.collectionIcon}>
                  {collection.icon || '🎭'}
                </Text>
              </View>

              <View style={styles.collectionContent}>
                <Text style={styles.collectionName} numberOfLines={2}>
                  {collection.name_fr}
                </Text>

                {collection.theme && (
                  <View style={styles.collectionThemeContainer}>
                    <View
                      style={[
                        styles.themeDot,
                        { backgroundColor: getThemeColor(collection.theme) },
                      ]}
                    />
                    <Text style={styles.collectionTheme}>
                      {collection.theme}
                    </Text>
                  </View>
                )}

                <View style={styles.collectionFooter}>
                  <Text style={styles.collectionDescription} numberOfLines={2}>
                    {collection.description_fr}
                  </Text>
                  <ArrowRight size={16} color="#d4a574" strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🎨</Text>
            <Text style={styles.infoTitle}>Visite guidée</Text>
            <Text style={styles.infoText}>
              Suivez un parcours thématique à travers les collections. Chaque
              œuvre raconte une histoire unique du patrimoine africain.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: theme.colors.background.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },

  // Categories
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.background.secondary,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  categoryTextActive: {
    color: theme.colors.background.primary,
  },

  // Featured Card
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: theme.colors.special.featured,
    borderRadius: 16,
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accent.primary,
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: theme.colors.special.whiteAlpha,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artworkCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent.primary,
  },
  exploreButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.background.primary,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },

  // Collections Grid
  collectionsGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  collectionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  collectionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionIcon: {
    fontSize: 32,
  },
  collectionContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  collectionThemeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  themeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  collectionTheme: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  collectionFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  collectionDescription: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
  },
});
