import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { generateTicketSummary } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface ShareTicketProps {
  booking: any;
  onClose: () => void;
}

const ShareTicket: React.FC<ShareTicketProps> = ({ booking, onClose }) => {
  const handleWhatsAppShare = () => {
    const ticketSummary = generateTicketSummary(booking);
    const encodedText = encodeURIComponent(ticketSummary);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    toast.success('Opening WhatsApp to share your ticket');
  };
  
  const handleSMSShare = () => {
    const ticketSummary = generateTicketSummary(booking);
    const encodedText = encodeURIComponent(ticketSummary);
    window.open(`sms:?&body=${encodedText}`, '_blank');
    toast.success('Opening SMS app to share your ticket');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-semibold mb-4">Share Ticket</h3>
        
        <div className="space-y-6">
          <p className="text-gray-600">Share your ticket details with friends and family via messaging apps:</p>
          
          {/* WhatsApp and SMS sharing */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-2 p-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="font-medium">Share via WhatsApp</span>
              <span className="text-xs text-gray-500">Send ticket details instantly</span>
            </button>
            <button
              onClick={handleSMSShare}
              className="flex flex-col items-center justify-center gap-2 p-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-10 w-10 text-blue-600" />
              <span className="font-medium">Share via SMS</span>
              <span className="text-xs text-gray-500">Text ticket details to anyone</span>
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              The recipient will receive a text summary of your booking details including journey information, 
              bus details, date, time, and seat numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTicket;