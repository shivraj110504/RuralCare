import React, { useRef } from 'react';
  import { motion } from 'framer-motion';
  import { useAnimateOnScroll, useStaggeredAnimation } from '@/animations/useAnimations';
  import HeartImage from '@/assets/HeaderImage 1.png';
  
  const Hero: React.FC = () => {
    const dnaRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
  
    const heroAnimation = useAnimateOnScroll(heroRef, 'animate-fade-in-up', 0);
    const contentAnimation = useAnimateOnScroll(contentRef, 'animate-fade-in-left', 200);
    const { getAnimationProps } = useStaggeredAnimation(3, 200);
  
    return (
      <section className="relative min-h-screen pt-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-medicare-100/70 to-transparent rounded-bl-[100px] opacity-80" />
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-teal-100/70 to-transparent rounded-tr-[100px] opacity-80" />
        </div>
      
      {/* Floating heart image (replacing DNA) */}
      <div className="absolute top-1/4 -right-24 w-72 h-[26rem] opacity-20 animate-float">
        <div ref={dnaRef} className="dna-container">
          <img src={HeartImage} alt="Heart" className="absolute top-0 w-full h-auto animate-rotate-slow" />
        </div>
      </div>
      
      {/* Floating cells */}
      <div className="absolute top-1/3 left-20 w-24 h-24 opacity-30 animate-float">
        <img src="/images/cell.svg" alt="Cell" className="animate-pulse-subtle" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 opacity-20 animate-blob">
        <img src="/images/cell.svg" alt="Cell" className="animate-rotate-slower" />
      </div>
      
      <div ref={heroRef} className={`container mx-auto px-6 relative z-10 ${heroAnimation}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
              AI-Powered Healthcare for
              <span className="text-medicare-600 block">Rural India</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Bringing accessible, AI-driven healthcare solutions to underserved communities with personalized treatment recommendations and remote doctor consultations.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="bg-medicare-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-medicare-500/20 hover:shadow-xl hover:shadow-medicare-500/30 transition-all duration-300 hover:bg-medicare-700">
              Try AI Chat
            </button>
            <button className="bg-white text-medicare-700 px-8 py-3 rounded-full font-medium shadow-md border border-medicare-200 hover:border-medicare-300 hover:bg-medicare-50 transition-all duration-300">
              Book Consultation
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 md:mt-24 max-w-5xl mx-auto frost-panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative p-6 md:p-8 lg:p-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-medicare-100/40 to-teal-100/40 opacity-70" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-medicare-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-medicare-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.5 12.65L13.51 11.65C13.28 11.42 13.28 11.05 13.51 10.82C13.74 10.59 14.11 10.59 14.34 10.82L15.33 11.82C15.56 12.05 15.56 12.42 15.33 12.65C15.1 12.88 14.73 12.88 14.5 12.65Z" fill="currentColor"/>
                    <path d="M9.5 12.65C9.27 12.88 8.9 12.88 8.67 12.65C8.44 12.42 8.44 12.05 8.67 11.82L9.66 10.82C9.89 10.59 10.26 10.59 10.49 10.82C10.72 11.05 10.72 11.42 10.49 11.65L9.5 12.65Z" fill="currentColor"/>
                    <path d="M12.33 13.4C12.01 13.4 11.74 13.14 11.74 12.81V9.68C11.74 9.36 12 9.09 12.33 9.09C12.66 9.09 12.92 9.35 12.92 9.68V12.81C12.92 13.14 12.65 13.4 12.33 13.4Z" fill="currentColor"/>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-1">AI-Powered Diagnosis</h3>
                  <p className="text-gray-600">Our advanced AI analyzes symptoms and provides accurate treatment recommendations, available 24/7.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-1">Remote Consultations</h3>
                  <p className="text-gray-600">Connect with qualified doctors remotely, eliminating travel needs and saving precious time.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
