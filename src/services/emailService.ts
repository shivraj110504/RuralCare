import { supabase } from '@/integrations/supabase/client';

interface BookingDetails {
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  medicineItems?: string[];
  totalAmount?: number;
  hospitalName?: string;
  bedType?: string;
  patientName?: string;
  checkInDate?: string;
  duration?: number;
}

export const sendBookingEmail = async (
  userEmail: string,
  bookingType: 'appointment' | 'medicine' | 'bed',
  bookingDetails?: BookingDetails
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-booking-email', {
      body: {
        userEmail,
        bookingType,
        bookingDetails,
      },
    });

    if (error) {
      console.error('Error sending booking email:', error);
      throw error;
    }

    console.log('Booking email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    throw error;
  }
};

// Example usage functions for different booking types

export const sendAppointmentEmail = async (
  userEmail: string,
  appointmentDetails: {
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
  }
) => {
  return sendBookingEmail(userEmail, 'appointment', appointmentDetails);
};

export const sendMedicineOrderEmail = async (
  userEmail: string,
  orderDetails: {
    medicineItems: string[];
    totalAmount: number;
  }
) => {
  return sendBookingEmail(userEmail, 'medicine', orderDetails);
};

export const sendBedBookingEmail = async (
  userEmail: string,
  bedDetails: {
    hospitalName: string;
    bedType: string;
    patientName: string;
    checkInDate: string;
    duration: number;
  }
) => {
  return sendBookingEmail(userEmail, 'bed', bedDetails);
};