import Dexie from 'dexie';

// Initialize the database
export const db = new Dexie('VoyageGenieDB');

// Define tables and indexes
db.version(1).stores({
  trips: '_id, destination, startDate, status, isFavorite',
  syncQueue: '++id, type, payload, timestamp'
});
