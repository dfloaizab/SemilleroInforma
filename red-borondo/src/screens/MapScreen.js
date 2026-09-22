import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import colors from '../theme/colors';
import { DUMMY_LISTINGS, CALI_REGION } from '../data/dummyListings';
//import { buildLeafletHtml } from '../map/leafletHtml';

//----
function buildLeafletHtml({ center, zoom, markers, tileUrl, attribution }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
    .leaflet-popup-content { margin: 10px 12px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView(
      [${center.lat}, ${center.lng}],
      ${zoom}
    );

    L.tileLayer('${tileUrl}', {
      attribution: '${attribution}',
      maxZoom: 19,
    }).addTo(map);

    var markersLayer = L.layerGroup().addTo(map);

    function clearMarkers() {
      markersLayer.clearLayers();
    }

    function addMarker(m) {
      var icon = L.divIcon({
        html: m.icon,
        className: '',
        iconSize: m.size || [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      });

      var marker = L.marker([m.position.lat, m.position.lng], { icon: icon });
      if (m.popup) {
        marker.bindPopup(m.popup);
      }
      marker.addTo(markersLayer);
    }

    function renderMarkers(list) {
      clearMarkers();
      list.forEach(addMarker);
    }

    renderMarkers(${JSON.stringify(markers)});

    map.on('click', function (e) {
      var payload = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ event: 'onMapClicked', payload: payload })
        );
      }
    });

    function handleMessage(raw) {
      try {
        var msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (msg.type === 'setMarkers') {
          renderMarkers(msg.markers);
        } else if (msg.type === 'setCenter') {
          map.setView([msg.lat, msg.lng], msg.zoom || map.getZoom());
        }
      } catch (e) {}
    }

    document.addEventListener('message', function (e) { handleMessage(e.data); });
    window.addEventListener('message', function (e) { handleMessage(e.data); });

    true;
  </script>
</body>
</html>
  `;
}
//----

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'low', label: '< 400k' },
  { id: 'mid', label: '400k - 700k' },
  { id: 'high', label: '> 700k' },
];

function matchesFilter(price, filterId) {
  if (filterId === 'all') return true;
  if (filterId === 'low') return price < 400000;
  if (filterId === 'mid') return price >= 400000 && price <= 700000;
  if (filterId === 'high') return price > 700000;
  return true;
}

function formatPrice(price) {
  return `$${price.toLocaleString('es-CO')}`;
}

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; OpenStreetMap contributors';

export default function MapScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [candidates, setCandidates] = useState([]);
  const [locating, setLocating] = useState(false);

  const webViewRef = useRef(null);

  const visibleListings = useMemo(
    () => DUMMY_LISTINGS.filter((i) => matchesFilter(i.price, activeFilter)),
    [activeFilter]
  );

  const listingMarkers = useMemo(
    () =>
      visibleListings.map((item) => ({
        id: item.id,
        position: {
          lat: item.coordinate.latitude,
          lng: item.coordinate.longitude,
        },
        icon: `
          <div style="
            width: 32px; height: 32px;
            border-radius: 50% 50% 50% 0;
            background: ${colors.pinListing};
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          ">
            <div style="
              width: 10px; height: 10px;
              background: white; border-radius: 50%;
              position: absolute; left: 8px; top: 8px;
            "></div>
          </div>
        `,
        size: [32, 32],
        popup: `
          <div style="width: 200px; font-family: Arial, sans-serif;">
            <strong style="font-size: 15px; color: #333;">${item.title}</strong>
            <div style="margin-top: 4px; color: ${colors.accentGreen}; font-weight: bold; font-size: 13px;">
              ${formatPrice(item.price)} / mes
            </div>
            <div style="margin-top: 6px; color: #666; font-size: 12px; line-height: 1.4;">
              ${item.description}
            </div>
          </div>
        `,
      })),
    [visibleListings]
  );

  const candidateMarkers = useMemo(
    () =>
      candidates.map((c) => ({
        id: c.id,
        position: {
          lat: c.coordinate.latitude,
          lng: c.coordinate.longitude,
        },
        icon: `
          <div style="
            width: 30px; height: 30px;
            border-radius: 50% 50% 50% 0;
            background: ${colors.pinCandidate};
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          ">
            <div style="
              width: 8px; height: 8px;
              background: white; border-radius: 50%;
              position: absolute; left: 8px; top: 8px;
            "></div>
          </div>
        `,
        size: [30, 30],
        popup: `
          <div style="width: 190px; font-family: Arial, sans-serif;">
            <strong style="font-size: 14px; color: #333;">${c.label}</strong>
            <div style="margin-top: 6px; color: #666; font-size: 12px; line-height: 1.4;">
              Lugar marcado por ti.
            </div>
          </div>
        `,
      })),
    [candidates]
  );

  const allMarkers = useMemo(
    () => [...listingMarkers, ...candidateMarkers],
    [listingMarkers, candidateMarkers]
  );

  // HTML generado una sola vez con el centro y el zoom de Cali.
  // Los marcadores iniciales no importan mucho porque enseguida los
  // enviaremos por postMessage cada vez que cambien.
  const html = useMemo(
    () =>
      buildLeafletHtml({
        center: {
          lat: CALI_REGION.latitude,
          lng: CALI_REGION.longitude,
        },
        zoom: 13,
        markers: [],
        tileUrl: TILE_URL,
        attribution: ATTRIBUTION,
      }),
    []
  );

  // Cada vez que cambian los marcadores, se los mandamos al WebView.
  React.useEffect(() => {
    if (!webViewRef.current) return;
    const message = JSON.stringify({
      type: 'setMarkers',
      markers: allMarkers,
    });
    webViewRef.current.postMessage(message);
  }, [allMarkers]);

  // Manejar mensajes que vienen desde el WebView
  function handleWebViewMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.event === 'onMapClicked') {
        const { lat, lng } = data.payload;
        if (typeof lat !== 'number' || typeof lng !== 'number') return;

        setCandidates((prev) => {
          const nextNumber = prev.length + 1;
          return [
            ...prev,
            {
              id: `c${nextNumber}-${Date.now()}`,
              coordinate: { latitude: lat, longitude: lng },
              label: `Candidato ${nextNumber}`,
            },
          ];
        });
      }
    } catch (e) {
      // Silencioso
    }
  }

  function clearCandidates() {
    if (candidates.length === 0) return;
    Alert.alert(
      'Limpiar candidatos',
      `Se eliminarán ${candidates.length} lugar(es) marcado(s).`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => setCandidates([]),
        },
      ]
    );
  }

  async function goToMyLocation() {
    try {
      setLocating(true);

      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          Alert.alert('Ubicación no disponible', 'Tu navegador no permite la geolocalización.');
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'setCenter',
                lat: latitude,
                lng: longitude,
                zoom: 15,
              })
            );
          },
          () =>
            Alert.alert(
              'No pudimos obtener tu ubicación',
              'Verifica que el navegador tenga permiso para acceder a tu ubicación.'
            ),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
        return;
      }

      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación', 'Activa el permiso de ubicación.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'setCenter',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15,
        })
      );
    } catch (error) {
      console.error(error);
      Alert.alert('No pudimos obtener tu ubicación', 'Inténtalo de nuevo.');
    } finally {
      setLocating(false);
    }
  }

  function recenterOnCali() {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'setCenter',
        lat: CALI_REGION.latitude,
        lng: CALI_REGION.longitude,
        zoom: 13,
      })
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textOnRed} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Arriendos solidarios</Text>
            <Text style={styles.headerSubtitle}>
              Toca el mapa para marcar un candidato
            </Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      <View style={styles.mapArea}>
        <WebView
          ref={webViewRef}
          style={styles.map}
          originWhitelist={['*']}
          source={{ html }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          domStorageEnabled
          // Permitir acceso a ubicación en web
          geolocationEnabled
          // En Android, evita que el fondo sea blanco antes de cargar
          androidLayerType="hardware"
        />

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.pinListing }]} />
            <Text style={styles.legendText}>Arriendo disponible</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.pinCandidate }]} />
            <Text style={styles.legendText}>Tu candidato</Text>
          </View>
        </View>

        <View style={styles.fabColumn}>
          <TouchableOpacity
            style={styles.fab}
            onPress={goToMyLocation}
            disabled={locating}
          >
            <Ionicons
              name={locating ? 'hourglass-outline' : 'locate'}
              size={22}
              color={colors.primaryRed}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} onPress={recenterOnCali}>
            <Ionicons name="map-outline" size={22} color={colors.primaryRed} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fab, styles.fabDanger]}
            onPress={clearCandidates}
          >
            <Ionicons name="trash-outline" size={22} color={colors.textOnRed} />
          </TouchableOpacity>
        </View>

        {candidates.length > 0 && (
          <View style={styles.candidateBadge}>
            <Ionicons name="bookmark" size={14} color={colors.textOnRed} />
            <Text style={styles.candidateBadgeText}>
              {candidates.length} candidato{candidates.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  mapArea: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  headerSafeArea: { backgroundColor: colors.primaryRed },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  iconButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: { color: colors.textOnRed, fontSize: 17, fontWeight: '700' },
  headerSubtitle: { color: colors.textMutedOnRed, fontSize: 11.5, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 14, paddingBottom: 12 },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)', marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.offWhite },
  filterChipText: { color: colors.textOnRed, fontSize: 12.5, fontWeight: '600' },
  filterChipTextActive: { color: colors.primaryRed },
  legend: {
    position: 'absolute', left: 14, bottom: 18,
    backgroundColor: colors.cardBackground,
    borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 11.5, color: colors.textDark },
  fabColumn: { position: 'absolute', right: 14, bottom: 18 },
  fab: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.cardBackground,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  fabDanger: { backgroundColor: colors.primaryRed },
  candidateBadge: {
    position: 'absolute', top: 12, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.accentGreen,
    paddingVertical: 5, paddingHorizontal: 12, borderRadius: 14,
  },
  candidateBadgeText: {
    color: colors.textOnRed, fontSize: 11.5,
    fontWeight: '600', marginLeft: 5,
  },
});