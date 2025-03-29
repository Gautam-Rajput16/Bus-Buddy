import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';

interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}

interface Booking {
  id: string;
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
}

export const generateTicketPDF = (booking: Booking) => {
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFillColor(6, 214, 160); // #06D6A0
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BusBuddy - E-Ticket', 105, 12, { align: 'center' });
  
  // Booking details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('Booking Details', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Draw line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 34, 196, 34);
  
  // Booking ID and Date
  doc.setFont('helvetica', 'bold');
  doc.text('Booking ID:', 14, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.id, 50, 42);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Date:', 120, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(format(parseISO(booking.bookingDate), 'dd MMM yyyy'), 170, 42);
  
  // Journey details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Journey Details', 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Draw line
  doc.line(14, 59, 196, 59);
  
  // Bus details
  doc.setFont('helvetica', 'bold');
  doc.text('Bus Name:', 14, 67);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.busName, 50, 67);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Bus Type:', 120, 67);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.busType, 170, 67);
  
  // Route
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 14, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.source, 50, 75);
  
  doc.setFont('helvetica', 'bold');
  doc.text('To:', 120, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.destination, 170, 75);
  
  // Date and Time
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 14, 83);
  doc.setFont('helvetica', 'normal');
  doc.text(format(parseISO(booking.date), 'dd MMM yyyy'), 50, 83);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Departure:', 120, 83);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.departureTime, 170, 83);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Arrival:', 14, 91);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.arrivalTime, 50, 91);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Seats:', 120, 91);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.seats.join(', '), 170, 91);
  
  // Passenger details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Passenger Details', 14, 105);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Draw line
  doc.line(14, 109, 196, 109);
  
  // Table header
  let yPos = 117;
  doc.setFont('helvetica', 'bold');
  doc.text('Name', 14, yPos);
  doc.text('Age', 90, yPos);
  doc.text('Gender', 120, yPos);
  doc.text('Seat No.', 170, yPos);
  
  // Draw line
  yPos += 4;
  doc.line(14, yPos, 196, yPos);
  
  // Table content
  doc.setFont('helvetica', 'normal');
  booking.passengers.forEach((passenger, index) => {
    yPos += 8;
    doc.text(passenger.name, 14, yPos);
    doc.text(passenger.age.toString(), 90, yPos);
    doc.text(passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1), 120, yPos);
    doc.text(passenger.seatNumber, 170, yPos);
  });
  
  // Draw line
  yPos += 4;
  doc.line(14, yPos, 196, yPos);
  
  // Fare details
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Fare Details', 14, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Draw line
  yPos += 4;
  doc.line(14, yPos, 196, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Fare:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`₹${booking.totalFare}`, 50, yPos);
  
  // Footer
  yPos += 20;
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos, 182, 25, 'F');
  
  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Important Information:', 16, yPos);
  
  yPos += 5;
  doc.text('• Please arrive at the boarding point at least 15 minutes before departure time.', 16, yPos);
  
  yPos += 5;
  doc.text('• Carry a valid ID proof along with this e-ticket for verification.', 16, yPos);
  
  yPos += 5;
  doc.text('• For any assistance, contact our customer support at 1800-123-4567.', 16, yPos);
  
  // QR Code placeholder (just a square for now)
  doc.setDrawColor(0, 0, 0);
  doc.rect(160, 160, 30, 30);
  doc.setFontSize(6);
  doc.text('Scan for verification', 175, 195, { align: 'center' });
  
  return doc;
};

export const downloadTicketPDF = (booking: Booking) => {
  const doc = generateTicketPDF(booking);
  doc.save(`BusBuddy_Ticket_${booking.id}.pdf`);
};

export const getTicketAsBase64 = (booking: Booking): string => {
  const doc = generateTicketPDF(booking);
  return doc.output('datauristring');
};

export const getTicketAsBlob = (booking: Booking): Blob => {
  const doc = generateTicketPDF(booking);
  const pdfOutput = doc.output('blob');
  return pdfOutput;
};

export const generateTicketSummary = (booking: Booking): string => {
  const journeyDate = format(parseISO(booking.date), 'dd MMM yyyy');
  
  return `
🎫 BusBuddy Ticket - ${booking.id}

📍 Journey: ${booking.source} to ${booking.destination}
🚌 Bus: ${booking.busName} (${booking.busType})
📅 Date: ${journeyDate}
⏰ Time: ${booking.departureTime}
💺 Seats: ${booking.seats.join(', ')}
💰 Fare: ₹${booking.totalFare}

Download your e-ticket from your BusBuddy account.
  `;
};