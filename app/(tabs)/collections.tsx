import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { AfricanPattern } from '@/components/AfricanPattern';

interface Collection {
  id: string;
  name_fr: string;
  description_fr: string;
  theme: string;
  icon: string;
}

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name_fr', { ascending: true });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = (theme: string): string => {
    switch (theme.toLowerCase()) {
      case 'histoire':
        return '#a67c52';
      case 'art':
        return '#9d7147';
      case 'culture':
        return '#8a7d70';
      case 'musique':
        return '#b8905f';
      default:
        return '#a67c52';
    }
  };

  return (
    <View style={styles.container}>
      <AfricanPattern variant="mudcloth" opacity={0.05} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Collections</Text>
          <Text style={styles.headerSubtitle}>
            Explorez les trésors du patrimoine africain
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c9b8a8" />
            <Text style={styles.loadingText}>Chargement des collections...</Text>
          </View>
        ) : (
          <View style={styles.collectionsContainer}>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={styles.collectionCard}>
                <View style={styles.collectionHeader}>
                  <View style={[styles.collectionIconContainer, { borderLeftColor: getThemeColor(collection.theme) }]}>
                    <Text style={styles.collectionIcon}>{collection.icon}</Text>
                  </View>
                  <Text style={styles.collectionTheme}>{collection.theme}</Text>
                </View>
                <Text style={styles.collectionName}>{collection.name_fr}</Text>
                <Text style={styles.collectionDescription} numberOfLines={2}>
                  {collection.description_fr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Visite guidée</Text>
            <Text style={styles.infoText}>
              Suivez un parcours thématique à travers les collections. Chaque œuvre raconte une histoire unique.
            </Text>
          </View>
        </View>
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
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8a7d70',
    lineHeight: 22,
    fontWeight: '300',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#8a7d70',
    fontWeight: '300',
  },
  collectionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  collectionCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  collectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  collectionIcon: {
    fontSize: 20,
  },
  collectionTheme: {
    fontSize: 11,
    color: '#8a7d70',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 8,
  },
  collectionDescription: {
    fontSize: 13,
    color: '#8a7d70',
    lineHeight: 20,
    fontWeight: '300',
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  infoCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#8a7d70',
    lineHeight: 22,
    fontWeight: '300',
  },
});
