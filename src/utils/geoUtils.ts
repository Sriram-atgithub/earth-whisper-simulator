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
  { name: 'Russia', continent: 'Europe', latMin: 41, latMax: 82, lonMin: 19, lonMax: 180 },
  { name: 'China', continent: 'Asia', latMin: 18, latMax: 54, lonMin: 73, lonMax: 135 },
  { name: 'India', continent: 'Asia', latMin: 6, latMax: 37, lonMin: 68, lonMax: 97 },
  { name: 'Australia', continent: 'Australia', latMin: -44, latMax: -10, lonMin: 113, lonMax: 154 },
  { name: 'United Kingdom', continent: 'Europe', latMin: 49, latMax: 61, lonMin: -8, lonMax: 2 },
  { name: 'France', continent: 'Europe', latMin: 41, latMax: 51, lonMin: -5, lonMax: 10 },
  { name: 'Germany', continent: 'Europe', latMin: 47, latMax: 55, lonMin: 6, lonMax: 15 },
  { name: 'Egypt', continent: 'Africa', latMin: 22, latMax: 32, lonMin: 25, lonMax: 35 },
  { name: 'South Africa', continent: 'Africa', latMin: -35, latMax: -22, lonMin: 16, lonMax: 33 }
];

// Major states/provinces for each continent (example groups)
const usStates = [
  { name: 'California', latMin: 32, latMax: 42, lonMin: -124, lonMax: -114 },
  { name: 'Texas', latMin: 25, latMax: 37, lonMin: -107, lonMax: -93 },
  { name: 'Florida', latMin: 24, latMax: 31, lonMin: -87, lonMax: -80 },
  { name: 'New York', latMin: 40, latMax: 45, lonMin: -80, lonMax: -71 },
  { name: 'Alaska', latMin: 54, latMax: 71, lonMin: -180, lonMax: -129 }
];

const canadaProvinces = [
  { name: 'Ontario', latMin: 41.5, latMax: 56.9, lonMin: -95, lonMax: -74 },
  { name: 'Quebec', latMin: 45, latMax: 62, lonMin: -80, lonMax: -57 },
  { name: 'British Columbia', latMin: 48, latMax: 60, lonMin: -140, lonMax: -113 },
  { name: 'Alberta', latMin: 49, latMax: 60, lonMin: -120, lonMax: -110 }
];

const brazilStates = [
  { name: 'Sao Paulo', latMin: -25, latMax: -19, lonMin: -53, lonMax: -44 },
  { name: 'Rio de Janeiro', latMin: -23.5, latMax: -20.7, lonMin: -44.5, lonMax: -40.9 }
];

const indiaStates = [
  { name: 'Maharashtra', latMin: 15.6, latMax: 22.1, lonMin: 72.6, lonMax: 80.9 },
  { name: 'Uttar Pradesh', latMin: 23.9, latMax: 28.6, lonMin: 77, lonMax: 84.7 }
];

const chinaProvinces = [
  { name: 'Guangdong', latMin: 20, latMax: 25.7, lonMin: 109, lonMax: 117 },
  { name: 'Sichuan', latMin: 26, latMax: 34, lonMin: 97, lonMax: 108 }
];

const russiaFederalSubjects = [
  { name: 'Moscow Oblast', latMin: 54.2, latMax: 56.7, lonMin: 36, lonMax: 40 },
  { name: 'Krasnoyarsk Krai', latMin: 52, latMax: 74, lonMin: 80, lonMax: 113 }
];

const ukCountries = [
  { name: 'England', latMin: 50, latMax: 55.8, lonMin: -6, lonMax: 2 },
  { name: 'Scotland', latMin: 54.5, latMax: 60.8, lonMin: -8, lonMax: -1 }
];

const germanyStates = [
  { name: 'Bavaria', latMin: 47, latMax: 50.6, lonMin: 9.5, lonMax: 13.8 },
  { name: 'North Rhine-Westphalia', latMin: 50.3, latMax: 52.5, lonMin: 5.8, lonMax: 9 }
];

const franceRegions = [
  { name: 'Île-de-France', latMin: 48, latMax: 49.2, lonMin: 1.5, lonMax: 3.8 },
  { name: 'Provence-Alpes-Côte d\'Azur', latMin: 43, latMax: 45.2, lonMin: 4, lonMax: 7.7 }
];

const australiaStates = [
  { name: 'New South Wales', latMin: -37, latMax: -28, lonMin: 141, lonMax: 154 },
  { name: 'Queensland', latMin: -29, latMax: -10, lonMin: 138, lonMax: 154 }
];

const southAfricaProvinces = [
  { name: 'Western Cape', latMin: -34.9, latMax: -31.5, lonMin: 17.2, lonMax: 25.5 },
  { name: 'Gauteng', latMin: -26.8, latMax: -25.2, lonMin: 27.3, lonMax: 28.7 }
];

// Add more if desired...

export const getRegionFromCoordinates = (lat: number, lon: number): GeographicalRegion => {
  // Normalize longitude to -180 to 180 range
  const normalizedLon = ((lon + 180) % 360) - 180;

  // Check North America (US, Canada)
  for (const state of usStates) {
    if (
      lat >= state.latMin && lat <= state.latMax &&
      normalizedLon >= state.lonMin && normalizedLon <= state.lonMax
    ) {
      return {
        name: `${state.name}, United States`,
        type: 'state',
        continent: 'North America',
        country: 'United States',
        state: state.name
      };
    }
  }
  for (const prov of canadaProvinces) {
    if (
      lat >= prov.latMin && lat <= prov.latMax &&
      normalizedLon >= prov.lonMin && normalizedLon <= prov.lonMax
    ) {
      return {
        name: `${prov.name}, Canada`,
        type: 'state',
        continent: 'North America',
        country: 'Canada',
        state: prov.name
      };
    }
  }

  // South America
  for (const state of brazilStates) {
    if (
      lat >= state.latMin && lat <= state.latMax &&
      normalizedLon >= state.lonMin && normalizedLon <= state.lonMax
    ) {
      return {
        name: `${state.name}, Brazil`,
        type: 'state',
        continent: 'South America',
        country: 'Brazil',
        state: state.name
      };
    }
  }

  // Europe (Russia, UK, France, Germany)
  for (const subj of russiaFederalSubjects) {
    if (
      lat >= subj.latMin && lat <= subj.latMax &&
      normalizedLon >= subj.lonMin && normalizedLon <= subj.lonMax
    ) {
      return {
        name: `${subj.name}, Russia`,
        type: 'state',
        continent: 'Europe',
        country: 'Russia',
        state: subj.name
      };
    }
  }
  for (const country of ukCountries) {
    if (
      lat >= country.latMin && lat <= country.latMax &&
      normalizedLon >= country.lonMin && normalizedLon <= country.lonMax
    ) {
      return {
        name: `${country.name}, United Kingdom`,
        type: 'state',
        continent: 'Europe',
        country: 'United Kingdom',
        state: country.name
      };
    }
  }
  for (const state of germanyStates) {
    if (
      lat >= state.latMin && lat <= state.latMax &&
      normalizedLon >= state.lonMin && normalizedLon <= state.lonMax
    ) {
      return {
        name: `${state.name}, Germany`,
        type: 'state',
        continent: 'Europe',
        country: 'Germany',
        state: state.name
      };
    }
  }
  for (const region of franceRegions) {
    if (
      lat >= region.latMin && lat <= region.latMax &&
      normalizedLon >= region.lonMin && normalizedLon <= region.lonMax
    ) {
      return {
        name: `${region.name}, France`,
        type: 'state',
        continent: 'Europe',
        country: 'France',
        state: region.name
      };
    }
  }

  // Africa (Egypt, South Africa)
  for (const province of southAfricaProvinces) {
    if (
      lat >= province.latMin && lat <= province.latMax &&
      normalizedLon >= province.lonMin && normalizedLon <= province.lonMax
    ) {
      return {
        name: `${province.name}, South Africa`,
        type: 'state',
        continent: 'Africa',
        country: 'South Africa',
        state: province.name
      };
    }
  }

  // Asia (India, China)
  for (const state of indiaStates) {
    if (
      lat >= state.latMin && lat <= state.latMax &&
      normalizedLon >= state.lonMin && normalizedLon <= state.lonMax
    ) {
      return {
        name: `${state.name}, India`,
        type: 'state',
        continent: 'Asia',
        country: 'India',
        state: state.name
      };
    }
  }
  for (const prov of chinaProvinces) {
    if (
      lat >= prov.latMin && lat <= prov.latMax &&
      normalizedLon >= prov.lonMin && normalizedLon <= prov.lonMax
    ) {
      return {
        name: `${prov.name}, China`,
        type: 'state',
        continent: 'Asia',
        country: 'China',
        state: prov.name
      };
    }
  }

  // Australia (major states)
  for (const state of australiaStates) {
    if (
      lat >= state.latMin && lat <= state.latMax &&
      normalizedLon >= state.lonMin && normalizedLon <= state.lonMax
    ) {
      return {
        name: `${state.name}, Australia`,
        type: 'state',
        continent: 'Australia',
        country: 'Australia',
        state: state.name
      };
    }
  }

  // Countries (if not found as state)
  for (const country of majorCountries) {
    if (
      lat >= country.latMin && lat <= country.latMax &&
      normalizedLon >= country.lonMin && normalizedLon <= country.lonMax
    ) {
      return {
        name: country.name,
        type: 'country',
        continent: country.continent,
        country: country.name
      };
    }
  }

  // Continents
  for (const [continent, bounds] of Object.entries(continentBounds)) {
    if (
      lat >= bounds.latMin && lat <= bounds.latMax &&
      normalizedLon >= bounds.lonMin && normalizedLon <= bounds.lonMax
    ) {
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
