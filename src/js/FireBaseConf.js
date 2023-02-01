// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_cV8NP-ECIkVC6i2OZD86oQvadHNSKe0",
  authDomain: "isaac-full-stack.firebaseapp.com",
  databaseURL:
    "https://isaac-full-stack-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "isaac-full-stack",
  storageBucket: "isaac-full-stack.appspot.com",
  messagingSenderId: "246746268861",
  appId: "1:246746268861:web:a013f38b6ef1232170e3d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
