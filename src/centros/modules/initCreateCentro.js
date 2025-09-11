// modules/createCentro.js
export function initCreateCentroForm() {
  const form = document.getElementById("userForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ No tienes sesión iniciada.");
      return;
    }

    // Capturamos los datos del formulario con los IDs nuevos
    const formData = {
      nombre: document.getElementById("nombrec").value,
      direccion: document.getElementById("direccionc").value,
      correo: document.getElementById("correoC").value,
      telefono: document.getElementById("telefonoC").value,
      ciudad: document.getElementById("ciudadc").value,
      nombre_fiscal: document.getElementById("nombrefc").value,
      NIF: document.getElementById("nifc").value,
      codigo_postal: document.getElementById("cpostal").value,
      pais: document.getElementById("paisc").value
    };

    try {
      const response = await fetch("http://localhost:9000/api/v1/centros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("✅ Centro creado correctamente.");
        window.location.href = "/dashboard/index.html"; // redirige al listado
      } else {
        const errorText = await response.text();
        console.error("❌ Error en la respuesta:", response.status, errorText);
        alert("No se pudo crear el centro.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
}
