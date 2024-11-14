import { ManageAccount } from '../backend/firebaseConnection.js';

// Datos para cada tipo de oferta
const myOffersData = [
  { busca: "12A", ofrece: "14C" },
  { busca: "15B", ofrece: "16D" },
];
const receivedOffersData = [
  { busca: "10A", ofrece: "12B" },
  { busca: "9C", ofrece: "8A" },
];

document.addEventListener("DOMContentLoaded", () => {
  let my_offers_btn = document.getElementById("my-offers-btn");
  let received_offers_btn = document.getElementById("received-offers-btn");
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
  if (received_offers_btn) {
    received_offers_btn.addEventListener("click", (e) => {
      e.preventDefault();
      //received_offers_btn.innerHTML = ""
      showTab(received_offers_btn.id)
      // Generar componentes de vuelo para "Ofertas recibidas"
      const receivedOffersContainer = document.getElementById("received-offers");
      receivedOffersContainer.innerHTML = "";
      receivedOffersData.forEach(data => {
        const flightComponent = createFlightComponent(data.busca, data.ofrece);
        receivedOffersContainer.appendChild(flightComponent);
      });
    });

  }

  if (my_offers_btn) {
    my_offers_btn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab(my_offers_btn.id)
      // Generar componentes de vuelo para "Ofertas creadas por mí"
      const myOffersContainer = document.getElementById("my-offers");
      myOffersContainer.innerHTML = "";
      myOffersData.forEach(data => {
        const flightComponent = createFlightComponent(data.busca, data.ofrece);
        myOffersContainer.appendChild(flightComponent);
      });
    });

  }


  function showTab(id) {
    // Ocultar todos los contenidos de las pestañas y eliminar la clase 'active' de todos los botones
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('[id*="btn"]').forEach(btn => btn.style.backgroundColor = '#f1f1f1');

    const tabID = id.replace("-btn", "")

    // Mostrar el contenido de la pestaña seleccionada y añadir la clase 'active' al botón seleccionado
    document.getElementById(id).style.backgroundColor = "#ddd"
    document.getElementById(tabID).classList.add('active');
    document.querySelector(`[id="${id}"]`).classList.add('active');
  }

  function createFlightComponent(busca, ofrece) {
    // Crear el contenedor principal
    const flightContainer = document.createElement("div");
    flightContainer.classList.add("vuelo-container");

    // Añadir el título
    const title = document.createElement("h3");
    title.textContent = "vuelo";
    flightContainer.appendChild(title);

    // Crear el contenedor de banderas
    const flagsContainer = document.createElement("div");
    flagsContainer.classList.add("flags-container");

    // Añadir la primera bandera (España)
    const flagSpain = document.createElement("img");
    flagSpain.src = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg";
    flagSpain.classList.add("flag");
    flagsContainer.appendChild(flagSpain);

    // Añadir la línea en diagonal
    const line = document.createElement("div");
    line.classList.add("line");
    flagsContainer.appendChild(line);

    // Añadir la segunda bandera (Marruecos)
    const flagMorocco = document.createElement("img");
    flagMorocco.src = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg";
    flagMorocco.classList.add("flag");
    flagsContainer.appendChild(flagMorocco);

    // Añadir el contenedor de banderas al contenedor principal
    flightContainer.appendChild(flagsContainer);

    // Añadir los detalles de "Busca" y "Ofrece"
    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `Busca: ${busca}<br>Ofrece: ${ofrece}`;
    flightContainer.appendChild(details);

    // Añadir el botón
    const button = document.createElement("button");
    button.classList.add("button");
    button.textContent = "Proponer cambio";
    flightContainer.appendChild(button);

    return flightContainer;
  }


});



