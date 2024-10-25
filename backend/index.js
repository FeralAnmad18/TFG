import { ManageAccount } from '../backend/firebaseConnection.js';

document.addEventListener("DOMContentLoaded", () => {
    let flightInput = document.getElementById("flight");
  
    let userSessionID = sessionStorage.getItem("sessionID")
    let login = document.getElementById("login")
    let logout = document.getElementById("logout")

    if (userSessionID === null) {
        flightInput.disabled=true
        logout.style.visibility="hidden"
        logout.style.display="none"
        login.style.visibility="visible"
        login.style.display="block"
        
    }else{
        flightInput.disabled=false
        logout.style.visibility="visible"
        logout.style.display="block"
        login.style.visibility="hidden"
        login.style.display="none"
    }

    logout.addEventListener('click', function(){

        const account = new ManageAccount();
        account.signOut();
        sessionStorage.clear()
    })
  });

