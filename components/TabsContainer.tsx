import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookmarkCheck, User, Settings } from 'lucide-react-native';
import { styles } from './styles';

interface TabsContainerProps {
  activeTab: 'passport' | 'profile' | 'settings';
  setActiveTab: (tab: 'passport' | 'profile' | 'settings') => void;
}

export function TabsContainer({ activeTab, setActiveTab }: TabsContainerProps) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'passport' && styles.tabActive]}
        onPress={() => setActiveTab('passport')}
        activeOpacity={0.7}
      >
        <BookmarkCheck
          size={20}
          color={activeTab === 'passport' ? '#a67c52' : '#6b5d50'}
          strokeWidth={1.5}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'passport' && styles.tabTextActive,
          ]}
        >
          Passeport
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
        onPress={() => setActiveTab('profile')}
        activeOpacity={0.7}
      >
        <User
          size={20}
          color={activeTab === 'profile' ? '#a67c52' : '#6b5d50'}
          strokeWidth={1.5}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'profile' && styles.tabTextActive,
          ]}
        >
          Profil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
        onPress={() => setActiveTab('settings')}
        activeOpacity={0.7}
      >
        <Settings
          size={20}
          color={activeTab === 'settings' ? '#a67c52' : '#6b5d50'}
          strokeWidth={1.5}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'settings' && styles.tabTextActive,
          ]}
        >
          Paramètres
        </Text>
      </TouchableOpacity>
    </View>
  );
}
