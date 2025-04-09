// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtSz72DKAjH4oyfR8MdE5GYyiqwQFOgQs",
  authDomain: "cigpp-proto.firebaseapp.com",
  projectId: "cigpp-proto",
  storageBucket: "cigpp-proto.firebasestorage.app",
  messagingSenderId: "459653782784",
  appId: "1:459653782784:web:b5991faa49258ad29167e5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { auth };
