// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC54pL762-FiGlw64ptzSOBQItK-w3L4qI",
  authDomain: "movemyseat.firebaseapp.com",
  projectId: "movemyseat",
  storageBucket: "movemyseat.appspot.com",
  messagingSenderId: "1097085778126",
  appId: "1:1097085778126:web:cc7eb263d79a81af7e789f",
  measurementId: "G-QGF025CSZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


let signUpForm = document.getElementById("signUpForm");

signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    let username = document.getElementById("user");
    let password = document.getElementById("password");
  
    if (username.value == "" || password.value == "") {
      username.style.borderColor = "red"
    } else {
      location("../index.hmtl")
    }
  });

