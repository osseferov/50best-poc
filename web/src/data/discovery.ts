// Mock content lifted verbatim from the static export. Same shape Directus will return.
import type { DiscoveryPage } from '../types'

export const discovery: DiscoveryPage = {
  hero: {
    title: 'Explore the best restaurants, bars, hotels and vineyards around the world',
    subtitle: 'Search by location to discover our expert-approved venues',
    image: 'https://www.the50.com/discovery/filestore/jpg/discovery-header-image-optimised.jpg',
  },
  blocks: [
    {
      type: 'venues', id: 'row-live-fire', label: 'restaurants',
      title: "Editors' picks: Restaurants that cook over live fire best",
      description: 'From wood-fired feasts to expertly grilled plates, these restaurants deliver',
      items: [
        {
          "id": "contramar",
          "name": "Contramar",
          "type": "Restaurant",
          "city": "Mexico City",
          "country": "Mexico",
          "style": "Iconic seafood cantina",
          "image": "https://www.the50.com/discovery/filestore/jpg/Contramar-MexicoCity-Mexico-02.jpg",
          "url": "/discovery/establishments/contramar"
        },
        {
          "id": "hartwood",
          "name": "Hartwood",
          "type": "Restaurant",
          "city": "Tulum",
          "country": "Mexico",
          "style": "Jungle-centric wood-fired Mexican",
          "image": "https://www.the50.com/discovery/filestore/jpg/1HartwoodDiscoDish1.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Mexico/Tulum/Hartwood.html"
        },
        {
          "id": "ekstedt",
          "name": "Ekstedt",
          "type": "Restaurant",
          "city": "Stockholm",
          "country": "Sweden",
          "style": "Fired-up Swedish bites",
          "image": "https://www.the50.com/discovery/filestore/jpg/Ekstedt-Stockholm-Sweden-03.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Sweden/Stockholm/Ekstedt.html"
        },
        {
          "id": "ando",
          "name": "Ando",
          "type": "Restaurant",
          "city": "Hong Kong",
          "country": "China",
          "style": "Spanish roots infused with Japanese creativity",
          "image": "https://www.the50.com/discovery/filestore/jpg/ando-hong-kong%20(1).jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/China/Hong-Kong/Ando.html"
        },
        {
          "id": "lita-marylebone",
          "name": "Lita Marylebone",
          "type": "Restaurant",
          "city": "London",
          "country": "UK",
          "style": "Decorated Basque bistro",
          "image": "https://www.the50.com/discovery/filestore/jpg/LitaMarylebone_interior.jpg",
          "url": "https://www.the50.com/discovery/Establishments/UK/London/Lita-Marylebone.html"
        },
        {
          "id": "elkano",
          "name": "Elkano",
          "type": "Restaurant",
          "city": "Getaria",
          "country": "Spain",
          "style": "World-renowned grilled seafood",
          "image": "https://www.the50.com/discovery/filestore/jpg/Elkano-Getaria-Spain-01.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Spain/Getaria/Elkano.html"
        },
        {
          "id": "burnt-ends",
          "name": "Burnt Ends",
          "type": "Restaurant",
          "city": "Singapore",
          "country": "Singapore",
          "style": "Australian-style barbecue",
          "image": "https://www.the50.com/discovery/filestore/jpg/BurntEnds-Singapore-Singapore-01.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Singapore/Singapore/Burnt-Ends.html"
        },
        {
          "id": "firedoor",
          "name": "Firedoor",
          "type": "Restaurant",
          "city": "Sydney",
          "country": "Australia",
          "style": "Authentic cooking over flames",
          "image": "https://www.the50.com/discovery/filestore/jpg/Firedoor-Sydney-Australia-03.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Australia/Sydney/Firedoor.html"
        }
      ],
    },
    {
      type: 'features', id: 'row-features', title: 'Inspirational Features',
      more: { label: 'View More', url: 'https://www.the50.com/stories/tags/Discovery' },
      items: [
        {
          "id": "ifeat-0",
          "title": "Made in Croatia: three chefs on the country's defining dishes",
          "image": "/assets/istanbul.jpg",
          "author": "Cheryl Cheung",
          "url": "#",
          "label": "Promotional feature"
        },
        {
          "id": "ifeat-1",
          "title": "5 Thanksgiving escapes where everything is handled",
          "image": "/assets/restaurant.jpg",
          "author": "Cheryl Cheung",
          "url": "#"
        },
        {
          "id": "ifeat-2",
          "title": "Inside Cap Juluca: a private cove that has become a Caribbean legend",
          "image": "/assets/mamounia.jpg",
          "author": "Madevi Dailly",
          "url": "#",
          "label": "Promotional feature"
        },
        {
          "id": "ifeat-3",
          "title": "Seafood, saganaki and speakeasies: a hotel concierge’s guide to Sydney",
          "image": "/assets/sydney.jpg",
          "author": "Hannah Brandler",
          "url": "#"
        }
      ],
    },
    {
      type: 'venues', id: 'row-bars', label: 'bars',
      title: 'Bars that experiment with fermantation',
      description: "Whether it's lacto-fermented fruit juices, koji cocktails, or fizzy kombucha, these bars deliver",
      items: [
        {
          "id": "mother",
          "name": "Mother",
          "type": "Bar",
          "city": "Toronto",
          "country": "Canada",
          "style": "Tasty and technically impressive",
          "image": "https://www.the50.com/discovery/filestore/jpg/Mother%20Cocktail%20Bar-Toronto-Canada-1.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Canada/Toronto/Mother.html"
        },
        {
          "id": "nhau-nhau",
          "name": "Nhau Nhau",
          "type": "Bar",
          "city": "Ho Chi Minh City",
          "country": "Vietnam",
          "style": "Nhau drinks no worries",
          "image": "https://www.the50.com/discovery/filestore/jpg/Nhau%20Nhau%20Pho%20Bar-Ho%20Chi%20Minh%20City-Vietnam-1.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Vietnam/Ho-Chi-Minh-City/Nhau-Nhau.html"
        },
        {
          "id": "raa",
          "name": "Raa",
          "type": "Bar",
          "city": "Dikwella",
          "country": "Sri Lanka",
          "style": "Coastal coconut heaven",
          "image": "https://www.the50.com/discovery/filestore/jpg/RaaDrink1.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Sri-Lanka/Dikwella/Raa.html"
        },
        {
          "id": "the-bellwood",
          "name": "The Bellwood",
          "type": "Bar",
          "city": "Tokyo",
          "country": "Japan",
          "style": "Japanese café meets cocktail bar",
          "image": "https://www.the50.com/discovery/filestore/jpg/The_Bellwood_Drink.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Japan/Tokyo/The-Bellwood.html"
        },
        {
          "id": "line",
          "name": "Line",
          "type": "Bar",
          "city": "Athens",
          "country": "Greece",
          "style": "Industrial-chic fermentation bar",
          "image": "https://www.the50.com/discovery/filestore/jpg/Line-wine.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Greece/Athens/Line.html"
        },
        {
          "id": "penicillin",
          "name": "Penicillin",
          "type": "Bar",
          "city": "Hong Kong",
          "country": "China",
          "style": "Waste not want more",
          "image": "https://www.the50.com/discovery/filestore/jpg/Penicillin-HongKong-China-1.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/China/Hong-Kong/Penicillin.html"
        },
        {
          "id": "native",
          "name": "Native",
          "type": "Bar",
          "city": "Singapore",
          "country": "Singapore",
          "style": "Creative Asia-centric concoctions",
          "image": "https://www.the50.com/discovery/filestore/jpg/Native-Singapore-Singapore-02.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Singapore/Singapore/Native.html"
        },
        {
          "id": "bar-us",
          "name": "Bar Us",
          "type": "Bar",
          "city": "Bangkok",
          "country": "Thailand",
          "style": "Temple of forward-thinking techniques",
          "image": "https://www.the50.com/discovery/filestore/jpg/Bar%20Us-drink.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Thailand/Bangkok/Bar-Us.html"
        }
      ],
    },
    {
      type: 'venues', id: 'row-hotels', label: 'hotels',
      title: 'Hotels with historic roots',
      description: 'These storied properties showcase their heritage through striking architecture and world-class hospitality',
      items: [
        {
          "id": "mandarin-oriental-ritz-madrid",
          "name": "Mandarin Oriental Ritz Madrid",
          "type": "Hotel",
          "city": "Madrid",
          "country": "Spain",
          "style": "Revived Madrid matriarch",
          "image": "https://www.the50.com/discovery/filestore/jpg/Mandarin%20Oriental%20Madrid%20-%20restaurant.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Spain/Madrid/Mandarin-Oriental-Ritz-Madrid.html"
        },
        {
          "id": "raffles-singapore",
          "name": "Raffles Singapore",
          "type": "Hotel",
          "city": "Singapore",
          "country": "Singapore",
          "style": "Historic Singapore revitalised",
          "image": "https://www.the50.com/discovery/filestore/jpg/Raffles%20Singapore%20-%20accommodation.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Singapore/Singapore/Raffles-Singapore.html"
        },
        {
          "id": "la-mamounia",
          "name": "La Mamounia",
          "type": "Hotel",
          "city": "Marrakech",
          "country": "Morocco",
          "style": "Historic Moroccan hospitality",
          "image": "https://www.the50.com/discovery/filestore/jpg/La%20Mamounia%20-%20restaurant.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Morocco/Marrakech/La-Mamounia.html"
        },
        {
          "id": "palacio-nazarenas-a-belmond-hotel-cusco",
          "name": "Palacio Nazarenas, A Belmond Hotel, Cusco",
          "type": "Hotel",
          "city": "Cusco",
          "country": "Peru",
          "style": "Incan heritage meets modenity",
          "image": "https://www.the50.com/discovery/filestore/jpg/Palacio%20Nazarenas_room.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Peru/Cusco/Palacio-Nazarenas-A-Belmond-Hotel-Cusco.html"
        },
        {
          "id": "bulgari-roma",
          "name": "Bulgari Roma",
          "type": "Hotel",
          "city": "Rome",
          "country": "Italy",
          "style": "A Roman jewel",
          "image": "https://www.the50.com/discovery/filestore/jpg/Bulgari%20Roma_exterior1.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Italy/Rome/Bulgari-Roma.html"
        },
        {
          "id": "taj-mahal-palace-mumbai",
          "name": "Taj Mahal Palace, Mumbai",
          "type": "Hotel",
          "city": "Mumbai",
          "country": "India",
          "style": "Old-fashioned grandeur",
          "image": "https://www.the50.com/discovery/filestore/jpg/Taj%20Mahal%20Palace_exterior.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/India/Mumbai/Taj-Mahal-Palace-Mumbai.html"
        },
        {
          "id": "mount-nelson",
          "name": "Mount Nelson",
          "type": "Hotel",
          "city": "Cape Town",
          "country": "South Africa",
          "style": "Cape Town’s pink lady",
          "image": "https://www.the50.com/discovery/filestore/jpg/2024%20The%20Mount%20Nelson%20Hotel_Exteriors_6%20(1).jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/South-Africa/Cape-Town/Mount-Nelson.html"
        }
      ],
    },
    { type: 'destinations', id: 'row-cities', label: 'cities', title: 'City spotlight', items: [
        {
          "id": "singapore",
          "name": "Singapore",
          "description": "Cocktails and cuisine in the City State",
          "image": "/assets/singapore.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=Singapore"
        },
        {
          "id": "tokyo",
          "name": "Tokyo",
          "description": "Ancient and modern dining and drinking",
          "image": "/assets/tokyo.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Tokyo&country=Japan"
        },
        {
          "id": "sydney",
          "name": "Sydney",
          "description": "Harbour beauty, outdoor living",
          "image": "/assets/sydney.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Sydney&country=Australia"
        },
        {
          "id": "mexico-city",
          "name": "Mexico City",
          "description": "Bustling capital built on Aztec ruins",
          "image": "/assets/mexico-city.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Mexico+City&country=Mexico"
        },
        {
          "id": "marrakech",
          "name": "Marrakech",
          "description": "Desert gateway with ancient souks",
          "image": "/assets/marrakech.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Marrakech&country=Morocco"
        },
        {
          "id": "new-york",
          "name": "New York",
          "description": "The city that never sleeps",
          "image": "/assets/vineyard.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=New+York&country=US"
        },
        {
          "id": "dubrovnik",
          "name": "Dubrovnik",
          "description": "Croatia's gastronomic capital",
          "image": "/assets/restaurant.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Dubrovnik&country=Croatia"
        },
        {
          "id": "seoul",
          "name": "Seoul",
          "description": "Fast-paced innovation meets timeless tradition",
          "image": "/assets/bar.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Seoul&country=South+Korea"
        },
        {
          "id": "paris",
          "name": "Paris",
          "description": "The best of the City of Lights",
          "image": "/assets/paris.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Paris&country=France"
        },
        {
          "id": "london",
          "name": "London",
          "description": "A city of boundless culinary variety",
          "image": "/assets/london.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=London&country=UK"
        },
        {
          "id": "istanbul",
          "name": "Istanbul",
          "description": "The only global capital straddling two continents",
          "image": "/assets/istanbul.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Istanbul&country=Turkey"
        },
        {
          "id": "los-angeles",
          "name": "Los Angeles",
          "description": "Eat and drink among the glitterati",
          "image": "/assets/vineyard.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Los+Angeles&country=US"
        },
        {
          "id": "vancouver",
          "name": "Vancouver",
          "description": "Culinary star power in the City of Glass",
          "image": "/assets/restaurant.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Vancouver&country=Canada"
        },
        {
          "id": "madrid",
          "name": "Madrid",
          "description": "Spain's beating heart",
          "image": "/assets/bar.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?town=Madrid&country=Spain"
        }
      ] },
    { type: 'destinations', id: 'row-wine-destinations', label: 'regions', title: 'Wine destinations', items: [
        {
          "id": "france",
          "name": "France",
          "description": "Timeless, elegant, terroir-driven",
          "image": "/assets/paris.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=France"
        },
        {
          "id": "italy",
          "name": "Italy",
          "description": "Lively, regional and full of personality",
          "image": "/assets/vineyard.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=Italy"
        },
        {
          "id": "spain",
          "name": "Spain",
          "description": "Earthy, slow-aged and quietly confident",
          "image": "/assets/ritz-madrid.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=Spain"
        },
        {
          "id": "australia",
          "name": "Australia",
          "description": "Sunny and generous with a modern edge",
          "image": "/assets/sydney.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=Australia"
        },
        {
          "id": "new-zealand",
          "name": "New Zealand",
          "description": "Fresh and zesty: for intensely aromatic wines",
          "image": "/assets/vineyard.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=New+Zealand"
        },
        {
          "id": "usa",
          "name": "USA",
          "description": "Ambitious and innovative",
          "image": "/assets/wine-cellar.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=United+States"
        },
        {
          "id": "portugal",
          "name": "Portugal",
          "description": "Old-school roots with punchy flavours",
          "image": "/assets/wine-cellar.jpg",
          "url": "https://www.the50.com/discovery/search-results.html?country=Portugal"
        }
      ] },
    {
      type: 'promos', id: 'collection-signup',
      collection: {
        title: 'Hotels with racquet sports',
        text: 'From tennis surrounded by the Swiss Alps to padel in an Indonesian jungle, these hotel courts are destinations in their own right',
        image: 'https://www.the50.com/discovery/filestore/jpg/discotenniscourt0508.jpg',
        url: 'https://www.the50.com/discovery/collection/Hotels%20with%20racquet%20sports',
      },
      signup: {
        title: 'Sign up to The 50',
        text: 'Receive our weekly newsletter, save venues and create shortlists to share with a friend',
        image: '/assets/bar.jpg',
      },
    },
    {
      type: 'venues', id: 'row-vineyards', label: 'vineyards',
      title: 'Off-the-beaten-track vineyards',
      description: 'World-class producers in less obvious regions',
      items: [
        {
          "id": "98wines",
          "name": "98Wines",
          "type": "Vineyard",
          "city": "Japan",
          "country": "Japan",
          "style": "Views of Mt. Fuji",
          "image": "/assets/vineyard.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Japan/Yamanashi/98Wines.html"
        },
        {
          "id": "bodega-garz-n",
          "name": "Bodega Garzón",
          "type": "Vineyard",
          "city": "Maldonado",
          "country": "Uruguay",
          "style": "Uruguayan style and smoke",
          "image": "https://www.the50.com/discovery/filestore/jpg/BodegaGarz%C3%B3n_TerraceView%20620%20x%20349px.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Uruguay/Maldonado/Bodega-Garz%C3%B3n.html"
        },
        {
          "id": "ch-teau-mercian-mariko-winery",
          "name": "Château Mercian Mariko Winery",
          "type": "Vineyard",
          "city": "Nagano",
          "country": "Japan",
          "style": "Tasting Japanese history",
          "image": "https://www.the50.com/discovery/filestore/jpg/CHM18_08_BB_Philosophy%20TEASER-620x349.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Japan/Nagano/Ch%C3%A2teau-Mercian-Mariko-Winery.html"
        },
        {
          "id": "ch-teau-mukhrani",
          "name": "Château Mukhrani",
          "type": "Vineyard",
          "city": "Mukhrani",
          "country": "Georgia",
          "style": "Georgia’s vinous nobility",
          "image": "https://www.the50.com/discovery/filestore/jpg/_MG_4455%20620%20x%20349px.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Georgia/Mukhrani/Ch%C3%A2teau-Mukhrani.html"
        },
        {
          "id": "bodega-bouza",
          "name": "Bodega Bouza",
          "type": "Vineyard",
          "city": "Montevideo",
          "country": "Uruguay",
          "style": "Vintage automobiles framing modern wines",
          "image": "https://www.the50.com/discovery/filestore/jpg/acceso%20620%20x%20349px.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Uruguay/Montevideo/Bodega-Bouza.html"
        },
        {
          "id": "ch-teau-buera",
          "name": "Château Buera",
          "type": "Vineyard",
          "city": "Kakheti",
          "country": "Georgia",
          "style": "Lakeside Georgian wine retreat",
          "image": "https://www.the50.com/discovery/filestore/jpg/ChBuera1.jpg",
          "gem": true,
          "url": "https://www.the50.com/discovery/Establishments/Georgia/Kakheti/Ch%C3%A2teau-Buera.html"
        },
        {
          "id": "movia",
          "name": "Movia",
          "type": "Vineyard",
          "city": "Brda",
          "country": "Slovenia",
          "style": "Pure terroir expression",
          "image": "https://www.the50.com/discovery/filestore/jpg/Movia%20image%202%20620%20x%20349.jpg",
          "url": "https://www.the50.com/discovery/Establishments/Slovenia/Brda/Movia.html"
        }
      ],
    },
  ],
}
