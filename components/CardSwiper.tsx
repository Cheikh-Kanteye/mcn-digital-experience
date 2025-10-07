import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import CollectedCard from './CollectedCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

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

interface CardSwiperProps {
  artworks: Artwork[];
  onSwipeLeft?: (artwork: Artwork) => void;
  onSwipeRight?: (artwork: Artwork) => void;
  onFinish?: () => void;
}

type GestureContext = {
  startX: number;
  startY: number;
};

export default function CardSwiper({
  artworks,
  onSwipeLeft,
  onSwipeRight,
  onFinish,
}: CardSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentArtwork = artworks[currentIndex];

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (currentArtwork) {
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft(currentArtwork);
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight(currentArtwork);
      }
    }

    setTimeout(() => {
      translateX.value = 0;
      translateY.value = 0;

      if (currentIndex < artworks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        if (onFinish) {
          onFinish();
        }
      }
    }, 300);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(handleSwipeComplete)('left');
      } else if (shouldSwipeRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(handleSwipeComplete)('right');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]);
    return { opacity };
  });

  const nopeOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0]);
    return { opacity };
  });

  if (!currentArtwork) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucune carte à afficher</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
          <Animated.View style={[styles.likeStamp, likeOpacityStyle]}>
            <Text style={styles.stampText}>J'AIME</Text>
          </Animated.View>

          <Animated.View style={[styles.nopeStamp, nopeOpacityStyle]}>
            <Text style={styles.stampText}>PASSER</Text>
          </Animated.View>

          <CollectedCard artwork={currentArtwork} />
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {artworks.length}
        </Text>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Swipez à gauche pour passer, à droite pour aimer
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    paddingVertical: 40,
  },
  cardWrapper: {
    position: 'relative',
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  likeStamp: {
    position: 'absolute',
    top: 100,
    right: 40,
    borderWidth: 4,
    borderColor: '#4ade80',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '20deg' }],
    zIndex: 10,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  nopeStamp: {
    position: 'absolute',
    top: 100,
    left: 40,
    borderWidth: 4,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-20deg' }],
    zIndex: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  stampText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
  counter: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#151515',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  counterText: {
    fontSize: 14,
    color: '#c9b8a8',
    fontWeight: '400',
  },
  instructions: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
  instructionsText: {
    fontSize: 12,
    color: '#6b5d50',
    textAlign: 'center',
    fontWeight: '300',
  },
});
