// Mock venue page lifted from the live the50.com/discovery/Establishments/Mexico/Mexico-City/Contramar.html.
import type { Venue, VenuePage } from '../types'

const IMG = 'https://www.the50.com/discovery/filestore/jpg/'
const near = (id: string, name: string, type: Venue['type'], style: string, image: string, gem?: boolean): Venue =>
  ({ id, name, type, city: 'Mexico City', country: 'Mexico', style, image: image && IMG + image, gem, url: '#' })

export const venues: Record<string, VenuePage> = {
  contramar: {
    venue: {
      id: 'contramar',
      name: 'Contramar',
      type: 'Restaurant',
      city: 'Mexico City',
      country: 'Mexico',
      style: 'Iconic seafood cantina',
      image: IMG + 'Contramar-MexicoCity-Mexico-02.jpg',
      url: '/discovery/establishments/contramar',
      gallery: ['02', '03', '01'].map((n) => `${IMG}Contramar-MexicoCity-Mexico-${n}.jpg`),
      description: "<p>Only fish and shellfish caught fresh each day make the cut at Contramar, a Mexico City seafood institution. Covering an array of culinary styles, from Peruvian tiradito to New England–style chowder, chef Gabriela Cámara – who has served as a culinary advisor to a former Mexican president, no less – prepares dishes such as Galicia‑style octopus with paprika and olive oil, sautéed shrimp tacos and whole grilled fish dressed in bright, spicy salsas. Contramar's bright and airy dining room is as unpretentious as it gets, all sun‑washed walls and the soft clatter of plates: a space deliberately designed for the seafood to take centre stage. Weekend lunchtimes pack out here, with locals flocking for the reliably fresh fare. Do not miss the tuna tostada, a favourite of the many return customers.</p>",
      address: 'Durango 200, Cuauhtémoc, Mexico City, 06700',
      map: { lat: 19.4195794, lng: -99.169362 },
      placeId: 'ChIJez8vvy__0YURP0rx5WhEig4',
      price: 'Average price per person $66',
      hours: ['Lunch: Mon – Sun'],
      phone: '52 55 5514 9217',
      website: 'http://www.contramar.com.mx/',
    },
    nearby: [
      near('Rayo', 'Rayo', 'Bar', 'Local spirit champion', 'Rayo_Drink.jpg', true),
      near('Less-Is-More', 'Less Is More', 'Bar', 'Maths meets cocktails', 'LessIsMore_exterior.jpg'),
      near('Lorea', 'Lorea', 'Restaurant', 'Austerity simplicity beauty', 'Lorea-MexcioCity-Mexico-02.jpg'),
      near('Maison-Artemisia', 'Maison Artemisia', 'Bar', 'Absinthe and live music', ''),
      near('Cafe-Tacobar', 'Cafe Tacobar', 'Bar', 'Street tacos and cocktails', 'Cafe_TacoBar_Drink.jpg'),
    ],
  },
}
