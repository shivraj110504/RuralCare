
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveAppointment } from './AppointmentService';
import { toast } from 'sonner';

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    availability: ["Morning", "Evening"],
    fees: 800,
    experience: "8 years"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    availability: ["Afternoon"],
    fees: 1500,
    experience: "12 years"
  },
  {
    id: 3,
    name: "Dr. Ananya Patel",
    specialty: "Pediatrician",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    availability: ["Morning", "Afternoon", "Evening"],
    fees: 1200,
    experience: "10 years"
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    availability: ["Afternoon", "Evening"],
    fees: 2000,
    experience: "15 years"
  },
];

// Time slots
const timeSlots = {
  "Morning": ["9:00 AM", "10:00 AM", "11:00 AM"],
  "Afternoon": ["12:00 PM", "2:00 PM", "3:00 PM"],
  "Evening": ["5:00 PM", "6:00 PM", "7:00 PM"],
};

const DoctorAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    symptoms: "",
  });
  const { toast: uiToast } = useToast();
  const { currentUser } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDoctorSelect = (id: number) => {
    setSelectedDoctor(id);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedDoctor) {
      uiToast({
        title: "Please select a doctor",
        description: "You need to select a doctor to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) {
      uiToast({
        title: "Please select date and time",
        description: "You need to select both date and time slot to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      uiToast({
        title: "Please fill all required fields",
        description: "Name, phone, and email are required",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      uiToast({
        title: "Authentication Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      return;
    }

    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
    if (!selectedDoctorData || !selectedDate || !selectedTimeSlot) {
      uiToast({
        title: "Missing Information",
        description: "Please complete all appointment details",
        variant: "destructive",
      });
      return;
    }

    // Save appointment to the database
    const appointmentData = {
      doctor_id: selectedDoctorData.id,
      doctor_name: selectedDoctorData.name,
      appointment_date: selectedDate,
      appointment_time: selectedTimeSlot,
      user_details: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        symptoms: formData.symptoms || undefined,
      },
      metadata: {
        doctor_specialty: selectedDoctorData.specialty,
        doctor_fees: selectedDoctorData.fees
      }
    };

    const result = await saveAppointment(appointmentData);
    
    if (result.success) {
      toast.success(`Appointment Booked Successfully!`, {
        description: `Your appointment with ${selectedDoctorData.name} is confirmed for ${format(selectedDate, 'PPP')} at ${selectedTimeSlot}`
      });
      
      // Reset form
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setCurrentStep(1);
      setFormData({
        name: "",
        phone: "",
        email: "",
        symptoms: "",
      });
    }
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9E6E1]">
      <div className="bg-gradient-to-r from-[#284954] to-[#4A8195] p-6 text-white">
        <h3 className="text-2xl font-display font-bold">Book Your Appointment</h3>
        <p className="text-white/80">Follow the steps to schedule a consultation with one of our specialists</p>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mt-6 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-white text-[#284954]' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
              1
            </div>
            <span className="text-sm mt-1">Select Doctor</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-white text-[#284954]' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
              2
            </div>
            <span className="text-sm mt-1">Schedule</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-white text-[#284954]' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
              3
            </div>
            <span className="text-sm mt-1">Details</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Step 1: Doctor Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold text-[#284954] mb-4">Select a Doctor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${selectedDoctor === doctor.id ? 'border-[#4A8195] bg-[#E9E6E1]' : 'border-gray-200 hover:border-[#81949A]'}`}
                  onClick={() => handleDoctorSelect(doctor.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1">
                      <h5 className="font-bold text-[#284954]">{doctor.name}</h5>
                      <p className="text-[#4A8195]">{doctor.specialty}</p>
                      <p className="text-sm text-[#81949A]">{doctor.experience} experience</p>
                      <div className="flex items-center mt-2 text-sm text-[#4A8195]">
                        <Clock size={14} className="mr-1" />
                        <span>Available: {doctor.availability.join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-[#E9E6E1] text-[#284954] px-3 py-1 rounded-full text-sm font-medium">
                        ₹{doctor.fees}
                      </span>
                      <p className="text-xs text-[#81949A] mt-1">Consultation Fee</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Date and Time Selection */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold text-[#284954] mb-4">Select Date & Time</h4>
            
            {selectedDoctorData && (
              <div className="bg-[#E9E6E1] rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={selectedDoctorData.image} alt={selectedDoctorData.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-[#284954]">{selectedDoctorData.name}</h5>
                    <p className="text-[#4A8195]">{selectedDoctorData.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-white text-[#284954] px-3 py-1 rounded-full text-sm font-medium">
                    ₹{selectedDoctorData.fees}
                  </span>
                  <p className="text-xs text-[#81949A] mt-1">Consultation Fee</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <h5 className="font-medium text-[#284954] mb-2 flex items-center">
                  <Calendar size={18} className="mr-2" />
                  Select Date
                </h5>
                <div className="border rounded-lg overflow-hidden">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>
              </div>
              
              {/* Time slots */}
              <div>
                <h5 className="font-medium text-[#284954] mb-2 flex items-center">
                  <Clock size={18} className="mr-2" />
                  Select Time
                </h5>
                
                {selectedDoctorData?.availability.map((period) => (
                  <div key={period} className="mb-4">
                    <h6 className="text-sm font-medium text-[#4A8195] mb-2">{period}</h6>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots[period as keyof typeof timeSlots].map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`py-2 px-2 text-sm rounded-lg transition-colors duration-200 ${selectedTimeSlot === time ? 'bg-[#4A8195] text-white' : 'bg-[#E9E6E1] text-[#284954] hover:bg-[#B1A79A]'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Patient Details */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold text-[#284954] mb-4">Your Information</h4>
            
            <div className="bg-[#E9E6E1] rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4 mb-2">
                <User size={16} className="text-[#4A8195]" />
                <span className="font-medium text-[#284954]">
                  {selectedDoctorData?.name}
                </span>
                <span className="inline-block bg-white text-[#284954] px-2 py-0.5 rounded-full text-xs font-medium">
                  ₹{selectedDoctorData?.fees}
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <Calendar size={16} className="text-[#4A8195]" />
                <span className="font-medium text-[#284954]">
                  {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Clock size={16} className="text-[#4A8195]" />
                <span className="font-medium text-[#284954]">
                  {selectedTimeSlot || 'No time selected'}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User size={14} className="mr-1 text-[#4A8195]" />
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-[#81949A] focus:border-[#4A8195]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#4A8195]" />
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border-[#81949A] focus:border-[#4A8195]"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="email" className="flex items-center">
                  <Mail size={14} className="mr-1 text-[#4A8195]" />
                  Email Address <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-[#81949A] focus:border-[#4A8195]"
                />
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="symptoms" className="flex items-center">
                  <MessageSquare size={14} className="mr-1 text-[#4A8195]" />
                  Symptoms or Concerns
                </Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Briefly describe your symptoms or concerns"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="border-[#81949A] focus:border-[#4A8195] min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-[#4A8195] hover:bg-[#284954]">
                  Book Appointment
                </Button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-[#81949A] text-[#4A8195]"
          >
            Back
          </Button>
          
          {currentStep < 3 && (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-[#4A8195] hover:bg-[#284954]"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
