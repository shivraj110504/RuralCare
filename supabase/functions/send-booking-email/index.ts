import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Using Resend API directly via fetch to avoid npm package issues
const sendEmailViaResend = async (from: string, to: string[], subject: string, html: string) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  userEmail: string;
  bookingType: 'appointment' | 'medicine' | 'bed';
  bookingDetails?: {
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
  };
}

const getEmailContent = (bookingType: string, details: any = {}) => {
  switch (bookingType) {
    case 'appointment':
      return {
        subject: `Appointment Confirmation - ${details.doctorName || 'Doctor'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Appointment Confirmed!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your appointment has been successfully booked</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Doctor:</strong> ${details.doctorName || 'Not specified'}</p>
                <p><strong>Date:</strong> ${details.appointmentDate || 'Not specified'}</p>
                <p><strong>Time:</strong> ${details.appointmentTime || 'Not specified'}</p>
              </div>
              <p style="color: #666; margin-top: 20px;">Please arrive 15 minutes before your scheduled appointment time.</p>
              <p style="color: #666;">If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            </div>
          </div>
        `
      };

    case 'medicine':
      return {
        subject: `Medicine Order Confirmation - Order Total: ₹${details.totalAmount || 0}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Medicine Order Confirmed!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your medicine order has been placed successfully</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order Items:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  ${details.medicineItems?.map((item: string) => `<li>${item}</li>`).join('') || '<li>Items not specified</li>'}
                </ul>
                <p><strong>Total Amount:</strong> ₹${details.totalAmount || 0}</p>
              </div>
              <p style="color: #666; margin-top: 20px;">Your medicines will be delivered within 24-48 hours.</p>
              <p style="color: #666;">You will receive a tracking notification once your order is dispatched.</p>
            </div>
          </div>
        `
      };

    case 'bed':
      return {
        subject: `Hospital Bed Booking Confirmation - ${details.hospitalName || 'Hospital'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Bed Booking Confirmed!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your hospital bed has been successfully reserved</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Hospital:</strong> ${details.hospitalName || 'Not specified'}</p>
                <p><strong>Patient Name:</strong> ${details.patientName || 'Not specified'}</p>
                <p><strong>Bed Type:</strong> ${details.bedType || 'Not specified'}</p>
                <p><strong>Check-in Date:</strong> ${details.checkInDate || 'Not specified'}</p>
                <p><strong>Duration:</strong> ${details.duration || 'Not specified'} days</p>
              </div>
              <p style="color: #666; margin-top: 20px;">Please arrive at the hospital with all necessary documents and medical reports.</p>
              <p style="color: #666;">Contact the hospital directly if you need to modify your booking.</p>
            </div>
          </div>
        `
      };

    default:
      return {
        subject: `Booking Confirmation`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your booking has been successfully processed</h2>
              <p style="color: #666; margin-top: 20px;">Thank you for using our healthcare services.</p>
            </div>
          </div>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, bookingType, bookingDetails }: BookingEmailRequest = await req.json();

    console.log(`Sending ${bookingType} booking email to ${userEmail}`);

    if (!userEmail || !bookingType) {
      throw new Error("Missing required fields: userEmail and bookingType");
    }

    const emailContent = getEmailContent(bookingType, bookingDetails);

    const emailResponse = await sendEmailViaResend(
      "HealthCare Portal <onboarding@resend.dev>",
      [userEmail],
      emailContent.subject,
      emailContent.html
    );

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailId: emailResponse.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);