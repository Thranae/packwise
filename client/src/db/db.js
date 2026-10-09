import Dexie from 'dexie';

// Initialize the database
export const db = new Dexie('VoyageGenieDB');

// Define tables and indexes
db.version(2).stores({
  trips: '_id, destination, startDate, status, isFavorite',
  alerts: '_id, origin, destination, status',
  syncQueue: '++id, endpoint, method, timestamp'
});
