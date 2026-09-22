import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import colors from '../theme/colors';

function FlagAccent() {
  return (
    <View style={styles.flagAccentWrapper}>
      <View
        style={[
          styles.flagStripe,
          { backgroundColor: colors.accentBlue },
        ]}
      />

      <View
        style={[
          styles.flagStripe,
          { backgroundColor: colors.accentWhite },
        ]}
      />

      <View
        style={[
          styles.flagStripe,
          { backgroundColor: colors.accentGreen },
        ]}
      />

      <View
        style={[
          styles.flagStripe,
          styles.flagStripeThin,
          { backgroundColor: colors.primaryRedLight },
        ]}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[
        colors.primaryRedDark,
        colors.primaryRed,
        colors.primaryRedLight,
      ]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.safeArea}
      >
        {/* Encabezado / marca */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="home"
              size={34}
              color={colors.primaryRed}
            />
          </View>

          <Text style={styles.title}>
            Red Borondo
          </Text>

          <Text style={styles.tagline}>
            Conectando solidaridad, tejiendo hogar
          </Text>

          <FlagAccent />
        </View>

        {/* Mensaje breve de propósito */}
        <View style={styles.messageBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.textOnRed}
            style={{ marginRight: 8 }}
          />

          <Text style={styles.messageText}>
            Conectamos a personas afectadas por el terremoto
            con arrendadores verificados de Cali, de forma
            segura y solidaria.
          </Text>
        </View>

        {/* Acciones principales */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Map')}
          >
            <Ionicons
              name="log-in-outline"
              size={20}
              color={colors.primaryRed}
              style={{ marginRight: 8 }}
            />

            <Text style={styles.primaryButtonText}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Map')}
          >
            <Ionicons
              name="map-outline"
              size={20}
              color={colors.textOnRed}
              style={{ marginRight: 8 }}
            />

            <Text style={styles.secondaryButtonText}>
              Explorar arriendos como invitado
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          Prototipo · Prueba de concepto para inversores y
          equipo de desarrollo
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 36,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textOnRed,
    letterSpacing: 0.5,
  },

  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.textMutedOnRed,
    marginTop: 6,
    textAlign: 'center',
  },

  flagAccentWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    width: 110,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },

  flagStripe: {
    flex: 1,
    height: '100%',
  },

  flagStripeThin: {
    flex: 0.5,
  },

  messageBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
  },

  messageText: {
    flex: 1,
    color: colors.textOnRed,
    fontSize: 13.5,
    lineHeight: 19,
  },

  actions: {
    marginBottom: 12,
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.offWhite,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  primaryButtonText: {
    color: colors.primaryRed,
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.textOnRed,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: colors.textOnRed,
    fontSize: 15,
    fontWeight: '600',
  },

  footerNote: {
    textAlign: 'center',
    color: colors.textMutedOnRed,
    fontSize: 11.5,
    marginBottom: 18,
  },
});