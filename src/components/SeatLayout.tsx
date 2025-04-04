import React, { useState } from 'react';
import { useBusStore } from '../store/busStore';
import { Info } from 'lucide-react';

interface Seat {
  id: number;
  number: string;
  status: 'available' | 'booked' | 'selected';
  price: number;
  type: 'window' | 'aisle' | 'middle';
  side: 'left' | 'right';
  deck: 'lower' | 'upper';
}

const SeatLayout = () => {
  const { selectedBus, selectedSeats, selectSeat, deselectSeat } = useBusStore();
  const [selectedDeck, setSelectedDeck] = useState<'lower' | 'upper'>('lower');
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  // Generate a realistic seat layout based on bus type
  const generateSeats = () => {
    const isSleeper = selectedBus?.type.includes('Sleeper');
    const isDoubleDecker = isSleeper;
    const rows = 12; // Standard number of rows
    
    // Create a list of booked seats (randomly)
    const bookedSeats = new Set();
    const totalSeats = rows * 5 * (isDoubleDecker ? 2 : 1); // 5 seats per row (3 + 2)
    const bookedCount = Math.floor(Math.random() * (totalSeats * 0.7));
    
    for (let i = 0; i < bookedCount; i++) {
      bookedSeats.add(Math.floor(Math.random() * totalSeats) + 1);
    }
    
    // Generate seats
    const seats: Seat[] = [];
    let seatId = 1;
    
    // Helper function to generate seats for a deck
    const generateDeckSeats = (deck: 'lower' | 'upper') => {
      for (let row = 1; row <= rows; row++) {
        if (selectedBus?.type.includes('Sleeper')) {
          // Sleeper bus: 2x2 layout
          // Left side (2 seats)
          for (let col = 1; col <= 2; col++) {
            const id = seatId++;
            const seatType = col === 1 ? 'window' : 'aisle'; // First seat is window, second is aisle

            seats.push({
              id,
              number: `${deck === 'upper' ? 'U' : 'L'}${row}${String.fromCharCode(64 + col)}`,
              status: bookedSeats.has(id) ? 'booked' : 'available',
              price: selectedBus?.price || 0,
              type: seatType,
              side: 'left',
              deck
            });
          }

          // Right side (2 seats)
          for (let col = 1; col <= 2; col++) {
            const id = seatId++;
            const seatType = col === 1 ? 'aisle' : 'window'; // First seat is aisle, second is window

            seats.push({
              id,
              number: `${deck === 'upper' ? 'U' : 'L'}${row}${String.fromCharCode(64 + col + 2)}`,
              status: bookedSeats.has(id) ? 'booked' : 'available',
              price: selectedBus?.price || 0,
              type: seatType,
              side: 'right',
              deck
            });
          }
        } else {
          // Seater bus: 3x2 layout
          // Left side (3 seats)
          for (let col = 1; col <= 3; col++) {
            const id = seatId++;
            const seatType = col === 1 ? 'window' : col === 3 ? 'aisle' : 'middle';

            seats.push({
              id,
              number: `${deck === 'upper' ? 'U' : 'L'}${row}${String.fromCharCode(64 + col)}`,
              status: bookedSeats.has(id) ? 'booked' : 'available',
              price: selectedBus?.price || 0,
              type: seatType,
              side: 'left',
              deck
            });
          }

          // Right side (2 seats)
          for (let col = 1; col <= 2; col++) {
            const id = seatId++;
            const seatType = col === 1 ? 'aisle' : 'window';

            seats.push({
              id,
              number: `${deck === 'upper' ? 'U' : 'L'}${row}${String.fromCharCode(64 + col + 3)}`,
              status: bookedSeats.has(id) ? 'booked' : 'available',
              price: selectedBus?.price || 0,
              type: seatType,
              side: 'right',
              deck
            });
          }
        }
      }
    };
    
    // Generate lower deck seats
    generateDeckSeats('lower');
    
    // Generate upper deck if sleeper bus
    if (isDoubleDecker) {
      generateDeckSeats('upper');
    }
    
    return seats;
  };

  const seats = generateSeats();
  const filteredSeats = seats.filter(seat => seat.deck === selectedDeck);
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      deselectSeat(seat.id);
    } else {
      selectSeat(seat);
    }
  };

  const getSeatColor = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    
    if (isSelected) return 'bg-[#2196F3] hover:bg-[#1976D2] text-white';
    if (seat.status === 'booked') return 'bg-[#808080] cursor-not-allowed text-white';
    return 'bg-[#E5E5E5] hover:bg-[#D5D5D5] text-gray-800';
  };

  const renderMiniMap = () => {
    if (!selectedBus) return null;
    return (
      <div className="absolute top-4 right-4 border border-gray-200 rounded-lg p-2 bg-white shadow-lg">
        <div className="text-xs font-medium mb-1">Bus Layout</div>
        <div className="flex gap-2">
          <div className="grid grid-cols-3 gap-[2px]">
            {filteredSeats
              .filter(seat => seat.side === 'left')
              .map((seat) => (
                <div
                  key={`mini-${seat.id}`}
                  className={`w-[6px] h-[6px] rounded-sm ${getSeatColor(seat)}`}
                />
              ))}
          </div>
          <div className="w-[4px]" /> {/* Aisle */}
          <div className="grid grid-cols-2 gap-[2px]">
            {filteredSeats
              .filter(seat => seat.side === 'right')
              .map((seat) => (
                <div
                  key={`mini-${seat.id}`}
                  className={`w-[6px] h-[6px] rounded-sm ${getSeatColor(seat)}`}
                />
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl relative">
      <h3 className="text-xl font-semibold mb-6">Select Your Seats</h3>
      
      {/* Bus info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="font-medium">{selectedBus?.name} - {selectedBus?.type}</p>
        <p className="text-sm text-gray-600">
          {selectedBus?.source} → {selectedBus?.destination} | {selectedBus?.date} | {selectedBus?.departureTime}
        </p>
      </div>
      
      {/* Deck selector for sleeper buses */}
      {selectedBus?.type.includes('Sleeper') && (
        <div className="flex mb-6 border rounded-lg overflow-hidden">
          <button
            onClick={() => setSelectedDeck('lower')}
            className={`flex-1 py-2 text-center ${
              selectedDeck === 'lower' 
                ? 'bg-[#2196F3] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lower Deck
          </button>
          <button
            onClick={() => setSelectedDeck('upper')}
            className={`flex-1 py-2 text-center ${
              selectedDeck === 'upper' 
                ? 'bg-[#2196F3] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upper Deck
          </button>
        </div>
      )}

      {/* Seat layout */}
      <div className="relative">
        {/* Seat layout container */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex gap-8 justify-center">
            {/* Left side (seats) */}
            <div className={`grid grid-cols-${selectedBus?.type.includes('Sleeper') ? '2' : '3'} gap-4`}>
              {filteredSeats
                .filter(seat => seat.side === 'left')
                .map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={seat.status === 'booked'}
                      className={`
                        relative ${selectedBus?.type.includes('Sleeper') ? 'w-8 h-12' : 'w-10 h-10'} 
                        rounded-${selectedBus?.type.includes('Sleeper') ? 'md' : 'lg'} 
                        transition-all duration-200
                        ${getSeatColor(seat)}
                        ${isSelected ? 'ring-2 ring-[#2196F3] ring-offset-2' : ''}
                      `}
                    >
                      <span className="text-xs">{seat.number}</span>

                      {/* Hover tooltip */}
                      {hoveredSeat?.id === seat.id && (
                        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                          <p>Seat: {seat.number}</p>
                          <p>Type: {seat.type}</p>
                          <p>Price: ₹{seat.price}</p>
                          
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Aisle */}
            <div className="w-8 h-full bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500 rotate-90">AISLE</span>
            </div>

            {/* Right side (2 seats) */}
            <div className="grid grid-cols-2 gap-4">
              {filteredSeats
                .filter(seat => seat.side === 'right')
                .map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={seat.status === 'booked'}
                      className={`
                        relative ${selectedBus?.type.includes('Sleeper') ? 'w-8 h-12' : 'w-10 h-10'} 
                        rounded-${selectedBus?.type.includes('Sleeper') ? 'md' : 'lg'} 
                        transition-all duration-200
                        ${getSeatColor(seat)}
                        ${isSelected ? 'ring-2 ring-[#2196F3] ring-offset-2' : ''}
                      `}
                    >
                      <span className="text-xs">{seat.number}</span>
                      
                      {/* Hover tooltip */}
                      {hoveredSeat?.id === seat.id && (
                        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                          <p>Seat: {seat.number}</p>
                          <p>Type: {seat.type}</p>
                          <p>Price: ₹{seat.price}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Mini-map */}
        {renderMiniMap()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#E5E5E5]" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#2196F3]" />
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#808080]" />
            <span className="text-sm">Booked</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Hover over seats to see details
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;