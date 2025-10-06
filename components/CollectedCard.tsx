import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

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

interface CollectedCardProps {
  artwork: Artwork;
}

const rarityConfig = {
  common: {
    label: 'COMMON',
    color: '#d4a574',
    textColor: '#d4a574',
    borderColor: '#d4a574',
    gradientColors: ['#4a3420', '#2a1d10'],
    bgColor: '#3a2818',
    glowColor: 'rgba(212, 165, 116, 0.4)',
    pattern: require('@/assets/images/pattern-common.png'),
  },
  rare: {
    label: 'RARE',
    color: '#7ed957',
    textColor: '#d4ff00',
    borderColor: '#7ed957',
    gradientColors: ['#1a3a20', '#0f2419'],
    bgColor: '#1a3a2a',
    glowColor: 'rgba(126, 217, 87, 0.6)',
    pattern: require('@/assets/images/pattern-rare.png'),
  },
  legendary: {
    label: 'LEGENDARY',
    color: '#60a5fa',
    textColor: '#ffd700',
    borderColor: '#60a5fa',
    gradientColors: ['#1a2e4a', '#0f1d35'],
    bgColor: '#1a3a5a',
    glowColor: 'rgba(96, 165, 250, 0.6)',
    pattern: require('@/assets/images/pattern-legendary.png'),
  },
};

export default function CollectedCard({ artwork }: CollectedCardProps) {
  const config = rarityConfig[artwork.rarity];

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: config.borderColor,
          shadowColor: config.glowColor,
          backgroundColor: '#1a1a1a',
        },
      ]}
    >
      {/* Pattern de fond en position absolue */}
      <View style={styles.cardPatternContainer}>
        <ImageBackground
          source={config.pattern}
          style={styles.cardPattern}
          imageStyle={styles.cardPatternImage}
        />
      </View>

      {/* Contenu de la carte avec padding */}
      <View style={styles.cardContent}>
        {/* Header avec "RARITY" */}
        <View style={styles.cardHeader}>
          <View style={styles.cornerDot} />
          <View style={styles.rarityBadgeTop}>
            <View style={styles.rarityDiamond}>
              <View
                style={[
                  styles.rarityDiamondInner,
                  { backgroundColor: config.color },
                ]}
              />
            </View>
            <Text style={[styles.rarityLabel, { color: config.color }]}>
              RARITY: {config.label}
            </Text>
            <View style={styles.rarityDiamond}>
              <View
                style={[
                  styles.rarityDiamondInner,
                  { backgroundColor: config.color },
                ]}
              />
            </View>
          </View>
          <View style={styles.cornerDot} />
        </View>

        {/* Titre du musée */}
        <Text style={styles.museumTitle}>MUSÉE DES CIVILISATIONS NOIRES</Text>

        {/* Image de l'artwork avec bordure lumineuse */}
        <View style={styles.artworkContainer}>
          <View
            style={[
              styles.artworkBorder,
              {
                borderColor: config.borderColor,
                shadowColor: config.color,
              },
            ]}
          >
            <Image
              source={{ uri: artwork.image_url }}
              style={styles.artworkImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Informations de l'artwork */}
        <View style={styles.artworkInfo}>
          <Text style={styles.artworkTitle}>{artwork.title}</Text>
          <Text style={styles.artworkSubtitle}>
            {artwork.origin}, {artwork.epoch}
          </Text>
        </View>

        {/* Footer avec propriétaire */}
        <View style={styles.cardFooter}>
          <View style={styles.cornerDot} />
          <View style={styles.ownerSection}>
            <Text style={styles.ownerLabel}>PROPRIÉTAIRE:</Text>
            <Text style={styles.ownerName}>NOM DU COLLECTIONNEUR</Text>
          </View>
          <View style={styles.cornerDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
    position: 'relative',
    width: '100%',
    maxWidth: 400,
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
});
