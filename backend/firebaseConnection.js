import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { Constantes } from '../backend/constantes.js';

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

  register(email, password, username, id) {
    createUserWithEmailAndPassword(auth, email, password, username, id)
      .then((_) => {
        this.insertUserData(email, username, id)
        generateSession(username, id)
        // // Corrección de typo
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
        obtainUserData(email)
        //window.location.href = "../index.html";
        // Mostrar alerta de inicio de sesión exitoso
        return true
      })
      .catch((error) => {
        console.error(error.message);
        // Mostrar alerta de error de inicio de sesión
        return false
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

  signOutNotIndex() {
    signOut(auth)
      .then((_) => {
        window.location.href = "../index.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  insertUserData(email, username, id) {
    setDoc(doc(db, "usuarios", email), {
      email: email,
      id_usuario: id,
      username: username
    })
      .then(() => {
        console.log("Usuario añadido correctamente a Firestore");
        window.location.href = "../index.html";
      })
      .catch((error) => {
        console.error("Error al añadir el usuario: ", error);
      });
  }

  insertPeticionDeCambio(asiento_ofrecido, asiento_buscado) {
    setDoc(doc(db, "peticion_cambio", generarId()), {
      asiento_buscado: asiento_buscado,
      asiento_ofrecido: asiento_ofrecido,
      destino: sessionStorage.getItem("destino"),
      fecha_vuelo: sessionStorage.getItem("fecha_vuelo"),
      origen: sessionStorage.getItem("origen"),
      id_usuario: sessionStorage.getItem("username"),
      id_vuelo: sessionStorage.getItem("id_vuelo"),
      solicitante: "",
      status: "CREATED"
    })
      .then(() => {
        console.log("Peticion de cambio añadida correctamente a Firestore");
        mostrarMensaje(Constantes.PETICION_CREADA);
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 5000);
      })
      .catch((error) => {
        console.error("Error al añadir la peticion de cambio: ", error);
      });
  }

  createRequest(petition) {
    setDoc(doc(db, "opciones_cambio", generarId()), {
      asiento_buscado: petition.asiento_buscado,
      asiento_ofrecido: petition.asiento_ofrecido,
      destino: petition.destino,
      fecha_vuelo: petition.fecha_vuelo,
      id_peticion_cambio: petition.id,
      origen: petition.origen,
      id_usuario: petition.id_usuario,
      id_vuelo: petition.id_vuelo,
      solicitante: sessionStorage.getItem("username"),
      status: "REQUESTED"
    })
      .then(() => {
        console.log("Peticion de cambio añadida correctamente a Firestore");
        mostrarMensaje(Constantes.PETICION_CREADA);
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 5000);
      })
      .catch((error) => {
        console.error("Error al añadir la peticion de cambio: ", error);
      });
  }

  obtainCambiosByUserId() {
    const q = query(
      collection(db, "peticion_cambio"),
      where("id_usuario", "==", sessionStorage.getItem("username")),
      where("status", "==", "CREATED")
    );

    return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
        return []; // En caso de error, devuelve un array vacío
      });
  }

  obtainPeticionesRecibidas() {
    const q = query(
      collection(db, "opciones_cambio"),
      where("id_usuario", "==", sessionStorage.getItem("username")),
      where("status", "==", "REQUESTED")
    );

    return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
        return []; // En caso de error, devuelve un array vacío
      });
  }

  obtainPeticionesAceptadas() {
    const q = query(
      collection(db, "opciones_cambio"),
      where("id_usuario", "==", sessionStorage.getItem("username")),
      where("status", "==", "ACCEPTED")
    );

    return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
        return []; // En caso de error, devuelve un array vacío
      });
  }

  cancelRequest(id) {
    const docRef = doc(db, "peticion_cambio", id);

    const nuevosDatos = {
      status: "CANCELED"
    };

    updateDoc(docRef, nuevosDatos)
      .then(() => {
        console.log("Documento actualizado correctamente.");
        this.getAllOptionRequestForCancelById(id)
        setTimeout(() => {
          location.reload()
        }, 2000);

        return true
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
        setTimeout(() => {
          location.reload()
        }, 2000);
        return false
      });
  }

  getAllOptionRequestForCancelById(id) {
    const q = query(
      collection(db, "opciones_cambio"),
      where("id_peticion_cambio", "==", id)
    );

   return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
      });
  }

  cancelOptionRequest(element) {
    const docRef = doc(db, "opciones_cambio", element.id);

    element.status = "CANCELED"

    updateDoc(docRef, element)
      .then(() => {
        console.log("Documento actualizado correctamente.");

      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
      });
  }

  acceptRequest(id) {
    const docRef = doc(db, "opciones_cambio", id);

    const nuevosDatos = {
      status: "ACCEPTED"
    };

    updateDoc(docRef, nuevosDatos)
      .then(() => {
        console.log("Documento actualizado correctamente.");
        setTimeout(() => {
          location.reload()
        }, 2000);

        return true
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
        setTimeout(() => {
          location.reload()
        }, 2000);
        return false
      });
  }

  refuseRequest(id) {
    const docRef = doc(db, "peticion_cambio", id);

    const nuevosDatos = {
      status: "REFUSED"
    };

    updateDoc(docRef, nuevosDatos)
      .then(() => {
        console.log("Documento actualizado correctamente.");
        setTimeout(() => {
          location.reload()
        }, 2000);

        return true
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
        setTimeout(() => {
          location.reload()
        }, 2000);
        return false
      });
  }


  obtainPeticionesCreadasPorFechayVuelo(fecha, vuelo) {
    const q = query(
      collection(db, "peticion_cambio"),
      where("id_vuelo", "==", vuelo),
      where("fecha_vuelo", "==", fecha)
    );
    return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
        return
      });
  }

  getNotisByUserID(){
    const q = query(
      collection(db, "notificaciones"),
      where("usuario_receptor", "==", sessionStorage.getItem("username"))
    );

   return getDocs(q)
      .then((querySnapshot) => {
        const docsArray = [];
        querySnapshot.forEach((doc) => {
          docsArray.push({ id: doc.id, ...doc.data() });
        });
        return docsArray; // Devuelve el array de documentos
      })
      .catch((error) => {
        console.error("Error obteniendo documentos: ", error);
      });
  }

  readNotification(id){
    
  }
}

function generateSession(username, id) {
  sessionStorage.setItem("username", username)
  sessionStorage.setItem("sessionID", id)
}

function obtainUserData(email) {
  const docRef = doc(db, "usuarios", email);

  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {  // Verificar si el documento existe
        generateSession(docSnap.data().username, docSnap.data().id_usuario)
        window.location.href = "../index.html";
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos del usuario:", error);
    });
}

function mostrarMensaje(textoMensaje) {
  const mensaje = document.getElementById('mensajeFlotante');
  mensaje.style.opacity = '1'; // Muestra el mensaje
  mensaje.innerText = textoMensaje
  setTimeout(() => {
    mensaje.style.opacity = '0'; // Oculta el mensaje después de 5 segundos
  }, 5000);
}

function generarId() {
  const longitud = 21;
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < longitud; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return id;
}