const CLAVE = "cita_s4";
const pagina = document.body.dataset.pagina;
let datos = null;

try {
  datos = JSON.parse(sessionStorage.getItem(CLAVE));
} catch {
  sessionStorage.removeItem(CLAVE);
}

const form = document.querySelector("#cita");

if (form) {

  // Rellenar formulario si ya existen datos previos guardados en la sesión
  if (datos) {
    for (const campo of ["Nombre", "correo", "Especialidad", "Fecha", "Horario"]) {
      if (form.elements[campo]) {
        form.elements[campo].value = datos[campo] || "";
      }
    }
  }
  form.addEventListener("submit", event => {
    event.preventDefault(); // Detiene el envío o para evaluar las reglas
    const mensaje = document.querySelector("#mensaje");
    mensaje.textContent = ""; // Limpiamos mensajes anteriores
    const Nombre = form.elements.Nombre.value.trim();
    const correo = form.elements.correo.value.trim();
    const Especialidad = form.elements.Especialidad.value;
    const Fecha = form.elements.Fecha.value;
    const Horario = form.elements.Horario.value;
    // 1. Validación de Nombre
    if (!Nombre) {
      mensaje.textContent = "Escribe el nombre del paciente.";
      form.elements.Nombre.focus();
      return;
    }
    // 2. Validación de Horario Bloqueado (Permite elegirlo pero frena al continuar)
    if (Horario === "11:00") {
      mensaje.textContent = "El horario de las 11:00 está bloqueado. Por favor, selecciona otro.";
      return;
    }
    // 3. Validación de Fecha Actual o Posterior
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ajustamos a medianoche local
    const fechaValidar = new Date(Fecha + 'T00:00:00');

    if (!Fecha || isNaN(fechaValidar.getTime()) || fechaValidar < hoy) {
      mensaje.textContent = "Por favor, selecciona una fecha actual o posterior.";
      return;
    }
    // 4. Guardar datos en el objeto definitivo si todo es válido
    const datosAGuardar = {
      Nombre,
      correo,
      Especialidad,
      Fecha,
      Horario
    };
    sessionStorage.setItem(CLAVE, JSON.stringify(datosAGuardar));
    location.href = "confirmacion-cita.html"; // Avanza a la siguiente página
  });
}
// pantalla de confirmación
if (pagina === "confirmacion") {
  if (!datos) {
    location.replace("cita.html"); // Si no hay datos en la sesión, regresa al formulario
  } else {
    const detalleEl = document.querySelector("#detalle");
    if (detalleEl) {
      detalleEl.textContent = [
        "Nombre: " + datos.Nombre,
        "Correo: " + datos.correo,
        "Especialidad: " + datos.Especialidad,
        "Fecha: " + datos.Fecha,
        "Horario: " + datos.Horario,
      ].join("\n");
    }
    const btnConfirmar = document.querySelector("#confirmacion-cita");
    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", () => {
        datos.estado = "confirmado";
        sessionStorage.setItem(CLAVE, JSON.stringify(datos));
        location.href = "index.html";
      });
    }
  }
}
