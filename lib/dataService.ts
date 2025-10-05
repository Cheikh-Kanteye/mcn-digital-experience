import { supabase } from './supabase';
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
    const { data, error } = await supabase.from('artworks').select('*');
    if (error) {
      console.error('Error fetching artworks:', error);
      return [];
    }
    return data as Artwork[];
  },

  async getArtworkById(id: string): Promise<Artwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching artwork by id:', error);
      return null;
    }
    return data as Artwork;
  },

  async getArtworkByQRCode(qrCode: string): Promise<Artwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    if (error) {
      console.error('Error fetching artwork by QR code:', error);
      return null;
    }
    return data as Artwork;
  },

  async getArtworkWithCollection(id: string): Promise<any> {
    const artwork = await this.getArtworkById(id);
    if (!artwork) return null;

    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', artwork.collection_id)
      .single();
    if (error) {
      console.error('Error fetching collection:', error);
      return { ...artwork, collection: null };
    }

    return {
      ...artwork,
      collection: collection || null,
    };
  },

  async getArtworkWithCollectionByQRCode(qrCode: string): Promise<any> {
    const artwork = await this.getArtworkByQRCode(qrCode);
    if (!artwork) return null;

    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', artwork.collection_id)
      .single();
    if (error) {
      console.error('Error fetching collection:', error);
      return { ...artwork, collection: null };
    }

    return {
      ...artwork,
      collection: collection || null,
    };
  },

  async getAllCollections(): Promise<Collection[]> {
    const { data, error } = await supabase.from('collections').select('*');
    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
    return data as Collection[];
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching collection by id:', error);
      return null;
    }
    return data as Collection;
  },

  async getArtworksByCollectionId(collectionId: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('collection_id', collectionId);
    if (error) {
      console.error('Error fetching artworks by collection id:', error);
      return [];
    }
    return data as Artwork[];
  },

  async getPassportEntries(userId: string): Promise<PassportEntry[]> {
    try {
      const { data, error } = await supabase
        .from('visitor_passport')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        console.error('Error loading passport entries:', error);
        return [];
      }
      return data as PassportEntry[];
    } catch (error) {
      console.error('Error loading passport entries:', error);
      return [];
    }
  },

  async getPassportEntry(
    userId: string,
    artworkId: string
  ): Promise<PassportEntry | null> {
    try {
      const { data, error } = await supabase
        .from('visitor_passport')
        .select('*')
        .eq('user_id', userId)
        .eq('artwork_id', artworkId);
      if (error) {
        console.error('Error loading passport entry:', error);
        return null;
      }
      return data && data.length > 0 ? (data[0] as PassportEntry) : null;
    } catch (error) {
      console.error('Error loading passport entry:', error);
      return null;
    }
  },

  async addOrUpdatePassportEntry(
    entry: Omit<PassportEntry, 'id'>
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('visitor_passport')
        .upsert(entry, { onConflict: 'user_id,artwork_id' });
      if (error) {
        console.error('Error saving passport entry:', error);
        return false;
      }
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
      if (collectedIds.length === 0) return [];

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .in('id', collectedIds);
      if (error) {
        console.error('Error loading collected artworks:', error);
        return [];
      }
      return data as Artwork[];
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
      if (favoriteIds.length === 0) return [];

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .in('id', favoriteIds);
      if (error) {
        console.error('Error loading favorite artworks:', error);
        return [];
      }
      return data as Artwork[];
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
      const { data: allArtworks, error } = await supabase
        .from('artworks')
        .select('id, rarity');
      if (error) {
        console.error('Error fetching all artworks for stats:', error);
        return {
          total: 0,
          collected: 0,
          common: 0,
          rare: 0,
          legendary: 0,
        };
      }

      return {
        total: allArtworks.length,
        collected: collectedArtworks.length,
        common: collectedArtworks.filter((a) => a.rarity === 'common').length,
        rare: collectedArtworks.filter((a) => a.rarity === 'rare').length,
        legendary: collectedArtworks.filter((a) => a.rarity === 'legendary')
          .length,
      };
    } catch (error) {
      console.error('Error calculating collection stats:', error);
      return {
        total: 0,
        collected: 0,
        common: 0,
        rare: 0,
        legendary: 0,
      };
    }
  },
};
