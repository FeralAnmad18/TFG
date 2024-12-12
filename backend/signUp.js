
import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';

document.addEventListener("DOMContentLoaded", () => {
  let signUpForm = document.getElementById("signUpForm");

  if (signUpForm) {
      signUpForm.addEventListener("submit", (e) => {
          e.preventDefault();
          let email = document.getElementById("email").value;
          let password = document.getElementById("password").value;
          let username = document.getElementById("user").value;
          if (validarFormulario()) {
              const account = new ManageAccount();
              account.register(email, password, username, generarID());
          }
      });
  }
}); 

function generarID() {
    const prefix = "MMS"; // Prefijo
    const randomNumbers = Math.floor(100000 + Math.random() * 900000); 
    const id = `${prefix}${randomNumbers}`; 
    return id;
  }


function validarFormulario() {
  let username = document.getElementById("user");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  let surname = document.getElementById("surname");
  let birthday = document.getElementById("birthday");
  let email = document.getElementById("email");
  let password2 = document.getElementById("password2");

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valido = true
  if (username.value.trim() === "") {
      username.placeholder="El nombre de usuario no puede estar vacío.";
      username.style.borderColor = "red";
      valido= false;
  }

  if (password.value.trim() === "") {
      password.placeholder="La contraseña no puede estar vacía.";
      password.style.borderColor = "red";
      valido= false;
  }

  if (name.value.trim() === "") {
      name.placeholder="El nombre no puede estar vacío.";
      name.style.borderColor = "red";
      valido= false;
  }

  if (surname.value.trim() === "") {
      surname.placeholder="El apellido no puede estar vacío.";
      surname.style.borderColor = "red";
      valido= false;
  }

  if (birthday.value.trim() === "") {
      birthday.placeholder="La fecha de nacimiento no puede estar vacía.";
      birthday.style.borderColor = "red";
      valido= false;
  }

  if (!emailRegex.test(email.value.trim())) {
      email.placeholder="Por favor, introduce un correo electrónico válido.";
      email.style.borderColor = "red";
      valido= false;
  }

  if (password.value !== password2.value) {
      password2.placeholder="Las contraseñas no coinciden.";
      password.style.borderColor = "red";
      password2.style.borderColor = "red";
      valido= false;
  }

  if (valido===true) {
    username.style.borderColor = "";
    password.style.borderColor = "";
    name.style.borderColor = "";
    surname.style.borderColor = "";
    birthday.style.borderColor = "";
    email.style.borderColor = "";
    password2.style.borderColor = "";

    mostrarMensaje(Constantes.REGIRSTRO_OK)
  }
  
  return valido;
}

function mostrarMensaje(textoMensaje) {
    const mensaje = document.getElementById('mensajeFlotante');
    mensaje.style.opacity = '1'; // Muestra el mensaje
    mensaje.innerText = textoMensaje
    setTimeout(() => {
        mensaje.style.opacity = '0'; // Oculta el mensaje después de 5 segundos
    }, 5000);
  }

