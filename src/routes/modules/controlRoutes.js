  export function redirectToControl() {
    const userId = localStorage.getItem("id_usuario"); // o "userId", según cómo lo guardaste
    if (userId) {
      window.location.href = `/dashboard/user/control.html?id=${userId}`;
    } else {
      alert("ID de usuario no encontrado en localStorage");
    }
  }