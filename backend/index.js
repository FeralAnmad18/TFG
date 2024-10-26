import { ManageAccount } from '../backend/firebaseConnection.js';

const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'x-magicapi-key': 'cm1z3rse80004mf034y1fq0nl'
    }
};

document.addEventListener("DOMContentLoaded", () => {
    let flightInput = document.getElementById("flight");
    let flightBtn = document.getElementById("flight_btn");
    let flightForm = document.getElementById("flightForm");

    let userSessionID = sessionStorage.getItem("sessionID")
    let login = document.getElementById("login")
    let logout = document.getElementById("logout")

    if (userSessionID === null) {
        flightInput.disabled = true
        flightBtn.disabled = true
        logout.style.visibility = "hidden"
        logout.style.display = "none"
        login.style.visibility = "visible"
        login.style.display = "block"

    } else {
        flightInput.disabled = false
        flightBtn.disabled = false
        logout.style.visibility = "visible"
        logout.style.display = "block"
        login.style.visibility = "hidden"
        login.style.display = "none"
    }

    logout.addEventListener('click', function () {

        const account = new ManageAccount();
        account.signOut();
        sessionStorage.clear()
    })

    document.querySelectorAll("input:disabled").forEach((input) => {
        // Agrega un evento para cuando el mouse pase por encima del input
        input.addEventListener("mouseenter", () => {
            input.style.cursor = "not-allowed";
        });

        // Opcional: restablece el cursor cuando el mouse salga del input
        input.addEventListener("mouseleave", () => {
            input.style.cursor = "default";
        });
    });

    flightForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let flightInput = document.getElementById("flight");

        if (flightForm) {
            if (flightInput.value.trim() === "") {
                flightInput.placeholder = "Se necesita un id de vuelo";
                flightInput.style.borderColor = "red";
            } else {
                obtainFlightByID(flightInput.value)
            }
        }
    });
});

function obtainFlightByID(id) {
    // Realizar la solicitud
    let flightNumber = "FR6791";
    const url = `https://api.magicapi.dev/api/v1/aedbx/aerodatabox/flights/Number/${flightNumber}?withAircraftImage=false&withLocation=false`;


    flightNumber = id
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            return response.json();
        })
        .then(data => {
            // Procesa los datos de la API aquí
            console.log("Datos de la API:", data);
        })
        .catch(error => {
            // Maneja cualquier error
            console.error("Error al hacer la solicitud:", error);
        });
}

