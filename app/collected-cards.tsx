import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
  Extrapolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import type { GestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AfricanPattern } from '@/components/AfricanPattern';
import { DataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';
import CollectedCard from '@/components/CollectedCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 60;

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

interface GestureContext {
  startX: number;
  startY: number;
}

const SwipeableCard = ({
  artwork,
  index,
  totalCards,
  onSwipeLeft,
  onSwipeRight,
  onRemove,
}: {
  artwork: Artwork;
  index: number;
  totalCards: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRemove: () => void;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isTop = index === totalCards - 1;

  const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
    'worklet';
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === 2) {
      // ACTIVE
      translateX.value = translationX;
      translateY.value = translationY;
    } else if (state === 5) {
      // END
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;

      if (shouldSwipeRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onRemove)();
        });
        if (onSwipeRight) {
          runOnJS(onSwipeRight)();
        }
      } else if (shouldSwipeLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onRemove)();
        });
        if (onSwipeLeft) {
          runOnJS(onSwipeLeft)();
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5],
      Extrapolate.CLAMP
    );

    const scale = isTop
      ? 1
      : interpolate(index, [0, totalCards - 1], [0.9, 1], Extrapolate.CLAMP);

    const stackTranslateY = isTop
      ? 0
      : interpolate(index, [0, totalCards - 1], [30, 0], Extrapolate.CLAMP);

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + stackTranslateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity,
      zIndex: index,
    };
  });

  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2],
      [0, 1],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2],
      [0.5, 1.2],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD / 2, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD / 2, 0],
      [1.2, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={isTop}>
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <Animated.View style={[styles.badge, styles.likeBadge, likeStyle]}>
          <Text style={styles.badgeText}>✓ GARDER</Text>
        </Animated.View>

        <Animated.View style={[styles.badge, styles.nopeBadge, nopeStyle]}>
          <Text style={styles.badgeText}>✗ RETIRER</Text>
        </Animated.View>

        <CollectedCard artwork={artwork} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default function CollectionsScreen() {
  const [collectedArtworks, setCollectedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('grid');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadCollectedArtworks();
    }
  }, [user]);

  const loadCollectedArtworks = async () => {
    if (!user) return;

    try {
      const artworks = await DataService.getCollectedArtworks(user.id);
      setCollectedArtworks(artworks);
    } catch (error) {
      console.error('Error loading collected artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    console.log('Carte conservée');
  }, []);

  const handleSwipeLeft = useCallback(() => {
    console.log('Carte retirée');
  }, []);

  const visibleCards = collectedArtworks.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <View style={styles.container}>
        <AfricanPattern variant="mudcloth" opacity={0.05} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#c9b8a8" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Cartes Collectées</Text>
        </View>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#c9b8a8" />
          <Text style={styles.emptyTitle}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AfricanPattern variant="mudcloth" opacity={0.05} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#c9b8a8" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Cartes Collectées</Text>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'grid' ? 'swipe' : 'grid')}
        >
          <Text style={styles.viewToggleText}>
            {viewMode === 'grid' ? '🃏 Swipe' : '⊞ Grille'}
          </Text>
        </TouchableOpacity>
      </View>

      {collectedArtworks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Aucune carte collectée</Text>
          <Text style={styles.emptyText}>
            Scannez des œuvres pour commencer votre collection
          </Text>
        </View>
      ) : viewMode === 'swipe' ? (
        <View style={styles.swipeContainer}>
          {currentIndex >= collectedArtworks.length ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Toutes les cartes vues ! 🎨</Text>
              <Text style={styles.emptyText}>
                Appuyez sur "Grille" pour revoir votre collection
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setCurrentIndex(0);
                  setViewMode('grid');
                }}
              >
                <Text style={styles.resetButtonText}>Retour à la grille</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {visibleCards.map((artwork, idx) => (
                <SwipeableCard
                  key={artwork.id}
                  artwork={artwork}
                  index={idx}
                  totalCards={visibleCards.length}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onRemove={handleRemove}
                />
              ))}

              <View style={styles.instructions}>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionArrow}>←</Text>
                  <Text style={styles.instructionText}>Retirer</Text>
                </View>
                <View style={styles.counterBadge}>
                  <Text style={styles.counterText}>
                    {currentIndex + 1} / {collectedArtworks.length}
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionArrow}>→</Text>
                  <Text style={styles.instructionText}>Garder</Text>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {collectedArtworks.map((artwork) => (
            <View key={artwork.id} style={styles.gridCard}>
              <CollectedCard artwork={artwork} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#c9b8a8',
    flex: 1,
  },
  viewToggle: {
    backgroundColor: 'rgba(201, 184, 168, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 184, 168, 0.3)',
  },
  viewToggleText: {
    fontSize: 14,
    color: '#c9b8a8',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    maxWidth: 400,
  },
  badge: {
    position: 'absolute',
    top: 60,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 4,
  },
  likeBadge: {
    right: 30,
    borderColor: '#7ed957',
    backgroundColor: 'rgba(126, 217, 87, 0.2)',
    transform: [{ rotate: '15deg' }],
  },
  nopeBadge: {
    left: 30,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ rotate: '-15deg' }],
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(201, 184, 168, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 184, 168, 0.2)',
  },
  instructionArrow: {
    fontSize: 18,
    color: '#c9b8a8',
  },
  instructionText: {
    fontSize: 12,
    color: '#c9b8a8',
    fontWeight: '500',
  },
  counterBadge: {
    backgroundColor: 'rgba(201, 184, 168, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c9b8a8',
  },
  counterText: {
    fontSize: 14,
    color: '#c9b8a8',
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: 'rgba(201, 184, 168, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#c9b8a8',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#c9b8a8',
    fontWeight: '500',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  gridCard: {
    width: '48%',
    marginBottom: 16,
  },
});
