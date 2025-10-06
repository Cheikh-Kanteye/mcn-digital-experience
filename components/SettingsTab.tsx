import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import {
  Settings,
  Bell,
  Globe,
  CreditCard,
  HelpCircle,
  Mail,
  Lock,
  LogOut,
} from 'lucide-react-native';
import { styles } from './styles';

export function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoScan, setAutoScan] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={32} color="#a67c52" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>Paramètres</Text>
          <Text style={styles.headerSubtitle}>
            Personnalisez votre expérience
          </Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#c9b8a8" strokeWidth={1.5} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notifications push</Text>
              <Text style={styles.settingDescription}>
                Recevoir des alertes sur les nouvelles œuvres
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#252525', true: '#a67c52' }}
            thumbColor={notifications ? '#c9b8a8' : '#6b5d50'}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Globe size={20} color="#c9b8a8" strokeWidth={1.5} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Mode sombre</Text>
              <Text style={styles.settingDescription}>
                Thème sombre pour le confort visuel
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#252525', true: '#a67c52' }}
            thumbColor={darkMode ? '#c9b8a8' : '#6b5d50'}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Scanner</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <CreditCard size={20} color="#c9b8a8" strokeWidth={1.5} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Scan automatique</Text>
              <Text style={styles.settingDescription}>
                Détecter automatiquement les QR codes
              </Text>
            </View>
          </View>
          <Switch
            value={autoScan}
            onValueChange={setAutoScan}
            trackColor={{ false: '#252525', true: '#a67c52' }}
            thumbColor={autoScan ? '#c9b8a8' : '#6b5d50'}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.settingMenuItem}>
          <HelpCircle size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.settingMenuText}>Centre d'aide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingMenuItem}>
          <Mail size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.settingMenuText}>Nous contacter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <TouchableOpacity style={styles.settingMenuItem}>
          <Lock size={20} color="#c9b8a8" strokeWidth={1.5} />
          <Text style={styles.settingMenuText}>Confidentialité</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingMenuItem}>
          <LogOut size={20} color="#e74c3c" strokeWidth={1.5} />
          <Text style={[styles.settingMenuText, { color: '#e74c3c' }]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
