
// 1. DATOS Y REFERENCIAS A LOS ELEMENTOS DE LA PAGINA


// arreglo principal: locales disponibles para arrendar 
// categoria es el plan del local, que depende de sus metros cuadrados
let locales = [
  { id: 1, nombre: "Local 102", valorArriendo: 1625000, categoria: "Basico", metrosCuadrados: 20, imagen: "img/local-102.png" },
  { id: 2, nombre: "Local 103", valorArriendo: 1625000, categoria: "Basico", metrosCuadrados: 25, imagen: "img/local-103.png" },
  { id: 3, nombre: "Local 201", valorArriendo: 2925000, categoria: "Pro", metrosCuadrados: 30, imagen: "img/local-201.png" },
  { id: 4, nombre: "Local 202", valorArriendo: 2925000, categoria: "Pro", metrosCuadrados: 45, imagen: "img/local-202.png" },
  { id: 5, nombre: "Local 301", valorArriendo: 3900000, categoria: "Premium", metrosCuadrados: 50, imagen: "img/local-301.png" },
  { id: 6, nombre: "Local 302", valorArriendo: 3900000, categoria: "Premium", metrosCuadrados: 60, imagen: "img/local-302.png" }
];

// planes disponibles, con ellos se crean los botones de filtro
const planes = ["Basico", "Pro", "Premium"];

// estado de filtros (cambian con la interaccion del usuario)
let categoriaSeleccionada = "todas";
let terminoBusqueda = "";

// registros enviados por el formulario de contacto (solo se agregan con push)
const registrosContacto = [];



// 2. FUNCIONES DE AYUDA (formato, validacion)


// devuelve el plan que le corresponde a un local segun sus metros cuadrados
function obtenerPlan(metrosCuadrados) {
  if (metrosCuadrados <= 25) {
    return "Basico";
  }
  if (metrosCuadrados <= 45) {
    return "Pro";
  }
  return "Premium";
}

// calcula total, locales Premium, area y suma de arriendos con filter y reduce
function calcularResumen(lista) {
  const total = lista.length;

  const premium = lista.filter(function (local) {
    return local.categoria === "Premium";
  }).length;

  const areaTotal = lista.reduce(function (acumulado, local) {
    return acumulado + local.metrosCuadrados;
  }, 0);

  const sumaValores = lista.reduce(function (acumulado, local) {
    return acumulado + local.valorArriendo;
  }, 0);

  return { total: total, premium: premium, areaTotal: areaTotal, sumaValores: sumaValores };
}

// combina el filtro de categoria con el texto del buscador
function obtenerListaFiltrada() {
  return locales.filter(function (local) {
    const coincideCategoria =
      categoriaSeleccionada === "todas" || local.categoria === categoriaSeleccionada;
    const coincideBusqueda = local.nombre.toLowerCase().indexOf(terminoBusqueda.toLowerCase()) !== -1;
    return coincideCategoria && coincideBusqueda;
  });
}

// valida los datos del formulario de agregar local, con retorno temprano
function validar(nombre, valorTexto, metrosTexto, idEnEdicion) {
  if (nombre.trim() === "" || valorTexto.trim() === "" || metrosTexto.trim() === "") {
    return "Completa todos los campos.";
  }

  const valorArriendo = Number(valorTexto);
  if (isNaN(valorArriendo) || valorArriendo <= 0) {
    return "El valor del arriendo debe ser un numero mayor a cero.";
  }

  const nombreRepetido = locales.some(function (local) {
    return local.nombre.toLowerCase() === nombre.trim().toLowerCase() && local.id !== idEnEdicion;
  });
  if (nombreRepetido) {
    return "Ya existe un local con ese numero.";
  }

  const metrosCuadrados = Number(metrosTexto);
  if (isNaN(metrosCuadrados) || metrosCuadrados < 10 || metrosCuadrados > 200) {
    return "Los metros cuadrados deben ser un numero entre 10 y 200.";
  }

  return "";
}

// monedas en las que se pueden ver los valores (los datos siempre estan en pesos)
const monedas = {
  COP: { nombre: "Pesos", unidad: "peso", prefijo: "$ " },
  USD: { nombre: "Dolares", unidad: "dolar", prefijo: "US$ " },
  EUR: { nombre: "Euros", unidad: "euro", prefijo: "EUR " }
};

// moneda elegida por el usuario y tasas que llegaron de la API (null mientras no lleguen)
let monedaActual = "COP";
let tasasCambio = null;
let fechaTasas = "";

function establecerMoneda(codigo) {
  monedaActual = codigo;
}

function establecerTasasCambio(tasas, actualizado) {
  tasasCambio = tasas;
  fechaTasas = actualizado;
}

// convierte pesos a la moneda elegida; devuelve null si todavia no hay tasa
function convertirMoneda(pesos) {
  if (monedaActual === "COP") {
    return pesos;
  }
  if (tasasCambio === null || typeof tasasCambio[monedaActual] !== "number") {
    return null;
  }
  return (pesos / tasasCambio.COP) * tasasCambio[monedaActual];
}

// cuantos pesos vale 1 unidad de una moneda (por ejemplo 1 dolar); null si no hay tasa
function calcularPesosPorUnidad(codigo) {
  if (tasasCambio === null || typeof tasasCambio[codigo] !== "number") {
    return null;
  }
  return tasasCambio.COP / tasasCambio[codigo];
}

// arriendo de cada local en la moneda elegida, con map
function calcularEquivalentePorLocal(lista) {
  return lista.map(function (local) {
    return { nombre: local.nombre, valor: convertirMoneda(local.valorArriendo) };
  });
}

// suma de arriendos en la moneda elegida, con map y reduce; null si no hay tasa
function calcularTotalEquivalente(lista) {
  if (convertirMoneda(0) === null) {
    return null;
  }
  return calcularEquivalentePorLocal(lista).reduce(function (acumulado, item) {
    return acumulado + item.valor;
  }, 0);
}

// orden y paginacion de la tabla de locales
const FILAS_POR_PAGINA = 5;
let columnaOrden = "nombre";
let ordenAscendente = true;
let paginaActual = 1;

// si se elige la misma columna se invierte el orden; si es otra, empieza de menor a mayor
function establecerOrden(columna) {
  if (columnaOrden === columna) {
    ordenAscendente = !ordenAscendente;
  } else {
    columnaOrden = columna;
    ordenAscendente = true;
  }
}

function establecerPagina(numero) {
  paginaActual = numero;
}

// devuelve una copia de la lista ordenada por la columna elegida (con sort)
function ordenarLista(lista) {
  const factor = ordenAscendente ? 1 : -1;
  return lista.slice().sort(function (a, b) {
    if (columnaOrden === "nombre") {
      return factor * a.nombre.localeCompare(b.nombre, "es", { numeric: true });
    }
    if (columnaOrden === "categoria") {
      return factor * (planes.indexOf(a.categoria) - planes.indexOf(b.categoria));
    }
    return factor * (a[columnaOrden] - b[columnaOrden]);
  });
}

function calcularTotalPaginas(cantidad) {
  return Math.max(1, Math.ceil(cantidad / FILAS_POR_PAGINA));
}

// devuelve solo los locales de la pagina actual; si la pagina ya no existe (por ejemplo al eliminar) retrocede
function obtenerPagina(lista) {
  const totalPaginas = calcularTotalPaginas(lista.length);
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }
  const inicio = (paginaActual - 1) * FILAS_POR_PAGINA;
  return lista.slice(inicio, inicio + FILAS_POR_PAGINA);
}

// prepara un valor para el CSV: pone comillas si hace falta y evita que Excel lo tome como formula
function escaparCeldaCSV(valor) {
  let texto = String(valor);
  if (typeof valor === "string" && /^[=+\-@]/.test(texto)) {
    texto = "'" + texto;
  }
  if (texto.indexOf(";") !== -1 || texto.indexOf('"') !== -1 || texto.indexOf("\n") !== -1) {
    texto = '"' + texto.split('"').join('""') + '"';
  }
  return texto;
}

// convierte una lista de locales en texto CSV (separado por punto y coma, como lo abre Excel en Colombia)
function crearCSV(lista) {
  const encabezado = ["Local", "Metros cuadrados", "Plan", "Valor arriendo (COP)"];
  const filas = lista.map(function (local) {
    return [local.nombre, local.metrosCuadrados, local.categoria, local.valorArriendo];
  });
  return [encabezado]
    .concat(filas)
    .map(function (fila) {
      return fila.map(escaparCeldaCSV).join(";");
    })
    .join("\r\n");
}

// clave de localStorage del equipo
const CLAVE_LOCALES = "PlazaMirador_locales";
const CLAVE_CONTACTOS = "PlazaMirador_contactos";

// guarda los locales en localStorage
function guardarLocales() {
  localStorage.setItem(CLAVE_LOCALES, JSON.stringify(locales));
}

// carga los locales guardados; si no hay nada o el dato esta danado, quedan los iniciales
function cargarLocales() {
  try {
    const texto = localStorage.getItem(CLAVE_LOCALES);
    if (texto === null) {
      return;
    }
    const guardados = JSON.parse(texto);
    if (Array.isArray(guardados)) {
      locales = guardados;
    }
  } catch (error) {
    return;
  }
}

// guarda los registros del formulario de contacto en localStorage
function guardarContactos() {
  localStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(registrosContacto));
}

// carga los registros de contacto guardados; si el dato esta danado se ignora
function cargarContactos() {
  try {
    const texto = localStorage.getItem(CLAVE_CONTACTOS);
    if (texto === null) {
      return;
    }
    const guardados = JSON.parse(texto);
    if (Array.isArray(guardados)) {
      registrosContacto.push.apply(registrosContacto, guardados);
    }
  } catch (error) {
    return;
  }
}
