
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMykZx_U2UpvuPjwGvXZZMUrPMBwTmUxY",
  authDomain: "medicare-app-demo.firebaseapp.com",
  projectId: "medicare-app-demo",
  storageBucket: "medicare-app-demo.appspot.com",
  messagingSenderId: "698450195761",
  appId: "1:698450195761:web:a7c7b85d70a4d2cfd39a1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
