// Datos ficticios (dummy) de arriendos asequibles en Cali, usados solo
// para la prueba de concepto. En producción vendrían del backend.

export const DUMMY_LISTINGS = [
  {
    id: 'l1',
    title: 'Habitación solidaria - San Fernando',
    price: 380000,
    coordinate: { latitude: 3.4276, longitude: -76.5461 },
    description: 'Habitación amoblada, cerca a punto de acopio humanitario.',
  },
  {
    id: 'l2',
    title: 'Apto compartido - Tequendama',
    price: 520000,
    coordinate: { latitude: 3.4372, longitude: -76.5388 },
    description: 'Apto 2 alcobas, acceso fácil a transporte público (MIO).',
  },
  {
    id: 'l3',
    title: 'Casa familiar - El Ingenio',
    price: 650000,
    coordinate: { latitude: 3.3711, longitude: -76.5389 },
    description: 'Casa con patio, arrendador verificado por la red.',
  },
  {
    id: 'l4',
    title: 'Habitación - Terrón Colorado',
    price: 300000,
    coordinate: { latitude: 3.4703, longitude: -76.5599 },
    description: 'Zona alta, ambiente tranquilo, servicios incluidos.',
  },
  {
    id: 'l5',
    title: 'Apartaestudio - Meléndez',
    price: 470000,
    coordinate: { latitude: 3.3745, longitude: -76.5445 },
    description: 'Cerca a la universidad, ideal para persona sola.',
  },
  {
    id: 'l6',
    title: 'Casa temporal - Aguablanca',
    price: 350000,
    coordinate: { latitude: 3.4187, longitude: -76.4899 },
    description: 'Alojamiento temporal de emergencia, corto plazo.',
  },
  {
    id: 'l7',
    title: 'Apto - Ciudad Jardín',
    price: 780000,
    coordinate: { latitude: 3.3583, longitude: -76.5348 },
    description: 'Apto amplio, zona segura, transporte cercano.',
  },
  {
    id: 'l8',
    title: 'Habitación - Valle del Lili',
    price: 420000,
    coordinate: { latitude: 3.3441, longitude: -76.5468 },
    description: 'Cerca a centro de salud, arrendador solidario.',
  },
];

export const CALI_REGION = {
  latitude: 3.4372,
  longitude: -76.5225,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};
