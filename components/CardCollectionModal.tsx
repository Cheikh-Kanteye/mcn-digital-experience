import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CollectedCard from './CollectedCard';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  rarity: 'common' | 'rare' | 'legendary';
  image_url: string;
  collection_id: string;
}

interface CardCollectionModalProps {
  visible: boolean;
  artwork: Artwork | null;
  onClose: () => void;
  onCollect: () => void;
}

const rarityConfig = {
  common: {
    bgColor: '#3a2818',
    color: '#d4a574',
  },
  rare: {
    bgColor: '#1a3a2a',
    color: '#7ed957',
  },
  legendary: {
    bgColor: '#1a3a5a',
    color: '#60a5fa',
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
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[config.bgColor + 'dd', config.bgColor + 'ff']}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <View style={styles.closeButtonInner}>
            <X size={20} color="#fff" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        <View style={styles.modalContent}>
          {showCard && (
            <View style={styles.cardContainer}>
              <CollectedCard artwork={artwork} />
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.collectButton, { backgroundColor: config.color }]}
              onPress={onCollect}
              activeOpacity={0.8}
            >
              <Text style={styles.collectButtonText}>Récupérer la carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
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
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 32,
  },
  card: {
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
    position: 'relative',
  },
  cardPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardPattern: {
    width: '100%',
    height: '100%',
  },
  cardPatternImage: {
    opacity: 0.15,
  },
  cardContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cornerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  rarityBadgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rarityDiamond: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityDiamondInner: {
    width: 6,
    height: 6,
  },
  rarityLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  museumTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d4a574',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 20,
  },
  artworkContainer: {
    marginBottom: 16,
  },
  artworkBorder: {
    borderWidth: 3,
    borderRadius: 8,
    padding: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  artworkImage: {
    width: '100%',
    height: 280,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  artworkInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  artworkTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  artworkSubtitle: {
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  ownerSection: {
    alignItems: 'center',
    flex: 1,
  },
  ownerLabel: {
    fontSize: 9,
    color: '#888',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d4a574',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actions: {
    width: '100%',
  },
  collectButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  collectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
