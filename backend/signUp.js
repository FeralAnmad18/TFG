
import { ManageAccount } from '../backend/firebaseConnection.js';

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
              //window.location.href = "../index.html";
          }
      });
  }
}); 

function generarID() {
    const prefix = "MMS"; // Prefijo
    const randomNumbers = Math.floor(100000 + Math.random() * 900000); // Generar un número aleatorio de 6 dígitos
    const id = `${prefix}${randomNumbers}`; // Concatenar el prefijo con los 6 números
    return id;
  }


function validarFormulario() {
  // Obtener los elementos
  let username = document.getElementById("user");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  let surname = document.getElementById("surname");
  let birthday = document.getElementById("birthday");
  let email = document.getElementById("email");
  let password2 = document.getElementById("password2");

  // Expresión regular para validar email
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valido = true
  // Validar campos vacíos
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

  // Validar formato de email
  if (!emailRegex.test(email.value.trim())) {
      email.placeholder="Por favor, introduce un correo electrónico válido.";
      email.style.borderColor = "red";
      valido= false;
  }

  // Validar que las contraseñas coincidan
  if (password.value !== password2.value) {
      password2.placeholder="Las contraseñas no coinciden.";
      password.style.borderColor = "red";
      password2.style.borderColor = "red";
      valido= false;
  }

  if (valido===true) {
    // Si todo es válido, quitar los bordes rojos y retornar true
    username.style.borderColor = "";
    password.style.borderColor = "";
    name.style.borderColor = "";
    surname.style.borderColor = "";
    birthday.style.borderColor = "";
    email.style.borderColor = "";
    password2.style.borderColor = "";

    alert("Formulario válido. ¡Enviado!");
  }
  
  return valido;
}

