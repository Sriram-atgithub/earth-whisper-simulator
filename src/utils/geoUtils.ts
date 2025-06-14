
// Geographical utilities for region detection
export interface GeographicalRegion {
  name: string;
  type: 'continent' | 'country' | 'state' | 'city';
  continent: string;
  country?: string;
  state?: string;
}

// Simple geographical boundaries (in real implementation, you'd use a proper geo library)
const continentBounds = {
  'North America': { latMin: 15, latMax: 71, lonMin: -168, lonMax: -52 },
  'South America': { latMin: -55, latMax: 13, lonMin: -81, lonMax: -35 },
  'Europe': { latMin: 35, latMax: 71, lonMin: -10, lonMax: 40 },
  'Africa': { latMin: -35, latMax: 37, lonMin: -18, lonMax: 51 },
  'Asia': { latMin: -10, latMax: 77, lonMin: 26, lonMax: 180 },
  'Australia': { latMin: -44, latMax: -10, lonMin: 113, lonMax: 154 },
  'Antarctica': { latMin: -90, latMax: -60, lonMin: -180, lonMax: 180 }
};

const majorCountries = [
  { name: 'United States', continent: 'North America', latMin: 24, latMax: 49, lonMin: -125, lonMax: -66 },
  { name: 'Canada', continent: 'North America', latMin: 42, latMax: 83, lonMin: -141, lonMax: -52 },
  { name: 'Brazil', continent: 'South America', latMin: -34, latMax: 5, lonMin: -74, lonMax: -35 },
  { name: 'Russia', continent: 'Asia', latMin: 41, latMax: 82, lonMin: 19, lonMax: 180 },
  { name: 'China', continent: 'Asia', latMin: 18, latMax: 54, lonMin: 73, lonMax: 135 },
  { name: 'India', continent: 'Asia', latMin: 6, latMax: 37, lonMin: 68, lonMax: 97 },
  { name: 'Australia', continent: 'Australia', latMin: -44, latMax: -10, lonMin: 113, lonMax: 154 },
  { name: 'United Kingdom', continent: 'Europe', latMin: 49, latMax: 61, lonMin: -8, lonMax: 2 },
  { name: 'France', continent: 'Europe', latMin: 41, latMax: 51, lonMin: -5, lonMax: 10 },
  { name: 'Germany', continent: 'Europe', latMin: 47, latMax: 55, lonMin: 6, lonMax: 15 },
  { name: 'Egypt', continent: 'Africa', latMin: 22, latMax: 32, lonMin: 25, lonMax: 35 },
  { name: 'South Africa', continent: 'Africa', latMin: -35, latMax: -22, lonMin: 16, lonMax: 33 }
];

const usStates = [
  { name: 'California', latMin: 32, latMax: 42, lonMin: -124, lonMax: -114 },
  { name: 'Texas', latMin: 25, latMax: 37, lonMin: -107, lonMax: -93 },
  { name: 'Florida', latMin: 24, latMax: 31, lonMin: -87, lonMax: -80 },
  { name: 'New York', latMin: 40, latMax: 45, lonMin: -80, lonMax: -71 },
  { name: 'Alaska', latMin: 54, latMax: 71, lonMin: -180, lonMax: -129 }
];

export const getRegionFromCoordinates = (lat: number, lon: number): GeographicalRegion => {
  // Normalize longitude to -180 to 180 range
  const normalizedLon = ((lon + 180) % 360) - 180;
  
  // Check for US states first (more specific)
  for (const state of usStates) {
    if (lat >= state.latMin && lat <= state.latMax && 
        normalizedLon >= state.lonMin && normalizedLon <= state.lonMax) {
      return {
        name: `${state.name}, United States`,
        type: 'state',
        continent: 'North America',
        country: 'United States',
        state: state.name
      };
    }
  }
  
  // Check for countries
  for (const country of majorCountries) {
    if (lat >= country.latMin && lat <= country.latMax && 
        normalizedLon >= country.lonMin && normalizedLon <= country.lonMax) {
      return {
        name: country.name,
        type: 'country',
        continent: country.continent,
        country: country.name
      };
    }
  }
  
  // Check for continents
  for (const [continent, bounds] of Object.entries(continentBounds)) {
    if (lat >= bounds.latMin && lat <= bounds.latMax && 
        normalizedLon >= bounds.lonMin && normalizedLon <= bounds.lonMax) {
      return {
        name: continent,
        type: 'continent',
        continent: continent
      };
    }
  }
  
  // Default to ocean
  return {
    name: lat > 0 ? 'Northern Ocean' : 'Southern Ocean',
    type: 'continent',
    continent: 'Ocean'
  };
};

export const generateRegionalData = (region: GeographicalRegion, dataType: string) => {
  // Generate realistic data based on region and data type
  const baseValues = {
    temperature: {
      'North America': { base: 8, variance: 25 },
      'South America': { base: 22, variance: 15 },
      'Europe': { base: 6, variance: 20 },
      'Africa': { base: 28, variance: 12 },
      'Asia': { base: 12, variance: 30 },
      'Australia': { base: 20, variance: 18 },
      'Antarctica': { base: -40, variance: 20 },
      'Ocean': { base: 15, variance: 10 }
    },
    precipitation: {
      'North America': { base: 50, variance: 40 },
      'South America': { base: 80, variance: 60 },
      'Europe': { base: 45, variance: 30 },
      'Africa': { base: 30, variance: 50 },
      'Asia': { base: 60, variance: 70 },
      'Australia': { base: 25, variance: 35 },
      'Antarctica': { base: 5, variance: 10 },
      'Ocean': { base: 0, variance: 5 }
    },
    wind: {
      'North America': { base: 15, variance: 20 },
      'South America': { base: 12, variance: 15 },
      'Europe': { base: 18, variance: 25 },
      'Africa': { base: 10, variance: 18 },
      'Asia': { base: 14, variance: 22 },
      'Australia': { base: 16, variance: 20 },
      'Antarctica': { base: 25, variance: 30 },
      'Ocean': { base: 20, variance: 25 }
    }
  };

  const dataSet = baseValues[dataType] || baseValues.temperature;
  const regionData = dataSet[region.continent] || dataSet['Ocean'];
  
  return (regionData.base + (Math.random() - 0.5) * regionData.variance).toFixed(1);
};
