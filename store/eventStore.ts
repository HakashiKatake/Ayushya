import { create } from 'zustand';

export interface Event {
  _id: string;
  caseId: string;
  timestamp: string;
  type: string;
  source: 'USER' | 'SYSTEM' | 'SIMULATOR';
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface EventStore {
  events: Event[];
  filteredEvents: Event[];
  selectedEventTypes: string[];
  loading: boolean;
  
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  setSelectedEventTypes: (types: string[]) => void;
  filterEvents: () => void;
  setLoading: (loading: boolean) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  filteredEvents: [],
  selectedEventTypes: [],
  loading: false,
  
  setEvents: (events) => {
    set({ events });
    get().filterEvents();
  },
  
  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
    get().filterEvents();
  },
  
  setSelectedEventTypes: (types) => {
    set({ selectedEventTypes: types });
    get().filterEvents();
  },
  
  filterEvents: () => {
    const { events, selectedEventTypes } = get();
    if (selectedEventTypes.length === 0) {
      set({ filteredEvents: events });
    } else {
      set({
        filteredEvents: events.filter((event) =>
          selectedEventTypes.includes(event.type)
        ),
      });
    }
  },
  
  setLoading: (loading) => set({ loading }),
}));
