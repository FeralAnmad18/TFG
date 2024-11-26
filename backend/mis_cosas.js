import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';

document.addEventListener("DOMContentLoaded", () => {

  let myOffersData = []

  const account = new ManageAccount();
  account.obtainCambiosByUserId().then((documentos) => {
    console.log("Documentos obtenidos:", documentos);
    myOffersData.push(documentos)
  });

  let receivedOffersData = []
  account.obtainPeticionesRecibidas().then((documentos) => {
    console.log("Documentos obtenidos:", documentos);
    receivedOffersData.push(documentos)
  });

  let acceptedOffersData = []
  account.obtainPeticionesAceptadas().then((documentos) => {
    console.log("Documentos obtenidos:", documentos);
    acceptedOffersData.push(documentos)
  });

  let userSessionID = sessionStorage.getItem("sessionID")
  let login = document.getElementById("login")
  let logout = document.getElementById("logout")
  let mis_cambios = document.getElementById("mis_cambios")

  if (userSessionID === null) {
    logout.style.visibility = "hidden"
    logout.style.display = "none"
    login.style.visibility = "visible"
    login.style.display = "block"
    mis_cambios.style.visibility = "hidden"
    mis_cambios.style.display = "none"
  } else {
    logout.style.visibility = "visible"
    logout.style.display = "block"
    login.style.visibility = "hidden"
    login.style.display = "none"
    mis_cambios.style.visibility = "visible"
    mis_cambios.style.display = "block"
  }

  logout.addEventListener('click', function () {


    account.signOutNotIndex();
    sessionStorage.clear()
  })

  let my_offers_btn = document.getElementById("my-offers-btn");
  let received_offers_btn = document.getElementById("received-offers-btn");
  let acepted_offers_btn = document.getElementById("accepted-offers-btn");

  if (received_offers_btn) {
    received_offers_btn.addEventListener("click", (e) => {
      e.preventDefault();
      //received_offers_btn.innerHTML = ""
      showTab(received_offers_btn.id)
      // Generar componentes de vuelo para "Ofertas recibidas"
      const receivedOffersContainer = document.getElementById("received-offers");
      receivedOffersContainer.innerHTML = "";
      receivedOffersData.forEach(data => {
        data.forEach(vuelo => {
          const flightComponent = createFlightComponent(vuelo, received_offers_btn.id);
          receivedOffersContainer.appendChild(flightComponent);
        })
      });
      if (receivedOffersData[0].length < 1) {
        mostrarMensaje(Constantes.NO_REQUESTED)
      }
    });

  }

  if (my_offers_btn) {
    my_offers_btn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab(my_offers_btn.id)


      const myOffersContainer = document.getElementById("my-offers");
      myOffersContainer.innerHTML = "";
      myOffersData.forEach(data => {
        data.forEach(vuelo => {
          const flightComponent = createFlightComponent(vuelo, my_offers_btn.id);
          myOffersContainer.appendChild(flightComponent);
        })

      });
      if (myOffersData[0].length < 1) {
        mostrarMensaje(Constantes.NO_PETICIONES)
      }
    });

  }

  if (acepted_offers_btn) {
    acepted_offers_btn.addEventListener("click", (e) => {
      e.preventDefault();
      showTab(acepted_offers_btn.id)
      // Generar componentes de vuelo para "Ofertas creadas por mí"
      const acceptedOffersContainer = document.getElementById("accepted-offers");
      acceptedOffersContainer.innerHTML = "";
      acceptedOffersData.forEach(data => {
        data.forEach(vuelo => {
          const flightComponent = createFlightComponent(vuelo, acepted_offers_btn.id);
          acceptedOffersContainer.appendChild(flightComponent);
        })
      });
      if (acceptedOffersData[0].length < 1) {
        mostrarMensaje(Constantes.NO_ACCEPTED)
      }
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

  function createFlightComponent(vuelo, id) {
    // Crear el contenedor principal
    const flightContainer = document.createElement("div");
    flightContainer.classList.add("vuelo-container");

    // Añadir el título
    const title = document.createElement("h3");
    title.textContent = vuelo.id_vuelo;
    flightContainer.appendChild(title);

    const fecha = document.createElement("p");
    fecha.textContent = `Fecha del vuelo: ${vuelo.fecha_vuelo}`;
    flightContainer.appendChild(fecha);

    // Crear el contenedor de banderas
    const flagsContainer = document.createElement("div");
    flagsContainer.classList.add("flags-container");

    // Añadir la primera bandera (España)
    const origen = document.createElement("img");
    origen.src = `https://flagcdn.com/w320/${vuelo.origen}.png`;
    origen.classList.add("flag");
    flagsContainer.appendChild(origen);

    // Añadir la línea en diagonal
    const line = document.createElement("div");
    line.classList.add("line");
    flagsContainer.appendChild(line);

    // Añadir la segunda bandera (Marruecos)
    const destino = document.createElement("img");
    destino.src = `https://flagcdn.com/w320/${vuelo.destino}.png`;
    destino.classList.add("flag");
    flagsContainer.appendChild(destino);

    // Añadir el contenedor de banderas al contenedor principal
    flightContainer.appendChild(flagsContainer);

    // Añadir los detalles de "Busca" y "Ofrece"
    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `Busca: ${vuelo.asiento_buscado}<br>Ofrece: ${vuelo.asiento_ofrecido}`;
    flightContainer.appendChild(details);

    // Añadir el botón
    const button = document.createElement("button");
    const cancelButton = document.createElement("button");
    switch (id) {
      case "my-offers-btn":
        button.classList.add("cancel-button");
        button.textContent = "Cancelar peticion";
        button.id = vuelo.id
        button.addEventListener("click", () => {
          let result = account.cancelRequest(button.id);
          if (result) {
            mostrarMensaje(Constantes.ERROR);
          } else {
            let opcionesCambio = []
            let i = 0;
            account.getAllOptionRequestForCancelById(button.id).then((documentos) => {
              console.log("Documentos obtenidos:", documentos);
              opcionesCambio.push(documentos)
              opcionesCambio.forEach(element => {
                account.cancelOptionRequest(element[i])
                i++
              });
            });

            mostrarMensaje(Constantes.PETICION_CANCELADA);
          }

        })
        break;
      case "received-offers-btn":
        button.classList.add("button");
        button.textContent = "Aceptar cambio";
        button.id = vuelo.id
        button.addEventListener("click", () => {
          let result = account.acceptRequest(button.id);
          if (result) {
            mostrarMensaje(Constantes.ERROR);
          } else {
            mostrarMensaje(Constantes.PETICION_ACEPTADA);
          }

        })
        cancelButton.classList.add("cancel-button");
        cancelButton.textContent = "Rechazar cambio";
        cancelButton.id = vuelo.id
        cancelButton.addEventListener("click", () => {
          let result = account.refuseRequest(cancelButton.id);
          if (result) {
            mostrarMensaje(Constantes.ERROR);
          } else {
            mostrarMensaje(Constantes.PETICION_RECHAZADA);
          }

        })
        flightContainer.appendChild(cancelButton);
        break;
      case "accepted-offers-btn":
        button.classList.add("cancel-button");
        button.textContent = "Cancelar cambio";
        button.id = vuelo.id
        button.addEventListener("click", () => {
          let result = account.cancelRequest(button.id);
          if (result) {
            mostrarMensaje(Constantes.ERROR);
          } else {
            mostrarMensaje(Constantes.PETICION_CANCELADA);
          }

        })
        break;
    }

    flightContainer.appendChild(button);

    return flightContainer;
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

function closeModal() {
  const modal = document.getElementById("apiModal");
  modal.style.display = "none"; // Muestra el modal
  const modalFlag = document.getElementById("flagModal");
  modalFlag.style.display = "none"; // 
}



