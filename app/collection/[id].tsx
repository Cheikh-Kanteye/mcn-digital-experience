import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Share2, Grid3x3, List } from 'lucide-react-native';
import { DataService } from '@/lib/dataService';
import { getOrCreateUserId } from '@/lib/storage';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  epoch: string;
  origin: string;
  artist: string;
  rarity?: string;
}

interface Collection {
  id: string;
  name_fr: string;
  description_fr: string;
  theme?: string;
  category?: string;
  is_featured?: boolean;
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadData();
    getOrCreateUserId().then(setUserId);
  }, [id]);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId, artworks]);

  const loadData = async () => {
    try {
      if (!id) return;

      const collectionData = await DataService.getCollectionById(id as string);
      setCollection(collectionData);

      const artworksData = await DataService.getArtworksByCollectionId(
        id as string
      );
      setArtworks(artworksData);
    } catch (error) {
      console.error('Error loading collection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favSet = new Set<string>();
      for (const artwork of artworks) {
        const passportEntry = await DataService.getPassportEntry(
          userId,
          artwork.id
        );
        if (passportEntry?.favorite) {
          favSet.add(artwork.id);
        }
      }
      setFavorites(favSet);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (artworkId: string) => {
    if (!userId) return;

    try {
      const isFavorite = favorites.has(artworkId);
      const newFavoriteStatus = !isFavorite;

      const success = await DataService.addOrUpdatePassportEntry({
        user_id: userId,
        artwork_id: artworkId,
        favorite: newFavoriteStatus,
        card_collected: true,
        scanned_at: new Date().toISOString(),
        notes: '',
      });

      if (success) {
        setFavorites((prev) => {
          const newSet = new Set(prev);
          if (newFavoriteStatus) {
            newSet.add(artworkId);
          } else {
            newSet.delete(artworkId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4a574" />
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Collection non trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroOverlay} />

          {/* Header buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={20} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Collection info */}
          <View style={styles.heroContent}>
            {collection.theme && (
              <View style={styles.themeBadge}>
                <Text style={styles.themeText}>
                  {collection.theme.toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.collectionTitle}>{collection.name_fr}</Text>
            <Text style={styles.collectionDescription}>
              {collection.description_fr}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{artworks.length}</Text>
                <Text style={styles.statLabel}>Œuvres</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{favorites.size}</Text>
                <Text style={styles.statLabel}>Favoris</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Toutes les œuvres</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewButton,
                viewMode === 'grid' && styles.viewButtonActive,
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Grid3x3
                size={18}
                color={viewMode === 'grid' ? '#1a1a1a' : '#999'}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewButton,
                viewMode === 'list' && styles.viewButtonActive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <List
                size={18}
                color={viewMode === 'list' ? '#1a1a1a' : '#999'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Artworks Grid/List */}
        {viewMode === 'grid' ? (
          <View style={styles.artworksGrid}>
            {artworks.map((artwork) => (
              <TouchableOpacity
                key={artwork.id}
                style={styles.gridCard}
                onPress={() => router.push(`/artwork/${artwork.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.gridImageContainer}>
                  <Image
                    source={{ uri: artwork.image_url }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />

                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(artwork.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Heart
                      size={16}
                      color={favorites.has(artwork.id) ? '#d4a574' : '#fff'}
                      fill={
                        favorites.has(artwork.id) ? '#d4a574' : 'transparent'
                      }
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.gridInfo}>
                  <Text style={styles.gridTitle} numberOfLines={1}>
                    {artwork.title}
                  </Text>
                  <Text style={styles.gridOrigin} numberOfLines={1}>
                    {artwork.origin}
                  </Text>
                  <Text style={styles.gridEpoch}>{artwork.epoch}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.artworksList}>
            {artworks.map((artwork) => (
              <TouchableOpacity
                key={artwork.id}
                style={styles.listCard}
                onPress={() => router.push(`/artwork/${artwork.id}`)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: artwork.image_url }}
                  style={styles.listImage}
                  resizeMode="cover"
                />

                <View style={styles.listInfo}>
                  <Text style={styles.listTitle} numberOfLines={1}>
                    {artwork.title}
                  </Text>
                  <Text style={styles.listArtist} numberOfLines={1}>
                    {artwork.artist || 'Artiste inconnu'}
                  </Text>
                  <View style={styles.listMetadata}>
                    <Text style={styles.listOrigin}>{artwork.origin}</Text>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listEpoch}>{artwork.epoch}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.listFavoriteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(artwork.id);
                  }}
                  activeOpacity={0.8}
                >
                  <Heart
                    size={20}
                    color={favorites.has(artwork.id) ? '#d4a574' : '#999'}
                    fill={favorites.has(artwork.id) ? '#d4a574' : 'transparent'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },

  // Hero Section
  heroSection: {
    height: 320,
    backgroundColor: '#2a2a2a',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(26,26,26,0.9))',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    paddingHorizontal: 20,
    zIndex: 1,
  },
  themeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 165, 116, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  themeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d4a574',
    letterSpacing: 1,
  },
  collectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  collectionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d4a574',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  toolbarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#d4a574',
  },

  // Grid View
  artworksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 40,
  },
  gridCard: {
    width: cardWidth,
  },
  gridImageContainer: {
    width: '100%',
    height: cardWidth * 1.3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridInfo: {
    paddingTop: 12,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  gridOrigin: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  gridEpoch: {
    fontSize: 12,
    color: '#d4a574',
    fontWeight: '600',
  },

  // List View
  artworksList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 40,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#242424',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  listArtist: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  listMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listOrigin: {
    fontSize: 12,
    color: '#d4a574',
    fontWeight: '600',
  },
  listDot: {
    fontSize: 12,
    color: '#666',
  },
  listEpoch: {
    fontSize: 12,
    color: '#999',
  },
  listFavoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
