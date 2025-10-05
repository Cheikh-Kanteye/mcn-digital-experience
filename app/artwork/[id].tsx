import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  MoreVertical,
  MapPin,
  Calendar,
  Headphones,
  Play,
  ChevronDown,
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import { getOrCreateUserId } from '@/lib/storage';
import { DataService } from '@/lib/dataService';
import { theme } from '@/lib/theme';

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
  materials?: string;
  dimensions?: string;
  provenance?: string;
  acquisition?: string;
}

// ========== COMPOSANTS MODULAIRES ==========

// Header avec image et actions
const ArtworkHeader = ({
  imageUrl,
  onBack,
  isFavorite,
  onToggleFavorite,
  onShare,
}: {
  imageUrl: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}) => (
  <View style={styles.headerContainer}>
    <Image
      source={{ uri: imageUrl }}
      style={styles.headerImage}
      resizeMode="cover"
    />

    {/* Actions en haut */}
    <View style={styles.topActions}>
      <TouchableOpacity style={styles.topButton} onPress={onBack}>
        <ArrowLeft
          size={20}
          color={theme.colors.text.primary}
          strokeWidth={2}
        />
      </TouchableOpacity>

      <View style={styles.topRightActions}>
        <TouchableOpacity style={styles.topButton} onPress={onToggleFavorite}>
          <Heart
            size={20}
            color={theme.colors.text.primary}
            fill={isFavorite ? theme.colors.text.primary : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton} onPress={onShare}>
          <Share2 size={20} color={theme.colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton}>
          <MoreVertical
            size={20}
            color={theme.colors.text.primary}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
    </View>

    {/* Badge époque sur l'image */}
    <View style={styles.epochBadge}>
      <Text style={styles.epochText}>Époque: XIVe siècle</Text>
    </View>

    {/* Bouton zoom en bas à droite */}
    <TouchableOpacity style={styles.zoomButton}>
      <View style={styles.zoomIcon}>
        <View style={styles.zoomIconInner} />
      </View>
    </TouchableOpacity>
  </View>
);

// Titre et informations principales
const ArtworkTitle = ({
  title,
  origin,
  epoch,
}: {
  title: string;
  origin: string;
  epoch: string;
}) => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <MapPin size={14} color={theme.colors.accent.primary} strokeWidth={2} />
        <Text style={styles.infoText}>{origin}</Text>
      </View>
      <View style={styles.infoItem}>
        <Calendar
          size={14}
          color={theme.colors.accent.primary}
          strokeWidth={2}
        />
        <Text style={styles.infoText}>{epoch}</Text>
      </View>
    </View>
  </View>
);

// Badge collection
const CollectionBadge = ({ collectionName }: { collectionName: string }) => (
  <View style={styles.collectionBadge}>
    <View style={styles.collectionDots}>
      <View style={[styles.dot, styles.dotOrange]} />
      <View style={[styles.dot, styles.dotOrange]} />
      <View style={[styles.dot, styles.dotGray]} />
    </View>
    <Text style={styles.collectionText}>{collectionName}</Text>
  </View>
);

// Guide audio avec lecteur
const AudioGuide = ({
  selectedLanguage,
  onLanguageChange,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
}: {
  selectedLanguage: 'FR' | 'EN' | 'WO';
  onLanguageChange: (lang: 'FR' | 'EN' | 'WO') => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.audioSection}>
      <View style={styles.audioHeader}>
        <View style={styles.audioTitleRow}>
          <View style={styles.audioIconContainer}>
            <Headphones
              size={20}
              color={theme.colors.accent.primary}
              strokeWidth={2}
            />
          </View>
          <View>
            <Text style={styles.audioTitle}>Guide Audio</Text>
            <Text style={styles.audioDuration}>
              Durée: {formatTime(duration)}
            </Text>
          </View>
        </View>

        <View style={styles.languageTabs}>
          {(['FR', 'EN', 'WO'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageTab,
                selectedLanguage === lang && styles.languageTabActive,
              ]}
              onPress={() => onLanguageChange(lang)}
            >
              <Text
                style={[
                  styles.languageTabText,
                  selectedLanguage === lang && styles.languageTabTextActive,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lecteur audio */}
      <View style={styles.audioPlayer}>
        <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
          {isPlaying ? (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <Play
              size={16}
              color={theme.colors.background.primary}
              strokeWidth={2}
              fill={theme.colors.background.primary}
            />
          )}
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Section description
const DescriptionSection = ({
  description,
  isExpanded,
  onToggleExpand,
}: {
  description: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => (
  <View style={styles.descriptionSection}>
    <Text style={styles.sectionTitle}>Description</Text>
    <Text
      style={styles.descriptionText}
      numberOfLines={isExpanded ? undefined : 4}
    >
      {description}
    </Text>
    <TouchableOpacity style={styles.readMoreButton} onPress={onToggleExpand}>
      <Text style={styles.readMoreText}>
        {isExpanded ? 'Lire moins' : 'Lire la suite'}
      </Text>
      <ChevronDown
        size={16}
        color={theme.colors.accent.primary}
        strokeWidth={2}
        style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
      />
    </TouchableOpacity>
  </View>
);

// Détails techniques
const TechnicalDetails = ({
  materials,
  dimensions,
  provenance,
  acquisition,
}: {
  materials?: string;
  dimensions?: string;
  provenance?: string;
  acquisition?: string;
}) => (
  <View style={styles.technicalSection}>
    <Text style={styles.sectionTitle}>Détails Techniques</Text>
    <View style={styles.technicalGrid}>
      <View style={styles.technicalItem}>
        <Text style={styles.technicalLabel}>Matériaux</Text>
        <Text style={styles.technicalValue}>
          {materials || 'Bois, Pigments naturels'}
        </Text>
      </View>
      <View style={styles.technicalItem}>
        <Text style={styles.technicalLabel}>Dimensions</Text>
        <Text style={styles.technicalValue}>
          {dimensions || '45 x 32 x 18 cm'}
        </Text>
      </View>
      <View style={styles.technicalItem}>
        <Text style={styles.technicalLabel}>Provenance</Text>
        <Text style={styles.technicalValue}>
          {provenance || 'Plateau Dogon, Mali'}
        </Text>
      </View>
      <View style={styles.technicalItem}>
        <Text style={styles.technicalLabel}>Acquisition</Text>
        <Text style={styles.technicalValue}>
          {acquisition || 'Don privé, 1967'}
        </Text>
      </View>
    </View>
  </View>
);

// Œuvres similaires
const SimilarArtworks = ({ artworks }: { artworks: any[] }) => (
  <View style={styles.similarSection}>
    <Text style={styles.sectionTitle}>Œuvres Similaires</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.similarScroll}
    >
      {artworks.map((artwork, index) => (
        <TouchableOpacity key={index} style={styles.similarCard}>
          <Image
            source={{ uri: artwork.image_url }}
            style={styles.similarImage}
            resizeMode="cover"
          />
          <View style={styles.similarInfo}>
            <Text style={styles.similarTitle} numberOfLines={1}>
              {artwork.title}
            </Text>
            <Text style={styles.similarEpoch}>{artwork.epoch}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// Bouton d'action principal
const AddToPassportButton = ({
  isInPassport,
  onPress,
}: {
  isInPassport: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.passportButton, isInPassport && styles.passportButtonAdded]}
    onPress={onPress}
    disabled={isInPassport}
  >
    <Text style={styles.passportButtonText}>
      {isInPassport ? '✓ Ajouté au Passeport' : 'Ajouter au Passeport'}
    </Text>
  </TouchableOpacity>
);

// ========== COMPOSANT PRINCIPAL ==========

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'FR' | 'EN' | 'WO'>(
    'FR'
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [isInPassport, setIsInPassport] = useState(false);

  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(270); // 4:30 en secondes
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  // Audio URLs par langue (à remplacer par vos vrais URLs)
  const audioUrls = {
    FR: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Exemple
    EN: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Exemple
    WO: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Exemple
  };

  useEffect(() => {
    loadArtwork();
    getOrCreateUserId().then(setUserId);

    // Configure audio mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (userId && artwork) {
      checkPassportStatus();
    }
  }, [userId, artwork]);

  // Charger l'audio quand la langue change
  useEffect(() => {
    loadAudio();
  }, [selectedLanguage]);

  const loadAudio = async () => {
    try {
      // Décharger l'audio précédent
      if (sound) {
        await sound.unloadAsync();
        setIsPlaying(false);
        setCurrentTime(0);
      }

      // Charger le nouvel audio
      const newSound = new Audio.Sound();
      await newSound.loadAsync({ uri: audioUrls[selectedLanguage] });
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 270);
      setCurrentTime(status.positionMillis ? status.positionMillis / 1000 : 0);
      setIsPlaying(status.isPlaying);

      // Si l'audio est terminé
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
        sound?.setPositionAsync(0);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleShare = async () => {
    if (!artwork) return;

    try {
      // Partage simple avec texte et URL
      const shareMessage = `Découvrez "${artwork.title}" - ${artwork.artist}\n\nÉpoque: ${artwork.epoch}\nOrigine: ${artwork.origin}\n\nVoir sur l'application Musée`;

      const result = await Share.share(
        Platform.OS === 'ios'
          ? {
              message: shareMessage,
              title: artwork.title,
              url: artwork.image_url,
            }
          : {
              message: `${shareMessage}\n\n${artwork.image_url}`,
              title: artwork.title,
            }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de partager pour le moment');
      console.error('Error sharing:', error);
    }
  };

  const loadArtwork = async () => {
    try {
      const data = await DataService.getArtworkWithCollection(id as string);
      if (!data) {
        console.error('Error loading artwork');
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
      const data = await DataService.getPassportEntry(userId, id as string);
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
      const success = await DataService.addOrUpdatePassportEntry({
        user_id: userId,
        artwork_id: artwork.id,
        favorite: newFavoriteStatus,
        card_collected: true,
        scanned_at: new Date().toISOString(),
        notes: '',
      });
      if (success) {
        setIsFavorite(newFavoriteStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToPassport = async () => {
    if (!userId || !artwork || isInPassport) return;
    try {
      const success = await DataService.addOrUpdatePassportEntry({
        user_id: userId,
        artwork_id: artwork.id,
        card_collected: true,
        scanned_at: new Date().toISOString(),
        favorite: false,
        notes: '',
      });
      if (success) {
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
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
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

  // Données fictives pour les œuvres similaires
  const similarArtworks = [
    {
      title: 'Statuette Bambara',
      epoch: 'XIIIe siècle',
      image_url: artwork.image_url,
    },
    {
      title: 'Masque Yoruba',
      epoch: 'XVe siècle',
      image_url: artwork.image_url,
    },
    {
      title: 'Fétiche Fang',
      epoch: 'XIVe siècle',
      image_url: artwork.image_url,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ArtworkHeader
          imageUrl={artwork.image_url}
          onBack={() => router.back()}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onShare={handleShare}
        />

        <View style={styles.contentContainer}>
          <ArtworkTitle
            title={artwork.title}
            origin={artwork.origin}
            epoch={artwork.epoch}
          />

          {artwork.collection?.name_fr && (
            <CollectionBadge collectionName={artwork.collection.name_fr} />
          )}

          <AudioGuide
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            currentTime={currentTime}
            duration={duration}
          />

          <DescriptionSection
            description={getDescription()}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />

          <AddToPassportButton
            isInPassport={isInPassport}
            onPress={addToPassport}
          />

          <TechnicalDetails
            materials={artwork.materials}
            dimensions={artwork.dimensions}
            provenance={artwork.provenance}
            acquisition={artwork.acquisition}
          />

          <SimilarArtworks artworks={similarArtworks} />
        </View>
      </ScrollView>
    </View>
  );
}

// ========== STYLES ==========

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
  errorText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  headerContainer: {
    height: 380,
    position: 'relative',
    backgroundColor: theme.colors.background.dark,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  topActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  epochBadge: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: theme.colors.ui.glass,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  epochText: {
    fontSize: 13,
    color: theme.colors.background.primary,
    fontWeight: '600',
  },
  zoomButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomIconInner: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
    borderRadius: 2,
  },

  // Content
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },

  // Collection Badge
  collectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  collectionDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOrange: {
    backgroundColor: theme.colors.accent.primary,
  },
  dotGray: {
    backgroundColor: theme.colors.special.dotGray,
  },
  collectionText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Audio Guide
  audioSection: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  audioHeader: {
    marginBottom: 16,
  },
  audioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  audioIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  audioDuration: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  languageTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  languageTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.background.primary,
  },
  languageTabActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  languageTabText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  languageTabTextActive: {
    color: theme.colors.background.primary,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  pauseBar: {
    width: 3,
    height: 14,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 2,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.ui.inactive,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    width: '30%',
    height: '100%',
    backgroundColor: theme.colors.accent.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
  },

  // Description
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    lineHeight: 22,
    marginBottom: 8,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    color: theme.colors.accent.primary,
    fontWeight: '600',
  },

  // Passport Button
  passportButton: {
    backgroundColor: theme.colors.accent.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  passportButtonAdded: {
    backgroundColor: theme.colors.ui.inactive,
  },
  passportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.background.primary,
  },

  // Technical Details
  technicalSection: {
    marginBottom: 24,
  },
  technicalGrid: {
    gap: 16,
  },
  technicalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  technicalLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  technicalValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // Similar Artworks
  similarSection: {
    marginBottom: 24,
  },
  similarScroll: {
    gap: 12,
    paddingRight: 20,
  },
  similarCard: {
    width: 140,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.background.secondary,
  },
  similarInfo: {
    padding: 12,
  },
  similarTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  similarEpoch: {
    fontSize: 11,
    color: theme.colors.text.secondary,
  },
});
