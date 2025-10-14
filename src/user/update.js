import { cargarUsuario } from "./modules/fetch/getUser.js";
import { actualizarUsuario } from "./modules/fetch/updateUser.js";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');


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
