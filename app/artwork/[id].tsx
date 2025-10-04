import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Volume2, Play, ZoomIn, Heart, Share2, BookmarkPlus } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { getOrCreateUserId } from '@/lib/storage';

const { width } = Dimensions.get('window');

interface ArtworkDetails {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  description_fr: string;
  description_en: string;
  description_wo: string;
  image_url: string;
  rarity: string;
  collection: {
    name_fr: string;
  };
}

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'FR' | 'EN' | 'WO'>('FR');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [isInPassport, setIsInPassport] = useState(false);

  useEffect(() => {
    loadArtwork();
    getOrCreateUserId().then(setUserId);
  }, [id]);

  useEffect(() => {
    if (userId && artwork) {
      checkPassportStatus();
    }
  }, [userId, artwork]);

  const loadArtwork = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          id,
          title,
          artist,
          epoch,
          origin,
          description_fr,
          description_en,
          description_wo,
          image_url,
          rarity,
          collections:collection_id(name_fr)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        console.error('Error loading artwork:', error);
        return;
      }

      setArtwork(data);
    } catch (error) {
      console.error('Error in loadArtwork:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPassportStatus = async () => {
    try {
      const { data } = await supabase
        .from('visitor_passport')
        .select('id, favorite')
        .eq('user_id', userId)
        .eq('artwork_id', id)
        .maybeSingle();

      setIsInPassport(!!data);
      if (data) {
        setIsFavorite(data.favorite);
      }
    } catch (error) {
      console.error('Error checking passport status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!userId || !artwork) return;

    try {
      const newFavoriteStatus = !isFavorite;

      const { error } = await supabase
        .from('visitor_passport')
        .upsert(
          {
            user_id: userId,
            artwork_id: artwork.id,
            favorite: newFavoriteStatus,
            card_collected: true,
          },
          {
            onConflict: 'user_id,artwork_id',
          }
        );

      if (!error) {
        setIsFavorite(newFavoriteStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToPassport = async () => {
    if (!userId || !artwork) return;

    try {
      const { error } = await supabase
        .from('visitor_passport')
        .upsert(
          {
            user_id: userId,
            artwork_id: artwork.id,
            card_collected: true,
          },
          {
            onConflict: 'user_id,artwork_id',
          }
        );

      if (!error) {
        setIsInPassport(true);
      }
    } catch (error) {
      console.error('Error adding to passport:', error);
    }
  };

  const getDescription = () => {
    if (!artwork) return '';
    switch (selectedLanguage) {
      case 'FR':
        return artwork.description_fr;
      case 'EN':
        return artwork.description_en;
      case 'WO':
        return artwork.description_wo || artwork.description_fr;
      default:
        return artwork.description_fr;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a67c52" />
      </View>
    );
  }

  if (!artwork) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Œuvre non trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: artwork.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <View style={styles.iconButton}>
              <ArrowLeft size={20} color="#c9b8a8" strokeWidth={1.5} />
            </View>
          </TouchableOpacity>

          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleFavorite}
              activeOpacity={0.8}>
              <Heart
                size={18}
                color={isFavorite ? '#a67c52' : '#c9b8a8'}
                fill={isFavorite ? '#a67c52' : 'transparent'}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={18} color="#c9b8a8" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsZoomed(!isZoomed)}>
              <ZoomIn size={18} color="#c9b8a8" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.collectionBadge}>
            <Text style={styles.collectionText}>{artwork.collection?.name_fr || ''}</Text>
          </View>

          <Text style={styles.title}>{artwork.title}</Text>

          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Artiste</Text>
              <Text style={styles.metadataValue}>{artwork.artist}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Époque</Text>
              <Text style={styles.metadataValue}>{artwork.epoch}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Origine</Text>
              <Text style={styles.metadataValue}>{artwork.origin}</Text>
            </View>
          </View>

          <View style={styles.languageSelector}>
            {(['FR', 'EN', 'WO'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageButton,
                  selectedLanguage === lang && styles.languageButtonActive,
                ]}
                onPress={() => setSelectedLanguage(lang)}>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang && styles.languageTextActive,
                  ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.audioSection}>
            <TouchableOpacity style={styles.audioButton}>
              <View style={styles.audioButtonContent}>
                <Volume2 size={20} color="#a67c52" strokeWidth={1.5} />
                <Text style={styles.audioButtonText}>Audio guide</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.videoButton}>
              <View style={styles.videoButtonInner}>
                <Play size={18} color="#8a7d70" strokeWidth={1.5} />
                <Text style={styles.videoButtonText}>Vidéo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{getDescription()}</Text>
          </View>

          {!isInPassport && (
            <TouchableOpacity
              style={styles.addToPassportButton}
              onPress={addToPassport}
              activeOpacity={0.8}>
              <View style={styles.passportButtonContent}>
                <BookmarkPlus size={18} color="#c9b8a8" strokeWidth={1.5} />
                <Text style={styles.passportButtonText}>Ajouter au passeport</Text>
              </View>
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#8a7d70',
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(21, 21, 21, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  imageActions: {
    position: 'absolute',
    top: 50,
    right: 20,
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(21, 21, 21, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  collectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#151515',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  collectionText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#8a7d70',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 20,
    lineHeight: 36,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  metadataItem: {
    flex: 1,
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  metadataLabel: {
    fontSize: 10,
    color: '#6b5d50',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '400',
    marginBottom: 6,
  },
  metadataValue: {
    fontSize: 13,
    color: '#c9b8a8',
    fontWeight: '300',
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#252525',
  },
  languageButtonActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#a67c52',
  },
  languageText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8a7d70',
  },
  languageTextActive: {
    color: '#c9b8a8',
  },
  audioSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  audioButton: {
    flex: 2,
    borderRadius: 4,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#a67c52',
  },
  audioButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  audioButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c9b8a8',
  },
  videoButton: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#252525',
  },
  videoButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  videoButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8a7d70',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 12,
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#8a7d70',
    lineHeight: 24,
    fontWeight: '300',
  },
  addToPassportButton: {
    borderRadius: 4,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#a67c52',
  },
  passportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  passportButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c9b8a8',
  },
});
