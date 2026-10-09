import { db } from '../db/db';
import api from './api';

class SyncService {
  constructor() {
    this.isSyncing = false;
    
    // Listen for online events to trigger sync automatically
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncService] Network online, processing sync queue...');
        this.processSyncQueue();
      });
    }
  }

  /**
   * Queue an API request to be processed later
   * @param {string} endpoint - The API endpoint (e.g., '/trips/id')
   * @param {string} method - HTTP method ('POST', 'PATCH', 'DELETE', etc)
   * @param {object} payload - The request body data
   */
  async queueSync(endpoint, method, payload) {
    try {
      await db.syncQueue.add({
        endpoint,
        method,
        payload,
        timestamp: Date.now()
      });
      
      // If we're already online, try to process it immediately
      if (navigator.onLine) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error('[SyncService] Failed to add to sync queue:', error);
    }
  }

  /**
   * Process all pending requests in the sync queue sequentially
   */
  async processSyncQueue() {
    if (this.isSyncing || !navigator.onLine) return;
    
    this.isSyncing = true;
    
    try {
      // Get all pending items, oldest first
      const pendingItems = await db.syncQueue.orderBy('timestamp').toArray();
      
      if (pendingItems.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`[SyncService] Processing ${pendingItems.length} queued items...`);

      for (const item of pendingItems) {
        try {
          // Attempt the API call
          await api({
            url: item.endpoint,
            method: item.method,
            data: item.payload
          });
          
          // On success, remove from queue
          await db.syncQueue.delete(item.id);
        } catch (error) {
          // If it's a 4xx error (except 429), it might be a bad request that will never succeed.
          // For safety, we keep it in the queue for 5xx/network errors, but delete for 400/404 to avoid poison pills.
          const status = error.response?.status;
          if (status >= 400 && status < 500 && status !== 429 && status !== 401) {
            console.error(`[SyncService] Request failed with ${status}. Discarding from queue.`, error);
            await db.syncQueue.delete(item.id);
          } else {
            // It's a network error or server error, stop processing queue and wait for next online event
            throw error;
          }
        }
      }
      
      console.log('[SyncService] Sync queue processed successfully.');
    } catch (error) {
      console.warn('[SyncService] Sync queue processing stopped due to error:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}

const syncService = new SyncService();
export default syncService;
