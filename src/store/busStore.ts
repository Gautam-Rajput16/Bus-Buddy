import { create } from 'zustand';
import { format } from 'date-fns';
import { generateMockBuses } from '../data/indianCities';

interface Bus {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  departureTime: string;
  arrivalTime: string;
  source: string;
  destination: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  departureCategory: string;
  duration: string;
  amenities: string[];
}

interface Seat {
  id: number;
  number: string;
  status: 'available' | 'booked' | 'selected';
  price: number;
  type?: 'window' | 'aisle' | 'middle';
  deck?: 'upper' | 'lower';
}

interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

interface Booking {
  id: string;
  busId: number;
  busName: string;
  busType: string;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  passengers: Passenger[];
  totalFare: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface BusStore {
  buses: Bus[];
  selectedBus: Bus | null;
  selectedSeats: Seat[];
  bookings: Booking[];
  filters: {
    type: string[];
    priceRange: [number, number];
    rating: number;
    departureTime: string[];
    amenities: string[];
  };
  searchParams: {
    source: string;
    destination: string;
    date: string;
    passengers: number;
  };
  setSearchParams: (params: Partial<BusStore['searchParams']>) => void;
  setFilters: (filters: Partial<BusStore['filters']>) => void;
  searchBuses: () => void;
  selectBus: (bus: Bus) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: number) => void;
  getTotalFare: () => number;
  resetSelection: () => void;
  clearFilters: () => void;
  sortBuses: (sortBy: 'price' | 'departure' | 'duration' | 'rating') => void;
  createBooking: (passengers: Passenger[]) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
}

export const useBusStore = create<BusStore>((set, get) => ({
  buses: [],
  selectedBus: null,
  selectedSeats: [],
  bookings: [],
  filters: {
    type: [],
    priceRange: [0, 5000],
    rating: 0,
    departureTime: [],
    amenities: []
  },
  searchParams: {
    source: '',
    destination: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  searchBuses: () => {
    const { searchParams, filters } = get();
    
    if (!searchParams.source || !searchParams.destination || !searchParams.date) {
      return;
    }
    
    // Generate mock buses based on search parameters
    const mockBuses = generateMockBuses(
      searchParams.source,
      searchParams.destination,
      searchParams.date
    );
    
    // Apply filters
    let filteredBuses = [...mockBuses];
    
    // Filter by bus type
    if (filters.type.length > 0) {
      filteredBuses = filteredBuses.filter((bus) => 
        filters.type.some(type => bus.type.includes(type))
      );
    }
    
    // Filter by rating
    if (filters.rating > 0) {
      filteredBuses = filteredBuses.filter((bus) => bus.rating >= filters.rating);
    }
    
    // Filter by departure time
    if (filters.departureTime.length > 0) {
      filteredBuses = filteredBuses.filter((bus) =>
        filters.departureTime.includes(bus.departureCategory)
      );
    }
    
    // Filter by price range
    filteredBuses = filteredBuses.filter(
      (bus) => bus.price >= filters.priceRange[0] && bus.price <= filters.priceRange[1]
    );
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      filteredBuses = filteredBuses.filter((bus) =>
        filters.amenities.every(amenity => bus.amenities.includes(amenity))
      );
    }
    
    set({ buses: filteredBuses });
  },
  selectBus: (bus) => set({ selectedBus: bus }),
  selectSeat: (seat) =>
    set((state) => ({
      selectedSeats: [...state.selectedSeats, { ...seat, status: 'selected' }],
    })),
  deselectSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((seat) => seat.id !== seatId),
    })),
  getTotalFare: () => {
    const { selectedSeats, searchParams } = get();
    const baseFare = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    // Add service fee (5% of base fare)
    const serviceFee = Math.round(baseFare * 0.05);
    return baseFare + serviceFee;
  },
  resetSelection: () => set({ selectedBus: null, selectedSeats: [] }),
  clearFilters: () => {
    set((state) => ({
      filters: {
        type: [],
        priceRange: [0, 5000],
        rating: 0,
        departureTime: [],
        amenities: [],
      },
    }));
    const { searchParams } = get(); // Get the current search parameters
    const mockBuses = generateMockBuses(
      searchParams.source,
      searchParams.destination,
      searchParams.date
    ); // Generate all buses based on search parameters
    set({ buses: mockBuses }); // Reset the bus list to show all buses
  },
  sortBuses: (sortBy) => {
    const { buses } = get();
    let sortedBuses = [...buses];
    
    switch (sortBy) {
      case 'price':
        sortedBuses.sort((a, b) => a.price - b.price);
        break;
      case 'departure':
        sortedBuses.sort((a, b) => {
          const timeA = parseInt(a.departureTime.replace(':', ''));
          const timeB = parseInt(b.departureTime.replace(':', ''));
          return timeA - timeB;
        });
        break;
      case 'duration':
        sortedBuses.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]);
          const durationB = parseInt(b.duration.split('h')[0]);
          return durationA - durationB;
        });
        break;
      case 'rating':
        sortedBuses.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    set({ buses: sortedBuses });
  },
  createBooking: (passengers) => {
    const { selectedBus, selectedSeats, getTotalFare } = get();
    
    if (!selectedBus || selectedSeats.length === 0) {
      return;
    }
    
    const newBooking: Booking = {
      id: `BK${Date.now().toString().slice(-8)}`,
      busId: selectedBus.id,
      busName: selectedBus.name,
      busType: selectedBus.type,
      source: selectedBus.source,
      destination: selectedBus.destination,
      date: selectedBus.date,
      departureTime: selectedBus.departureTime,
      arrivalTime: selectedBus.arrivalTime,
      seats: selectedSeats.map(seat => seat.number),
      passengers,
      totalFare: getTotalFare(),
      bookingDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'confirmed'
    };
    
    set((state) => ({
      bookings: [...state.bookings, newBooking],
      selectedBus: null,
      selectedSeats: []
    }));
    
    return newBooking;
  },
  cancelBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    }));
  },
  getBookingById: (bookingId) => {
    const { bookings } = get();
    return bookings.find(booking => booking.id === bookingId);
  }
}));