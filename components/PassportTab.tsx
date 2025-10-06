import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  BookmarkCheck,
  Heart,
  Calendar,
  CreditCard,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { AfricanPattern } from '@/components/AfricanPattern';
import { DataService } from '@/lib/dataService';
import { useAuth } from '@/lib/authContext';

interface VisitedArtwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  scanned_at: string;
  favorite: boolean;
}

interface PassportTabProps {
  visitedArtworks: VisitedArtwork[];
  loading: boolean;
  stats: {
    total: number;
    collected: number;
    common: number;
    rare: number;
    legendary: number;
  };
  toggleFavorite: (artworkId: string) => void;
}

export function PassportTab({
  visitedArtworks,
  loading,
  stats,
  toggleFavorite,
}: PassportTabProps) {
  const { user } = useAuth();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <BookmarkCheck size={32} color="#a67c52" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>Mon Passeport</Text>
          <Text style={styles.headerSubtitle}>
            Votre voyage à travers les civilisations
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.collected}</Text>
            <Text style={styles.statLabel}>Œuvres</Text>
            <Text style={styles.statLabel}>collectées</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {visitedArtworks.filter((a) => a.favorite).length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.legendary}</Text>
            <Text style={styles.statLabel}>Légendaires</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/collected-cards')}
          activeOpacity={0.8}
        >
          <CreditCard size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.actionButtonText}>
            Voir mes cartes collectées
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.artworksContainer}>
        <Text style={styles.sectionTitle}>Œuvres collectées</Text>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#c9b8a8" />
            <Text style={styles.emptyTitle}>Chargement...</Text>
          </View>
        ) : visitedArtworks.length === 0 ? (
          <View style={styles.emptyState}>
            <BookmarkCheck size={48} color="#8a7d70" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucune œuvre scannée</Text>
            <Text style={styles.emptyText}>
              Scannez votre première œuvre pour commencer votre voyage culturel
            </Text>
          </View>
        ) : (
          <View style={styles.artworksList}>
            {visitedArtworks.map((artwork) => (
              <TouchableOpacity
                key={artwork.id}
                style={styles.artworkCard}
                onPress={() => router.push(`/artwork/${artwork.id}`)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: artwork.image_url }}
                  style={styles.artworkImage}
                />
                <View style={styles.artworkInfo}>
                  <View style={styles.artworkHeader}>
                    <View style={styles.artworkTitleContainer}>
                      <Text style={styles.artworkTitle} numberOfLines={1}>
                        {artwork.title}
                      </Text>
                      <Text style={styles.artworkArtist} numberOfLines={1}>
                        {artwork.artist}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(artwork.id);
                      }}
                    >
                      <Heart
                        size={18}
                        color={artwork.favorite ? '#a67c52' : '#6b5d50'}
                        fill={artwork.favorite ? '#a67c52' : 'transparent'}
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.artworkFooter}>
                    <View style={styles.dateContainer}>
                      <Calendar size={12} color="#6b5d50" strokeWidth={1.5} />
                      <Text style={styles.dateText}>
                        {formatDate(artwork.scanned_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.shareSection}>
        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>Partagez votre parcours</Text>
          <Text style={styles.shareText}>
            Créez une carte visuelle élégante de vos découvertes et partagez-la
            avec vos proches
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Créer une carte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
