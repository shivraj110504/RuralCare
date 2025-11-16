import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, Timer, Truck, MapPin, Search, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { sendMedicineOrderEmail } from "@/services/emailService";

interface MedicineItem {
  id: number;
  name: string;
  generic: string;
  price: number;
  stock: string;
  prescription: boolean;
}

const MedicineDelivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<MedicineItem[]>([]);
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const medicines: MedicineItem[] = [
    { id: 1, name: "Paracetamol 500mg", generic: "Acetaminophen", price: 35, stock: "In Stock", prescription: false },
    { id: 2, name: "Azithromycin 250mg", generic: "Azithromycin", price: 120, stock: "In Stock", prescription: true },
    { id: 3, name: "Amoxicillin 500mg", generic: "Amoxicillin", price: 80, stock: "In Stock", prescription: true },
    { id: 4, name: "Cetrizine 10mg", generic: "Cetirizine", price: 45, stock: "In Stock", prescription: false },
    { id: 5, name: "Pantoprazole 40mg", generic: "Pantoprazole", price: 95, stock: "Low Stock", prescription: false },
    { id: 6, name: "Metformin 500mg", generic: "Metformin", price: 60, stock: "In Stock", prescription: true },
  ];
  
  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.generic.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const addToCart = (medicine: MedicineItem) => {
    setCart([...cart, medicine]);
    toast.success("Added to cart", {
      description: `${medicine.name} has been added to your cart.`,
    });
  };
  
  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);
  
  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please log in", {
        description: "You need to be logged in to place an order"
      });
      navigate("/login");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Empty cart", {
        description: "Please add items to your cart before checking out"
      });
      return;
    }
    
    if (!address) {
      toast.error("Missing address", {
        description: "Please provide a delivery address"
      });
      return;
    }
    
    try {
      // Save the order to the database
      const orderDetails = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          generic: item.generic,
          price: item.price,
          prescription: item.prescription
        })),
        address,
        specialInstructions,
        deliveryFee: 40
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          order_type: 'medicine',
          order_details: orderDetails,
          total_amount: totalAmount + 40,
          status: 'confirmed'
        })
        .select();
        
      if (error) throw error;
      
      // Send confirmation email
      try {
        const medicineItems = cart.map(item => `${item.name} (${item.generic}) - ₹${item.price}`);
        await sendMedicineOrderEmail(
          currentUser.email,
          {
            medicineItems,
            totalAmount: totalAmount + 40, // Including delivery charges
          }
        );
        console.log("Medicine order confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send medicine order confirmation email:", emailError);
        // Don't fail the entire operation if email fails
      }
      
      toast.success("Order Placed Successfully!", {
        description: "Your medicines will be delivered within 24-48 hours.",
      });
      
      // Reset cart and form
      setCart([]);
      setAddress('');
      setSpecialInstructions('');
      
      // Optionally, redirect to orders page
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error: any) {
      console.error("Error placing order:", error.message);
      toast.error("Error placing order", {
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
              Medicine Delivery
            </h1>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto">
              Order essential medications online and get them delivered to your doorstep
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                  <div className="relative mb-6">
                    <Input 
                      type="text" 
                      placeholder="Search medicines by name or generic compound..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-4">
                    {filteredMedicines.map(medicine => (
                      <div key={medicine.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-purple-900">{medicine.name}</h3>
                          <p className="text-sm text-gray-500">{medicine.generic}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${medicine.stock === "In Stock" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                              {medicine.stock}
                            </span>
                            {medicine.prescription && (
                              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 ml-2">
                                Prescription Required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-900">₹{medicine.price}</p>
                          <Button 
                            size="sm" 
                            className="mt-2" 
                            onClick={() => addToCart(medicine)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredMedicines.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No medicines found matching your search.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-purple-900 mb-4">How Medicine Delivery Works</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package className="text-purple-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-1">Order Medicines</h3>
                      <p className="text-sm text-gray-600">Select medicines, upload prescription if needed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Timer className="text-orange-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-orange-700 mb-1">Processing</h3>
                      <p className="text-sm text-gray-600">We verify prescription and pack your order</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Truck className="text-purple-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-1">Delivery</h3>
                      <p className="text-sm text-gray-600">Medicines delivered to your doorstep</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/3">
                <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                  <h2 className="text-xl font-bold text-purple-900 mb-4">Your Cart</h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                              <p className="font-medium text-purple-900">{item.name}</p>
                              <p className="text-sm text-gray-500">₹{item.price}</p>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="font-medium">₹40</span>
                        </div>
                        <div className="flex justify-between font-bold text-purple-900 text-lg mt-4">
                          <span>Total</span>
                          <span>₹{totalAmount + 40}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <MapPin className="text-purple-600 mr-3" size={20} />
                          <div className="text-sm flex-1">
                            <p className="font-medium">Delivery Address</p>
                            <Input 
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your full address"
                              className="mt-1 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm mb-2">Upload Prescription (if required)</p>
                          <Input type="file" className="text-sm" />
                        </div>
                        
                        <div>
                          <p className="text-sm mb-2">Special Instructions</p>
                          <Textarea 
                            placeholder="Any special instructions for delivery..." 
                            className="text-sm"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                          />
                        </div>
                        
                        <Button className="w-full" onClick={handleCheckout}>
                          <Check className="mr-2 h-4 w-4" /> Place Order
                        </Button>
                      </div>
                    </>
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

export default MedicineDelivery;
