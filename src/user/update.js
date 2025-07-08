import { cargarUsuario } from "./modules/getUser.js";
import { actualizarUsuario } from "./modules/updateUser.js";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log("ID desde URL:", id);

    if (id) {
        cargarUsuario(id);

        // Asocia la función al botón solo cuando se haga clic
        const btn = document.querySelector('button[type="submit"]');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // evita que el formulario se envíe por defecto
                actualizarUsuario(id);
            });
        }
    } else {
        console.error("ID no encontrado");
    }
});
