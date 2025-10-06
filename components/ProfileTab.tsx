import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BookmarkCheck,
  Heart,
  Calendar,
  CreditCard,
  User,
  Share2,
  Mail,
  Lock,
} from 'lucide-react-native';
import { useAuth } from '@/lib/authContext';
import { styles } from './styles';

interface VisitedArtwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  scanned_at: string;
  favorite: boolean;
}

interface ProfileTabProps {
  visitedArtworks: VisitedArtwork[];
  stats: {
    total: number;
    collected: number;
    common: number;
    rare: number;
    legendary: number;
  };
}

export function ProfileTab({ visitedArtworks, stats }: ProfileTabProps) {
  const { user } = useAuth();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileAvatar}>
            <User size={48} color="#a67c52" strokeWidth={1.5} />
          </View>
          <Text style={styles.headerTitle}>
            {user?.email?.split('@')[0] || 'Visiteur'}
          </Text>
          <Text style={styles.headerSubtitle}>{user?.email || ''}</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.profileStatsGrid}>
          <View style={styles.profileStatCard}>
            <BookmarkCheck size={24} color="#a67c52" strokeWidth={1.5} />
            <Text style={styles.profileStatNumber}>{stats.collected}</Text>
            <Text style={styles.profileStatLabel}>Œuvres scannées</Text>
          </View>
          <View style={styles.profileStatCard}>
            <Heart size={24} color="#a67c52" strokeWidth={1.5} />
            <Text style={styles.profileStatNumber}>
              {visitedArtworks.filter((a) => a.favorite).length}
            </Text>
            <Text style={styles.profileStatLabel}>Favorites</Text>
          </View>
          <View style={styles.profileStatCard}>
            <CreditCard size={24} color="#a67c52" strokeWidth={1.5} />
            <Text style={styles.profileStatNumber}>{stats.legendary}</Text>
            <Text style={styles.profileStatLabel}>Cartes rares</Text>
          </View>
          <View style={styles.profileStatCard}>
            <Calendar size={24} color="#a67c52" strokeWidth={1.5} />
            <Text style={styles.profileStatNumber}>
              {visitedArtworks.length > 0
                ? Math.ceil(
                    (Date.now() -
                      new Date(
                        visitedArtworks[visitedArtworks.length - 1].scanned_at
                      ).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0}
            </Text>
            <Text style={styles.profileStatLabel}>Jours actifs</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Badges & Réalisations</Text>
        <View style={styles.badgesContainer}>
          <View style={styles.badgeCard}>
            <View style={styles.badgeIcon}>
              <BookmarkCheck size={24} color="#a67c52" strokeWidth={1.5} />
            </View>
            <Text style={styles.badgeTitle}>Explorateur</Text>
            <Text style={styles.badgeDescription}>Première œuvre scannée</Text>
          </View>
          <View style={[styles.badgeCard, styles.badgeCardLocked]}>
            <View style={[styles.badgeIcon, styles.badgeIconLocked]}>
              <Lock size={24} color="#6b5d50" strokeWidth={1.5} />
            </View>
            <Text style={styles.badgeTitle}>Collectionneur</Text>
            <Text style={styles.badgeDescription}>Scanner 10 œuvres</Text>
          </View>
          <View style={[styles.badgeCard, styles.badgeCardLocked]}>
            <View style={[styles.badgeIcon, styles.badgeIconLocked]}>
              <Lock size={24} color="#6b5d50" strokeWidth={1.5} />
            </View>
            <Text style={styles.badgeTitle}>Expert</Text>
            <Text style={styles.badgeDescription}>Scanner 50 œuvres</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Share2 size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.profileMenuText}>Partager mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Mail size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.profileMenuText}>Modifier l'email</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
