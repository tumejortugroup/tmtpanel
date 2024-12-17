/*Google Calendar*/

// Configuración de la API
const CLIENT_ID = '269238382627-l5j8r4o1v7v9m38koslvtm3f7n3smmh7.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCIJ2MQ980erldVowFjfA5Nsu7AohS_3_k';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Cargar la API
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

window.handleClientLoad = handleClientLoad;

// Inicializar el cliente de Google API
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: SCOPES
    }).then(() => {
        console.log("Cliente de Google API inicializado.");
        const authInstance = gapi.auth2.getAuthInstance();

        // Asignar eventos a botones
        document.getElementById('authorize-button').onclick = () => {
            authInstance.signIn().then(() => {
                console.log("Sesión iniciada.");
                toggleButtons(true);
            });
        };

        document.getElementById('signout-button').onclick = () => {
            authInstance.signOut().then(() => {
                console.log("Sesión cerrada.");
                toggleButtons(false);
            });
        };
    }).catch(error => {
        console.error("Error al inicializar la API:", error);
    });
}

// Mostrar/ocultar botones según el estado de sesión
function toggleButtons(isSignedIn) {
    document.getElementById('authorize-button').style.display = isSignedIn ? 'none' : 'inline';
    document.getElementById('signout-button').style.display = isSignedIn ? 'inline' : 'none';
}
