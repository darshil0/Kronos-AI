import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CalendarEvent, Persona, EventType, EventStatus } from '../types';

export const calendarService = {
  async addEvent(eventData: Omit<CalendarEvent, 'id' | 'created_at'>) {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        created_at: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>) {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
    }
  },

  async deleteEvent(id: string) {
    try {
      const docRef = doc(db, 'events', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  },

  async fetchNearbyEvents(userId: string, startTime: string) {
    try {
      const start = new Date(startTime);
      const dayStart = new Date(start);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(start);
      dayEnd.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'events'),
        where('user_id', '==', userId),
        where('start_time', '>=', dayStart.toISOString()),
        where('start_time', '<=', dayEnd.toISOString())
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'events');
      return [];
    }
  }
};
