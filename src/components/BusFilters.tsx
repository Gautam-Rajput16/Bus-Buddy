import React from 'react';
import { useBusStore } from '../store/busStore';
import { getBusTypes, getDepartureTimeSlots } from '../data/indianCities';

const BusFilters = () => {
  const { filters, setFilters, searchBuses, clearFilters } = useBusStore();

  const busTypes = getBusTypes().map(type => type.split(' ')[0]).filter((value, index, self) => self.indexOf(value) === index);
  const departureTimes = ["Morning", "Afternoon", "Evening", "Night"];
  const amenities = ["WiFi", "Charging Point", "Blanket", "Water Bottle", "Reading Light", "Snacks", "TV"];

  const handleTypeChange = (type: string) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter((t) => t !== type)
      : [...filters.type, type];
    setFilters({ type: newTypes });
    searchBuses();
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters({ priceRange: value });
    searchBuses();
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ amenities: newAmenities });
    searchBuses();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={() => {
            clearFilters(); // Reset filters and fetch all buses
          }}
          className="text-sm text-[#06D6A0] hover:text-[#05bf8f]"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Bus Type */}
        <div>
          <h4 className="font-medium mb-2">Bus Type</h4>
          <div className="space-y-2">
            {busTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="rounded text-[#06D6A0] focus:ring-[#06D6A0]"
                />
                <span className="ml-2 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange([filters.priceRange[0], Number(e.target.value)])}
              className="w-full accent-[#06D6A0]"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-medium mb-2">Minimum Rating</h4>
          <select
            value={filters.rating}
            onChange={(e) => {
              setFilters({ rating: Number(e.target.value) });
              searchBuses();
            }}
            className="w-full p-2 border rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
          >
            <option value="0">All Ratings</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>

        {/* Departure Time */}
        <div>
          <h4 className="font-medium mb-2">Departure Time</h4>
          <div className="space-y-2">
            {departureTimes.map((time) => (
              <label key={time} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes(time)}
                  onChange={() => {
                    const newTimes = filters.departureTime.includes(time)
                      ? filters.departureTime.filter((t) => t !== time)
                      : [...filters.departureTime, time];
                    setFilters({ departureTime: newTimes });
                    searchBuses();
                  }}
                  className="rounded text-[#06D6A0] focus:ring-[#06D6A0]"
                />
                <span className="ml-2 text-sm">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-medium mb-2">Amenities</h4>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded text-[#06D6A0] focus:ring-[#06D6A0]"
                />
                <span className="ml-2 text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusFilters;