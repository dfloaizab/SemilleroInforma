export function buildLeafletHtml({ center, zoom, markers, tileUrl, attribution }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
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

    // Marcadores iniciales
    renderMarkers(${JSON.stringify(markers)});

    // Notificar clics del mapa a React Native
    map.on('click', function (e) {
      var payload = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ event: 'onMapClicked', payload: payload })
        );
      }
    });

    // Escuchar mensajes desde React Native (para actualizar marcadores)
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