import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { CalendarEvent, Persona, EventType, EventStatus } from "../types";

export const calendarService = {
  async addEvent(eventData: Omit<CalendarEvent, "id" | "created_at">) {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        created_at: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "events");
    }
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>) {
    try {
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
    }
  },

  async deleteEvent(id: string) {
    try {
      const docRef = doc(db, "events", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  },
};
