import artworksData from '@/data/artworks.json';
import collectionsData from '@/data/collections.json';
import { getOrCreateUserId } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSPORT_KEY = '@museum_passport';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  description_fr: string;
  description_en: string;
  description_wo: string;
  audio_guide_fr: string;
  audio_guide_en: string;
  audio_guide_wo: string;
  video_url: string;
  image_url: string;
  image_detail_url: string;
  qr_code: string;
  rarity: 'common' | 'rare' | 'legendary';
  collection_id: string;
}

interface Collection {
  id: string;
  name_fr: string;
  name_en: string;
  name_wo: string;
  description_fr: string;
  description_en: string;
  description_wo: string;
  theme: string;
  icon: string;
}

interface PassportEntry {
  id: string;
  user_id: string;
  artwork_id: string;
  scanned_at: string;
  card_collected: boolean;
  favorite: boolean;
  notes: string;
}

export const DataService = {
  async getAllArtworks(): Promise<Artwork[]> {
    return artworksData as Artwork[];
  },

  async getArtworkById(id: string): Promise<Artwork | null> {
    const artwork = artworksData.find((a) => a.id === id);
    return artwork ? (artwork as Artwork) : null;
  },

  async getArtworkByQRCode(qrCode: string): Promise<Artwork | null> {
    const artwork = artworksData.find((a) => a.qr_code === qrCode);
    return artwork ? (artwork as Artwork) : null;
  },

  async getArtworkWithCollection(id: string): Promise<any> {
    const artwork = await this.getArtworkById(id);
    if (!artwork) return null;

    const collection = collectionsData.find((c) => c.id === artwork.collection_id);

    return {
      ...artwork,
      collections: collection || null,
    };
  },

  async getArtworkWithCollectionByQRCode(qrCode: string): Promise<any> {
    const artwork = await this.getArtworkByQRCode(qrCode);
    if (!artwork) return null;

    const collection = collectionsData.find((c) => c.id === artwork.collection_id);

    return {
      ...artwork,
      collections: collection || null,
    };
  },

  async getAllCollections(): Promise<Collection[]> {
    return collectionsData as Collection[];
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    const collection = collectionsData.find((c) => c.id === id);
    return collection ? (collection as Collection) : null;
  },

  async getArtworksByCollectionId(collectionId: string): Promise<Artwork[]> {
    return artworksData.filter((a) => a.collection_id === collectionId) as Artwork[];
  },

  async getPassportEntries(userId: string): Promise<PassportEntry[]> {
    try {
      const data = await AsyncStorage.getItem(PASSPORT_KEY);
      if (!data) return [];

      const allEntries: PassportEntry[] = JSON.parse(data);
      return allEntries.filter((entry) => entry.user_id === userId);
    } catch (error) {
      console.error('Error loading passport entries:', error);
      return [];
    }
  },

  async getPassportEntry(userId: string, artworkId: string): Promise<PassportEntry | null> {
    try {
      const entries = await this.getPassportEntries(userId);
      return entries.find((e) => e.artwork_id === artworkId) || null;
    } catch (error) {
      console.error('Error loading passport entry:', error);
      return null;
    }
  },

  async addOrUpdatePassportEntry(entry: Omit<PassportEntry, 'id'>): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(PASSPORT_KEY);
      let allEntries: PassportEntry[] = data ? JSON.parse(data) : [];

      const existingIndex = allEntries.findIndex(
        (e) => e.user_id === entry.user_id && e.artwork_id === entry.artwork_id
      );

      if (existingIndex >= 0) {
        allEntries[existingIndex] = {
          ...allEntries[existingIndex],
          ...entry,
        };
      } else {
        const newEntry: PassportEntry = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...entry,
        };
        allEntries.push(newEntry);
      }

      await AsyncStorage.setItem(PASSPORT_KEY, JSON.stringify(allEntries));
      return true;
    } catch (error) {
      console.error('Error saving passport entry:', error);
      return false;
    }
  },

  async getCollectedArtworks(userId: string): Promise<Artwork[]> {
    try {
      const entries = await this.getPassportEntries(userId);
      const collectedIds = entries
        .filter((e) => e.card_collected)
        .map((e) => e.artwork_id);

      return artworksData.filter((a) => collectedIds.includes(a.id)) as Artwork[];
    } catch (error) {
      console.error('Error loading collected artworks:', error);
      return [];
    }
  },

  async getFavoriteArtworks(userId: string): Promise<Artwork[]> {
    try {
      const entries = await this.getPassportEntries(userId);
      const favoriteIds = entries
        .filter((e) => e.favorite)
        .map((e) => e.artwork_id);

      return artworksData.filter((a) => favoriteIds.includes(a.id)) as Artwork[];
    } catch (error) {
      console.error('Error loading favorite artworks:', error);
      return [];
    }
  },

  async getCollectionStats(userId: string): Promise<{
    total: number;
    collected: number;
    common: number;
    rare: number;
    legendary: number;
  }> {
    try {
      const collectedArtworks = await this.getCollectedArtworks(userId);

      return {
        total: artworksData.length,
        collected: collectedArtworks.length,
        common: collectedArtworks.filter((a) => a.rarity === 'common').length,
        rare: collectedArtworks.filter((a) => a.rarity === 'rare').length,
        legendary: collectedArtworks.filter((a) => a.rarity === 'legendary').length,
      };
    } catch (error) {
      console.error('Error calculating collection stats:', error);
      return {
        total: artworksData.length,
        collected: 0,
        common: 0,
        rare: 0,
        legendary: 0,
      };
    }
  },
};
