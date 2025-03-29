import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBusStore } from '../store/busStore';

interface BookingValidation {
  isValid: boolean;
  message?: string;
}

export const useBookingFlow = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { createBooking } = useBusStore();

  const validatePassengerDetails = (passengers: any[]): BookingValidation => {
    if (!passengers.length) {
      return { isValid: false, message: 'Please add passenger details' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    for (const passenger of passengers) {
      if (!passenger.name?.trim()) {
        return { isValid: false, message: 'Please enter name for all passengers' };
      }

      if (!passenger.age || passenger.age < 1) {
        return { isValid: false, message: 'Please enter valid age for all passengers' };
      }

      if (!passenger.gender) {
        return { isValid: false, message: 'Please select gender for all passengers' };
      }

      if (!passenger.phone || !phoneRegex.test(passenger.phone)) {
        return { isValid: false, message: 'Please enter valid phone number for all passengers' };
      }

      if (!passenger.email || !emailRegex.test(passenger.email)) {
        return { isValid: false, message: 'Please enter valid email for all passengers' };
      }
    }

    return { isValid: true };
  };

  const validatePaymentDetails = (paymentDetails: any): BookingValidation => {
    if (!paymentDetails.method) {
      return { isValid: false, message: 'Please select a payment method' };
    }

    if (paymentDetails.method === 'card') {
      const cardNumberRegex = /^\d{16}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^\d{3}$/;

      if (!paymentDetails.cardNumber || !cardNumberRegex.test(paymentDetails.cardNumber)) {
        return { isValid: false, message: 'Please enter a valid card number' };
      }
      if (!paymentDetails.expiryDate || !expiryRegex.test(paymentDetails.expiryDate)) {
        return { isValid: false, message: 'Please enter a valid expiry date (MM/YY)' };
      }
      if (!paymentDetails.cvv || !cvvRegex.test(paymentDetails.cvv)) {
        return { isValid: false, message: 'Please enter a valid CVV' };
      }
    } else if (paymentDetails.method === 'upi') {
      const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
      if (!paymentDetails.upiId || !upiRegex.test(paymentDetails.upiId)) {
        return { isValid: false, message: 'Please enter a valid UPI ID' };
      }
    } else if (paymentDetails.method === 'wallet') {
      if (!paymentDetails.walletProvider) {
        return { isValid: false, message: 'Please select a wallet provider' };
      }
    }

    return { isValid: true };
  };

  const processBooking = async (passengers: any[], paymentDetails: any) => {
    setIsProcessing(true);

    try {
      // Validate passenger details
      const passengerValidation = validatePassengerDetails(passengers);
      if (!passengerValidation.isValid) {
        toast.error(passengerValidation.message);
        return false;
      }

      // Validate payment details
      const paymentValidation = validatePaymentDetails(paymentDetails);
      if (!paymentValidation.isValid) {
        toast.error(paymentValidation.message);
        return false;
      }

      // Process payment (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create booking
      const booking = createBooking(passengers);

      // Show success message and redirect
      toast.success('Booking confirmed successfully!');
      navigate('/my-bookings');

      return true;
    } catch (error) {
      toast.error('Failed to process booking. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processBooking,
    validatePassengerDetails,
    validatePaymentDetails
  };
};