import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { BookmarkCheck, Heart, Calendar, Trash2 } from 'lucide-react-native';
import { AfricanPattern } from '@/components/AfricanPattern';
import { DataService } from '@/lib/dataService';
import { getOrCreateUserId } from '@/lib/storage';
import { useRouter } from 'expo-router';

interface VisitedArtwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  scanned_at: string;
  favorite: boolean;
}

export default function PassportScreen() {
  const [visitedArtworks, setVisitedArtworks] = useState<VisitedArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, collected: 0, common: 0, rare: 0, legendary: 0 });
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    loadPassportData();
  }, []);

  const loadPassportData = async () => {
    try {
      const uid = await getOrCreateUserId();
      setUserId(uid);

      const collectedArtworks = await DataService.getCollectedArtworks(uid);
      const passportEntries = await DataService.getPassportEntries(uid);
      const collectionStats = await DataService.getCollectionStats(uid);

      const artworksWithData = collectedArtworks.map((artwork) => {
        const entry = passportEntries.find((e) => e.artwork_id === artwork.id);
        return {
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          image_url: artwork.image_url,
          scanned_at: entry?.scanned_at || new Date().toISOString(),
          favorite: entry?.favorite || false,
        };
      });

      setVisitedArtworks(artworksWithData);
      setStats(collectionStats);
    } catch (error) {
      console.error('Error loading passport data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (artworkId: string) => {
    const artwork = visitedArtworks.find((a) => a.id === artworkId);
    if (!artwork || !userId) return;

    try {
      const newFavoriteStatus = !artwork.favorite;

      await DataService.addOrUpdatePassportEntry({
        user_id: userId,
        artwork_id: artworkId,
        favorite: newFavoriteStatus,
        card_collected: true,
        scanned_at: artwork.scanned_at,
        notes: '',
      });

      setVisitedArtworks((prev) =>
        prev.map((a) =>
          a.id === artworkId ? { ...a, favorite: newFavoriteStatus } : a
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <AfricanPattern variant="mudcloth" opacity={0.05} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <BookmarkCheck size={32} color="#a67c52" strokeWidth={1.5} />
            <Text style={styles.headerTitle}>Mon Passeport</Text>
            <Text style={styles.headerSubtitle}>
              Votre voyage à travers les civilisations
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.collected}</Text>
              <Text style={styles.statLabel}>Œuvres</Text>
              <Text style={styles.statLabel}>collectées</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {visitedArtworks.filter(a => a.favorite).length}
              </Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.legendary}</Text>
              <Text style={styles.statLabel}>Légendaires</Text>
            </View>
          </View>
        </View>

        <View style={styles.artworksContainer}>
          <Text style={styles.sectionTitle}>Œuvres collectées</Text>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#c9b8a8" />
              <Text style={styles.emptyTitle}>Chargement...</Text>
            </View>
          ) : visitedArtworks.length === 0 ? (
            <View style={styles.emptyState}>
              <BookmarkCheck size={48} color="#8a7d70" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Aucune œuvre scannée</Text>
              <Text style={styles.emptyText}>
                Scannez votre première œuvre pour commencer votre voyage culturel
              </Text>
            </View>
          ) : (
            <View style={styles.artworksList}>
              {visitedArtworks.map((artwork) => (
                <TouchableOpacity
                  key={artwork.id}
                  style={styles.artworkCard}
                  onPress={() => router.push(`/artwork/${artwork.id}`)}
                  activeOpacity={0.8}>
                  <Image
                    source={{ uri: artwork.image_url }}
                    style={styles.artworkImage}
                  />
                  <View style={styles.artworkInfo}>
                    <View style={styles.artworkHeader}>
                      <View style={styles.artworkTitleContainer}>
                        <Text style={styles.artworkTitle} numberOfLines={1}>
                          {artwork.title}
                        </Text>
                        <Text style={styles.artworkArtist} numberOfLines={1}>
                          {artwork.artist}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleFavorite(artwork.id);
                        }}>
                        <Heart
                          size={18}
                          color={artwork.favorite ? '#a67c52' : '#6b5d50'}
                          fill={artwork.favorite ? '#a67c52' : 'transparent'}
                          strokeWidth={1.5}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.artworkFooter}>
                      <View style={styles.dateContainer}>
                        <Calendar size={12} color="#6b5d50" strokeWidth={1.5} />
                        <Text style={styles.dateText}>{formatDate(artwork.scanned_at)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.shareSection}>
          <View style={styles.shareCard}>
            <Text style={styles.shareTitle}>Partagez votre parcours</Text>
            <Text style={styles.shareText}>
              Créez une carte visuelle élégante de vos découvertes et partagez-la avec vos proches
            </Text>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Créer une carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#c9b8a8',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
  artworksContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 16,
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8a7d70',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#6b5d50',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
    fontWeight: '300',
  },
  artworksList: {
    gap: 16,
  },
  artworkCard: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#252525',
  },
  artworkImage: {
    width: 100,
    height: 120,
  },
  artworkInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  artworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  artworkTitleContainer: {
    flex: 1,
  },
  artworkTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 4,
  },
  artworkArtist: {
    fontSize: 12,
    color: '#8a7d70',
    fontWeight: '300',
  },
  favoriteButton: {
    padding: 4,
  },
  artworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: '#6b5d50',
    fontWeight: '300',
  },
  deleteButton: {
    padding: 4,
  },
  shareSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  shareCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#252525',
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 8,
  },
  shareText: {
    fontSize: 13,
    color: '#8a7d70',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '300',
  },
  shareButton: {
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#a67c52',
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c9b8a8',
  },
});
