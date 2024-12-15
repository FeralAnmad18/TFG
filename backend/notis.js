import { ManageAccount } from '../backend/firebaseConnection.js';
import { Constantes } from '../backend/constantes.js';
import { DateManager } from './dateManager.js';

const account = new ManageAccount();
let contador_notificaciones = 0;

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
                notis_A.innerText += " (" + contador_notificaciones + ")"
            }
        });
    });

    let userSessionID = sessionStorage.getItem("sessionID")
    let login = document.getElementById("login")
    let logout = document.getElementById("logout")
    let mis_cambios = document.getElementById("mis_cambios")
    let notis = document.getElementById("notis")

    if (userSessionID === null) {
        logout.style.visibility = "hidden"
        logout.style.display = "none"
        login.style.visibility = "visible"
        login.style.display = "block"
        mis_cambios.style.visibility = "hidden"
        mis_cambios.style.display = "none"
        notis.style.visibility = "hidden"
        notis.style.display = "none"
    } else {
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


        account.signOutNotIndex();
        sessionStorage.clear()
    })

    let all_notis = [];
    account.getNotisByUserID().then((documentos) => {
        console.log("Documentos obtenidos:", documentos);
        documentos.forEach((documento, index) => {
            all_notis.push(documento);
            if (index === documentos.length - 1) {
                console.log("Este es el último documento:", documento);
                fillTable(all_notis)
            }
        });
    });


    console.log(all_notis)
})

function fillTable(data) {
    const datos = data;
    const cabeceras = [
        ["", "Remitente", "Fecha", "Acciones"]
    ];

    const container = document.getElementById('notis_table');
    container.innerHTML = "";
    const tabla = document.createElement('table');
    const tbody = document.createElement('tbody');
    cabeceras.forEach((fila, indice) => {
        const tr = document.createElement('tr');
        const br = document.createElement('br')
        tbody.appendChild(br)

        fila.forEach(celda => {
            const cell = indice === 0 ? document.createElement('th') : document.createElement('td');
            cell.textContent = celda;
            tr.appendChild(cell);
        });

        tbody.appendChild(tr);
    });
    datos.forEach((fila) => {
        const tr = document.createElement('tr');

        let iconCell = document.createElement('td');
        let icon = document.createElement('img');

        if (fila.leido === true) {
            icon.src = "../images/read_icon.png";
        } else {
            icon.src = "../images/unread.png";
        }

        icon.alt = "Estado de lectura";
        icon.style.width = "20px";
        icon.style.height = "20px";
        iconCell.appendChild(icon);
        tr.appendChild(iconCell);

        let userCell = document.createElement('td');
        userCell.textContent = fila.usuario_emisor;
        tr.appendChild(userCell);

        let dateCell = document.createElement('td');
        dateCell.textContent = fila.fecha;
        tr.appendChild(dateCell)

        const accionesCell = document.createElement('td');
        const leerBtn = document.createElement('button');

        leerBtn.textContent = "Leer";
        leerBtn.id = JSON.stringify(fila);
        leerBtn.onclick = () => readNotification(leerBtn.id);

        const marcarLeidoBtn = document.createElement('button');
        marcarLeidoBtn.textContent = "Marcar como leído";
        marcarLeidoBtn.id = JSON.stringify(fila);
        marcarLeidoBtn.onclick = () => setNotificationAsRead(marcarLeidoBtn.id);

        accionesCell.appendChild(leerBtn);
        accionesCell.appendChild(marcarLeidoBtn);

        tr.appendChild(accionesCell);

        if (fila.leido === true) {
            tr.querySelectorAll('td').forEach(td => {
                td.style.backgroundColor = "#b3b2b1";
            });
        }

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    container.appendChild(tabla);

    container.style.maxHeight = "400px"; // Máxima altura del contenedor
    container.style.overflowY = "auto";  // Habilitar el scroll vertical
    container.style.padding = "10px"; // Asegura que haya un pequeño relleno
}

function readNotification(notificacion) {
    showNotificationMessage(JSON.parse(notificacion))
    account.readNotification(JSON.parse(notificacion))
}

function setNotificationAsRead(notificacion) {
    account.readNotification(JSON.parse(notificacion))
    setTimeout(() => {
        location.reload()
    }, 1000);
}

function showNotificationMessage(data) {
    const modal = document.getElementById("noti_message_modal");
    let title = document.getElementById("titulo_message");
    let body = document.getElementById("message_body");

    title.innerText = "Mensaje de " + data.usuario_emisor
    body.innerText = data.mensaje
    modal.style.display = "flex";
}

const close_button = document.getElementById("close_button");

if (close_button) {
    close_button.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
        location.reload()
    });
} else {
    console.error("close_button no fue encontrado en el DOM.");
}

function closeModal() {
    const modal = document.getElementById("noti_message_modal");
    modal.style.display = "none";
}