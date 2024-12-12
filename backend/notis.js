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
            // Verificamos si es el último documento
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
    let all_notis = [];
    account.getNotisByUserID().then((documentos) => {
        console.log("Documentos obtenidos:", documentos);
        documentos.forEach((documento, index) => {
            all_notis.push(documento);
            // Verificamos si es el último documento
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

    // Selecciona el contenedor de la tabla
    const container = document.getElementById('notis_table');

    // Limpia el contenedor si ya hay una tabla
    container.innerHTML = "";

    // Crea la tabla y el cuerpo de la tabla
    const tabla = document.createElement('table');
    const tbody = document.createElement('tbody');

    // Itera sobre los datos para crear filas y celdas
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

        // Celda para el icono
        let iconCell = document.createElement('td');
        let icon = document.createElement('img');

        if (fila.leido === true) {
            icon.src = "../images/read_icon.png"; // Icono para leídos
        } else {
            icon.src = "../images/unread.png"; // Icono para no leídos
        }

        icon.alt = "Estado de lectura"; // Descripción alternativa
        icon.style.width = "20px";      // Ajustar tamaño del icono si es necesario
        icon.style.height = "20px";
        iconCell.appendChild(icon);
        tr.appendChild(iconCell);

        // Celda para usuario_emisor
        let userCell = document.createElement('td');
        userCell.textContent = fila.usuario_emisor;
        tr.appendChild(userCell);

        // Celda para fecha
        let dateCell = document.createElement('td');
        dateCell.textContent = fila.fecha;
        tr.appendChild(dateCell);

        // Celda para botones de acciones
        const accionesCell = document.createElement('td');

        // Botón "Leer"
        const leerBtn = document.createElement('button');
        leerBtn.textContent = "Leer";
        leerBtn.id = JSON.stringify(fila);
        leerBtn.onclick = () => readNotification(leerBtn.id);

        // Botón "Marcar como leído"
        const marcarLeidoBtn = document.createElement('button');
        marcarLeidoBtn.textContent = "Marcar como leído";
        marcarLeidoBtn.id = JSON.stringify(fila);
        marcarLeidoBtn.onclick = () => setNotificationAsRead(marcarLeidoBtn.id);

        // Agregar los botones a la celda de acciones
        accionesCell.appendChild(leerBtn);
        accionesCell.appendChild(marcarLeidoBtn);

        tr.appendChild(accionesCell);

        // Cambiar el color de fondo si la notificación está leída
        if (fila.leido === true) {
            tr.querySelectorAll('td').forEach(td => {
                td.style.backgroundColor = "#b3b2b1";
            });
        }

        // Agregar la fila completa al tbody
        tbody.appendChild(tr);
    });

    // Agrega el cuerpo a la tabla y la tabla al contenedor
    tabla.appendChild(tbody);
    container.appendChild(tabla);
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
    modal.style.display = "flex"; // Muestra el modal
}

const close_button = document.getElementById("close_button");

// Verifica si el botón fue seleccionado correctamente
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
    modal.style.display = "none"; // Muestra el modal
}