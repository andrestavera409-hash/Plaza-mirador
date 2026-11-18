// 4. EVENTOS

// id del local que se esta editando (null si se esta agregando uno nuevo)
let idEnEdicion = null;

// agregar un local nuevo
formLocal.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombre = inputNombreLocal.value;
  const valorTexto = inputValorLocal.value;
  const metrosTexto = inputMetrosLocal.value;

  const mensajeError = validar(nombre, valorTexto, metrosTexto, idEnEdicion);
  if (mensajeError !== "") {
    mostrarErrorLocal(mensajeError);
    mostrarToast(mensajeError, "error");
    return;
  }

  limpiarErrorLocal();

  // si hay un local en edicion, se actualiza en vez de crear otro
  if (idEnEdicion !== null) {
    const localEditado = locales.find(function (item) {
      return item.id === idEnEdicion;
    });
    const metrosEditados = Number(metrosTexto);
    localEditado.nombre = nombre.trim();
    localEditado.valorArriendo = Number(valorTexto);
    localEditado.metrosCuadrados = metrosEditados;
    localEditado.categoria = obtenerPlan(metrosEditados);
    idEnEdicion = null;
    guardarLocales();
    salirModoEdicion();
    actualizarVista();
    mostrarToast("Se realizo correctamente.", "exito");
    return;
  }

  const idsExistentes = locales.map(function (local) {
    return local.id;
  });
  const nuevoId = idsExistentes.length > 0 ? Math.max.apply(null, idsExistentes) + 1 : 1;

  const metrosCuadrados = Number(metrosTexto);
  const nuevoLocal = {
    id: nuevoId,
    nombre: nombre.trim(),
    valorArriendo: Number(valorTexto),
    categoria: obtenerPlan(metrosCuadrados),
    metrosCuadrados: metrosCuadrados,
    imagen: "img/local-generico.png"
  };

  locales.push(nuevoLocal);
  guardarLocales();
  formLocal.reset();
  actualizarVista();
  mostrarToast("Se realizo correctamente.", "exito");
});

// buscar mientras se escribe
buscadorInput.addEventListener("input", function (evento) {
  terminoBusqueda = evento.target.value;
  establecerPagina(1);
  actualizarVista();
});

// filtrar por categoria (delegacion sobre el contenedor de botones)
filtrosCategoria.addEventListener("click", function (evento) {
  if (evento.target.matches("button[data-categoria]")) {
    categoriaSeleccionada = evento.target.getAttribute("data-categoria");
    establecerPagina(1);
    actualizarVista();
  }
});

// ordenar la tabla al hacer clic en el encabezado de una columna
encabezadoTablaLocales.addEventListener("click", function (evento) {
  if (evento.target.matches("button[data-columna]")) {
    establecerOrden(evento.target.getAttribute("data-columna"));
    establecerPagina(1);
    actualizarVista();
  }
});

// paginacion de la tabla
botonPaginaAnterior.addEventListener("click", function () {
  establecerPagina(paginaActual - 1);
  actualizarVista();
});

botonPaginaSiguiente.addEventListener("click", function () {
  establecerPagina(paginaActual + 1);
  actualizarVista();
});

// exportar a CSV todos los locales que cumplen los filtros, en el orden elegido
botonExportarCsv.addEventListener("click", function () {
  const lista = ordenarLista(obtenerListaFiltrada());
  if (lista.length === 0) {
    mostrarToast("No hay locales para exportar.", "error");
    return;
  }
  descargarArchivo("locales-plaza-mirador.csv", crearCSV(lista));
  mostrarToast("Se realizo correctamente.", "exito");
});

// eliminar un local (delegacion sobre el contenedor de tarjetas)
contenedorTarjetas.addEventListener("click", function (evento) {
  if (evento.target.matches("button[data-id]")) {
    const id = Number(evento.target.getAttribute("data-id"));
    const local = locales.find(function (item) {
      return item.id === id;
    });
    if (!local) {
      return;
    }

    const confirmado = confirm('Eliminar el local "' + local.nombre + '"?');
    if (!confirmado) {
      return;
    }

    locales = locales.filter(function (item) {
      return item.id !== id;
    });
    guardarLocales();
    if (idEnEdicion === id) {
      idEnEdicion = null;
      salirModoEdicion();
    }
    actualizarVista();
    mostrarToast("Se realizo correctamente.", "exito");
  }
});

// editar un local: lo carga en el formulario
contenedorTarjetas.addEventListener("click", function (evento) {
  if (evento.target.matches("button[data-editar]")) {
    const id = Number(evento.target.getAttribute("data-editar"));
    const local = locales.find(function (item) {
      return item.id === id;
    });
    if (!local) {
      return;
    }

    idEnEdicion = id;
    limpiarErrorLocal();
    entrarModoEdicion(local);
  }
});

// cancelar la edicion sin cambiar nada
botonCancelarLocal.addEventListener("click", function () {
  idEnEdicion = null;
  limpiarErrorLocal();
  salirModoEdicion();
});

// formulario de contacto: confirmacion sin recargar la pagina
formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const nombre = inputNombreContacto.value;

  registrosContacto.push({
    local: selectLocalContacto.value,
    nombre: nombre,
    correo: inputCorreoContacto.value,
    telefono: inputTelefonoContacto.value,
    metodoPago: selectMetodoPagoContacto.value
  });
  guardarContactos();
  pintarTablaRegistros(registrosContacto);

  mensajeConfirmacionContacto.textContent = "Gracias " + nombre + ", tu registro fue recibido.";
  mensajeConfirmacionContacto.classList.remove("oculto");
  formContacto.reset();
  mostrarToast("Se realizo correctamente.", "exito");
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

// cambia la moneda en que se ven los valores
selectorMoneda.addEventListener("change", async function () {
  const codigo = selectorMoneda.value;

  if (codigo !== "COP") {
    const hayTasas = await cargarTasas();
    if (!hayTasas) {
      selectorMoneda.value = "COP";
      establecerMoneda("COP");
      actualizarVista();
      return;
    }
    const pesosPorUnidad = calcularPesosPorUnidad(codigo);
    if (pesosPorUnidad === null) {
      mostrarEstadoApi("La API no trajo la tasa de esa moneda.", "error");
      selectorMoneda.value = "COP";
      establecerMoneda("COP");
      actualizarVista();
      return;
    }
    mostrarEstadoApi("1 " + monedas[codigo].unidad + " = " + formatearMoneda(Math.round(pesosPorUnidad)) + " (actualizado: " + fechaTasas + ")", "exito");
  }

  establecerMoneda(codigo);
  actualizarVista();
});


// 5. ARRANQUE


document.addEventListener("DOMContentLoaded", function () {
  cargarLocales();
  cargarContactos();
  actualizarVista();
  pintarTablaRegistros(registrosContacto);
  cargarTasas();
});
