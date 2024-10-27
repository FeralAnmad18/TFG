import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';
import { DateManager } from './dateManager.js';

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
                obtainDatesByFlightByID(flightInput.value)
            }
        }
    });
});

function obtainFlightByIDandDate(id, date) {
    // Realizar la solicitud

    let options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'x-magicapi-key': Constantes.API_KEY_FLIGHT_BY_ID
        }
    };

    const url = `https://api.magicapi.dev/api/v1/aedbx/aerodatabox/flights/Number/${id}/${date}?withAircraftImage=false&withLocation=false`;

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
            fillFlagModal(data)
        })
        .catch(error => {
            // Maneja cualquier error
            console.error("Error al hacer la solicitud:", error);
        });
}

function obtainDatesByFlightByID(id) {
    // Realizar la solicitud
    let options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'x-magicapi-key': Constantes.API_KEY_DATES_FLIGHT_BY_ID
        }
    };

    const url = `https://api.magicapi.dev/api/v1/aedbx/aerodatabox/flights/Number/${id}/dates`;

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            return response.json();
        })
        .then(data => {
            // Procesa los datos de la API aquí
            console.log("Datos de la API:", data[1]);
            showModal(data);
        })
        .catch(error => {
            // Maneja cualquier error
            console.error("Error al hacer la solicitud:", error);
        });
}

// Función para mostrar el modal
function showModal(data) {
    const modal = document.getElementById("apiModal");
    fillDates(data)
    modal.style.display = "flex"; // Muestra el modal
}


close_button.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
});

select_date_btn.addEventListener("click", (e) => {
    e.preventDefault();
    let flightInput = document.getElementById("flight");
    let selectElement = document.getElementById("dates");
    let date = selectElement.value;
    obtainFlightByIDandDate(flightInput.value, date)
});

function closeModal() {
    const modal = document.getElementById("apiModal");
    modal.style.display = "none"; // Muestra el modal
}

function fillDates(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let dateCompare
    var select = document.getElementById("dates");
    for (let index = 0; index < data.length; index++) {
        dateCompare = new Date(data[index]);
        if (dateCompare > today) {
            var option = document.createElement("option");
            option.text = data[index];
            option.value = data[index];
            select.appendChild(option);
        }
    }

}

function fillFlagModal(data){
    let arrFlag = document.getElementById("arrFlag")
    let deptFlag = document.getElementById("deptFlag")

    let flagURL = `https://flagcdn.com/w320/${country}.png`
}

