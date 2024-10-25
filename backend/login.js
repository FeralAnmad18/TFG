
import { ManageAccount } from '../backend/firebaseConnection.js';

document.addEventListener("DOMContentLoaded", () => {
  let signUpForm = document.getElementById("loginForm");

  if (signUpForm) {
      signUpForm.addEventListener("submit", (e) => {
          e.preventDefault();
          let email = document.getElementById("email").value;
          let password = document.getElementById("password").value;
         
            const account = new ManageAccount();
            account.authenticate(email, password);
          
      });
  }
  
}); 
