import { parseJwt } from '../../Auth/modules/jwt.js';

export function initCreateUserFormAdmin() {
    const form = document.getElementById("userForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const idCentro = document.getElementById("centro").value;
        if (!idCentro) {
            alert("Debes seleccionar un centro para el nuevo usuario.");
            return;
        }

        const formData = {
            nombre: document.getElementById("fname").value,
            apellidos: document.getElementById("lname").value,
            telefono: document.getElementById("mobno").value,
            correo: document.getElementById("email").value,
            fecha_de_nacimiento: document.getElementById("birthday").value,
            rol: document.querySelector("[name='role']").value,
            direccion: document.getElementById("add1").value,
            ciudad: document.getElementById("city").value,
            id_centro: idCentro, // 👈 se envía el id del select
            username: document.getElementById("uname").value,
            password: document.getElementById("pass").value,
            estado: document.getElementById("estado").value
        };

        try {
            const response = await fetch("http://localhost:9000/api/v1/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = "/dashboard/index.html";
            } else {
                alert("Hubo un problema al crear el usuario.");
                console.error("Respuesta no OK:", response.status, await response.text());
            }

        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error de conexión con el servidor.");
        }
    });
}
