// MAPA - 3. REFERENCIAS A LA PAGINA

const NS_SVG = "http://www.w3.org/2000/svg";

const mapa = document.getElementById("mapa");
const leyenda = document.getElementById("leyenda");
const selectModo = document.getElementById("modo-color");
const selectorMoneda = document.getElementById("selector-moneda");
const botonAcercar = document.getElementById("boton-acercar");
const botonAlejar = document.getElementById("boton-alejar");
const botonTodo = document.getElementById("boton-todo");
const botonIrLocal = document.getElementById("boton-ir-local");
const detalleVacio = document.getElementById("detalle-vacio");
const detalleDatos = document.getElementById("detalle-datos");
const detalleNumero = document.getElementById("detalle-numero");
const detalleZona = document.getElementById("detalle-zona");
const detalleMetros = document.getElementById("detalle-metros");
const detalleArriendo = document.getElementById("detalle-arriendo");
const detalleEtiquetaEquivalente = document.getElementById("detalle-etiqueta-equivalente");
const detalleEquivalente = document.getElementById("detalle-equivalente");
const detalleBase = document.getElementById("detalle-base");
const detalleEstado = document.getElementById("detalle-estado");
const detalleExtra = document.getElementById("detalle-extra");
const botonContacto = document.getElementById("boton-contacto");
const botonContrato = document.getElementById("boton-contrato");
const resumenTexto = document.getElementById("resumen-texto");
const estadoApi = document.getElementById("estado-api");
const textoEstadoApi = document.getElementById("texto-estado-api");
const indicadorCarga = document.getElementById("indicador-carga");


// MAPA - 4. DIBUJO

function crearElementoSvg(tipo) {
  return document.createElementNS(NS_SVG, tipo);
}

function crearRectangulo(x, y, ancho, alto, clase) {
  const rectangulo = crearElementoSvg("rect");
  rectangulo.setAttribute("x", x);
  rectangulo.setAttribute("y", y);
  rectangulo.setAttribute("width", ancho);
  rectangulo.setAttribute("height", alto);
  rectangulo.classList.add(clase);
  return rectangulo;
}

function crearRotulo(texto, x, y, vertical, claseExtra) {
  const rotulo = crearElementoSvg("text");
  rotulo.textContent = texto;
  rotulo.setAttribute("x", x);
  rotulo.setAttribute("y", y);
  if (vertical) {
    rotulo.setAttribute("transform", "rotate(-90 " + x + " " + y + ")");
  }
  rotulo.classList.add("mapa-rotulo");
  if (claseExtra) {
    rotulo.classList.add(claseExtra);
  }
  return rotulo;
}

// forma de D: lado recto arriba (pegado al edificio) y curva hacia afuera
function crearForma(zona, clase) {
  const final = zona.x + zona.ancho;
  const curva = crearElementoSvg("path");
  curva.setAttribute(
    "d",
    "M " + zona.x + " " + zona.y +
    " A " + zona.ancho / 2 + " " + zona.profundidad + " 0 0 0 " + final + " " + zona.y + " Z"
  );
  curva.classList.add(clase);
  return curva;
}

// un circulo del plano (arboles y zonas grises que los rodean)
function crearCirculo(x, y, radio, clase) {
  const circulo = crearElementoSvg("circle");
  circulo.setAttribute("cx", x);
  circulo.setAttribute("cy", y);
  circulo.setAttribute("r", radio);
  circulo.classList.add(clase);
  return circulo;
}

// jardines con su franja gris para sentarse, y arboles con su zona gris alrededor
function pintarZonasVerdes() {
  jardines.forEach(function (jardin) {
    const banca = crearRectangulo(jardin.x, jardin.y + jardin.alto + DISTANCIA_BANCA, jardin.ancho, ALTO_BANCA, "mapa-banca");
    banca.setAttribute("rx", 6);
    mapa.appendChild(banca);

    const rectanguloJardin = crearRectangulo(jardin.x, jardin.y, jardin.ancho, jardin.alto, "mapa-jardin");
    rectanguloJardin.setAttribute("rx", 8);
    mapa.appendChild(rectanguloJardin);
  });

  arboles.forEach(function (arbol) {
    mapa.appendChild(crearCirculo(arbol.x, arbol.y, arbol.radio + MARGEN_SOMBRA_ARBOL, "mapa-banca"));
  });
  arboles.forEach(function (arbol) {
    mapa.appendChild(crearCirculo(arbol.x, arbol.y, arbol.radio, "mapa-arbol"));
  });
}

function pintarFondo() {
  mapa.appendChild(crearRectangulo(edificio.x, edificio.y, edificio.ancho, edificio.alto, "mapa-edificio"));

  pasillos.forEach(function (pasillo) {
    mapa.appendChild(crearRectangulo(pasillo.x, pasillo.y, pasillo.ancho, pasillo.alto, "mapa-pasillo"));
  });

  mapa.appendChild(crearForma(mirador, "mapa-mirador"));
  mapa.appendChild(crearForma(zonaMesas, "mapa-zona-mesas"));

  pintarZonasVerdes();

  const centroX = mirador.x + mirador.ancho / 2;
  mapa.appendChild(crearRotulo("Mirador / zona de mesas", centroX, 915, false, "mapa-rotulo--grande"));
  mapa.appendChild(crearRotulo("para sentarse, comer y descansar", centroX, 942, false, "mapa-rotulo--medio"));
  mapa.appendChild(crearRotulo("Entrada principal", 740, 28, false));
}

// los nombres de los pasillos van encima de los locales y los pasillos, para que se lean
function pintarNombresPasillos() {
  pasillos.forEach(function (pasillo) {
    if (pasillo.vertical) {
      mapa.appendChild(crearRotulo(pasillo.nombre, pasillo.x + pasillo.ancho / 2 + 5, pasillo.y + pasillo.alto / 2, true));
    } else {
      mapa.appendChild(crearRotulo(pasillo.nombre, pasillo.x + 160, pasillo.y + pasillo.alto / 2 + 5, false));
    }
  });
}

function crearLocalSvg(local) {
  const rectangulo = crearRectangulo(local.x, local.y, local.ancho, local.alto, "mapa-local");
  rectangulo.setAttribute("rx", 6);
  rectangulo.setAttribute("data-numero", local.numero);
  rectangulo.setAttribute("tabindex", "0");
  rectangulo.setAttribute("role", "button");
  rectangulo.setAttribute("aria-label", "Local " + local.numero + ", " + zonas[local.zona].nombre + ", " + estados[local.estado]);
  rectangulo.classList.add("mapa-zona-" + local.zona, "mapa-estado-" + local.estado);
  return rectangulo;
}

function crearEtiqueta(local) {
  const etiqueta = crearElementoSvg("text");
  etiqueta.textContent = local.numero;
  etiqueta.setAttribute("x", local.x + local.ancho / 2);
  etiqueta.setAttribute("y", local.y + local.alto / 2);
  etiqueta.classList.add("mapa-etiqueta");
  return etiqueta;
}

function pintarMapa() {
  mapa.textContent = "";
  pintarFondo();
  locales.forEach(function (local) {
    mapa.appendChild(crearLocalSvg(local));
  });
  pintarNombresPasillos();
  locales.forEach(function (local) {
    mapa.appendChild(crearEtiqueta(local));
  });
}

function pintarLeyenda() {
  leyenda.textContent = "";
  const modo = selectModo.value;
  const items = modo === "zona" ? zonas : estados;

  Object.keys(items).forEach(function (clave) {
    const li = document.createElement("li");
    const muestra = document.createElement("span");
    muestra.classList.add("mapa-leyenda__muestra", "mapa-leyenda__muestra--" + clave);
    li.appendChild(muestra);

    let texto = "";
    if (modo === "zona") {
      texto = zonas[clave].nombre + " (x" + zonas[clave].factor + ")";
    } else {
      texto = estados[clave];
    }
    li.appendChild(document.createTextNode(texto));
    leyenda.appendChild(li);
  });
}

function pintarModoColor() {
  mapa.classList.remove("mapa-svg--zona", "mapa-svg--estado");
  mapa.classList.add("mapa-svg--" + selectModo.value);
  pintarLeyenda();
}

// da formato a un valor en la moneda elegida; muestra un guion si todavia no hay tasa
function formatearEquivalente(numero) {
  if (numero === null) {
    return "-";
  }
  return monedas[monedaActual].prefijo + numero.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pintarResumen() {
  let texto =
    contarArrendados() + " de " + locales.length + " locales arrendados. Ingreso mensual esperado: " +
    formatearMoneda(calcularIngresoMensual());
  if (monedaActual !== "COP") {
    texto += " (" + formatearEquivalente(convertirMoneda(calcularIngresoMensual())) + ")";
  }
  resumenTexto.textContent = texto + ".";
}

// muestra el indicador de carga mientras se consulta la API
function mostrarCargaApi() {
  estadoApi.classList.remove("estado-api--error");
  indicadorCarga.classList.remove("oculto");
  textoEstadoApi.textContent = "Cargando las tasas de cambio...";
}

// muestra el resultado de la consulta a la API (tipo "error" lo pone en rojo)
function mostrarEstadoApi(mensaje, tipo) {
  indicadorCarga.classList.add("oculto");
  textoEstadoApi.textContent = mensaje;
  if (tipo === "error") {
    estadoApi.classList.add("estado-api--error");
  } else {
    estadoApi.classList.remove("estado-api--error");
  }
}

// escribe el encuadre actual en el atributo viewBox del SVG
function aplicarEncuadre() {
  mapa.setAttribute("viewBox", encuadre.x + " " + encuadre.y + " " + encuadre.ancho + " " + encuadre.alto);
}


// MAPA - 5. DETALLE DEL LOCAL

function mostrarDetalle(local) {
  const zona = zonas[local.zona];
  detalleVacio.classList.add("oculto");
  detalleDatos.classList.remove("oculto");
  detalleExtra.classList.add("oculto");

  detalleNumero.textContent = "Local " + local.numero;
  detalleZona.textContent = zona.nombre + " (x" + zona.factor + ")";
  detalleMetros.textContent = local.metros + " m2";
  detalleArriendo.textContent = formatearMoneda(calcularArriendo(local));
  detalleBase.textContent = formatearMoneda(local.metros * TARIFA_METRO);
  detalleEstado.textContent = estados[local.estado];

  if (monedaActual === "COP") {
    detalleEtiquetaEquivalente.classList.add("oculto");
    detalleEquivalente.classList.add("oculto");
  } else {
    detalleEtiquetaEquivalente.classList.remove("oculto");
    detalleEquivalente.classList.remove("oculto");
    detalleEtiquetaEquivalente.textContent = "Arriendo en " + monedas[monedaActual].nombre.toLowerCase();
    detalleEquivalente.textContent = formatearEquivalente(convertirMoneda(calcularArriendo(local)));
  }
}

function marcarSeleccion(numero) {
  const rectangulos = mapa.querySelectorAll("rect[data-numero]");
  rectangulos.forEach(function (rectangulo) {
    if (Number(rectangulo.getAttribute("data-numero")) === numero) {
      rectangulo.classList.add("mapa-local--seleccionado");
      mapa.appendChild(rectangulo);
    } else {
      rectangulo.classList.remove("mapa-local--seleccionado");
    }
  });
  // las etiquetas se vuelven a poner arriba para que no las tape el rectangulo
  mapa.querySelectorAll("text.mapa-etiqueta").forEach(function (etiqueta) {
    mapa.appendChild(etiqueta);
  });
}

function mostrarContacto(local) {
  if (local.arrendatario === "") {
    detalleExtra.textContent = "Este local esta disponible, todavia no tiene arrendatario.";
  } else {
    detalleExtra.textContent = "Arrendatario: " + local.arrendatario + ". Telefono: " + local.telefono + ".";
  }
  detalleExtra.classList.remove("oculto");
}

function mostrarContrato(local) {
  if (local.arrendatario === "") {
    detalleExtra.textContent = "Este local esta disponible, todavia no tiene contrato.";
  } else {
    detalleExtra.textContent =
      "Contrato desde " + local.inicio + " por " + local.meses + " meses, con canon de " +
      formatearMoneda(calcularArriendo(local)) + " al mes.";
  }
  detalleExtra.classList.remove("oculto");
}

function seleccionarLocal(numero) {
  localSeleccionado = buscarLocal(numero);
  marcarSeleccion(numero);
  mostrarDetalle(localSeleccionado);
  botonIrLocal.disabled = false;
}
