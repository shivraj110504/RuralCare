
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-teal-500 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">MediCare</h3>
            <p className="text-teal-100 mb-4">
              Making quality healthcare accessible to everyone in rural India through innovative AI technology and remote consultations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-teal-200 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-teal-200 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-teal-200 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-teal-100 hover:text-teal-200 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#chat" className="text-teal-100 hover:text-teal-200 transition-colors">AI Health Assistant</a>
              </li>
              <li>
                <a href="#appointment" className="text-teal-100 hover:text-teal-200 transition-colors">Book Appointment</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Our Doctors</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">AI Symptom Checker</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Remote Consultations</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Medicine Delivery</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Medical Records</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Health Education</a>
              </li>
              <li>
                <a href="#" className="text-teal-100 hover:text-teal-200 transition-colors">Emergency Support</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-teal-200" />
                <span className="text-teal-100">
                  123 Healthcare Campus,<br />
                  Bangalore, Karnataka 560001,<br />
                  India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-teal-200" />
                <span className="text-teal-100">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-teal-200" />
                <span className="text-teal-100">support@medicare-india.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-teal-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-teal-200 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} MediCare. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-teal-200 hover:text-teal-100 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-teal-200 hover:text-teal-100 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-teal-200 hover:text-teal-100 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
