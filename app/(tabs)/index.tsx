import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Camera, Compass, Clock, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AfricanPattern } from '@/components/AfricanPattern';
import { DataService } from '@/lib/dataService';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredArtwork, setFeaturedArtwork] = useState<any>(null);

  useEffect(() => {
    loadFeaturedArtwork();
  }, []);

  const loadFeaturedArtwork = async () => {
    try {
      const data = await DataService.getArtworkByQRCode('MCN001');

      if (data) {
        setFeaturedArtwork(data);
      }
    } catch (error) {
      console.error('Error loading featured artwork:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AfricanPattern variant="mudcloth" opacity={0.05} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Bienvenue au</Text>
            <Text style={styles.museumName}>Musée des</Text>
            <Text style={styles.museumName}>Civilisations Noires</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>
              Explorez l'héritage culturel africain
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/scanner')}>
              <View style={styles.actionIcon}>
                <Camera size={28} color="#a67c52" strokeWidth={1.5} />
              </View>
              <Text style={styles.actionTitle}>Scanner</Text>
              <Text style={styles.actionSubtitle}>une œuvre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/collections')}>
              <View style={styles.actionIcon}>
                <Compass size={28} color="#a67c52" strokeWidth={1.5} />
              </View>
              <Text style={styles.actionTitle}>Explorer</Text>
              <Text style={styles.actionSubtitle}>les collections</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Clock size={20} color="#a67c52" strokeWidth={1.5} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Horaires</Text>
              <Text style={styles.infoText}>Mardi - Dimanche</Text>
              <Text style={styles.infoText}>10h00 - 18h00</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Info size={20} color="#a67c52" strokeWidth={1.5} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>À propos</Text>
              <Text style={styles.infoText}>
                Le MCN célèbre la richesse et la diversité des civilisations africaines à travers les âges.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Œuvre du jour</Text>
          {featuredArtwork && (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => router.push(`/artwork/${featuredArtwork.id}`)}
              activeOpacity={0.9}>
              <Image
                source={{ uri: featuredArtwork.image_url }}
                style={styles.featuredImage}
              />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{featuredArtwork.title}</Text>
                <Text style={styles.featuredOrigin}>
                  {featuredArtwork.origin} • {featuredArtwork.epoch}
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#0a0a0a',
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#6b5d50',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '400',
  },
  museumName: {
    fontSize: 28,
    fontWeight: '300',
    color: '#c9b8a8',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 16,
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#252525',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#c9b8a8',
    marginTop: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b5d50',
    marginTop: 2,
    fontWeight: '300',
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
    flexDirection: 'row',
    gap: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c9b8a8',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#8a7d70',
    lineHeight: 20,
    fontWeight: '300',
  },
  featuredSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  featuredCard: {
    borderRadius: 8,
    overflow: 'hidden',
    height: 240,
    backgroundColor: '#151515',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 4,
  },
  featuredOrigin: {
    fontSize: 12,
    color: '#8a7d70',
    fontWeight: '300',
  },
});
