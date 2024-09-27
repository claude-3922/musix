import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOq43tYiDWa6h1V11P8FNi3nAahdxWdRo",
  authDomain: "musix-133ae.firebaseapp.com",
  projectId: "musix-133ae",
  storageBucket: "musix-133ae.appspot.com",
  messagingSenderId: "215556324430",
  appId: "1:215556324430:web:91cc6c07ef0f4e8d07571f",
  measurementId: "G-1XC8DKD8YT",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
