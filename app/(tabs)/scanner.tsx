import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Scan } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getOrCreateUserId } from '@/lib/storage';
import CardCollectionModal from '@/components/CardCollectionModal';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  epoch: string;
  origin: string;
  rarity: 'common' | 'rare' | 'legendary';
  image_url: string;
  collection: string;
}

export default function ScannerScreen() {
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedArtwork, setScannedArtwork] = useState<Artwork | null>(null);
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    getOrCreateUserId().then(setUserId);
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.iconContainer}>
            <Scan size={40} color="#a67c52" strokeWidth={1.5} />
          </View>
          <Text style={styles.permissionTitle}>Accès à la caméra</Text>
          <Text style={styles.permissionMessage}>
            Pour scanner les œuvres du musée, nous avons besoin d'accéder à votre caméra.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Autoriser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const { data: artwork, error: artworkError } = await supabase
        .from('artworks')
        .select(`
          *,
          collection:collection_id(name_fr)
        `)
        .eq('qr_code', data)
        .single();

      if (artworkError || !artwork) {
        console.error('Artwork not found:', artworkError);
        Alert.alert(
          'Œuvre non trouvée',
          'Le code QR scanné ne correspond à aucune œuvre du musée.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        return;
      }

      const { data: existingEntry } = await supabase
        .from('visitor_passport')
        .select('id, card_collected')
        .eq('user_id', userId)
        .eq('artwork_id', artwork.id)
        .maybeSingle();

      if (existingEntry?.card_collected) {
        router.push(`/artwork/${artwork.id}`);
        setScanned(false);
        return;
      }

      setScannedArtwork({
        ...artwork,
        collection: artwork.collection?.name_fr || '',
      });
      setModalVisible(true);
    } catch (error) {
      console.error('Error scanning artwork:', error);
      setScanned(false);
    }
  };

  const handleCollectCard = async () => {
    if (!scannedArtwork || !userId) return;

    try {
      const { error } = await supabase
        .from('visitor_passport')
        .upsert(
          {
            user_id: userId,
            artwork_id: scannedArtwork.id,
            card_collected: true,
            scanned_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,artwork_id',
          }
        );

      if (error) {
        console.error('Error collecting card:', error);
        return;
      }

      setModalVisible(false);
      setTimeout(() => {
        router.push(`/artwork/${scannedArtwork.id}`);
        setScanned(false);
      }, 300);
    } catch (error) {
      console.error('Error in handleCollectCard:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CardCollectionModal
        visible={modalVisible}
        artwork={scannedArtwork}
        onClose={handleCloseModal}
        onCollect={handleCollectCard}
      />
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Scanner une œuvre</Text>
            <Text style={styles.headerSubtitle}>
              Pointez la caméra vers le code QR
            </Text>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>
                Alignez le code QR dans le cadre
              </Text>
              <Text style={styles.instructionSubtext}>
                Le scan se fera automatiquement
              </Text>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#c9b8a8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 50,
    fontWeight: '300',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#151515',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#252525',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 14,
    color: '#8a7d70',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '300',
  },
  permissionButton: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#a67c52',
    paddingVertical: 16,
    alignItems: 'center',
  },
  permissionButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#c9b8a8',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#c9b8a8',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#c9b8a8',
    borderWidth: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  instructionCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c9b8a8',
    textAlign: 'center',
    marginBottom: 6,
  },
  instructionSubtext: {
    fontSize: 12,
    color: '#8a7d70',
    textAlign: 'center',
    fontWeight: '300',
  },
});
