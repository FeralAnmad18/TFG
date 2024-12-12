import { ManageAccount } from '../backend/firebaseConnection.js';

document.addEventListener("DOMContentLoaded", () => {

  let cambios_form = document.getElementById("cambios_form");
  let cancel_btn = document.getElementById("cancel_btn");

  cancel_btn.addEventListener("click", (e) => {
    e.preventDefault();
    cancelarCambio()

  })

  if (cambios_form) {
    cambios_form.addEventListener("submit", (e) => {
      e.preventDefault();
      let current_seat = document.getElementById("current-seat").value;
      let desired_seat = document.getElementById("desired-seat").value;

      const account = new ManageAccount();
      account.insertPeticionDeCambio(current_seat, desired_seat);

    });
  }
});



function cancelarCambio(){
  window.location.href = "../index.html"
}



