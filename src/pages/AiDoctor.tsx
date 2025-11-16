
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot, { ChatBotHandle } from '../components/ChatBot';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Award, ShieldCheck, Phone, Clock, MapPin, Sparkles, Zap } from 'lucide-react';
import { useAnimateOnScroll, useStaggeredAnimation } from '@/animations/useAnimations';

const AiDoctor = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const chatBotRef = useRef<HTMLDivElement>(null);
  const chatApiRef = useRef<ChatBotHandle>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const callingAgentRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  const heroAnimation = useAnimateOnScroll(heroRef, 'animate-fade-in-up', 100);
  const chatBotAnimation = useAnimateOnScroll(chatBotRef, 'animate-scale-in', 200);
  const cardsAnimation = useAnimateOnScroll(cardsRef, 'animate-fade-in-up', 300);
  const callingAgentAnimation = useAnimateOnScroll(callingAgentRef, 'animate-fade-in-up', 400);
  const faqAnimation = useAnimateOnScroll(faqRef, 'animate-fade-in-up', 500);
  
  const { getAnimationProps } = useStaggeredAnimation(3, 150);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div ref={heroRef} className={`text-center mb-12 ${heroAnimation}`}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-teal-500 mb-4">
              Gemini AI-Powered Health Assistant
            </h1>
            <p className="text-xl text-teal-400 max-w-2xl mx-auto">
              Get instant health assessment, personalized recommendations, and medication suggestions by describing your symptoms.
            </p>
          </div>
          
          <div ref={chatBotRef} className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden hover-lift ${chatBotAnimation}`}>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-8 bg-gradient-to-br from-teal-500 to-teal-400 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Sparkles className="mr-2" />
                  How It Works
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-teal-500 rounded-full flex items-center justify-center mr-3 font-bold text-sm">1</span>
                    <span>Describe your symptoms in detail</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-teal-500 rounded-full flex items-center justify-center mr-3 font-bold text-sm">2</span>
                    <span>Gemini AI analyzes your symptoms pattern</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-teal-500 rounded-full flex items-center justify-center mr-3 font-bold text-sm">3</span>
                    <span>Get personalized health advice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-teal-500 rounded-full flex items-center justify-center mr-3 font-bold text-sm">4</span>
                    <span>Receive medication suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white text-teal-500 rounded-full flex items-center justify-center mr-3 font-bold text-sm">5</span>
                    <span>Book a doctor if needed</span>
                  </li>
                </ul>
                
                {/* Common Diseases Section */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🏥</span>
                    Common Conditions
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {['Fever','Common Cold','Headache / Migraine','Stomach Ache / Gastritis'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full text-xs transition-colors"
                          onClick={() => chatApiRef.current?.sendExternalMessage(label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Indigestion / Acidity','Diarrhea','Constipation','Cough'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full text-xs transition-colors"
                          onClick={() => chatApiRef.current?.sendExternalMessage(label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Sore Throat / Tonsillitis','Skin Rashes / Allergies','Urinary Tract Infection (UTI)'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full text-xs transition-colors"
                          onClick={() => chatApiRef.current?.sendExternalMessage(label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-8">
                {currentUser ? (
                  <ChatBot ref={chatApiRef} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-teal-100 p-6 rounded-xl mb-6">
                      <ShieldCheck size={48} className="mx-auto mb-4 text-teal-500" />
                      <h3 className="text-xl font-bold text-teal-500 mb-2">Please Login First</h3>
                      <p className="text-teal-400 mb-4">
                        To use our Gemini AI Health Assistant and get personalized medical advice, you need to be logged in.
                      </p>
                      <Button 
                        onClick={() => navigate('/login')}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        Login to Continue
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {currentUser && (
            <div ref={cardsRef} className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto ${cardsAnimation}`}>
              <Card className="bg-white shadow-md border-0 hover-scale transition-all duration-300"
                   {...getAnimationProps(0)}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                      <CalendarCheck className="h-6 w-6 text-teal-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-teal-500">Regular Check-ups</h3>
                    <p className="text-teal-300 text-sm">
                      Remember to schedule regular check-ups with your doctor even if you feel healthy.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md border-0 hover-scale transition-all duration-300"
                   {...getAnimationProps(2)}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-teal-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-teal-500">Health Goals</h3>
                    <p className="text-teal-300 text-sm">
                      Our AI assistant can help you track and achieve your personal health goals.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md border-0 hover-scale transition-all duration-300"
                   {...getAnimationProps(1)}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-6 w-6 text-teal-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-teal-500">Privacy Assured</h3>
                    <p className="text-teal-300 text-sm">
                      Your health data is encrypted and stored securely. We prioritize your privacy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Enhanced AI Calling Agent Section */}
          <div ref={callingAgentRef} className={`mt-16 max-w-4xl mx-auto ${callingAgentAnimation}`}>
            <div className="relative bg-gradient-to-br from-teal-500 via-teal-400 to-emerald-400 rounded-3xl p-1 shadow-2xl">
              <div className="relative bg-gradient-to-br from-teal-500 via-teal-400 to-emerald-400 rounded-3xl p-8 text-white text-center overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full animate-pulse-gentle"></div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 bg-white/10 rounded-full animate-bounce-gentle"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full animate-pulse-gentle"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Phone className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
                    <Sparkles className="mr-3" />
                    AI Calling Agent - 24/7 Support
                    <Sparkles className="ml-3" />
                  </h2>
                  
                  <p className="text-xl mb-8 text-white/95 font-medium">
                    🚀 Access all our website services through one simple phone call
                  </p>
                  
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 hover-scale">
                    <div className="text-lg font-semibold mb-3 flex items-center justify-center">
                      <Phone className="mr-2" />
                      Call Now:
                    </div>
                    <a 
                      href="tel:+12202469491" 
                      className="group text-4xl font-mono font-bold hover:text-yellow-300 transition-all duration-300 block"
                    >
                      <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:to-white transition-all duration-300">
                        +1 220 246 9491
                      </span>
                    </a>
                    <div className="mt-3 text-sm text-white/80">
                      ✨ Tap to call instantly - No wait times!
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center hover-scale transition-all duration-300">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        🏔️ Rural Area Support
                      </h3>
                      <p className="text-sm text-white/85 leading-relaxed">
                        Specially designed for rural areas with limited internet connectivity
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center hover-scale transition-all duration-300">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        ⚡ 24/7 Availability
                      </h3>
                      <p className="text-sm text-white/85 leading-relaxed">
                        Round-the-clock support whenever you need medical assistance
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center hover-scale transition-all duration-300">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Phone className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        🎯 Complete Services
                      </h3>
                      <p className="text-sm text-white/85 leading-relaxed">
                        Book appointments, order medicines, find hospitals - all in one call
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={faqRef} className={`mt-16 max-w-4xl mx-auto ${faqAnimation}`}>
            <h2 className="text-2xl font-bold text-teal-500 mb-6 text-center flex items-center justify-center">
              <Sparkles className="mr-2" />
              Frequently Asked Questions
              <Sparkles className="ml-2" />
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md hover-lift transition-all duration-300"
                   {...getAnimationProps(0)}>
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Is the Gemini AI doctor accurate?</h3>
                <p className="text-teal-300">Our AI health assistant has been trained on extensive medical data and provides suggestions with a high degree of accuracy. However, it is designed to be a complement to, not a replacement for, professional medical advice.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover-lift transition-all duration-300"
                   {...getAnimationProps(2)}>
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Is my health information secure?</h3>
                <p className="text-teal-300">Yes, all your health information is encrypted and stored securely. We adhere to strict privacy protocols and never share your personal health information without consent.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover-lift transition-all duration-300"
                   {...getAnimationProps(1)}>
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Can I use the AI doctor without internet?</h3>
                <p className="text-teal-300">A limited version of our AI health assistant is available offline. While full functionality requires an internet connection, basic symptom assessment can be performed offline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AiDoctor;
