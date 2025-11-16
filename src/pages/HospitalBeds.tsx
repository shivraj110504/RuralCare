import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Building, Calendar as CalendarIcon, MapPin, Bed, Users, Phone, User } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { sendBedBookingEmail } from "@/services/emailService";

const hospitals = [
  {
    id: 1,
    name: "Apollo Hospitals",
    location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
    fallbackImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3",
    bedTypes: [
      { type: "General Ward", price: 2500, available: 12 },
      { type: "Semi-Private", price: 5000, available: 8 },
      { type: "Private Room", price: 8000, available: 5 },
      { type: "ICU", price: 15000, available: 3 },
    ]
  },
  {
    id: 2,
    name: "Max Super Speciality Hospital",
    location: "Mumbai",
    image: "https://www.spineandneurosurgeryhospitalindia.com/max-hospital-delhi-india/img/max-hospital.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    bedTypes: [
      { type: "General Ward", price: 3000, available: 15 },
      { type: "Semi-Private", price: 6000, available: 10 },
      { type: "Private Room", price: 9500, available: 6 },
      { type: "ICU", price: 18000, available: 4 },
    ]
  },
  {
    id: 3,
    name: "Fortis Healthcare",
    location: "Bangalore",
    image: "https://proudlyfilipino.com/wp-content/uploads/2023/03/Manila-Doctors-Hospital-Manila-Final.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    bedTypes: [
      { type: "General Ward", price: 2800, available: 20 },
      { type: "Semi-Private", price: 5500, available: 12 },
      { type: "Private Room", price: 9000, available: 8 },
      { type: "ICU", price: 17000, available: 5 },
    ]
  },
  {
    id: 4,
    name: "AIIMS",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3",
    fallbackImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
    bedTypes: [
      { type: "General Ward", price: 1500, available: 25 },
      { type: "Semi-Private", price: 4000, available: 15 },
      { type: "Private Room", price: 7000, available: 10 },
      { type: "ICU", price: 12000, available: 6 },
    ]
  },
];

const HospitalBeds = () => {
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [selectedBedType, setSelectedBedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState(1);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const hospital = selectedHospital ? hospitals.find(h => h.id === selectedHospital) : null;
  const bedType = hospital && selectedBedType ? 
    hospital.bedTypes.find(b => b.type === selectedBedType) : null;

  const totalPrice = bedType ? bedType.price * duration : 0;

  const nextStep = () => {
    if (!currentUser && currentStep === 1) {
      toast.error("Please log in", {
        description: "You need to be logged in to book a hospital bed"
      });
      navigate("/login");
      return;
    }
    
    if (currentStep === 1 && !selectedHospital) {
      toast.error("Please select a hospital", {
        description: "You need to select a hospital to proceed"
      });
      return;
    }

    if (currentStep === 2 && (!selectedBedType || !selectedDate)) {
      toast.error("Incomplete selection", {
        description: "Please select bed type and admission date"
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
    
    if (!currentUser) {
      toast.error("Please log in", {
        description: "You need to be logged in to book a hospital bed"
      });
      navigate("/login");
      return;
    }
    
    if (!patientName || !patientPhone) {
      toast.error("Please fill all required fields", {
        description: "Patient name and phone number are required"
      });
      return;
    }

    try {
      const orderDetails = {
        hospital,
        bedType: selectedBedType,
        admissionDate: selectedDate?.toISOString(),
        duration,
        patientName,
        patientPhone,
        totalPrice
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          order_type: 'bed',
          order_details: orderDetails,
          total_amount: totalPrice,
          status: 'confirmed'
        })
        .select();
        
      if (error) throw error;
      
      // Send confirmation email
      try {
        await sendBedBookingEmail(
          currentUser.email,
          {
            hospitalName: hospital?.name || '',
            bedType: selectedBedType || '',
            patientName,
            checkInDate: selectedDate ? format(selectedDate, 'PPP') : '',
            duration,
          }
        );
        console.log("Bed booking confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send bed booking confirmation email:", emailError);
        // Don't fail the entire operation if email fails
      }
      
      toast.success("Bed Reserved Successfully!", {
        description: `Your ${selectedBedType} bed at ${hospital?.name} is confirmed for ${selectedDate ? format(selectedDate, 'PPP') : ''}`
      });
      
      setSelectedHospital(null);
      setSelectedBedType(null);
      setSelectedDate(undefined);
      setDuration(1);
      setPatientName("");
      setPatientPhone("");
      setCurrentStep(1);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error: any) {
      console.error("Error making bed booking:", error.message);
      toast.error("Error making booking", {
        description: error.message || "Something went wrong"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-purple-900 mb-4">
              Hospital Bed Booking
            </h1>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto">
              Reserve hospital beds in advance at top healthcare facilities across India
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6 text-white">
                <h3 className="text-2xl font-display font-bold">Book Hospital Bed</h3>
                <p className="text-white/80">Reserve a bed at your preferred hospital</p>
                
                <div className="flex items-center justify-between mt-6 max-w-md mx-auto">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-white text-purple-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
                      1
                    </div>
                    <span className="text-sm mt-1">Select Hospital</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-white text-purple-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
                      2
                    </div>
                    <span className="text-sm mt-1">Choose Bed & Date</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-white text-purple-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>
                      3
                    </div>
                    <span className="text-sm mt-1">Patient Details</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Select a Hospital</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospitals.map((hospital) => (
                        <div 
                          key={hospital.id}
                          className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${selectedHospital === hospital.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-200'}`}
                          onClick={() => setSelectedHospital(hospital.id)}
                        >
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={hospital.image} 
                              alt={hospital.name} 
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (hospital.fallbackImage && target.src !== hospital.fallbackImage) {
                                  target.src = hospital.fallbackImage;
                                }
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h5 className="font-bold text-purple-900">{hospital.name}</h5>
                            <p className="text-purple-700 flex items-center mt-1">
                              <MapPin size={14} className="mr-1" />
                              {hospital.location}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Available bed types: {hospital.bedTypes.length}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {currentStep === 2 && hospital && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Choose Bed Type & Admission Date</h4>
                    
                    <div className="bg-purple-50 rounded-lg p-4 mb-6 flex items-center">
                      <Building className="text-purple-600 mr-3" size={20} />
                      <div>
                        <h5 className="font-bold text-purple-900">{hospital.name}</h5>
                        <p className="text-purple-700">{hospital.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                          <Bed size={18} className="mr-2" />
                          Select Bed Type
                        </h5>
                        
                        <RadioGroup 
                          value={selectedBedType || ""}
                          onValueChange={setSelectedBedType}
                          className="space-y-3"
                        >
                          {hospital.bedTypes.map((bed) => (
                            <div 
                              key={bed.type}
                              className={`border rounded-lg p-3 transition-all ${selectedBedType === bed.type ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                            >
                              <RadioGroupItem 
                                value={bed.type} 
                                id={bed.type} 
                                className="peer sr-only" 
                              />
                              <Label
                                htmlFor={bed.type}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div>
                                  <div className="font-medium text-purple-900">{bed.type}</div>
                                  <div className="text-sm text-purple-700">
                                    {bed.available} beds available
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-purple-900">₹{bed.price.toLocaleString()}</div>
                                  <div className="text-xs text-purple-700">per day</div>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {selectedBedType && (
                          <div className="mt-4">
                            <Label htmlFor="duration" className="text-sm font-medium text-purple-900">
                              Duration (days)
                            </Label>
                            <div className="flex items-center mt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-l-md"
                                onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                              >
                                -
                              </Button>
                              <Input
                                id="duration"
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="h-9 rounded-none text-center w-16"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-r-md"
                                onClick={() => setDuration(prev => prev + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                          <CalendarIcon size={18} className="mr-2" />
                          Select Admission Date
                        </h5>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className={cn("rounded-md border p-3")}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {selectedBedType && selectedDate && (
                      <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-medium text-purple-900 mb-2">Booking Summary</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-purple-700">Bed Type:</div>
                          <div className="font-medium text-purple-900">{selectedBedType}</div>
                          
                          <div className="text-purple-700">Admission Date:</div>
                          <div className="font-medium text-purple-900">{format(selectedDate, 'PPP')}</div>
                          
                          <div className="text-purple-700">Duration:</div>
                          <div className="font-medium text-purple-900">{duration} day{duration > 1 ? 's' : ''}</div>
                          
                          <div className="text-purple-700">Rate per Day:</div>
                          <div className="font-medium text-purple-900">₹{bedType?.price.toLocaleString()}</div>
                          
                          <div className="text-purple-700 font-medium">Total Amount:</div>
                          <div className="font-bold text-purple-900">₹{totalPrice.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {currentStep === 3 && hospital && selectedBedType && selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-xl font-bold text-purple-900 mb-4">Patient Details</h4>
                    
                    <div className="bg-purple-50 rounded-lg p-4 mb-6">
                      <h5 className="font-medium text-purple-900 mb-2">Booking Summary</h5>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Building size={16} className="text-purple-600 mr-2" />
                          <span className="text-purple-900">{hospital.name}, {hospital.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Bed size={16} className="text-purple-600 mr-2" />
                          <span className="text-purple-900">{selectedBedType} - ₹{bedType?.price.toLocaleString()} per day</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CalendarIcon size={16} className="text-purple-600 mr-2" />
                          <span className="text-purple-900">{format(selectedDate, 'PPP')} ({duration} day{duration > 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex items-center text-sm font-bold mt-2">
                          <span className="text-purple-900">Total: ₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName" className="flex items-center">
                          <User size={14} className="mr-1 text-purple-600" />
                          Patient Name <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="patientName"
                          placeholder="Enter patient's full name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          required
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="patientPhone" className="flex items-center">
                          <Phone size={14} className="mr-1 text-purple-600" />
                          Phone Number <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="patientPhone"
                          placeholder="Enter contact number"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          required
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                          Confirm Reservation
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="border-purple-200 text-purple-700"
                  >
                    Back
                  </Button>
                  
                  {currentStep < 3 && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HospitalBeds;
