import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusStore } from '../store/busStore';
import SeatLayout from '../components/SeatLayout';
import { ArrowLeft, Calendar, Clock, MapPin, Users, CreditCard, Wallet, Shield, Phone, Mail, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import NeomorphicButton from '../components/NeomorphicButton';
import Checkbox from '../components/Checkbox';
import { useBookingFlow } from '../hooks/useBookingFlow';

interface PassengerDetails {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
  phone: string;
  email: string;
}

interface PaymentDetails {
  method: 'card' | 'upi' | 'wallet' | '';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  walletProvider?: string;
}

const SelectSeats = () => {
  const navigate = useNavigate();
  const { selectedBus, selectedSeats, getTotalFare, createBooking } = useBusStore();
  const [currentStep, setCurrentStep] = useState<'seats' | 'details' | 'payment'>('seats');
  const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: '' });
  const [addInsurance, setAddInsurance] = useState(false);
  const { isProcessing, processBooking } = useBookingFlow();

  useEffect(() => {
    if (!selectedBus) {
      navigate('/search');
    }
  }, [selectedBus, navigate]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    
    if (!updatedPassengers[index]) {
      updatedPassengers[index] = {
        name: '',
        age: 0,
        gender: 'male',
        seatNumber: selectedSeats[index]?.number || '',
        phone: '',
        email: ''
      };
    }
    
    if (field === 'age') {
      updatedPassengers[index] = {
        ...updatedPassengers[index],
        [field]: parseInt(value) || 0
      };
    } else {
      updatedPassengers[index] = {
        ...updatedPassengers[index],
        [field]: value
      };
    }
    
    setPassengers(updatedPassengers);
  };

  const validatePassengerDetails = () => {
    if (passengers.length !== selectedSeats.length) {
      toast.error('Please fill details for all passengers');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    for (const passenger of passengers) {
      if (!passenger.name || passenger.name.trim() === '') {
        toast.error('Please enter name for all passengers');
        return false;
      }
      
      if (!passenger.age || passenger.age < 1) {
        toast.error('Please enter valid age for all passengers');
        return false;
      }
      
      if (!passenger.gender) {
        toast.error('Please select gender for all passengers');
        return false;
      }
      
      if (!passenger.phone || !phoneRegex.test(passenger.phone)) {
        toast.error('Please enter valid phone number for all passengers');
        return false;
      }
      
      if (!passenger.email || !emailRegex.test(passenger.email)) {
        toast.error('Please enter valid email for all passengers');
        return false;
      }
    }
    
    return true;
  };

  const validatePaymentDetails = () => {
    if (!paymentDetails.method) {
      toast.error('Please select a payment method');
      return false;
    }

    if (paymentDetails.method === 'card') {
      const cardNumberRegex = /^\d{16}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^\d{3}$/;

      if (!paymentDetails.cardNumber || !cardNumberRegex.test(paymentDetails.cardNumber)) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!paymentDetails.expiryDate || !expiryRegex.test(paymentDetails.expiryDate)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!paymentDetails.cvv || !cvvRegex.test(paymentDetails.cvv)) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    } else if (paymentDetails.method === 'upi') {
      const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
      if (!paymentDetails.upiId || !upiRegex.test(paymentDetails.upiId)) {
        toast.error('Please enter a valid UPI ID');
        return false;
      }
    } else if (paymentDetails.method === 'wallet') {
      if (!paymentDetails.walletProvider) {
        toast.error('Please select a wallet provider');
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (currentStep === 'seats') {
      if (selectedSeats.length === 0) {
        toast.error('Please select at least one seat to continue');
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (validatePassengerDetails()) {
        setCurrentStep('payment');
      }
    }
  };

  const handlePayment = async () => {
    const success = await processBooking(passengers, paymentDetails);
    if (!success) {
      return;
    }
  };

  const handleInsuranceChange = (checked: boolean) => {
    setAddInsurance(checked);
  };

  const insuranceCost = Math.round(getTotalFare() * 0.02); // 2% of total fare

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/search')}
        className="neo-btn flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search results
      </button>
      
      {/* Progress Steps */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-center">
          {['seats', 'details', 'payment'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep === step ? 'bg-[#06D6A0] text-white' : 
                    index < ['seats', 'details', 'payment'].indexOf(currentStep) ? 'bg-[#06D6A0] text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">
                  {step}
                </span>
              </div>
              {index < 2 && (
                <div className="ml-4 w-16 h-0.5 bg-gray-200">
                  <div className={`h-full bg-[#06D6A0] transition-all ${
                    index < ['seats', 'details', 'payment'].indexOf(currentStep) ? 'w-full' : 'w-0'
                  }`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Bus Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="neo-card mb-6"
      >
        <h2 className="text-2xl font-bold mb-4">{selectedBus?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-gray-600 text-sm">Route</p>
              <p className="font-medium">{selectedBus?.source} → {selectedBus?.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-gray-600 text-sm">Date</p>
              <p className="font-medium">{selectedBus?.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-gray-600 text-sm">Departure</p>
              <p className="font-medium">{selectedBus?.departureTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-gray-600 text-sm">Bus Type</p>
              <p className="font-medium">{selectedBus?.type}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'seats' && <SeatLayout />}
          
          {currentStep === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="neo-card"
            >
              <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
              <div className="space-y-6">
                {selectedSeats.map((seat, index) => (
                  <div key={seat.id} className="neo-card">
                    <p className="font-medium mb-3">Passenger {index + 1} - Seat {seat.number}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={passengers[index]?.name || ''}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="neo-input"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                          type="number"
                          value={passengers[index]?.age || ''}
                          onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                          className="neo-input"
                          placeholder="Enter age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                          value={passengers[index]?.gender || 'male'}
                          onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                          className="neo-select"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={passengers[index]?.phone || ''}
                            onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                            className="neo-input pl-10"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={passengers[index]?.email || ''}
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            className="neo-input pl-10"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="neo-card"
            >
              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Select Payment Method</h4>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 neo-card cursor-pointer transition-colors ${
                      paymentDetails.method === 'card' ? 'border-[#06D6A0] bg-[#06D6A0]/5' : ''
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentDetails.method === 'card'}
                        onChange={() => setPaymentDetails({ method: 'card' })}
                        className="neo-radio"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Pay securely with your card</p>
                      </div>
                    </label>

                    {paymentDetails.method === 'card' && (
                      <div className="ml-7 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            maxLength={16}
                            value={paymentDetails.cardNumber || ''}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                            className="neo-input"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={paymentDetails.expiryDate || ''}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                              className="neo-input"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={paymentDetails.cvv || ''}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                              className="neo-input"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <label className={`flex items-center p-4 neo-card cursor-pointer transition-colors ${
                      paymentDetails.method === 'upi' ? 'border-[#06D6A0] bg-[#06D6A0]/5' : ''
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentDetails.method === 'upi'}
                        onChange={() => setPaymentDetails({ method: 'upi' })}
                        className="neo-radio"
                      />
                      <div className="ml-3">
                        <span className="font-medium">UPI</span>
                        <p className="text-sm text-gray-500 mt-1">Pay using UPI ID</p>
                      </div>
                    </label>

                    {paymentDetails.method === 'upi' && (
                      <div className="ml-7">
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={paymentDetails.upiId || ''}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                          className="neo-input"
                          placeholder="username@upi"
                        />
                      </div>
                    )}

                    <label className={`flex items-center p-4 neo-card cursor-pointer transition-colors ${
                      paymentDetails.method === 'wallet' ? 'border-[#06D6A0] bg-[#06D6A0]/5' : ''
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentDetails.method === 'wallet'}
                        onChange={() => setPaymentDetails({ method: 'wallet' })}
                        className="neo-radio"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Wallet className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">Mobile Wallet</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Pay using mobile wallet</p>
                      </div>
                    </label>

                    {paymentDetails.method === 'wallet' && (
                      <div className="ml-7">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Wallet</label>
                        <select
                          value={paymentDetails.walletProvider || ''}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, walletProvider: e.target.value })}
                          className="neo-select"
                        >
                          <option value="">Select a wallet</option>
                          <option value="paytm">Paytm</option>
                          <option value="phonepe">PhonePe</option>
                          <option value="amazonpay">Amazon Pay</option>
                          <option value="mobikwik">MobiKwik</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium text-blue-900">Secure Payment</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="neo-card sticky top-6"
          >
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Selected Seats</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSeats.map((seat) => (
                    <span key={seat.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                      {seat.number}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Fare</span>
                  <span>₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span>₹{Math.round(selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 0.05)}</span>
                </div>
                
                <div className="my-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Travel Insurance</span>
                    </div>
                    <Checkbox
                      checked={addInsurance}
                      onChange={handleInsuranceChange}
                      className="ml-2"
                    />
                  </div>
                  {addInsurance && (
                    <p className="text-xs text-gray-600 mt-2">
                      Protect your journey against cancellations, delays, and medical emergencies for just ₹{insuranceCost}.
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                  <span>Total Amount</span>
                  <span className="text-[#06D6A0]">₹{getTotalFare() + (addInsurance ? insuranceCost : 0)}</span>
                </div>
              </div>

              {currentStep === 'payment' && (
                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Please verify all details before making the payment
                    </p>
                  </div>
                </div>
              )}
              
              <NeomorphicButton
                onClick={currentStep === 'payment' ? handlePayment : handleContinue}
                disabled={isProcessing}
                className={`
                  w-full
                  ${isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#06D6A0] hover:bg-[#05bf8f]'
                  }
                  text-white
                `}
              >
                {isProcessing ? 'Processing...' : currentStep === 'payment' ? `Pay ₹${getTotalFare() + (addInsurance ? insuranceCost : 0)}` : 'Continue'}
              </NeomorphicButton>
              
              <p className="text-xs text-center text-gray-500">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectSeats;