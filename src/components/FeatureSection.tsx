
import React, { useRef } from 'react';
import { useAnimateOnScroll, useStaggeredAnimation } from '../animations/useAnimations';

const FeatureSection: React.FC = () => {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const headerAnimation = useAnimateOnScroll(headerRef, 'animate-fade-in-up', 0);
  const section1Class = useAnimateOnScroll(section1Ref, 'animate-fade-in-left', 100);
  const section2Class = useAnimateOnScroll(section2Ref, 'animate-fade-in-right', 200);
  const section3Class = useAnimateOnScroll(section3Ref, 'animate-fade-in-left', 300);
  const section4Class = useAnimateOnScroll(section4Ref, 'animate-fade-in-right', 400);
  
  const { getAnimationProps } = useStaggeredAnimation(4, 150);

  return (
    <section id="features" className="section-container">
      <div ref={headerRef} className={`text-center mb-16 ${headerAnimation}`}>
        <h2 className="section-heading">Comprehensive Healthcare <span className="text-medicare-600">Features</span></h2>
        <p className="section-subheading">
          Designed to deliver quality healthcare services to rural areas with limited access to medical facilities
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div ref={section1Ref} className={`frost-panel hover-lift transition-all duration-500 ${section1Class}`}
             {...getAnimationProps(0)}>
          <div className="p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-medicare-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-medicare-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17.99V14.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4">AI-Powered Diagnosis</h3>
            <p className="text-gray-600 mb-6">Our advanced AI algorithms analyze symptoms and medical history to provide precise treatment recommendations in real-time, even in areas with limited internet connectivity.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 symptom analysis and diagnosis</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized treatment plans</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Medication recommendations with dosage</span>
              </li>
            </ul>
          </div>
        </div>

        <div ref={section2Ref} className={`frost-panel ${section2Class}`}>
          <div className="p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.97 12.29C21.97 18.02 17.35 22.64 11.62 22.64C5.89 22.64 1.27 18.02 1.27 12.29C1.27 6.56 5.89 1.94 11.62 1.94C17.35 1.94 21.97 6.56 21.97 12.29Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.62 16.79V12.29H7.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4">Remote Consultations</h3>
            <p className="text-gray-600 mb-6">Connect with qualified doctors through video, audio, or text consultations from the comfort of your home, eliminating the need for long-distance travel to medical facilities.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure video and audio calls</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Text-based consultations for low-bandwidth areas</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Follow-up appointment scheduling</span>
              </li>
            </ul>
          </div>
        </div>

        <div ref={section3Ref} className={`frost-panel ${section3Class}`}>
          <div className="p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-medicare-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-medicare-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 10.65H9.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8.21V13.21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86V19.95C3.32 21.75 4.61 22.51 6.19 21.64L11.07 18.93C11.59 18.64 12.43 18.64 12.94 18.93L17.82 21.64C19.4 22.52 20.69 21.76 20.69 19.95V5.86C20.68 3.74 18.95 2 16.82 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4">Offline Access</h3>
            <p className="text-gray-600 mb-6">MediCare is designed to work in areas with limited connectivity, providing essential medical services even when internet access is intermittent or unavailable.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Offline symptom assessment</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Local data storage with sync capabilities</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-medicare-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Low-bandwidth optimized application</span>
              </li>
            </ul>
          </div>
        </div>

        <div ref={section4Ref} className={`frost-panel ${section4Class}`}>
          <div className="p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4">Medical History Database</h3>
            <p className="text-gray-600 mb-6">Securely store and access your complete medical history, enabling more accurate diagnoses and personalized treatment plans from healthcare providers.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure encryption of medical data</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Previous diagnoses and treatment history</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Medication tracking and reminders</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
