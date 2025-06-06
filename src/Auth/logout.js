// CIERRE DE SESIÓN
document.getElementById("logout").addEventListener('click', async () => {
    const token=localStorage.getItem('token');
    
    localStorage.removeItem('token');
            
    alert('Sesión cerrada');
    window.location.href = '/auth/sign-in.html';          

    if(token === null){
        console.log('Token eliminado con éxito')
    }else{
        console.log('Error: El token no se elimino ')
    }
 
    
})