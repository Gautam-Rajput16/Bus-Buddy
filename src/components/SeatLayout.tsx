import React, { useState } from 'react';
import { useBusStore } from '../store/busStore';

const SeatLayout = () => {
  const { selectedBus, selectedSeats, selectSeat, deselectSeat } = useBusStore();
  const [selectedDeck, setSelectedDeck] = useState<'lower' | 'upper'>('lower');

  // Generate a realistic seat layout based on bus type
  const generateSeats = () => {
    const isSleeper = selectedBus?.type.includes('Sleeper');
    const isDoubleDecker = isSleeper;
    
    // For sleeper buses, we'll have fewer seats but they're larger
    const seatsPerRow = isSleeper ? 2 : 3;
    const rows = isSleeper ? 10 : 13;
    
    // Create a list of booked seats (randomly)
    const bookedSeats = new Set();
    const totalSeats = rows * seatsPerRow * (isDoubleDecker ? 2 : 1);
    const bookedCount = Math.floor(Math.random() * (totalSeats * 0.7));
    
    for (let i = 0; i < bookedCount; i++) {
      bookedSeats.add(Math.floor(Math.random() * totalSeats) + 1);
    }
    
    // Generate seats
    const seats = [];
    let seatId = 1;
    
    // Generate for lower deck
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        const id = seatId++;
        const seatType = col === 1 ? 'window' : col === seatsPerRow ? 'window' : 'aisle';
        
        seats.push({
          id,
          number: `L${row}${String.fromCharCode(64 + col)}`,
          status: bookedSeats.has(id) ? 'booked' : 'available',
          price: selectedBus?.price || 0,
          type: seatType,
          deck: 'lower'
        });
      }
    }
    
    // Generate for upper deck if sleeper
    if (isDoubleDecker) {
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= seatsPerRow; col++) {
          const id = seatId++;
          const seatType = col === 1 ? 'window' : col === seatsPerRow ? 'window' : 'aisle';
          
          seats.push({
            id,
            number: `U${row}${String.fromCharCode(64 + col)}`,
            status: bookedSeats.has(id) ? 'booked' : 'available',
            price: selectedBus?.price || 0,
            type: seatType,
            deck: 'upper'
          });
        }
      }
    }
    
    return seats;
  };

  const seats = generateSeats();
  const filteredSeats = seats.filter(seat => seat.deck === selectedDeck);
  
  const isSleeper = selectedBus?.type.includes('Sleeper');
  const seatsPerRow = isSleeper ? 2 : 3;

  const handleSeatClick = (seat: typeof seats[0]) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      deselectSeat(seat.id);
    } else {
      selectSeat(seat);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Select Your Seats</h3>
      
      {/* Bus info */}
      <div className="mb-6 p-3 bg-gray-50 rounded-md">
        <p className="font-medium">{selectedBus?.name} - {selectedBus?.type}</p>
        <p className="text-sm text-gray-600">
          {selectedBus?.source} → {selectedBus?.destination} | {selectedBus?.date} | {selectedBus?.departureTime}
        </p>
      </div>
      
      {/* Deck selector for sleeper buses */}
      {isSleeper && (
        <div className="flex mb-4 border rounded-md overflow-hidden">
          <button
            onClick={() => setSelectedDeck('lower')}
            className={`flex-1 py-2 text-center ${
              selectedDeck === 'lower' 
                ? 'bg-[#06D6A0] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Lower Deck
          </button>
          <button
            onClick={() => setSelectedDeck('upper')}
            className={`flex-1 py-2 text-center ${
              selectedDeck === 'upper' 
                ? 'bg-[#06D6A0] text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Upper Deck
          </button>
        </div>
      )}
      
      {/* Driver indicator */}
      <div className="flex justify-end mb-2">
        <div className="bg-gray-200 rounded-md p-2 text-xs text-center w-16">
          Driver
        </div>
      </div>
      
      {/* Seat layout */}
      <div className="border border-gray-300 rounded-md p-4 mb-6">
        <div className={`grid grid-cols-${seatsPerRow} gap-2`} style={{ gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)` }}>
          {filteredSeats.map((seat) => {
            const isSelected = selectedSeats.some((s) => s.id === seat.id);
            const status = isSelected ? 'selected' : seat.status;
            
            return (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                disabled={status === 'booked'}
                className={`
                  p-2 rounded-md text-sm font-medium transition-colors relative
                  ${
                    status === 'available'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : status === 'booked'
                      ? 'bg-red-100 text-red-800 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }
                  ${isSleeper ? 'h-16' : 'h-10'}
                `}
              >
                <span className="absolute top-1 left-1 text-xs">{seat.number}</span>
                {isSleeper && <span className="absolute bottom-1 right-1 text-xs">₹{seat.price}</span>}
                {!isSleeper && <span className="absolute top-1 right-1 text-xs">₹{seat.price}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Selected: {selectedSeats.length}</p>
          <p className="font-semibold">
            Total: ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;