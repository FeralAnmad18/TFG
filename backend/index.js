import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';
import { DateManager } from './dateManager.js';

document.addEventListener("DOMContentLoaded", () => {

    let flightInput = document.getElementById("flight");
    let flightBtn = document.getElementById("flight_btn");
    let flightForm = document.getElementById("flightForm");

    let userSessionID = sessionStorage.getItem("sessionID")
    let login = document.getElementById("login")
    let logout = document.getElementById("logout")
    let mis_cambios = document.getElementById("mis_cambios")

    if (userSessionID === null) {
        flightInput.disabled = true
        flightBtn.disabled = true
        logout.style.visibility = "hidden"
        logout.style.display = "none"
        login.style.visibility = "visible"
        login.style.display = "block"
        mis_cambios.style.visibility = "hidden"
        mis_cambios.style.display = "none"
    } else {
        flightInput.disabled = false
        flightBtn.disabled = false
        logout.style.visibility = "visible"
        logout.style.display = "block"
        login.style.visibility = "hidden"
        login.style.display = "none"
        mis_cambios.style.visibility = "visible"
        mis_cambios.style.display = "block"
    }

    logout.addEventListener('click', function () {

        const account = new ManageAccount();
        account.signOut();
        sessionStorage.clear()
    })

    if (mis_cambios) {
        mis_cambios.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "html/mis_cosas.html";
        });
    } else {
        console.error("mis_cambios no fue encontrado en el DOM.");
    }

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
    // Obtén el elemento de carga
    document.getElementById('loader').style.visibility = 'visible';
    
    // Muestra el loader
    loader.style.display = 'block';
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
            setTimeout(5000)
            document.getElementById('loader').style.visibility = 'hidden';
            console.log("Datos de la API:", data);
            fillFlagModal(data, date, id)
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


const close_button = document.getElementById("close_button");

// Verifica si el botón fue seleccionado correctamente
if (close_button) {
    close_button.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
    });
} else {
    console.error("close_button no fue encontrado en el DOM.");
}

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
    const modalFlag = document.getElementById("flagModal");
    modalFlag.style.display = "none"; // 
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

const close_button_flag = document.getElementById("close_button_flag");

// Verifica si el botón fue seleccionado correctamente
if (close_button_flag) {
    close_button_flag.addEventListener("click", (e) => {
        e.preventDefault();
        
    });
} else {
    console.error("close_button_flag no fue encontrado en el DOM.");
}

const notMyFlight_button = document.getElementById("notMyFlight");

// Verifica si el botón fue seleccionado correctamente
if (notMyFlight_button) {
    notMyFlight_button.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarMensaje(Constantes.DISCULPA);
        closeModal();
    });
} else {
    console.error("notMyFlight_button no fue encontrado en el DOM.");
}

const myFlight_button = document.getElementById("myFlight");

// Verifica si el botón fue seleccionado correctamente
if (myFlight_button) {
    myFlight_button.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "html/cambios.html";
    });
} else {
    console.error("notMyFlight_button no fue encontrado en el DOM.");
}

function fillFlagModal(data, fecha, id) {
    let arrFlag = document.getElementById("arrFlag")
    let deptFlag = document.getElementById("deptFlag")
    let arrival = document.getElementById("arrival")
    let origin = document.getElementById("origin")
    let fechaText = document.getElementById("flightDate")
    let airline = document.getElementById("airline")

    let arrCountry = data[0].arrival.airport.countryCode.toLowerCase()
    let deptCountry = data[0].departure.airport.countryCode.toLowerCase()

    let arrflagURL = `https://flagcdn.com/w320/${arrCountry}.png`
    let deptflagURL = `https://flagcdn.com/w320/${deptCountry}.png`

    if (data[0].arrival.airport.municipalityName.length > 20) {
        arrival.innerText = "Destino: " + data[0].arrival.airport.shortName
    } else {
        arrival.innerText = "Destino: " + data[0].arrival.airport.municipalityName
    }

    if (data[0].departure.airport.municipalityName.length > 20) {
        origin.innerText = "Origen: " + data[0].departure.airport.shortName
    } else {
        origin.innerText = "Origen: " + data[0].departure.airport.municipalityName
    }
    arrFlag.src = arrflagURL
    deptFlag.src = deptflagURL
    deptFlag.style.width = "150px"
    deptFlag.style.height = "100px"
    arrFlag.style.width = "150px"
    arrFlag.style.height = "100px"
    fechaText.innerText = fecha
    airline.innerText = data[0].airline.name

    sessionStorage.setItem("id_vuelo",id)
    sessionStorage.setItem("destino",arrCountry)
    sessionStorage.setItem("origen",deptCountry)

    closeModal()
    const modal = document.getElementById("flagModal");
    modal.style.display = "flex"; // Muestra el modal
}

function mostrarMensaje(textoMensaje) {
    const mensaje = document.getElementById('mensajeFlotante');
    mensaje.style.opacity = '1'; // Muestra el mensaje
    mensaje.innerText = textoMensaje
    setTimeout(() => {
        mensaje.style.opacity = '0'; // Oculta el mensaje después de 5 segundos
    }, 5000);
    closeModal();
}

