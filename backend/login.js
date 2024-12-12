
import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';

document.addEventListener("DOMContentLoaded", () => {
  let signUpForm = document.getElementById("loginForm");

  if (signUpForm) {
      signUpForm.addEventListener("submit", (e) => {
          e.preventDefault();
          let email = document.getElementById("email").value;
          let password = document.getElementById("password").value;
          const account = new ManageAccount();
          let login = account.authenticate(email, password);
          if (!login) {
            mostrarMensaje(Constantes.LOGIN_OK)
          } else {
            mostrarMensaje(Constantes.LOGIN_NOT_OK)
          }
      });
  }
});

function mostrarMensaje(textoMensaje) {
  const mensaje = document.getElementById('mensajeFlotante');
  mensaje.style.opacity = '1'; // Muestra el mensaje
  mensaje.innerText = textoMensaje
  setTimeout(() => {
      mensaje.style.opacity = '0'; // Oculta el mensaje después de 5 segundos
  }, 5000);
  closeModal();
}
