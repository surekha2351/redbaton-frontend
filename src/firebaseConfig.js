// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-d--ynq1egwnau8lJVn_1O7x8hl52g70",
  authDomain: "redbaton-b3c07.firebaseapp.com",
  projectId: "redbaton-b3c07",
  storageBucket: "redbaton-b3c07.appspot.com",
  messagingSenderId: "923979474261",
  appId: "1:923979474261:web:575de2e6303e78156efbdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}