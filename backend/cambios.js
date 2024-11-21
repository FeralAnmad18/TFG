import { ManageAccount } from '../backend/firebaseConnection.js';

document.addEventListener("DOMContentLoaded", () => {

  let cambios_form = document.getElementById("cambios_form");

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



