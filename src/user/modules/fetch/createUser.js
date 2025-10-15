import { parseJwt } from '/src/Auth/modules/jwt.js';

export function initCreateUserForm() {
    const form = document.getElementById("userForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const userData = token ? parseJwt(token) : null;

        if (!userData?.centro_id) {
            alert("No se pudo obtener el centro del usuario.");
            return;
        }

        //FORMATEAR NUMERO PARA 001 010 ETC 

        let numeroInput = document.getElementById("cname").value.trim();


        let numeroFormateado = numeroInput.padStart(3, "0");
        const numeroUsuario = `${numeroFormateado}-${userData.centro_id}`;

        const formData = {
            numero_usuario: numeroUsuario,
            nombre: document.getElementById("fname").value,
            apellidos: document.getElementById("lname").value,
            telefono: document.getElementById("mobno").value,
            correo: document.getElementById("email").value,
            fecha_de_nacimiento: document.getElementById("birthday").value,
            rol: document.querySelector("[name='role']").value,
            direccion: document.getElementById("add1").value,
            ciudad: document.getElementById("city").value,
            id_centro: userData.centro_id,
            password: document.getElementById("pass").value.trim() || null,
            estado: document.getElementById("estado").value
        };

        try {
            const response = await fetch("https://my.tumejortugroup.com/api/v1/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = "/dashboard/user/user-list.html";
            } else {
                alert("Hubo un problema al crear el usuario.");
                console.error("Respuesta no OK:", response.status, await response.text());
            }

        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Rellena todos los campos obligatorios.");
        }
    });
}
