
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { GraduationCap, Book, FileText, Video, Users, Award } from 'lucide-react';

const Training = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-purple-900 mb-4">
              Healthcare Training Programs
            </h1>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto">
              Empowering local health workers and community volunteers with essential medical knowledge and skills
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
                <GraduationCap size={64} className="text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Beginner</span>
                  <span className="text-orange-500 font-semibold">Free</span>
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Basic Healthcare Training</h3>
                <p className="text-gray-600 mb-4">Learn essential healthcare skills for community health workers, including vital sign monitoring, basic first aid, and common illness identification.</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <FileText size={16} className="mr-1" />
                    5 Modules
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    1,248 Enrolled
                  </span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Enroll Now</Button>
              </div>
            </div>
            
            {/* Course 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
              <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center">
                <Book size={64} className="text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Intermediate</span>
                  <span className="text-orange-500 font-semibold">₹1,999</span>
                </div>
                <h3 className="text-xl font-bold text-orange-700 mb-2">Maternal & Child Health Care</h3>
                <p className="text-gray-600 mb-4">Comprehensive training on prenatal care, safe delivery practices, newborn care, and maternal health monitoring for rural health workers.</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <FileText size={16} className="mr-1" />
                    7 Modules
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    843 Enrolled
                  </span>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Enroll Now</Button>
              </div>
            </div>
            
            {/* Course 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
                <Video size={64} className="text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Advanced</span>
                  <span className="text-orange-500 font-semibold">₹2,499</span>
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Telemedicine Operation</h3>
                <p className="text-gray-600 mb-4">Learn to facilitate virtual consultations between doctors and patients, operate telemedicine equipment, and troubleshoot common issues.</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <FileText size={16} className="mr-1" />
                    6 Modules
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    621 Enrolled
                  </span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Enroll Now</Button>
              </div>
            </div>
            
            {/* Course 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
              <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center">
                <Award size={64} className="text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Professional</span>
                  <span className="text-orange-500 font-semibold">₹3,999</span>
                </div>
                <h3 className="text-xl font-bold text-orange-700 mb-2">Community Health Management</h3>
                <p className="text-gray-600 mb-4">Advanced training for community health leaders covering program management, health data collection, and community mobilization strategies.</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <FileText size={16} className="mr-1" />
                    9 Modules
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    485 Enrolled
                  </span>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Enroll Now</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">Why Train With MediCare?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Offline Learning</h3>
                <p className="text-gray-600">Access course materials even without internet connection</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Recognized Certification</h3>
                <p className="text-gray-600">Earn certificates recognized by healthcare authorities</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Expert Mentorship</h3>
                <p className="text-gray-600">Learn from experienced healthcare professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Training;
