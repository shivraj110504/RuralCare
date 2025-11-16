
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define diseases with medicines, things to avoid, and home remedies
export const medicalAdvice = {
  "fever": {
    "medicines": ["Paracetamol", "Ibuprofen"],
    "avoid": ["Cold drinks", "Heavy meals", "Excess physical activity"],
    "remedies": ["Drink warm fluids", "Take rest", "Use a cold compress on the forehead"]
  },
  "cold": {
    "medicines": ["Cetirizine", "Paracetamol"],
    "avoid": ["Cold beverages", "Dairy products", "Dust and smoke"],
    "remedies": ["Drink warm honey-lemon tea", "Steam inhalation", "Gargle with salt water"]
  },
  "cough": {
    "medicines": ["Dextromethorphan", "Ambroxol"],
    "avoid": ["Cold food", "Sugary snacks", "Smoking"],
    "remedies": ["Drink ginger tea", "Use honey and warm water", "Stay hydrated"]
  },
  "headache": {
    "medicines": ["Aspirin", "Ibuprofen"],
    "avoid": ["Bright lights", "Loud noises", "Caffeine"],
    "remedies": ["Rest in a dark room", "Apply a cold compress", "Drink plenty of water"]
  },
  "diabetes": {
    "medicines": ["Metformin", "Insulin"],
    "avoid": ["Sugary foods", "High-carb diet", "Alcohol"],
    "remedies": ["Eat fiber-rich foods", "Exercise regularly", "Monitor blood sugar levels"]
  },
  "hypertension": {
    "medicines": ["Amlodipine", "Losartan"],
    "avoid": ["Salty foods", "Stress", "Caffeine"],
    "remedies": ["Practice deep breathing", "Reduce sodium intake", "Exercise regularly"]
  },
  "asthma": {
    "medicines": ["Salbutamol", "Budesonide"],
    "avoid": ["Dust", "Cold air", "Strong odors"],
    "remedies": ["Use a humidifier", "Practice breathing exercises", "Avoid allergens"]
  },
  "infection": {
    "medicines": ["Amoxicillin", "Azithromycin"],
    "avoid": ["Unhygienic conditions", "Touching infected areas", "Self-medication"],
    "remedies": ["Drink turmeric milk", "Maintain hygiene", "Stay hydrated"]
  },
  "pain": {
    "medicines": ["Ibuprofen", "Acetaminophen"],
    "avoid": ["Heavy lifting", "Prolonged standing", "High-impact activities"],
    "remedies": ["Apply heat or ice", "Practice stretching", "Get adequate rest"]
  },
  "acidity": {
    "medicines": ["Pantoprazole", "Ranitidine"],
    "avoid": ["Spicy food", "Caffeine", "Smoking"],
    "remedies": ["Drink cold milk", "Eat smaller meals", "Chew gum to increase saliva"]
  },
  "allergy": {
    "medicines": ["Loratadine", "Fexofenadine"],
    "avoid": ["Pollen", "Dust mites", "Strong perfumes"],
    "remedies": ["Use a saline rinse", "Wear a mask outside", "Keep home dust-free"]
  },
  "anxiety": {
    "medicines": ["Alprazolam", "Diazepam"],
    "avoid": ["Caffeine", "Negative news", "Overworking"],
    "remedies": ["Practice meditation", "Take deep breaths", "Maintain a sleep schedule"]
  },
  "depression": {
    "medicines": ["Fluoxetine", "Sertraline"],
    "avoid": ["Social isolation", "Junk food", "Excessive alcohol"],
    "remedies": ["Engage in social activities", "Exercise daily", "Practice gratitude"]
  },
  "arthritis": {
    "medicines": ["Methotrexate", "Naproxen"],
    "avoid": ["Cold weather", "Excessive sugar", "Smoking"],
    "remedies": ["Take warm baths", "Do light stretching", "Maintain a healthy weight"]
  },
  "covid": {
    "medicines": ["Molnupiravir", "Favipiravir"],
    "avoid": ["Crowded places", "Close contact with infected persons", "Cold drinks"],
    "remedies": ["Rest well", "Drink warm fluids", "Isolate if symptomatic"]
  },
};

// Define basic greetings & general responses
export const generalResponses: Record<string, string> = {
  "hello": "Hello! How can I assist you today?",
  "hi": "Hi there! What can I help you with?",
  "hey": "Hey! Do you have any medical-related questions?",
  "how are you": "I'm just a chatbot, but I'm here to help!",
  "good morning": "Good morning! Hope you're doing well.",
  "good evening": "Good evening! How can I assist you?",
  "thank you": "You're welcome! Stay healthy!",
  "thanks": "You're welcome! Have a great day!"
};

// Initialize the Gemini AI Client
const GEMINI_API_KEY = "AIzaSyCDW682lYu1tuQaX27cvZY-qwJ_2edp9-8";

// Create a client with the API key
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
}

// Function to get response from Gemini AI
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!model) {
    return "I'm currently experiencing technical difficulties. Please try asking about common symptoms like fever, cold, headache, or cough, and I'll provide helpful information based on our medical database.";
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Check if response is empty or too short
    if (!text || text.trim().length < 10) {
      return "I understand your concern. Based on your symptoms, I recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, you can try some general remedies like staying hydrated and getting adequate rest.";
    }
    
    return text;
  } catch (error: any) {
    console.error("Error getting response from Gemini AI:", error);
    
    // Provide more helpful fallback based on error type
    if (error.message?.includes('API_KEY')) {
      return "I'm currently experiencing technical difficulties. Please try asking about common symptoms like fever, cold, headache, or cough, and I'll provide helpful information based on our medical database.";
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return "I'm currently experiencing high demand. Please try again in a few moments, or ask about common symptoms like fever, cold, headache, or cough for immediate assistance.";
    } else {
      return "I understand your concern. Based on your symptoms, I recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, you can try some general remedies like staying hydrated and getting adequate rest.";
    }
  }
};

// Helper function to check if message contains a disease
export const containsDisease = (message: string): boolean => {
  const userQueryLower = message.toLowerCase().trim();
  return Object.keys(medicalAdvice).some(disease => userQueryLower.includes(disease));
};

// Main function to get chatbot response
export const getChatbotResponse = async (userQuery: string, userName?: string): Promise<string> => {
  const userQueryLower = userQuery.toLowerCase().trim();

  // Check for basic greetings first
  if (userQueryLower in generalResponses) {
    return generalResponses[userQueryLower];
  }

  // Check for known diseases
  for (const [disease, advice] of Object.entries(medicalAdvice)) {
    if (userQueryLower.includes(disease)) {
      let responseText = `🔹 **${disease.charAt(0).toUpperCase() + disease.slice(1)}**\n`;
      responseText += `💊 **Medicines:** ${advice.medicines.join(', ')}\n`;
      responseText += `❌ **Avoid:** ${advice.avoid.join(', ')}\n`;
      responseText += `✅ **Home Remedies:** ${advice.remedies.join(', ')}\n`;
      responseText += "\n⚠️ Always consult a doctor before taking any medication.";
      return responseText;
    }
  }

  // Check for common symptom keywords and provide helpful responses
  const commonSymptoms = ['pain', 'ache', 'hurt', 'sore', 'uncomfortable', 'feeling', 'symptom'];
  if (commonSymptoms.some(symptom => userQueryLower.includes(symptom))) {
    return `I understand you're experiencing discomfort. For general pain relief, you can try:
    
💊 **Over-the-counter options:** Paracetamol or Ibuprofen
❌ **Avoid:** Heavy lifting, prolonged standing, high-impact activities
✅ **Home remedies:** Apply heat or ice, practice stretching, get adequate rest

⚠️ If pain persists or worsens, please consult a healthcare professional.`;
  }

  // If not a known disease, use Gemini AI
  const greeting = userName ? `Hello ${userName}, ` : "";
  const aiPrompt = `${greeting}You are an AI medical assistant. Provide a **concise, accurate** answer to:\n${userQuery}\n\nKeep the response short and factual.`;

  try {
    return await getGeminiResponse(aiPrompt);
  } catch (error) {
    // Fallback response if everything fails
    return `I understand your concern about "${userQuery}". While I'm experiencing some technical difficulties, I recommend:

1. **For immediate relief:** Try basic remedies like rest, hydration, and over-the-counter pain relief if appropriate
2. **For serious symptoms:** Consult a healthcare professional immediately
3. **For common conditions:** Ask about specific symptoms like fever, cold, headache, or cough

⚠️ Always consult a doctor for proper diagnosis and treatment.`;
  }
};
