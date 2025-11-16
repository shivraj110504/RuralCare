
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-teal-500 mb-8">About MediCare</h1>
            
            <div className="prose prose-lg prose-teal max-w-none">
              <p className="text-xl text-teal-400 mb-6">
                MediCare is dedicated to revolutionizing healthcare access in rural India through innovative technology solutions.
              </p>
              
              <h2 className="text-2xl font-bold text-teal-500 mt-8 mb-4">Our Mission</h2>
              <p className="text-teal-500">
                Our mission is to bridge the healthcare gap between urban and rural areas in India. By leveraging artificial intelligence and telemedicine, 
                we aim to provide high-quality healthcare services to even the most remote communities.
              </p>
              
              <h2 className="text-2xl font-bold text-teal-500 mt-8 mb-4">The Challenge</h2>
              <p className="text-teal-500">
                Rural India faces significant healthcare challenges, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-teal-500">
                <li>Limited access to medical professionals</li>
                <li>Long distances to healthcare facilities</li>
                <li>Unreliable internet connectivity</li>
                <li>Shortage of specialized care</li>
                <li>Difficulty in accessing medications</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-teal-500 mt-8 mb-4">Our Solution</h2>
              <p className="text-teal-500">
                MediCare combines AI technology with remote healthcare delivery to overcome these challenges. Our platform features:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-teal-500">
                <li>AI-powered symptom assessment and diagnostic assistance</li>
                <li>Remote consultations with qualified doctors</li>
                <li>Offline access to medical information</li>
                <li>Medication delivery services</li>
                <li>Training for local health workers</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-teal-500 mt-8 mb-4">Our Impact</h2>
              <p className="text-teal-500">
                Since our launch, MediCare has:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-teal-500">
                <li>Served over 100,000 patients in rural areas</li>
                <li>Connected 5,000+ villages to quality healthcare</li>
                <li>Reduced travel time for medical consultations by 85%</li>
                <li>Trained 2,000+ local health workers</li>
                <li>Delivered essential medications to remote locations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
