import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC54pL762-FiGlw64ptzSOBQItK-w3L4qI",
    authDomain: "movemyseat.firebaseapp.com",
    projectId: "movemyseat",
    storageBucket: "movemyseat.appspot.com",
    messagingSenderId: "1097085778126",
    appId: "1:1097085778126:web:cc7eb263d79a81af7e789f",
    measurementId: "G-QGF025CSZ2"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app)

export class ManageAccount {
  register(email, password,username,id) {
    createUserWithEmailAndPassword(auth, email, password,username,id)
      .then((_) => {
        this.insertUserData(email,username,id)
        //window.location.href = "../index.html"; // Corrección de typo
        // Mostrar alerta de registro exitoso
        alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
      })
      .catch((error) => {
        console.error(error.message);
            // Mostrar alerta de error de registro
            alert("Error al registrar: " + error.message);
      });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "../index.html";
        // Mostrar alerta de inicio de sesión exitoso
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      })
      .catch((error) => {
        console.error(error.message);
                // Mostrar alerta de error de inicio de sesión
                alert("Error al iniciar sesión: " + error.message);
      });
  }

  signOut() {
    signOut(auth)
      .then((_) => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  insertUserData(email, username, id) {
    addDoc(collection(db, "usuarios"), {
        email: email,
        id_usuario: id,
        username: username
      })
      .then(() => {
        console.log("Usuario añadido correctamente a Firestore");
      })
      .catch((error) => {
        console.error("Error al añadir el usuario: ", error);
      });
  }
}