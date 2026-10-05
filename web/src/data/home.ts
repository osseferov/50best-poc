// Mock content lifted verbatim from the static export. Same shape Directus will return.
import type { HomePage } from '../types'

export const home: HomePage = {
  hero: {
    title: 'The 50',
    subtitle: 'Formerly 50 Best, The 50 celebrates and connects the best in global hospitality',
    image: '/assets/restaurant.jpg',
    alt: 'A high-ceilinged dining room laid with white linen and rattan armchairs.',
    cta: { label: 'Find out more', url: '#' },
  },
  explore: [
    { name: 'Restaurants', image: '/assets/restaurant.jpg', alt: 'Dining room set for service with round tables and white linen.', url: '#' },
    { name: 'Bars', image: '/assets/bar.jpg', alt: 'A long copper-topped cocktail bar lit in warm red, lined with stools.', url: '#' },
    { name: 'Hotels', image: '/assets/raffles.jpg', alt: 'The white colonnaded facade of Raffles Hotel, Singapore.', url: '#' },
    { name: 'Vineyards', image: '/assets/vineyard.jpg', alt: 'Rows of grape vines running between cypress trees in Tuscany.', url: '#' },
  ],
  destinations: [
    { id: 'tokyo', name: 'Tokyo', image: '/assets/tokyo.jpg', alt: 'Tokyo at night seen across the city rooftops.', url: '/discovery#cities' },
    { id: 'mexico-city', name: 'Mexico City', image: '/assets/mexico-city.jpg', alt: 'The Angel of Independence monument on Paseo de la Reforma, Mexico City.', url: '/discovery#cities' },
    { id: 'singapore', name: 'Singapore', image: '/assets/singapore.jpg', alt: 'Marina Bay, Singapore, at dusk.', url: '/discovery#cities' },
    { id: 'paris', name: 'Paris', image: '/assets/paris.jpg', alt: 'The Eiffel Tower and Pont Alexandre III lit at night.', url: '/discovery#cities' },
    { id: 'istanbul', name: 'Istanbul', image: '/assets/istanbul.jpg', alt: 'The Bosphorus seen from Galata Tower, Istanbul.', url: '/discovery#cities' },
    { id: 'marrakech', name: 'Marrakech', image: '/assets/marrakech.jpg', alt: 'Jemaa el-Fnaa square in Marrakech at sunset.', url: '/discovery#cities' },
    { id: 'sydney', name: 'Sydney', image: '/assets/sydney.jpg', alt: 'Sydney Opera House and Harbour Bridge at dusk.', url: '/discovery#cities' },
    { id: 'london', name: 'London', image: '/assets/london.jpg', alt: 'The London skyline along the River Thames.', url: '/discovery#cities' },
  ],
  stories: [
    { id: 'story-hall-of-fame', title: 'Hall of fame: every venue that has topped the list', category: 'Features', read_minutes: 8, image: '/assets/restaurant.jpg', alt: 'A formal dining room laid for service.', url: '/stories' },
    { id: 'story-live-fire', title: 'Eight kitchens built around an open flame', category: 'Travel', read_minutes: 6, image: '/assets/mexico-city.jpg', alt: 'Paseo de la Reforma, Mexico City.', url: '/stories' },
    { id: 'story-historic-hotels', title: 'The grand hotels that outlived their century', category: 'Profiles', read_minutes: 9, image: '/assets/mamounia.jpg', alt: 'The garden pool at La Mamounia, Marrakech.', url: '/stories' },
  ],
  films: [
    { id: 'film-bar', title: 'Behind the bar: a night in service', duration: '4 min', image: '/assets/bar.jpg', alt: 'A dimly lit cocktail bar with backlit bottles.', url: '#' },
    { id: 'film-growers', title: 'The growers: one harvest, start to finish', duration: '7 min', image: '/assets/vineyard.jpg', alt: 'Vines running between cypress trees in Tuscany.', url: '#' },
    { id: 'film-taj', title: 'A hotel that has run for 120 years', duration: '9 min', image: '/assets/taj-mahal-palace.jpg', alt: 'The Taj Mahal Palace hotel on the Mumbai waterfront.', url: '#' },
    { id: 'film-cellar', title: 'Cellar work: the slow part of winemaking', duration: '5 min', image: '/assets/wine-cellar.jpg', alt: 'Oak barrels stacked in a winery cellar.', url: '#' },
    { id: 'film-marrakech', title: 'Marrakech: a kitchen inside a garden', duration: '6 min', image: '/assets/mamounia-interior.jpg', alt: 'A tiled interior courtyard at La Mamounia, Marrakech.', url: '#' },
  ],
}
