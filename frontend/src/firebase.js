import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfi-gj7f03c3iKSZx-kyedlAhqLNN8xLc",
  authDomain: "placement-preperation-project.firebaseapp.com",
  projectId: "placement-preperation-project",
  appId: "1:1097969742256:web:b1cac66bd4dbbceb67e675",
    storageBucket: "placement-preperation-project.firebasestorage.app",
     messagingSenderId: "1097969742256",
       measurementId: "G-NZ1KS2FGF3"
};

const app = initializeApp(firebaseConfig);

// ✅ IMPORTANT exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();