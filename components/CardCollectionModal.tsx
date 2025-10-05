import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AfricanPattern } from './AfricanPattern';

const { width } = Dimensions.get('window');

interface Artwork {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  rarity: 'common' | 'rare' | 'legendary';
  image_url: string;
  collection: string;
}

interface CardCollectionModalProps {
  visible: boolean;
  artwork: Artwork | null;
  onClose: () => void;
  onCollect: () => void;
}

const rarityConfig = {
  common: {
    label: 'Commun',
    color: '#8a7d70',
    borderColor: '#6b5d50',
    gradientColors: ['#151515', '#1a1a1a'] as const,
    glowColor: 'rgba(138, 125, 112, 0.3)',
  },
  rare: {
    label: 'Rare',
    color: '#5a9fd4',
    borderColor: '#4a8fc4',
    gradientColors: ['#1a2838', '#152030'] as const,
    glowColor: 'rgba(90, 159, 212, 0.4)',
  },
  legendary: {
    label: 'Légendaire',
    color: '#d4a574',
    borderColor: '#c49564',
    gradientColors: ['#2a2318', '#221d13'] as const,
    glowColor: 'rgba(212, 165, 116, 0.5)',
  },
};

export default function CardCollectionModal({
  visible,
  artwork,
  onClose,
  onCollect,
}: CardCollectionModalProps) {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setShowCard(true), 300);
    } else {
      setShowCard(false);
    }
  }, [visible]);

  if (!artwork) return null;

  const config = rarityConfig[artwork.rarity];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}>
          <View style={styles.closeButtonInner}>
            <X size={20} color="#c9b8a8" strokeWidth={1.5} />
          </View>
        </TouchableOpacity>

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Sparkles size={24} color={config.color} strokeWidth={1.5} />
            <Text style={styles.headerTitle}>Nouvelle carte découverte!</Text>
          </View>

          {showCard && (
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.cardGlow,
                  { shadowColor: config.glowColor },
                ]}
              />
              <LinearGradient
                colors={config.gradientColors}
                style={[
                  styles.card,
                  { borderColor: config.borderColor },
                ]}>
                <View style={styles.cardPattern}>
                  <AfricanPattern opacity={0.05} />
                </View>

                <View style={styles.rarityBadge}>
                  <View
                    style={[
                      styles.rarityDot,
                      { backgroundColor: config.color },
                    ]}
                  />
                  <Text style={[styles.rarityText, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>

                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: artwork.image_url }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View
                    style={[
                      styles.cardImageBorder,
                      { borderColor: config.borderColor },
                    ]}
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{artwork.title}</Text>
                  <Text style={styles.cardSubtitle}>{artwork.artist}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>{artwork.epoch}</Text>
                    <View style={styles.cardMetaDot} />
                    <Text style={styles.cardMetaText}>{artwork.origin}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.collectionLabel}>{artwork.collection}</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.collectButton,
                { borderColor: config.color, backgroundColor: config.gradientColors[0] },
              ]}
              onPress={onCollect}
              activeOpacity={0.8}>
              <Text style={[styles.collectButtonText, { color: config.color }]}>
                Récupérer la carte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(21, 21, 21, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#c9b8a8',
    letterSpacing: 0.5,
  },
  cardContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 32,
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  card: {
    borderRadius: 8,
    borderWidth: 2,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    zIndex: 1,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  cardImageContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 1,
  },
  cardImage: {
    width: '100%',
    height: 240,
    borderRadius: 4,
  },
  cardImageBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 1,
    borderRadius: 6,
  },
  cardInfo: {
    marginBottom: 16,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#8a7d70',
    marginBottom: 8,
    fontWeight: '300',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMetaText: {
    fontSize: 11,
    color: '#6b5d50',
    fontWeight: '300',
  },
  cardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#6b5d50',
  },
  cardFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 93, 80, 0.2)',
    zIndex: 1,
  },
  collectionLabel: {
    fontSize: 10,
    color: '#6b5d50',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '400',
  },
  actions: {
    width: '100%',
  },
  collectButton: {
    borderRadius: 4,
    borderWidth: 2,
    paddingVertical: 16,
    alignItems: 'center',
  },
  collectButtonText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
