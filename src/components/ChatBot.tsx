import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Pill, ShoppingCart, XCircle, HomeIcon, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { getChatbotResponse, medicalAdvice, containsDisease } from '@/utils/geminiAI';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestedMedicines?: Medicine[];
}

interface Medicine {
  id: number;
  name: string;
  generic: string;
  price: number;
  description: string;
}

export interface ChatBotHandle {
  sendExternalMessage: (text: string) => void;
}

const ChatBot = forwardRef<ChatBotHandle>((_props, ref) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // const messagesEndRef = useRef<HTMLDivElement>(null); // Removed as we don't need auto-scroll
  
  const availableMedicines: Medicine[] = [
    { id: 1, name: "Paracetamol 500mg", generic: "Acetaminophen", price: 35, description: "For fever and pain relief" },
    { id: 2, name: "Cetrizine 10mg", generic: "Cetirizine", price: 45, description: "For allergies and cold symptoms" },
    { id: 3, name: "Ibuprofen 400mg", generic: "Ibuprofen", price: 50, description: "Anti-inflammatory for pain and swelling" },
    { id: 4, name: "Vitamin C 1000mg", generic: "Ascorbic Acid", price: 120, description: "Immune system support" },
    { id: 5, name: "Omeprazole 20mg", generic: "Omeprazole", price: 85, description: "For acid reflux and heartburn" },
    { id: 6, name: "Amoxicillin 500mg", generic: "Amoxicillin", price: 95, description: "Antibiotic for bacterial infections" },
    { id: 7, name: "Aspirin 300mg", generic: "Acetylsalicylic Acid", price: 40, description: "Pain reliever and blood thinner" },
    { id: 8, name: "Loratadine 10mg", generic: "Loratadine", price: 55, description: "Non-drowsy antihistamine for allergies" },
    { id: 9, name: "Pantoprazole 40mg", generic: "Pantoprazole", price: 90, description: "For acid reflux and stomach ulcers" },
    { id: 10, name: "Dextromethorphan syrup", generic: "Dextromethorphan", price: 65, description: "Cough suppressant" },
  ];
  
  useEffect(() => {
    // Initial greeting with username if logged in
    const greeting = currentUser 
      ? `Hello ${currentUser.user_metadata?.name || 'there'}! I'm MediCare's AI assistant powered by Gemini. How can I help you today?`
      : "Hello! I'm MediCare's AI assistant powered by Gemini. Please log in to get personalized health assistance.";
      
    setMessages([{
      id: 1,
      text: greeting,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [currentUser]);

  // Remove automatic scrolling completely
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   // Only scroll to bottom if there are messages and user is actively chatting
  //   if (messages.length > 1) {
  //     scrollToBottom();
  //   }
  // }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Helper function to find medicine recommendations based on symptoms
  const findMedicineRecommendations = (response: string): Medicine[] => {
    const foundMedicines: Medicine[] = [];
    
    // Extract disease names from the response
    for (const [disease, advice] of Object.entries(medicalAdvice)) {
      if (response.toLowerCase().includes(disease)) {
        // For each mentioned disease, look for matching medicines
        for (const medicineName of advice.medicines) {
          const matchingMedicine = availableMedicines.find(med => 
            med.generic.toLowerCase() === medicineName.toLowerCase() || 
            med.name.toLowerCase().includes(medicineName.toLowerCase())
          );
          
          if (matchingMedicine && !foundMedicines.some(m => m.id === matchingMedicine.id)) {
            foundMedicines.push(matchingMedicine);
          }
        }
      }
    }
    
    return foundMedicines;
  };

  const addToCart = async (medicine: Medicine) => {
    if (!currentUser) {
      toast.error("Please log in to add items to cart", {
        description: "You'll need to sign in to complete your purchase"
      });
      navigate("/login");
      return;
    }
    
    try {
      // Simulate adding to cart by creating an order with a single item
      const orderDetails = {
        items: [{
          id: medicine.id,
          name: medicine.name,
          generic: medicine.generic,
          price: medicine.price,
          prescription: false
        }],
        address: "",
        specialInstructions: "Added from AI Assistant",
        deliveryFee: 40
      };
      
      const { data, error } = await supabase
        .from('orders' as any)
        .insert({
          user_id: currentUser.id,
          order_type: 'medicine',
          order_details: orderDetails,
          total_amount: medicine.price + 40,
          status: 'pending'
        } as any)
        .select();
        
      if (error) throw error;
      
      toast.success("Added to cart", {
        description: `${medicine.name} has been added to your cart.`
      });
      
      // Add confirmation message from bot
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: `Great! I've added ${medicine.name} to your cart. You can complete your purchase in the medicine delivery section or add more items.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
    } catch (error: any) {
      console.error("Error adding to cart:", error.message);
      toast.error("Error adding to cart", {
        description: error.message || "Something went wrong"
      });
    }
  };

  const processMessage = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    if (!currentUser) {
      setTimeout(() => {
        const loginMessage: Message = {
          id: messages.length + 2,
          text: "Please log in to get personalized health advice and medicine recommendations.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, loginMessage]);
        setIsTyping(false);
        navigate('/login');
      }, 600);
      return;
    }

    try {
      const userName = currentUser.user_metadata?.name;
      const responseText = await getChatbotResponse(trimmed, userName);
      const hasDiseaseInQuery = containsDisease(trimmed);
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        suggestedMedicines: hasDiseaseInQuery ? findMedicineRecommendations(responseText) : undefined
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    const currentInput = input;
    setInput('');
    await processMessage(currentInput);
  };

  useImperativeHandle(ref, () => ({
    sendExternalMessage: (text: string) => {
      processMessage(text);
    }
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Render message content
  const renderMessageContent = (message: Message) => {
    return (
      <>
        <p className="text-sm md:text-base whitespace-pre-line">{message.text}</p>
        {message.suggestedMedicines && message.suggestedMedicines.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold">Recommended Medications:</p>
            {message.suggestedMedicines.map((med) => (
              <div key={med.id} className="bg-white/80 p-2 rounded-lg text-xs md:text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Pill className="h-3 w-3 mr-1 text-teal-500" />
                      <span className="font-medium">{med.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-4">{med.description}</p>
                    <p className="text-xs text-gray-600 ml-4 mt-1">₹{med.price}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs py-1 h-7 bg-white"
                    onClick={() => addToCart(med)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </>
    );
  };

  return (
    <section id="chat" className="section-container">
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-display font-bold text-teal-600 mb-1">AI-Powered Chat Assistant</h2>
        <p className="text-xs md:text-sm text-teal-400 max-w-xl mx-auto">Describe your symptoms to get quick, tailored health guidance.</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="frost-panel overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="h-[75vh] overflow-y-auto p-4 bg-white">
            <div className="flex flex-col space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100 
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <motion.div 
                        className={`px-4 py-3 rounded-2xl relative ${
                          message.sender === 'user' 
                            ? 'bg-teal-500 text-white rounded-tr-none shadow-lg' 
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-tl-none shadow-md border border-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {renderMessageContent(message)}
                        {/* Subtle animation shimmer for bot messages */}
                        {message.sender === 'bot' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-2xl"></div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Removed messagesEndRef as we don't need auto-scroll */}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <motion.input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={currentUser ? "Describe your symptoms..." : "Please log in to use the chatbot..."}
                className="flex-1 border border-gray-200 rounded-l-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                disabled={!currentUser}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.button
                onClick={handleSendMessage}
                className="bg-teal-500 text-white rounded-r-full px-6 py-3 font-medium hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!currentUser}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.11 13.6501L13.69 10.0601" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Note: This AI assistant provides general health information powered by Gemini. For serious conditions, please consult a healthcare professional.</p>
          {!currentUser && (
            <p className="mt-2 text-teal-500 font-medium">
              Please <a href="/login" className="underline">log in</a> to access personalized health advice and medicine recommendations.
            </p>
          )}
        </div>
      </div>
    </section>
  );
});

export default ChatBot;
