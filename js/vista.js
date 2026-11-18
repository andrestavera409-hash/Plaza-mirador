// referencias a elementos del DOM
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const cuerpoTablaLocales = document.getElementById("cuerpo-tabla-locales");
const filtrosCategoria = document.getElementById("filtros-categoria");
const resumenTotal = document.getElementById("resumen-total");
const resumenPremium = document.getElementById("resumen-premium");
const resumenArea = document.getElementById("resumen-area");
const resumenSuma = document.getElementById("resumen-suma");
const resumenEquivalente = document.getElementById("resumen-equivalente");
const selectorMoneda = document.getElementById("selector-moneda");
const encabezadoEquivalente = document.getElementById("encabezado-equivalente");
const estadoApi = document.getElementById("estado-api");
const textoEstadoApi = document.getElementById("texto-estado-api");
const indicadorCarga = document.getElementById("indicador-carga");
const contadorResultados = document.getElementById("contador-resultados");
const avisoSinResultados = document.getElementById("aviso-sin-resultados");
const buscadorInput = document.getElementById("buscador");
const encabezadoTablaLocales = document.getElementById("encabezado-tabla-locales");
const botonExportarCsv = document.getElementById("boton-exportar-csv");
const botonesOrden = document.querySelectorAll("button[data-columna]");
const botonPaginaAnterior = document.getElementById("boton-pagina-anterior");
const botonPaginaSiguiente = document.getElementById("boton-pagina-siguiente");
const textoPagina = document.getElementById("texto-pagina");
const avisoTablaVacia = document.getElementById("aviso-tabla-vacia");

const formLocal = document.getElementById("form-local");
const inputNombreLocal = document.getElementById("nombre-local");
const inputValorLocal = document.getElementById("valor-local");
const inputMetrosLocal = document.getElementById("metros-local");
const tituloFormLocal = document.getElementById("titulo-form-local");
const botonGuardarLocal = document.getElementById("boton-guardar-local");
const botonCancelarLocal = document.getElementById("boton-cancelar-local");
const mensajeErrorLocal = document.getElementById("mensaje-error-local");
const toast = document.getElementById("toast");

// guarda el temporizador del toast, para poder cancelarlo si llega otro
let toastTimeoutId = null;

const formContacto = document.getElementById("form-contacto");
const inputNombreContacto = document.getElementById("nombre");
const mensajeConfirmacionContacto = document.getElementById("mensaje-confirmacion-contacto");
const inputCorreoContacto = document.getElementById("correo");
const inputTelefonoContacto = document.getElementById("telefono");
const selectLocalContacto = document.getElementById("local");
const selectMetodoPagoContacto = document.getElementById("metodo-pago");
const cuerpoTablaRegistros = document.getElementById("cuerpo-tabla-registros");
const avisoSinRegistros = document.getElementById("aviso-sin-registros");

// da formato de pesos colombianos a un numero
function formatearMoneda(numero) {
  return "$ " + numero.toLocaleString("es-CO");
}


// 3. FUNCIONES QUE DIBUJAN EN LA PAGINA


// da formato a un valor en la moneda elegida; muestra un guion si todavia no hay tasa
function formatearEquivalente(numero) {
  if (numero === null) {
    return "-";
  }
  return monedas[monedaActual].prefijo + numero.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// crea una tarjeta de local con createElement, sin usar innerHTML
function crearTarjeta(local) {
  const articulo = document.createElement("article");
  articulo.className = "tarjeta";

  const imagen = document.createElement("img");
  imagen.src = local.imagen;
  imagen.alt = local.nombre;
  imagen.className = "tarjeta__imagen";

  const titulo = document.createElement("h4");
  titulo.textContent = local.nombre;

  const parrafoArea = document.createElement("p");
  parrafoArea.textContent = "Area: " + local.metrosCuadrados + " metros cuadrados";

  const parrafoPlan = document.createElement("p");
  parrafoPlan.textContent = "Plan: " + local.categoria;

  const parrafoValor = document.createElement("p");
  parrafoValor.textContent = "Arriendo: " + formatearMoneda(local.valorArriendo) + " / mes";

  const parrafoEquivalente = document.createElement("p");
  parrafoEquivalente.textContent = "En " + monedas[monedaActual].nombre.toLowerCase() + ": " + formatearEquivalente(convertirMoneda(local.valorArriendo)) + " / mes";
  if (monedaActual === "COP") {
    parrafoEquivalente.classList.add("oculto");
  }

  const botonEditar = document.createElement("button");
  botonEditar.type = "button";
  botonEditar.textContent = "Editar";
  botonEditar.setAttribute("data-editar", local.id);

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.setAttribute("data-id", local.id);

  articulo.appendChild(imagen);
  articulo.appendChild(titulo);
  articulo.appendChild(parrafoArea);
  articulo.appendChild(parrafoPlan);
  articulo.appendChild(parrafoValor);
  articulo.appendChild(parrafoEquivalente);
  articulo.appendChild(botonEditar);
  articulo.appendChild(botonEliminar);

  return articulo;
}

// dibuja las tarjetas de la lista filtrada
function pintarTarjetas(lista) {
  contenedorTarjetas.textContent = "";
  lista.forEach(function (local) {
    contenedorTarjetas.appendChild(crearTarjeta(local));
  });
}

// dibuja la tabla con todos los locales (no solo los filtrados)
function pintarTabla(lista) {
  cuerpoTablaLocales.textContent = "";

  lista.forEach(function (local) {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = local.nombre;

    const celdaMetros = document.createElement("td");
    celdaMetros.textContent = local.metrosCuadrados;

    const celdaPlan = document.createElement("td");
    celdaPlan.textContent = local.categoria;

    const celdaValor = document.createElement("td");
    celdaValor.textContent = formatearMoneda(local.valorArriendo);

    const celdaEquivalente = document.createElement("td");
    celdaEquivalente.textContent = formatearEquivalente(convertirMoneda(local.valorArriendo));
    if (monedaActual === "COP") {
      celdaEquivalente.classList.add("oculto");
    }

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaMetros);
    fila.appendChild(celdaPlan);
    fila.appendChild(celdaValor);
    fila.appendChild(celdaEquivalente);
    cuerpoTablaLocales.appendChild(fila);
  });
}

// marca en los encabezados cual es la columna ordenada y en que direccion
function pintarEncabezadosOrden() {
  botonesOrden.forEach(function (boton) {
    const columna = boton.getAttribute("data-columna");
    const celda = boton.parentElement;
    let flecha = "";
    let aria = "none";

    if (columna === columnaOrden) {
      flecha = ordenAscendente ? " \u25B2" : " \u25BC";
      aria = ordenAscendente ? "ascending" : "descending";
    }

    boton.textContent = boton.getAttribute("data-etiqueta") + flecha;
    celda.setAttribute("aria-sort", aria);
  });
}

// muestra en que pagina esta la tabla y activa o desactiva los botones
function pintarPaginacion(cantidad) {
  const totalPaginas = calcularTotalPaginas(cantidad);
  textoPagina.textContent = "Pagina " + paginaActual + " de " + totalPaginas + " (" + cantidad + " locales)";
  botonPaginaAnterior.disabled = paginaActual <= 1;
  botonPaginaSiguiente.disabled = paginaActual >= totalPaginas;

  if (cantidad === 0) {
    avisoTablaVacia.classList.remove("oculto");
  } else {
    avisoTablaVacia.classList.add("oculto");
  }
}

// crea un archivo con el texto dado y le pide al navegador que lo descargue
function descargarArchivo(nombreArchivo, texto) {
  const archivo = new Blob(["\uFEFF" + texto], { type: "text/csv;charset=utf-8;" });
  const direccion = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = direccion;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(direccion);
}

// pinta los botones de filtro (uno por plan) en la barra lateral
function pintarFiltrosCategoria() {
  filtrosCategoria.textContent = "";

  const categorias = ["todas"].concat(planes);

  categorias.forEach(function (categoria) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filtro-boton";
    boton.textContent = categoria === "todas" ? "Todas" : categoria;
    boton.setAttribute("data-categoria", categoria);

    if (categoria === categoriaSeleccionada) {
      boton.classList.add("seleccionado");
    }

    filtrosCategoria.appendChild(boton);
  });
}

// actualiza los numeros del resumen en la barra lateral
function pintarResumen() {
  const resumen = calcularResumen(locales);
  resumenTotal.textContent = "Total de locales: " + resumen.total;
  resumenPremium.textContent = "Locales Premium: " + resumen.premium;
  resumenArea.textContent = "Area total: " + resumen.areaTotal + " metros cuadrados";
  resumenSuma.textContent = "Suma de arriendos: " + formatearMoneda(resumen.sumaValores);
  resumenEquivalente.textContent = "Suma en " + monedas[monedaActual].nombre.toLowerCase() + ": " + formatearEquivalente(calcularTotalEquivalente(locales));
  if (monedaActual === "COP") {
    resumenEquivalente.classList.add("oculto");
    encabezadoEquivalente.classList.add("oculto");
  } else {
    resumenEquivalente.classList.remove("oculto");
    encabezadoEquivalente.classList.remove("oculto");
    encabezadoEquivalente.textContent = "Arriendo en " + monedas[monedaActual].nombre.toLowerCase();
  }
}

// muestra cuantos resultados hay y el aviso de "sin resultados"
function pintarContador(lista) {
  contadorResultados.textContent = lista.length + " resultado(s) encontrado(s)";

  if (lista.length === 0) {
    avisoSinResultados.classList.remove("oculto");
  } else {
    avisoSinResultados.classList.add("oculto");
  }
}

// dibuja la tabla de registros del formulario de contacto
function pintarTablaRegistros(lista) {
  cuerpoTablaRegistros.textContent = "";

  lista.forEach(function (registro) {
    const fila = document.createElement("tr");
    const datos = [
      registro.local,
      registro.nombre,
      registro.correo,
      registro.telefono,
      registro.metodoPago
    ];

    datos.forEach(function (dato) {
      const celda = document.createElement("td");
      celda.textContent = dato;
      fila.appendChild(celda);
    });

    cuerpoTablaRegistros.appendChild(fila);
  });

  if (lista.length === 0) {
    avisoSinRegistros.classList.remove("oculto");
  } else {
    avisoSinRegistros.classList.add("oculto");
  }
}

// vuelve a pintar todo lo que depende de los datos o de los filtros
function actualizarVista() {
  const listaFiltrada = obtenerListaFiltrada();
  const listaOrdenada = ordenarLista(listaFiltrada);
  pintarTarjetas(listaFiltrada);
  pintarTabla(obtenerPagina(listaOrdenada));
  pintarPaginacion(listaOrdenada.length);
  pintarEncabezadosOrden();
  pintarContador(listaFiltrada);
  pintarResumen();
  pintarFiltrosCategoria();
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

// muestra un mensaje de error del formulario de locales
function mostrarErrorLocal(mensaje) {
  mensajeErrorLocal.textContent = mensaje;
  mensajeErrorLocal.classList.remove("oculto");
  mensajeErrorLocal.classList.add("error");
}

// limpia el mensaje de error del formulario de locales
function limpiarErrorLocal() {
  mensajeErrorLocal.textContent = "";
  mensajeErrorLocal.classList.add("oculto");
  mensajeErrorLocal.classList.remove("error");
}

// muestra una notificacion emergente abajo a la derecha, y se esconde sola
function mostrarToast(mensaje, tipo) {
  toast.textContent = mensaje;
  toast.classList.remove("oculto", "exito", "proceso", "error");
  toast.classList.add(tipo);

  if (toastTimeoutId !== null) {
    clearTimeout(toastTimeoutId);
  }
  toastTimeoutId = setTimeout(function () {
    toast.classList.add("oculto");
  }, 3000);
}

// pone el formulario en modo edicion con los datos del local
function entrarModoEdicion(local) {
  inputNombreLocal.value = local.nombre;
  inputValorLocal.value = local.valorArriendo;
  inputMetrosLocal.value = local.metrosCuadrados;
  tituloFormLocal.textContent = "Editar local";
  botonGuardarLocal.textContent = "Guardar cambios";
  botonCancelarLocal.classList.remove("oculto");
  formLocal.scrollIntoView({ behavior: "smooth", block: "center" });
  inputNombreLocal.focus();
}

// devuelve el formulario a su estado normal de agregar
function salirModoEdicion() {
  formLocal.reset();
  tituloFormLocal.textContent = "Agregar un local nuevo";
  botonGuardarLocal.textContent = "Agregar local";
  botonCancelarLocal.classList.add("oculto");
}
