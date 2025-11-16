
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll, useStaggeredAnimation } from '@/animations/useAnimations';

const AboutSection: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const headerAnimation = useAnimateOnScroll(headerRef, 'animate-fade-in-up', 0);
  const contentAnimation = useAnimateOnScroll(contentRef, 'animate-fade-in-left', 200);
  const imageAnimation = useAnimateOnScroll(imageRef, 'animate-fade-in-right', 300);
  
  return (
    <section id="about" className="section-container bg-gradient-to-b from-white to-medicare-50/30">
      <div ref={headerRef} className={`text-center mb-16 ${headerAnimation}`}>
        <h2 className="section-heading">About <span className="text-medicare-600">MediCare</span></h2>
        <p className="section-subheading">
          Our mission is to make quality healthcare accessible to everyone, regardless of location
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div ref={contentRef} className={`${contentAnimation}`}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="hover-scale transition-transform duration-300"
          >
          <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6">Bridging the Healthcare Gap in Rural India</h3>
          
          <div className="space-y-6 text-gray-600">
            <p>
              MediCare was founded with a singular vision: to overcome the healthcare disparities between urban and rural India. 
              We recognized that while 70% of India's population resides in rural areas, they have access to less than 30% of the country's doctors.
            </p>
            <p>
              Our AI-powered platform combines cutting-edge technology with medical expertise to deliver reliable healthcare services
              to the most remote locations, addressing the challenges of distance, infrastructure limitations, and doctor shortages.
            </p>
            <p>
              By leveraging artificial intelligence, we're able to provide initial diagnoses, treatment recommendations, and
              follow-up care, all while connecting patients with qualified doctors through our telehealth services when needed.
            </p>
            
            <div className="pt-4">
              <button className="bg-medicare-600 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-medicare-500/20 hover:shadow-xl hover:shadow-medicare-500/30 transition-all duration-300 hover:bg-medicare-700">
                Learn More About Our Mission
              </button>
            </div>
          </div>
        </motion.div>
        </div>
        
        <div ref={imageRef} className={`${imageAnimation}`}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative hover-lift transition-all duration-500"
          >
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-medicare-500 to-medicare-600 flex items-center justify-center animate-pulse-gentle">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Healthcare Revolution</h3>
              <p className="text-gray-600 mb-6">Transforming rural healthcare with AI-powered solutions and telemedicine capabilities.</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/50 rounded-xl hover-scale transition-all duration-300">
                  <div className="text-2xl font-bold text-medicare-600 animate-bounce-gentle">70%</div>
                  <div className="text-sm text-gray-600">Rural Population</div>
                </div>
                <div className="p-4 bg-white/50 rounded-xl hover-scale transition-all duration-300">
                  <div className="text-2xl font-bold text-medicare-600 animate-bounce-gentle">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-gradient-to-tl from-teal-200 to-medicare-200 rounded-full opacity-20 blur-3xl animate-pulse-gentle"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
