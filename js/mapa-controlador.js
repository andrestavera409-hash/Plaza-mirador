// MAPA - 6. EVENTOS Y ZOOM

// punteros activos (mouse o dedos) para arrastrar y pellizcar
const punteros = new Map();
let distanciaAnterior = 0;
let seMovio = false;

// zoom sobre un punto de la pantalla: se convierte a proporcion dentro del mapa
function cambiarZoom(factor, pantallaX, pantallaY) {
  const caja = mapa.getBoundingClientRect();
  calcularZoom(factor, (pantallaX - caja.left) / caja.width, (pantallaY - caja.top) / caja.height);
  aplicarEncuadre();
}

// zoom desde los botones: se hace sobre el centro del mapa
function cambiarZoomCentro(factor) {
  const caja = mapa.getBoundingClientRect();
  cambiarZoom(factor, caja.left + caja.width / 2, caja.top + caja.height / 2);
}

// acerca la vista hasta el local seleccionado
function irAlLocal() {
  const sector = mapa.querySelector("rect.mapa-local--seleccionado");
  if (sector === null) {
    return;
  }
  const caja = sector.getBBox();
  calcularCentrarEn(caja.x + caja.width / 2, caja.y + caja.height / 2);
  aplicarEncuadre();
}

function calcularDistancia() {
  const puntos = Array.from(punteros.values());
  const dx = puntos[0].x - puntos[1].x;
  const dy = puntos[0].y - puntos[1].y;
  return Math.sqrt(dx * dx + dy * dy);
}

mapa.addEventListener("click", function (evento) {
  if (seMovio) {
    return;
  }
  if (evento.target.matches("rect[data-numero]")) {
    seleccionarLocal(Number(evento.target.getAttribute("data-numero")));
  }
});

mapa.addEventListener("keydown", function (evento) {
  if ((evento.key === "Enter" || evento.key === " ") && evento.target.matches("rect[data-numero]")) {
    evento.preventDefault();
    seleccionarLocal(Number(evento.target.getAttribute("data-numero")));
  }
});

// rueda del mouse: acerca o aleja sobre el punto donde esta el cursor
mapa.addEventListener("wheel", function (evento) {
  evento.preventDefault();
  const factor = evento.deltaY < 0 ? 1.2 : 1 / 1.2;
  cambiarZoom(factor, evento.clientX, evento.clientY);
}, { passive: false });

// arrastrar con el mouse o con un dedo para mover el mapa, y pellizcar con dos dedos para el zoom
mapa.addEventListener("pointerdown", function (evento) {
  punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });
  seMovio = false;
  if (punteros.size === 2) {
    distanciaAnterior = calcularDistancia();
  }
  mapa.classList.add("mapa-svg--arrastrando");
});

mapa.addEventListener("pointermove", function (evento) {
  if (!punteros.has(evento.pointerId)) {
    return;
  }
  const anterior = punteros.get(evento.pointerId);
  const dx = evento.clientX - anterior.x;
  const dy = evento.clientY - anterior.y;
  punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });

  if (punteros.size === 2) {
    const distancia = calcularDistancia();
    const puntos = Array.from(punteros.values());
    cambiarZoom(distancia / distanciaAnterior, (puntos[0].x + puntos[1].x) / 2, (puntos[0].y + puntos[1].y) / 2);
    distanciaAnterior = distancia;
    seMovio = true;
    return;
  }

  if (Math.abs(dx) + Math.abs(dy) > 0) {
    const caja = mapa.getBoundingClientRect();
    calcularDesplazamiento(dx * (encuadre.ancho / caja.width), dy * (encuadre.alto / caja.height));
    aplicarEncuadre();
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      seMovio = true;
    }
  }
});

function soltarPuntero(evento) {
  punteros.delete(evento.pointerId);
  if (punteros.size === 0) {
    mapa.classList.remove("mapa-svg--arrastrando");
    // si hubo arrastre, el click que viene justo despues se ignora
    setTimeout(function () {
      seMovio = false;
    }, 0);
  }
}

mapa.addEventListener("pointerup", soltarPuntero);
mapa.addEventListener("pointercancel", soltarPuntero);
mapa.addEventListener("pointerleave", soltarPuntero);

botonAcercar.addEventListener("click", function () {
  cambiarZoomCentro(1.5);
});

botonAlejar.addEventListener("click", function () {
  cambiarZoomCentro(1 / 1.5);
});

botonTodo.addEventListener("click", function () {
  calcularVerTodo();
  aplicarEncuadre();
});

botonIrLocal.addEventListener("click", irAlLocal);

selectModo.addEventListener("change", pintarModoColor);

botonContacto.addEventListener("click", function () {
  if (localSeleccionado !== null) {
    mostrarContacto(localSeleccionado);
  }
});

botonContrato.addEventListener("click", function () {
  if (localSeleccionado !== null) {
    mostrarContrato(localSeleccionado);
  }
});


// pide las tasas a la API (solo si todavia no llegaron); devuelve true si ya hay tasas
async function cargarTasas() {
  if (tasasCambio !== null) {
    return true;
  }

  mostrarCargaApi();
  selectorMoneda.disabled = true;
  try {
    const datos = await obtenerTasasCambio();
    establecerTasasCambio(datos.tasas, datos.actualizado);
    mostrarEstadoApi("Tasas de cambio listas. Ya puedes ver los valores en otra moneda.", "exito");
    return true;
  } catch (error) {
    mostrarEstadoApi(error.message, "error");
    return false;
  } finally {
    selectorMoneda.disabled = false;
  }
}

// vuelve a poner los valores en la moneda elegida
function refrescarValores() {
  pintarResumen();
  if (localSeleccionado !== null) {
    mostrarDetalle(localSeleccionado);
  }
}

// cambia la moneda en que se ven los valores
selectorMoneda.addEventListener("change", async function () {
  const codigo = selectorMoneda.value;

  if (codigo !== "COP") {
    const hayTasas = await cargarTasas();
    const pesosPorUnidad = calcularPesosPorUnidad(codigo);
    if (!hayTasas || pesosPorUnidad === null) {
      if (hayTasas) {
        mostrarEstadoApi("La API no trajo la tasa de esa moneda.", "error");
      }
      selectorMoneda.value = "COP";
      establecerMoneda("COP");
      refrescarValores();
      return;
    }
    mostrarEstadoApi("1 " + monedas[codigo].unidad + " = " + formatearMoneda(Math.round(pesosPorUnidad)) + " (actualizado: " + fechaTasas + ")", "exito");
  }

  establecerMoneda(codigo);
  refrescarValores();
});


// MAPA - 7. ARRANQUE

document.addEventListener("DOMContentLoaded", function () {
  pintarMapa();
  pintarModoColor();
  pintarResumen();
  cargarTasas();
});
