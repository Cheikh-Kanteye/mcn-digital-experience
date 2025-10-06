import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useAuth } from '@/lib/authContext';
import { DataService } from '@/lib/dataService';
import { AfricanPattern } from '@/components/AfricanPattern';
import { PassportTab } from '@/components/PassportTab';
import { SettingsTab } from '@/components/SettingsTab';
import { styles } from '@/components/styles';
import { TabsContainer } from '@/components/TabsContainer';
import { ProfileTab } from '@/components/ProfileTab';

interface VisitedArtwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  scanned_at: string;
  favorite: boolean;
}

type TabType = 'passport' | 'profile' | 'settings';

export default function PassportScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('passport');
  const [visitedArtworks, setVisitedArtworks] = useState<VisitedArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    collected: 0,
    common: 0,
    rare: 0,
    legendary: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPassportData();
    }
  }, [user]);

  const loadPassportData = async () => {
    if (!user) return;

    try {
      const uid = user.id;

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
    if (!artwork || !user) return;

    try {
      const newFavoriteStatus = !artwork.favorite;

      await DataService.addOrUpdatePassportEntry({
        user_id: user.id,
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

  return (
    <View style={styles.container}>
      <AfricanPattern variant="mudcloth" opacity={0.05} />
      <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'passport' && (
          <PassportTab
            visitedArtworks={visitedArtworks}
            loading={loading}
            stats={stats}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab visitedArtworks={visitedArtworks} stats={stats} />
        )}
        {activeTab === 'settings' && <SettingsTab />}
      </ScrollView>
    </View>
  );
}
