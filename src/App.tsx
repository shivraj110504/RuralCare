
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import AiDoctor from "./pages/AiDoctor";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Training from "./pages/Training";
import MedicineDelivery from "./pages/MedicineDelivery";
import HospitalBeds from "./pages/HospitalBeds";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import MedicalDetails from "./pages/MedicalDetails";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-doctor" element={<AiDoctor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/training" element={<Training />} />
            <Route path="/medicine-delivery" element={<MedicineDelivery />} />
            <Route path="/hospital-beds" element={<HospitalBeds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/medical-details" element={<MedicalDetails />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
