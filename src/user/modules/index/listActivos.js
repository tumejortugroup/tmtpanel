export async function pintarUsuariosDashboard() {
    const token = localStorage.getItem("token");
    const centro_id = localStorage.getItem("centro_id");

    if (!token || !centro_id) {
        console.warn("⚠️ Faltan datos en localStorage.");
        return;
    }

    const endpoint = `https://my.tumejortugroup.com/api/v1/usuarios/centro/activos?id=${centro_id}`;

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`❌ Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.table(data);

        if (data.length === 0) {
            console.warn("⚠️ No llegaron datos de usuarios");
            return;
        }

        const { usuarios_activos, usuarios_inactivos } = data[0];
        const totalUsuarios = usuarios_activos + usuarios_inactivos;

        // calcular porcentajes
        const percentActivos = totalUsuarios > 0 ? Math.round((usuarios_activos / totalUsuarios) * 100) : 0;
        const percentInactivos = totalUsuarios > 0 ? Math.round((usuarios_inactivos / totalUsuarios) * 100) : 0;

        // 👉 seleccionamos el <ul>
        const ul = document.querySelector("#activos-users");
        if (!ul) {
            console.warn("⚠️ No se encontró el contenedor UL con id #activos-users");
            return;
        }

        // Pintamos las tarjetas
        ul.innerHTML = `
            <li class="swiper-slide card card-slide" data-aos="fade-up" data-aos-delay="700">
                <div class="card-body">
                    <div class="progress-widget">
                        <div class="circle-progress" data-value="100"></div>
                        <div class="progress-detail">
                            <p class="mb-2">Usuarios</p>
                            <h4 class="counter">${totalUsuarios}</h4>
                        </div>
                    </div>
                </div>
            </li>

            <li class="swiper-slide card card-slide" data-aos="fade-up" data-aos-delay="800">
                <div class="card-body">
                    <div class="progress-widget">
                        <div class="circle-progress" data-value="${percentActivos}"></div>
                        <div class="progress-detail">
                            <p class="mb-2">Activos</p>
                            <h4 class="counter">${usuarios_activos}</h4>
                        </div>
                    </div>
                </div>
            </li>

            <li class="swiper-slide card card-slide" data-aos="fade-up" data-aos-delay="900">
                <div class="card-body">
                    <div class="progress-widget">
                        <div class="circle-progress" data-value="${percentInactivos}"></div>
                        <div class="progress-detail">
                            <p class="mb-2">Inactivos</p>
                            <h4 class="counter">${usuarios_inactivos}</h4>
                        </div>
                    </div>
                </div>
            </li>
        `;

        // 👉 Ahora generamos los SVG de las bolas
        document.querySelectorAll("#activos-users .circle-progress").forEach(el => {
            const value = parseInt(el.getAttribute("data-value"), 10) || 0;

            el.innerHTML = `
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path class="circle-bg"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#eee" stroke-width="2"/>
                  <path class="circle"
                        stroke-dasharray="${value}, 100"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#4cafef" stroke-width="2"/>
                  <text x="18" y="20.35" class="percentage" text-anchor="middle" font-size="8" fill="#4cafef">
                    ${value}%
                  </text>
                </svg>
            `;
        });

    } catch (error) {
        console.error("❌ Error al cargar los datos de usuarios:", error.message);
    }
}
