const fs = require('fs');

const cities = [
  { city: 'Santorini', country: 'GREECE', id: '1613395877344-13d4a8e0d49e' },
  { city: 'Kyoto', country: 'JAPAN', id: '1493976040381-81b634081220' },
  { city: 'Swiss Alps', country: 'SWITZERLAND', id: '1531366936331-5039324bf8b5' },
  { city: 'Cinque Terre', country: 'ITALY', id: '1499678329028-101435549a4e' },
  { city: 'Bora Bora', country: 'FRENCH POLYNESIA', id: '1582042858913-79eb538c8b41' },
  { city: 'Paris', country: 'FRANCE', id: '1502602898657-3e91760cbb34' },
  { city: 'Machu Picchu', country: 'PERU', id: '1526392060635-c1fbe07448d0' },
  { city: 'Dubai', country: 'UAE', id: '1512453979798-5ea266f8880c' },
  { city: 'New York City', country: 'USA', id: '1496442226666-8d4d0e62e6e9' },
  { city: 'London', country: 'UK', id: '1513635269975-5969336acd79' },
  { city: 'Lake Tahoe', country: 'USA', id: '1503177119275-0aa32b3a9368' },
  { city: 'Amsterdam', country: 'NETHERLANDS', id: '1512461947265-5c1798363c4e' },
  { city: 'Banff', country: 'CANADA', id: '1534063231149-5e7e0a6d0c75' },
  { city: 'Venice', country: 'ITALY', id: '1514890547357-a9ee288728e0' },
  { city: 'Sydney', country: 'AUSTRALIA', id: '1506973035872-a4ec16b8e8d9' },
  { city: 'Istanbul', country: 'TURKEY', id: '1524231757712-2d5612173155' },
  { city: 'Rio de Janeiro', country: 'BRAZIL', id: '1483729558449-99ef09a8c325' },
  { city: 'Taj Mahal', country: 'INDIA', id: '1524492412937-b28074a5d7da' },
  { city: 'Patagonia', country: 'ARGENTINA', id: '1520630767352-71cbe5a864e4' },
  { city: 'Maldives', country: 'MALDIVES', id: '1514282401024-a4f66a2cb1f2' },
  { city: 'Bali', country: 'INDONESIA', id: '1537996194471-e657df975ab4' },
  { city: 'Yellowstone', country: 'USA', id: '1494589252033-f54f7a78ce00' },
  { city: 'Grand Canyon', country: 'USA', id: '1474044159687-1ee9f24b0873' },
  { city: 'Seoul', country: 'SOUTH KOREA', id: '1517154421773-05b82a740922' },
  { city: 'Cape Town', country: 'SOUTH AFRICA', id: '1580060839134-75a5ed5c9a96' },
  { city: 'Barcelona', country: 'SPAIN', id: '1539037116271-8b43825700e1' },
  { city: 'Rome', country: 'ITALY', id: '1552832231267-31034f54d6fa' },
  { city: 'Prague', country: 'CZECH REPUBLIC', id: '1541845157-a6d2d6e511eb' },
  { city: 'Vienna', country: 'AUSTRIA', id: '1516550893868-659f7d23f39a' },
  { city: 'Budapest', country: 'HUNGARY', id: '1549428512-eb7934be9f89' },
  { city: 'Lisbon', country: 'PORTUGAL', id: '1558233043-41dc393fdfbb' },
  { city: 'Singapore', country: 'SINGAPORE', id: '1525625293386-3f8f99389eba' },
  { city: 'Hong Kong', country: 'HONG KONG', id: '1507525428034-b723cf961d3e' },
  { city: 'Tokyo', country: 'JAPAN', id: '1503899036067-e5917f69ee73' },
  { city: 'Reykjavik', country: 'ICELAND', id: '1476610582234-a15d0fa8b61e' },
  { city: 'Edinburgh', country: 'UK', id: '1533157545468-b78b546e33de' }
];

let items = [];
// Generate 144 items by repeating
for (let i = 0; i < 4; i++) {
  items = items.concat(cities.map(c => ({
    url: "https://images.unsplash.com/photo-" + c.id + "?auto=format&fit=crop&w=1080&q=80",
    city: c.city,
    country: c.country
  })));
}

const content = "export const SLIDESHOW_IMAGES = " + JSON.stringify(items, null, 2) + ";\n";
fs.writeFileSync('d:/packwise/client/src/constants/slideshowImages.js', content);
