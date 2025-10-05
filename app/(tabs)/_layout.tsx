import { Tabs, Redirect } from 'expo-router';
import { View } from 'react-native';
import {
  Hop as Home,
  Camera,
  Bookmark,
  Compass,
  ShoppingBag,
  QrCode,
} from 'lucide-react-native';
import { useAuth } from '@/lib/authContext';
import { ActivityIndicator } from 'react-native';

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <ActivityIndicator size="large" color="#c9b8a8" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#252525',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#c9b8a8',
        tabBarInactiveTintColor: '#6b5d50',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          tabBarIcon: ({ size, color }) => (
            <Compass size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ size, color }) => (
            <View
              style={{
                position: 'absolute',
                width: 50,
                height: 50,
                borderRadius: 30,
                backgroundColor: '#a67c52bb',
                borderWidth: 2,
                borderColor: '#a67c52',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <QrCode size={24} color="#ffffffff" strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: 'Passeport',
          tabBarIcon: ({ size, color }) => (
            <Bookmark size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="boutique"
        options={{
          title: 'Boutique',
          tabBarIcon: ({ size, color }) => (
            <ShoppingBag size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
