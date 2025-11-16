
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sendAppointmentEmail } from "@/services/emailService";

export interface AppointmentData {
  doctor_id: number;
  doctor_name: string;
  appointment_date: Date;
  appointment_time: string;
  user_details: {
    name: string;
    phone: string;
    email: string;
    symptoms?: string;
  };
  metadata?: Record<string, any>;
}

export async function saveAppointment(appointmentData: AppointmentData) {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // First, save the appointment
    const { data: appointmentRecord, error: appointmentError } = await supabase
      .from('appointments' as any)
      .insert({
        doctor_id: appointmentData.doctor_id,
        doctor_name: appointmentData.doctor_name,
        appointment_date: appointmentData.appointment_date.toISOString().split('T')[0],
        appointment_time: appointmentData.appointment_time,
        status: 'scheduled',
        user_id: user.id // Add the user_id from the authenticated user
      } as any)
      .select()
      .single();

    if (appointmentError) throw appointmentError;

    // Then, save any additional metadata
    const metadata = {
      ...appointmentData.metadata || {},
      user_details: appointmentData.user_details
    };

    const { error: metadataError } = await supabase
      .from('appointment_metadata' as any)
      .insert({
        appointment_id: (appointmentRecord as any)?.id,
        metadata
      } as any);

    if (metadataError) throw metadataError;

    // Send confirmation email
    try {
      await sendAppointmentEmail(
        appointmentData.user_details.email,
        {
          doctorName: appointmentData.doctor_name,
          appointmentDate: appointmentData.appointment_date.toLocaleDateString(),
          appointmentTime: appointmentData.appointment_time,
        }
      );
      console.log("Appointment confirmation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send appointment confirmation email:", emailError);
      // Don't fail the entire operation if email fails
    }

    return { success: true, appointmentId: (appointmentRecord as any)?.id };
  } catch (error: any) {
    console.error("Error saving appointment:", error);
    toast.error("Failed to save appointment: " + (error.message || "Unknown error"));
    return { success: false, error };
  }
}

export async function getAppointments() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data: appointments, error } = await supabase
      .from('appointments' as any)
      .select(`
        *,
        appointment_metadata (
          metadata
        )
      `)
      .eq('user_id', user.id) // Filter appointments by the current user
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return { appointments, success: true };
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return { success: false, error };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('appointments' as any)
      .update({ status } as any)
      .eq('id', appointmentId)
      .eq('user_id', user.id); // Ensure the user can only update their own appointments

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    return { success: false, error };
  }
}
