// --- script.js CORREGIDO Y MÁS ROBUSTO ---

// El objeto principal que contiene la información de TODOS los exhibidores.
const datosCompletosIniciales = {
    "exhibidor1": {
        "titulo": "Exhibidor 1",
        "subtitulo": "Esquina Casa de La Hna Dora",
        "horarios": {
            "LUNES": { "TURNO1_7_9": ["Nancy D Aquino", "Gerardo Aquino"], "TURNO2_9_11": ["Martha Vazquez", "Carmen Palazuelos"] },
            "MARTES": { "TURNO2_9_11": ["Dora Carrillo", "Marta Vazquez"], "TURNO4_13_15": ["Esperanza D Rumbo", "Ana de Ramirez"], "TURNO5_15_17": ["Josefina Tellesz", "Ana de Ramirez"] },
            "MIERCOLES": { "TURNO1_7_9": ["Anaisa Ramirez"], "TURNO2_9_11": ["VIKI ARÍAS"], "TURNO3_11_13": ["Adelita Ching"], "TURNO4_13_15": ["Josefina Tellez"] },
            "JUEVES": { "TURNO1_7_9": ["Marisela de Gonzalez"], "TURNO2_9_11": ["Ana D Ramirez", "Genoveva Aguilar", "Josefina Telles"], "TURNO5_15_17": ["Avelina Guzman"], "TURNO6_17_19": ["Adela D Santos"] },
            "VIERNES": { "TURNO1_7_9": ["LUCÍA DORANTES", "CARMEN DE REYES"], "TURNO2_9_11": ["Marta Vazquez", "Dora Carrillo"] },
            "SABADO": { "TURNO3_11_13": ["Mercedes Aguilar"], "TURNO4_13_15": ["Samuel Muñoz"] },
            "DOMINGO": {}
        }
    },
    "exhibidor3": {
        "titulo": "Exhibidor 3",
        "subtitulo": "Esquina Dulceria Villanueva",
        "horarios": {
            "LUNES": { "TURNO1_7_9": ["SANDRA DE RANGEL", "JORGE RANGEL"] },
            "MARTES": { "TURNO1_7_9": ["MARISELA DE GONZÁLEZ", "CARMÉN DE REYES"], "TURNO2_9_11": ["Jazmin de Caballero", "Crystal de Fajardo"] },
            "MIERCOLES": { "TURNO1_7_9": ["GENOVEVA AGUILAR", "MERCEDES AGUILAR"], "TURNO2_9_11": ["BETZABE DE BALDERAS", "TERE DE LA CRUZ"], "TURNO3_11_13": ["TERE DE LA CRUZ", "Griss de Hdz"] },
            "JUEVES": { "TURNO1_7_9": ["BETZABE DE BALDERAS", "SANDRA DE RANGEL"] },
            "VIERNES": { "TURNO1_7_9": ["FELIPE CASTILLO", "AIDA CASTILLO"], "TURNO2_9_11": ["Luis Rivera", "Ariel Bañuelos"] },
            "SABADO": { "TURNO1_7_9": ["PROCOPIO RUMBO", "Ezperanza de Rumbo"], "TURNO2_9_11": ["Jose Luis Altamirano", "Martin Ortega"] },
            "DOMINGO": {}
        }
    },
    // --- PLANTILLA PARA TUS OTROS EXHIBIDORES ---
    "exhibidor2": { "titulo": "Exhibidor 2", "subtitulo": "Lugar del Exhibidor 2", "horarios": {} },
    "exhibidor4": { "titulo": "Exhibidor 4", "subtitulo": "Lugar del Exhibidor 4", "horarios": {} },
    "exhibidor5": { "titulo": "Exhibidor 5", "subtitulo": "Lugar del Exhibidor 5", "horarios": {} },
    "exhibidor6": { "titulo": "Exhibidor 6", "subtitulo": "Lugar del Exhibidor 6", "horarios": {} },
    "exhibidor7": { "titulo": "Exhibidor 7", "subtitulo": "Lugar del Exhibidor 7", "horarios": {} },
    "exhibidor8": { "titulo": "Exhibidor 8", "subtitulo": "Lugar del Exhibidor 8", "horarios": {} }
};

let exhibidorActualId; // Variable global para saber qué exhibidor estamos viendo

// --- FUNCIONES DE MANEJO DE DATOS ---

function obtenerDatosCompletos() {
    const datosGuardados = localStorage.getItem('datosCompletosExhibidores');
    if (!datosGuardados) {
        localStorage.setItem('datosCompletosExhibidores', JSON.stringify(datosCompletosIniciales));
        return datosCompletosIniciales;
    }
    return JSON.parse(datosGuardados);
}

function guardarDatosCompletos(datos) {
    localStorage.setItem('datosCompletosExhibidores', JSON.stringify(datos));
}

// --- FUNCIONES DE LA INTERFAZ ---

function actualizarVistaCompleta() {
    if (!exhibidorActualId) return; // Seguridad: no hacer nada si no hay un exhibidor seleccionado

    const datosCompletos = obtenerDatosCompletos();
    const infoExhibidor = datosCompletos[exhibidorActualId];
    
    document.getElementById('titulo-exhibidor').textContent = infoExhibidor.titulo;
    document.getElementById('subtitulo-exhibidor').textContent = infoExhibidor.subtitulo;
    
    consultarHorario();
    document.getElementById('resultado-disponibilidad').innerHTML = '';
}

function consultarHorario() {
    if (!exhibidorActualId) return;

    const dia = document.getElementById('dia-select').value;
    const turno = document.getElementById('turno-select').value;
    const listaPersonasUI = document.getElementById('lista-personas');
    const formAgregar = document.getElementById('form-agregar');
    
    const datosCompletos = obtenerDatosCompletos();
    const horariosDelExhibidor = datosCompletos[exhibidorActualId].horarios;
    listaPersonasUI.innerHTML = '';

    const personasAsignadas = horariosDelExhibidor[dia]?.[turno] || [];

    if (personasAsignadas.length > 0) {
        personasAsignadas.forEach((nombre, index) => {
            const li = document.createElement('li');
            const spanNombre = document.createElement('span');
            spanNombre.textContent = nombre;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => eliminarPersona(dia, turno, index);
            li.appendChild(spanNombre);
            li.appendChild(deleteButton);
            listaPersonasUI.appendChild(li);
        });
    } else {
        listaPersonasUI.innerHTML = '<li>Este horario está libre.</li>';
    }
    
    formAgregar.classList.remove('hidden');
}

function agregarPersona() {
    if (!exhibidorActualId) return;

    const dia = document.getElementById('dia-select').value;
    const turno = document.getElementById('turno-select').value;
    const nombreInput = document.getElementById('nombre-input');
    const nuevoNombre = nombreInput.value.trim();

    if (nuevoNombre === "") return alert("Por favor, escribe un nombre.");

    const datosCompletos = obtenerDatosCompletos();
    const horarios = datosCompletos[exhibidorActualId].horarios;
    if (!horarios[dia]) horarios[dia] = {};
    if (!horarios[dia][turno]) horarios[dia][turno] = [];

    horarios[dia][turno].push(nuevoNombre);
    guardarDatosCompletos(datosCompletos);

    nombreInput.value = '';
    consultarHorario();
}

function eliminarPersona(dia, turno, index) {
    if (!exhibidorActualId) return;
    if (!confirm("¿Estás seguro de que quieres eliminar a esta persona del horario?")) return;

    const datosCompletos = obtenerDatosCompletos();
    const horarios = datosCompletos[exhibidorActualId].horarios;
    const nombreEliminado = horarios[dia][turno][index];
    
    horarios[dia][turno].splice(index, 1);
    guardarDatosCompletos(datosCompletos);
    
    alert(`"${nombreEliminado}" ha sido eliminado con éxito.`);
    consultarHorario();
}

function buscarDiasDisponibles() {
    if (!exhibidorActualId) return;

    const turnoBuscado = document.getElementById('turno-buscar-select').value;
    const resultadoDiv = document.getElementById('resultado-disponibilidad');
    const datosCompletos = obtenerDatosCompletos();
    const horariosDelExhibidor = datosCompletos[exhibidorActualId].horarios;
    
    const diasDeLaSemana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    const diasLibres = [];

    diasDeLaSemana.forEach(dia => {
        const personasEnTurno = horariosDelExhibidor[dia]?.[turnoBuscado] || [];
        if (personasEnTurno.length === 0) {
            diasLibres.push(dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase());
        }
    });

    if (diasLibres.length > 0) {
        resultadoDiv.innerHTML = '<h4>Días con este turno disponible:</h4>';
        const ul = document.createElement('ul');
        diasLibres.forEach(dia => {
            const li = document.createElement('li');
            li.textContent = dia;
            ul.appendChild(li);
        });
        resultadoDiv.appendChild(ul);
    } else {
        resultadoDiv.innerHTML = '<p>No hay días libres para el turno seleccionado.</p>';
    }
}

// --- FUNCIÓN DE INICIALIZACIÓN (AQUÍ ESTABA EL ERROR) ---

document.addEventListener('DOMContentLoaded', () => {
    const selectExhibidor = document.getElementById('exhibidor-select');
    const datosCompletos = obtenerDatosCompletos();
    
    // 1. Obtener las claves (IDs) de los exhibidores del objeto de datos.
    const exhibidorIds = Object.keys(datosCompletos);
    
    // 2. Si no hay datos, detenerse para evitar errores.
    if (exhibidorIds.length === 0) {
        console.error("No se encontraron datos de exhibidores para cargar.");
        return;
    }

    // 3. Llenar el menú desplegable con los exhibidores.
    exhibidorIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = datosCompletos[id].titulo;
        selectExhibidor.appendChild(option);
    });
    
    // 4. ESTA ES LA CORRECCIÓN CLAVE:
    // Establecer explícitamente el primer exhibidor de la lista como el actual.
    exhibidorActualId = exhibidorIds[0];
    selectExhibidor.value = exhibidorActualId; // Asegurarse de que el menú visualmente lo refleje.

    // 5. Añadir el evento para que, al cambiar de exhibidor, todo se actualice.
    selectExhibidor.addEventListener('change', (e) => {
        exhibidorActualId = e.target.value;
        actualizarVistaCompleta();
    });

    // 6. Ahora que todo está configurado, cargar la vista inicial.
    actualizarVistaCompleta();
});