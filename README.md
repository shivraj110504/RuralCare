# 🏥 RuralCare - AI-Powered Healthcare for Rural India

<div align="center">
  <img src="./public/images/logo.svg" alt="RuralCare Logo" width="120" height="120" />
  
  **Bringing accessible, AI-driven healthcare solutions to underserved communities**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.1-green.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-blue.svg)](https://tailwindcss.com/)
</div>

---

## 🌟 Project Overview

RuralCare is a revolutionary AI-powered healthcare platform designed specifically for rural India, where access to quality healthcare remains a significant challenge. Our platform leverages advanced AI technology, including Google's Gemini AI, to provide 24/7 medical consultations, personalized treatment recommendations, and comprehensive healthcare services to communities with limited medical infrastructure.

### 🎯 Mission Statement

To democratize healthcare access in rural India by providing AI-driven medical consultations, remote healthcare services, and seamless connectivity to healthcare providers - bridging the gap between rural communities and quality medical care.

### 🌍 The Problem We're Solving

- **Limited Healthcare Access**: Rural areas often lack adequate medical facilities and specialists
- **Distance Barriers**: Patients need to travel long distances for basic medical consultations
- **Resource Constraints**: Shortage of healthcare professionals in rural regions
- **Communication Gaps**: Language and technology barriers in accessing healthcare information
- **Emergency Response**: Lack of immediate medical guidance during health emergencies

---

## ✨ Key Features

### 🤖 AI-Powered Health Assistant
- **Gemini AI Integration**: Advanced symptom analysis and medical recommendations
- **24/7 Availability**: Round-the-clock health consultations via chat interface
- **Multi-language Support**: Healthcare guidance in local languages
- **Offline Functionality**: Basic symptom assessment works without internet connectivity

### 📞 AI Calling Agent
- **Voice-Based Consultations**: Call +1 932-240-8510 for instant medical assistance
- **Complete Service Access**: Book appointments, order medicines, find hospitals via phone
- **Rural-Friendly**: Designed for areas with limited internet connectivity
- **24/7 Support**: Always available for medical emergencies and consultations

### 🏥 Comprehensive Healthcare Services
- **Remote Consultations**: Video/audio calls with qualified doctors
- **Medicine Delivery**: Order and receive medicines at your doorstep
- **Hospital Bed Tracking**: Real-time availability of hospital beds
- **Nearby Hospital Locator**: Find the nearest healthcare facilities
- **Appointment Booking**: Schedule consultations with specialists

### 👤 User Management & Privacy
- **Secure Authentication**: Firebase-based user authentication
- **Medical History**: Encrypted storage of complete medical records
- **Privacy Protection**: HIPAA-compliant data handling and storage
- **Personalized Care**: Tailored recommendations based on medical history

### 🎨 Enhanced User Experience
- **Responsive Design**: Optimized for all devices and screen sizes
- **Smooth Animations**: Framer Motion powered interactions
- **Accessible Interface**: Designed for users with varying technical literacy
- **Progressive Web App**: Works offline and can be installed on devices

---

## 🛠 Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern UI development with hooks and context
- **TypeScript 5.5.3**: Type-safe development and better code maintainability
- **Vite 5.4.1**: Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **shadcn/ui**: High-quality, customizable UI components
- **Framer Motion 12.4.10**: Smooth animations and interactions
- **Lucide React**: Beautiful, customizable icons

### AI & Backend Services
- **Google Gemini AI**: Advanced AI for medical consultations and recommendations
- **Firebase 11.4.0**: Authentication, real-time database, and hosting
- **Supabase**: Additional backend services and database management

### Maps & Location Services
- **Leaflet 1.9.4**: Interactive maps for hospital location services
- **React Leaflet 5.0.0**: React bindings for Leaflet maps

### State Management & Data Fetching
- **TanStack Query 5.56.2**: Server state management and caching
- **React Hook Form 7.53.0**: Form validation and state management
- **React Router DOM 6.26.2**: Client-side routing

### Development & Build Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Bun**: Fast package manager and runtime

---

## 📁 Project Structure

```
ruralcare-bot/
├── public/                     # Static assets
│   ├── images/                 # Icons and illustrations
│   │   ├── logo.svg           # RuralCare logo
│   │   ├── dna.svg            # Medical animations
│   │   ├── cell.svg           # Scientific illustrations
│   │   └── stethoscope.svg    # Medical icons
│   ├── favicon.ico            # Website favicon
│   └── og-image.png           # Social media preview image
│
├── src/                       # Source code
│   ├── animations/            # Animation hooks and utilities
│   │   └── useAnimations.tsx  # Custom animation hooks
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Hero.tsx           # Landing page hero section
│   │   ├── FeatureSection.tsx # Features showcase
│   │   ├── ChatBot.tsx        # AI chatbot interface
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── Footer.tsx         # Footer component
│   │   └── DoctorAppointment.tsx # Appointment booking
│   │
│   ├── contexts/              # React context providers
│   │   └── AuthContext.tsx    # Authentication context
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   └── use-toast.ts       # Toast notification hook
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── utils.ts           # General utility functions
│   │
│   ├── pages/                 # Application pages
│   │   ├── Index.tsx          # Landing page
│   │   ├── AiDoctor.tsx       # AI consultation page
│   │   ├── Login.tsx          # User authentication
│   │   ├── MedicineDelivery.tsx # Medicine ordering
│   │   ├── HospitalBeds.tsx   # Hospital bed availability
│   │   ├── NearbyHospitals.tsx # Hospital locator
│   │   └── Profile.tsx        # User profile management
│   │
│   ├── services/              # External service integrations
│   │   └── emailService.ts    # Email notification service
│   │
│   ├── utils/                 # Utility functions
│   │   └── geminiAI.ts        # Gemini AI integration
│   │
│   └── App.tsx                # Main application component
│
├── supabase/                  # Supabase configuration
│   ├── functions/             # Edge functions
│   └── migrations/            # Database migrations
│
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── vite.config.ts            # Vite build configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **bun** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd ruralcare-bot
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun (recommended for faster installation)
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using bun
   bun run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🏗 Development Guide

### Code Structure Guidelines

1. **Components**: Create reusable components in `src/components/`
2. **Pages**: Add new pages in `src/pages/` and update routing in `App.tsx`
3. **Hooks**: Custom hooks go in `src/hooks/`
4. **Utilities**: Helper functions in `src/utils/` or `src/lib/`
5. **Styling**: Use Tailwind CSS classes and maintain responsive design

### Adding New Features

1. **AI Chat Features**: Modify `src/components/ChatBot.tsx`
2. **New Pages**: Create in `src/pages/` and add routes in `App.tsx`
3. **Database Changes**: Update Supabase migrations in `supabase/migrations/`
4. **UI Components**: Extend `src/components/ui/` with new shadcn components

### Best Practices

- **Type Safety**: Use TypeScript for all new code
- **Responsive Design**: Test on multiple device sizes
- **Accessibility**: Follow WCAG guidelines for inclusive design
- **Performance**: Optimize images and use lazy loading
- **Security**: Never expose API keys in client-side code

---

## 🌐 Deployment

### Recommended Platforms

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

### Environment Variables for Production

Ensure all environment variables are properly configured in your hosting platform:
- Firebase configuration
- Gemini AI API key
- Supabase credentials

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Install dependencies**: `npm install`
5. **Make your changes** and test thoroughly
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- **Code Quality**: Follow TypeScript and React best practices
- **Testing**: Ensure your changes don't break existing functionality
- **Documentation**: Update README if you add new features
- **Accessibility**: Maintain WCAG compliance
- **Mobile-First**: Ensure responsive design across all devices

### Areas for Contribution

- 🌍 **Localization**: Add support for regional Indian languages
- 🔧 **Features**: Enhance AI capabilities and user experience
- 🎨 **Design**: Improve UI/UX for rural users
- 📱 **Mobile**: Optimize for feature phones and low-end devices
- 🔒 **Security**: Enhance data privacy and security measures

---

## 📞 Support & Contact

### For Users
- **AI Calling Agent**: +1 932-240-8510 (24/7 Support)
- **Email Support**: support@ruralcare.health
- **Documentation**: Visit our help center

### For Developers
- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Join our community discussions
- **Discord**: Join our developer community

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced AI capabilities
- **Firebase** for reliable backend services
- **Supabase** for database and real-time features
- **shadcn/ui** for beautiful UI components
- **Rural Healthcare Workers** for their invaluable feedback
- **Open Source Community** for continuous support

---

## 📈 Project Stats

- 🏥 **Healthcare Services**: 8+ integrated services
- 🤖 **AI-Powered**: Gemini AI for medical consultations
- 📱 **Mobile-Optimized**: 100% responsive design
- 🌍 **Offline-Ready**: Works with limited connectivity
- 🔒 **Secure**: HIPAA-compliant data handling
- ⚡ **Fast**: Vite-powered development and build

---

<div align="center">
  <h3>🚀 Making Healthcare Accessible for All</h3>
  <p><strong>RuralCare - Where Technology Meets Compassion</strong></p>
  
  [Website](https://ruralcare.health) • [Documentation](https://docs.ruralcare.health) • [Community](https://community.ruralcare.health)
</div>
#   R u r a l C a r e  
 