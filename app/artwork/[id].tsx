import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Volume2, Play, ZoomIn, Heart, Share2, BookmarkPlus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ArtworkDetails {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  description_fr: string;
  image_url: string;
  collection: string;
}

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'FR' | 'EN' | 'WO'>('FR');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const artwork: ArtworkDetails = {
    id: '1',
    title: 'Masque Gelede',
    artist: 'Artisan Yoruba',
    epoch: 'XIXe siècle',
    origin: 'Nigeria',
    description_fr: 'Masque cérémoniel utilisé lors des rituels Gelede pour honorer les mères ancestrales. Les motifs colorés et les sculptures représentent la fertilité et le pouvoir féminin. Chaque détail sculpté raconte une histoire profonde de la tradition Yoruba, transmettant des valeurs spirituelles et sociales à travers les générations.',
    image_url: 'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg',
    collection: 'Spiritualité et Rites',
  };

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
            onPress={() => router.back()}>
            <View style={styles.iconButton}>
              <ArrowLeft size={20} color="#c9b8a8" strokeWidth={1.5} />
            </View>
          </TouchableOpacity>

          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}>
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

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.contentContainer}>
          <View style={styles.collectionBadge}>
            <Text style={styles.collectionText}>{artwork.collection}</Text>
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
            <Text style={styles.descriptionText}>{artwork.description_fr}</Text>
          </View>

          <TouchableOpacity style={styles.addToPassportButton}>
            <View style={styles.passportButtonContent}>
              <BookmarkPlus size={18} color="#c9b8a8" strokeWidth={1.5} />
              <Text style={styles.passportButtonText}>Ajouter au passeport</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
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
