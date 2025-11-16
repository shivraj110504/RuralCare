import React, { useRef } from 'react';
  import { motion } from 'framer-motion';
  import Navbar from '../components/Navbar';
  import ChatBot from '../components/ChatBot';
  import DoctorAppointment from '../components/DoctorAppointment';
  import Footer from '../components/Footer';
  import { useAnimateOnScroll, useStaggeredAnimation } from '@/animations/useAnimations';
  import HeartImage from '@/assets/HeaderImage 1.png';
  
  const Index = () => {
    // Animation refs
    const heroRef = useRef<HTMLDivElement>(null);
    const appointmentRef = useRef<HTMLDivElement>(null);
  
  const heroAnimation = useAnimateOnScroll(heroRef, 'animate-fade-in-up', 100);
  const appointmentAnimation = useAnimateOnScroll(appointmentRef, 'animate-fade-in-left', 200);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40">
        <div className="container mx-auto px-4 relative z-10">
          <div ref={heroRef} className={`flex flex-col md:flex-row items-center justify-between gap-12 ${heroAnimation}`}>
            {/* Hero Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-teal-500 leading-tight">
                  AI-Powered Healthcare for Rural India
                </h1>
                <p className="mt-4 text-lg md:text-xl text-teal-400 max-w-lg">
                  Making quality healthcare accessible to everyone, everywhere with advanced AI and remote consultations.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a 
                  href="/ai-doctor" 
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-300 text-center"
                >
                  Try AI Consultation
                </a>
                <a 
                  href="#about" 
                  className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-white font-medium rounded-lg transition-colors duration-300 text-center"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
            
            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-teal-100 rounded-full opacity-20 animate-blob"></div>
                <div className="relative h-full w-full dna-container flex items-center justify-center">
                  <img src={HeartImage} alt="Heart" className="w-5/6 h-auto animate-float" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-2/3 h-2/3 bg-teal-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-2/3 h-2/3 bg-teal-300 rounded-full filter blur-3xl opacity-20"></div>
      </section>

      {/* Features Section Preview */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-teal-500 mb-4">Our Key Features</h2>
            <p className="text-lg text-teal-400 max-w-2xl mx-auto">Empowering rural communities with accessible healthcare solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Doctor */}
            <div className="frost-panel p-6 border-2 border-teal-100 bg-gradient-to-br from-white to-teal-100">
              <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#284954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 9h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z"></path>
                  <path d="M5 9h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z"></path>
                  <path d="M12 14a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-teal-500 mb-2">AI-Powered Diagnostics</h3>
              <p className="text-teal-400">Get instant health assessments and personalized recommendations from our advanced AI system.</p>
            </div>
            
            {/* Feature 2 - Training */}
            <div className="frost-panel p-6 border-2 border-teal-200 bg-gradient-to-br from-white to-teal-100">
              <div className="w-14 h-14 bg-teal-200 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#284954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-teal-500 mb-2">Health Training</h3>
              <p className="text-teal-400">Access educational resources and training for community health workers and local practitioners.</p>
            </div>
            
            {/* Feature 3 - Medicine Delivery */}
            <div className="frost-panel p-6 border-2 border-teal-100 bg-gradient-to-br from-white to-teal-100">
              <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#284954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0"></path>
                  <path d="M10 5v11"></path>
                  <path d="M5 6c6.667 0 13.333 0 20 0"></path>
                  <path d="M8 14c4 0 8 0 12 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-teal-500 mb-2">Medicine Delivery</h3>
              <p className="text-teal-400">Get essential medications delivered to your doorstep, even in remote areas with limited access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section id="chat" className="py-20 bg-gradient-to-b from-white to-teal-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-teal-500 mb-4">
              AI Health Assistant
            </h2>
            <p className="text-lg text-teal-400 max-w-2xl mx-auto">
              Describe your symptoms and get instant personalized recommendations and medication suggestions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ChatBot />
          </div>
        </div>
      </section>

      {/* Doctor Appointment Section */}
      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-teal-500 mb-4">
              Book a Doctor Appointment
            </h2>
            <p className="text-lg text-teal-400 max-w-2xl mx-auto">
              Connect with qualified healthcare professionals for remote consultations
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <DoctorAppointment />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-teal-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to experience better healthcare?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join thousands of users who are already benefiting from MediCare's innovative healthcare solutions.</p>
          <a href="/ai-doctor" className="inline-block px-8 py-4 bg-white text-teal-500 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Try AI Consultation Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
