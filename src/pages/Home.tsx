import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Bus, Shield,  Star } from 'lucide-react';
import { useBusStore } from '../store/busStore';
import { indianCities, popularRoutes } from '../data/indianCities';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/AnimatedCard';
import ParallaxSection from '../components/ParallaxSection';
import StaggeredList from '../components/StaggeredList';
import NeomorphicButton from '../components/NeomorphicButton';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  const navigate = useNavigate();
  const { setSearchParams, searchBuses } = useBusStore();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sourceDropdown, setSourceDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const [filteredSourceCities, setFilteredSourceCities] = useState<string[]>([]);
  const [filteredDestinationCities, setFilteredDestinationCities] = useState<string[]>([]);

  useEffect(() => {
    if (source) {
      const filtered = indianCities.filter(city => 
        city.toLowerCase().includes(source.toLowerCase())
      ).slice(0, 5);
      setFilteredSourceCities(filtered);
    } else {
      setFilteredSourceCities([]);
    }
  }, [source]);

  useEffect(() => {
    if (destination) {
      const filtered = indianCities.filter(city => 
        city.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 5);
      setFilteredDestinationCities(filtered);
    } else {
      setFilteredDestinationCities([]);
    }
  }, [destination]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source || !destination) {
      alert('Please select both source and destination cities');
      return;
    }
    
    setSearchParams({
      source,
      destination,
      date,
   
    });
    
    searchBuses();
    navigate('/search');
  };

  const handlePopularRouteClick = (from: string, to: string) => {
    setSource(from);
    setDestination(to);
  };

  const features = [
    {
      icon: <Bus className="h-8 w-8 text-[#06D6A0]" />,
      title: "Live Tracking",
      description: "Track your bus in real-time with accurate ETA updates"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#06D6A0]" />,
      title: "Secure Booking",
      description: "Safe and secure payment options with instant confirmation"
    },
    {
      icon: <Star className="h-8 w-8 text-[#06D6A0]" />,
      title: "24/7 Support",
      description: "Round the clock customer service for all your travel needs"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <ParallaxSection className="relative h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://www.lasvegasbussales.com/wp-content/uploads/2020/05/Overnight-Bus-Tips.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Your Journey Begins Here
            </h1>
            <p className="text-xl text-gray-200">
              Book bus tickets easily with just a few clicks
            </p>
          </motion.div>

          {/* Search Form */}
          <AnimatedCard className="max-w-3xl mx-auto" delay={0.3}>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => {
                        setSource(e.target.value);
                        setSourceDropdown(true);
                      }}
                      onFocus={() => setSourceDropdown(true)}
                      className="neo-input pl-10"
                      placeholder="Departure City"
                    />
                    {sourceDropdown && filteredSourceCities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 mt-1 w-full bg-[#e6e9ef] shadow-neo-card rounded-xl overflow-hidden"
                      >
                        {filteredSourceCities.map((city) => (
                          <div
                            key={city}
                            className="px-4 py-2 hover:bg-white/50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSource(city);
                              setSourceDropdown(false);
                            }}
                          >
                            {city}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setDestinationDropdown(true);
                      }}
                      onFocus={() => setDestinationDropdown(true)}
                      className="neo-input pl-10"
                      placeholder="Destination City"
                    />
                    {destinationDropdown && filteredDestinationCities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 mt-1 w-full bg-[#e6e9ef] shadow-neo-card rounded-xl overflow-hidden"
                      >
                        {filteredDestinationCities.map((city) => (
                          <div
                            key={city}
                            className="px-4 py-2 hover:bg-white/50 cursor-pointer transition-colors"
                            onClick={() => {
                              setDestination(city);
                              setDestinationDropdown(false);
                            }}
                          >
                            {city}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="neo-input pl-10"
                    />
                  </div>
                </div>
              </div>

              <NeomorphicButton
                type="submit"
                className="w-full bg-[#06D6A0] text-white hover:bg-[#05bf8f]"
              >
                Search Buses
              </NeomorphicButton>
            </form>

            {/* Popular Routes */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Routes:</h3>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.map((route, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handlePopularRouteClick(route.from, route.to)}
                    className="neo-btn text-xs px-3 py-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {route.from} → {route.to}
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </div>
      </ParallaxSection>

      {/* Features */}
      <div className="py-20 bg-[#e6e9ef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose BusBuddy?
            </h2>
          </ScrollReveal>

          <StaggeredList
            items={features.map((feature, index) => (
              <AnimatedCard
                key={index}
                className="text-center"
                delay={index * 0.1}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 p-4 rounded-full bg-[#e6e9ef] shadow-neo-flat">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;