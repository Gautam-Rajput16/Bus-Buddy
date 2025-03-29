import React, { useState } from 'react';
import { useBusStore } from '../store/busStore';
import { Calendar, Clock, MapPin, User, Ticket, AlertTriangle, CheckCircle, XCircle, Share2 } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { downloadTicketPDF } from '../utils/pdfGenerator';
import ShareTicket from '../components/ShareTicket';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const { bookings, cancelBooking } = useBusStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [sharingBooking, setSharingBooking] = useState<any | null>(null);

  const displayedBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = parseISO(booking.date);
    const isUpcoming = isAfter(bookingDate, today) && booking.status === 'confirmed';
    const isCompleted = !isAfter(bookingDate, today) && booking.status !== 'cancelled';
    
    switch (filter) {
      case 'upcoming':
        return isUpcoming;
      case 'completed':
        return isCompleted;
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  const toggleExpandBooking = (bookingId: string) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const handleDownloadTicket = (booking: any) => {
    try {
      downloadTicketPDF(booking);
      toast.success('Ticket downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download ticket. Please try again.');
    }
  };

  const handleShareTicket = (booking: any) => {
    setSharingBooking(booking);
  };

  const getStatusBadge = (status: string, date: string) => {
    const bookingDate = parseISO(date);
    const today = new Date();
    const isCompleted = !isAfter(bookingDate, today) && status !== 'cancelled';
    
    if (status === 'cancelled') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <XCircle className="h-3 w-3" /> Cancelled
      </span>;
    } else if (isCompleted) {
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle className="h-3 w-3" /> Completed
      </span>;
    } else {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <Ticket className="h-3 w-3" /> Confirmed
      </span>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        My Bookings
      </motion.h1>
      
      {/* Filter tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="neo-card p-2 mb-6 flex rounded-xl overflow-hidden"
      >
        {['all', 'upcoming', 'completed', 'cancelled'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as any)}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
              filter === filterType
                ? 'neo-btn-pressed bg-[#06D6A0] text-white'
                : 'neo-btn text-gray-600 hover:text-gray-900'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </motion.div>
      
      {/* No bookings message */}
      {displayedBookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="neo-card text-center p-8"
        >
          <div className="flex justify-center mb-4">
            <Ticket className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? "You haven't made any bookings yet." 
              : `You don't have any ${filter} bookings.`}
          </p>
          <Link 
            to="/" 
            className="neo-btn inline-flex items-center px-4 py-2 text-white bg-[#06D6A0] hover:bg-[#05bf8f]"
          >
            Book a Bus
          </Link>
        </motion.div>
      )}
      
      {/* Bookings list */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {displayedBookings.map((booking) => (
          <motion.div
            key={booking.id}
            variants={itemVariants}
            className="neo-card overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            {/* Booking header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{booking.source} to {booking.destination}</h3>
                    {getStatusBadge(booking.status, booking.date)}
                  </div>
                  <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpandBooking(booking.id)}
                    className="neo-btn text-sm text-[#06D6A0] hover:text-[#05bf8f] px-3 py-1"
                  >
                    {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {booking.status === 'confirmed' && isAfter(parseISO(booking.date), new Date()) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="neo-btn text-sm text-red-600 hover:text-red-800 px-3 py-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Basic booking info */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Travel Date</p>
                    <p className="font-medium">{format(parseISO(booking.date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Departure Time</p>
                    <p className="font-medium">{booking.departureTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Bus Type</p>
                    <p className="font-medium">{booking.busName} - {booking.busType}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedBooking === booking.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-gray-50 border-t border-gray-100"
              >
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Journey Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#06D6A0]"></div>
                        <div className="w-0.5 h-10 bg-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                      <div>
                        <div>
                          <p className="font-medium">{booking.source}</p>
                          <p className="text-xs text-gray-500">{booking.departureTime}, {format(parseISO(booking.date), 'dd MMM yyyy')}</p>
                        </div>
                        <div className="mt-4">
                          <p className="font-medium">{booking.destination}</p>
                          <p className="text-xs text-gray-500">{booking.arrivalTime}, {format(parseISO(booking.date), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Seats: {booking.seats.join(', ')}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Fare: ₹{booking.totalFare}</p>
                      <p className="text-sm text-gray-600 mt-1">Booking Date: {format(parseISO(booking.bookingDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Passenger Details</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seat
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {booking.passengers.map((passenger, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {passenger.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {passenger.age}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {passenger.seatNumber}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Cancellation policy */}
                {booking.status === 'confirmed' && (
                  <div className="mt-4 p-3 neo-card bg-yellow-50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Cancellation Policy</p>
                        <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                          <li>Cancel before 24 hours of departure: 75% refund</li>
                          <li>Cancel between 12-24 hours of departure: 50% refund</li>
                          <li>Cancel less than 12 hours before departure: No refund</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ticket actions */}
                {booking.status === 'confirmed' && (
                  <div className="mt-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleShareTicket(booking)}
                      className="neo-btn flex items-center px-4 py-2 text-gray-700"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button 
                      onClick={() => handleDownloadTicket(booking)}
                      className="neo-btn flex items-center px-4 py-2 text-white bg-[#06D6A0] hover:bg-[#05bf8f]"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Download Ticket
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Share Ticket Modal */}
      {sharingBooking && (
        <ShareTicket 
          booking={sharingBooking} 
          onClose={() => setSharingBooking(null)} 
        />
      )}
    </div>
  );
};

export default MyBookings;