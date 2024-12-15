import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';
import { DateManager } from './dateManager.js';

const account = new ManageAccount();
let contador_notificaciones = 0;


const modal = document.getElementById("dataModal");
const closeModalButton = document.getElementById("closeModal");
const flightsContainer = document.getElementById("flightsContainer");

document.addEventListener("DOMContentLoaded", () => {
    let notis_A = document.getElementById("notis_A")
    account.getNotisByUserID().then((documentos) => {
        console.log("Documentos obtenidos:", documentos);
        documentos.forEach((documento, index) => {
            if (documento.leido === false) {
                contador_notificaciones++;
            }
            
            if (index === documentos.length - 1) {
              console.log("Este es el último documento:", documento);
              console.log("numero de notis: ", contador_notificaciones)
              notis_A.innerText += " ("+contador_notificaciones+")"
            }
          });
    });

    let flightInput = document.getElementById("flight");
    let flightBtn = document.getElementById("flight_btn");
    let flightForm = document.getElementById("flightForm");

    let userSessionID = sessionStorage.getItem("sessionID")
    let login = document.getElementById("login")
    let logout = document.getElementById("logout")
    let mis_cambios = document.getElementById("mis_cambios")
    let notis = document.getElementById("notis")
    

    if (userSessionID === null) {
        flightInput.disabled = true
        flightBtn.disabled = true
        logout.style.visibility = "hidden"
        logout.style.display = "none"
        login.style.visibility = "visible"
        login.style.display = "block"
        mis_cambios.style.visibility = "hidden"
        mis_cambios.style.display = "none"
        notis.style.visibility = "hidden"
        notis.style.display = "none"
    } else {
        flightInput.disabled = false
        flightBtn.disabled = false
        logout.style.visibility = "visible"
        logout.style.display = "block"
        login.style.visibility = "hidden"
        login.style.display = "none"
        mis_cambios.style.visibility = "visible"
        mis_cambios.style.display = "block"
        notis.style.visibility = "visible"
        notis.style.display = "block"
        
    }

    logout.addEventListener('click', function () {
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
        input.addEventListener("mouseenter", () => {
            input.style.cursor = "not-allowed";
        });
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
    document.getElementById('loader').style.visibility = 'visible';

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
            setTimeout(5000)
            document.getElementById('loader').style.visibility = 'hidden';
            console.log("Datos de la API:", data);
            fillFlagModal(data, date, id)
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}

function obtainDatesByFlightByID(id) {
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
            console.log("Datos de la API:", data[1]);
            showModal(data);
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}

function showModal(data) {
    const modal = document.getElementById("apiModal");
    let body = document.getElementById("apiModal");
    let title = document.getElementById("apiModal");
    fillDates(data)
    modal.style.display = "flex";
}


const close_button = document.getElementById("close_button");

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
    let checkExistingPetitions = document.getElementById("petition_check");
    let date = selectElement.value;
    if (checkExistingPetitions.checked) {
        let petitions = []
        account.obtainPeticionesCreadasPorFechayVuelo(date, flightInput.value).then((documentos) => {
            console.log("Documentos obtenidos:", documentos);
            documentos.forEach(element => {
                if ((!["ACCEPTED", "CANCELED"].includes(element.status)) && (element.id_usuario != sessionStorage.getItem("username"))) {
                    petitions.push(element)
                }
            });
        });
        setTimeout(() => {
            if (petitions.length < 1 || petitions[0] == undefined) {
                mostrarMensaje(Constantes.NO_PETICIONES_INDEX)
            } else {
                populateModal(petitions); 
                modal.style.display = "flex";
            }
        }, 5000);

    } else {
        obtainFlightByIDandDate(flightInput.value, date)
    }

});

closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function closeModal() {
    const modal = document.getElementById("apiModal");
    modal.style.display = "none";
    const modalFlag = document.getElementById("flagModal");
    modalFlag.style.display = "none";
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

if (close_button_flag) {
    close_button_flag.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal()
    });
} else {
    console.error("close_button_flag no fue encontrado en el DOM.");
}

const notMyFlight_button = document.getElementById("notMyFlight");

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

    sessionStorage.setItem("fecha_vuelo", fecha)
    sessionStorage.setItem("id_vuelo", id)
    sessionStorage.setItem("destino", arrCountry)
    sessionStorage.setItem("origen", deptCountry)

    closeModal()
    const modal = document.getElementById("flagModal");
    modal.style.display = "flex";
}

function mostrarMensaje(textoMensaje) {
    const mensaje = document.getElementById('mensajeFlotante');
    mensaje.style.opacity = '1';
    mensaje.innerText = textoMensaje
    setTimeout(() => {
        mensaje.style.opacity = '0';
    }, 5000);
    closeModal();
}

function populateModal(petitions) {
    flightsContainer.innerHTML = "";
    if (petitions != undefined) {


        petitions.forEach(petition => {
            const flightDiv = document.createElement("div");
            flightDiv.classList.add("flight-container-existing");

            const title = document.createElement("h3");
            title.textContent = petition.id_vuelo;
            flightDiv.appendChild(title);

            const date = document.createElement("p");
            date.textContent = `Fecha del vuelo: ${petition.fecha_vuelo}`;
            flightDiv.appendChild(date);

            const flagsContainer = document.createElement("div");
            flagsContainer.classList.add("flags-container-existing");

            const originFlag = document.createElement("img");
            originFlag.classList.add("flag-existing");
            originFlag.src = `https://flagcdn.com/w320/${petition.origen}.png`;
            flagsContainer.appendChild(originFlag);

            const line = document.createElement("div");
            line.classList.add("line-existing");
            flagsContainer.appendChild(line);

            const destinationFlag = document.createElement("img");
            destinationFlag.classList.add("flag-existing");
            destinationFlag.src = `https://flagcdn.com/w320/${petition.destino}.png`;
            flagsContainer.appendChild(destinationFlag);

            flightDiv.appendChild(flagsContainer);

            const details = document.createElement("div");
            details.classList.add("details-existing");
            details.innerHTML = `Busca: ${petition.asiento_buscado}<br>Ofrece: ${petition.asiento_ofrecido}`;
            flightDiv.appendChild(details);

            const button = document.createElement("button");

            button.classList.add("button");
            button.textContent = "Proponer cambio";
            button.id = JSON.stringify(petition)
            console.log(JSON.parse(button.id))
            button.addEventListener("click", () => {
                let result = account.createRequest(JSON.parse(button.id));
                if (result == false) {
                    mostrarMensaje(Constantes.ERROR);
                } else {
                    mostrarMensaje(Constantes.PETICION_CREADA);
                    account.createNotification(Constantes.MENSAJE_PETICION_CREADA(sessionStorage.getItem("username")), petition.id_usuario)
                }

            })
            flightDiv.appendChild(button);
            flightsContainer.appendChild(flightDiv);
        });
    }
}

