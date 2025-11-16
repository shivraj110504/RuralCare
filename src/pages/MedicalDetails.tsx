
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { HeartPulse, Droplets, CalendarClock, Ruler, Weight, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// First, let's create our SQL to store medical details
// This will be executed in a separate lov-sql block

const medicalFormSchema = z.object({
  bloodType: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  medications: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type MedicalFormValues = z.infer<typeof medicalFormSchema>;

const MedicalDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [medicalData, setMedicalData] = useState<any>(null);

  const form = useForm<MedicalFormValues>({
    resolver: zodResolver(medicalFormSchema),
    defaultValues: {
      bloodType: "",
      height: "",
      weight: "",
      allergies: "",
      chronicConditions: "",
      medications: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Fetch medical data (we'll create this table in a SQL block)
    const fetchMedicalData = async () => {
      try {
        const { data, error } = await supabase
          .from("medical_details")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle();
        
        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" - this is fine for new users
          throw error;
        }
        
        if (data) {
          setMedicalData(data);
          
          // Set form values
          form.reset({
            bloodType: (data as any)?.blood_type || "",
            height: (data as any)?.height || "",
            weight: (data as any)?.weight || "",
            allergies: (data as any)?.allergies || "",
            chronicConditions: (data as any)?.chronic_conditions || "",
            medications: (data as any)?.medications || "",
            emergencyContact: (data as any)?.emergency_contact || "",
            emergencyPhone: (data as any)?.emergency_phone || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching medical details:", error.message);
        toast.error("Failed to load medical data");
      }
    };

    fetchMedicalData();
  }, [currentUser, navigate, form]);

  const onSubmit = async (values: MedicalFormValues) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const medicalDetails = {
        user_id: currentUser.id,
        blood_type: values.bloodType,
        height: values.height,
        weight: values.weight,
        allergies: values.allergies,
        chronic_conditions: values.chronicConditions,
        medications: values.medications,
        emergency_contact: values.emergencyContact,
        emergency_phone: values.emergencyPhone,
        updated_at: new Date().toISOString(),
      };
      
      if (medicalData) {
        // Update existing record
        const { error } = await supabase
          .from("medical_details" as any)
          .update(medicalDetails as any)
          .eq("user_id", currentUser.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("medical_details" as any)
          .insert({
            ...medicalDetails,
            created_at: new Date().toISOString(),
          } as any);
        
        if (error) throw error;
      }
      
      toast.success("Medical details updated successfully!");
    } catch (error: any) {
      console.error("Error updating medical details:", error.message);
      toast.error(error.message || "Failed to update medical details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-900 mb-8">Medical Details</h1>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="emergency">Emergency & Conditions</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Medical Information</CardTitle>
                      <CardDescription>
                        Add your basic health metrics and blood type.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select your blood type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="Unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="175" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="70" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="emergency">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Conditions & Emergency Contact</CardTitle>
                      <CardDescription>
                        Important information for emergency situations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any allergies you have..." 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="chronicConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chronic Conditions</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any chronic conditions..." 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any medications you are currently taking..." 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="emergencyContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Contact name" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="emergencyPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Phone</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Contact phone number" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    Back to Profile
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Medical Details"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalDetails;
