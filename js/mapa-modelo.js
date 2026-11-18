// MAPA - 1. DATOS

// valor base del metro cuadrado, antes de aplicar el efecto de la zona
const TARIFA_METRO = 45000;

// la zona depende de que tan cerca esta el local del mirador
const zonas = {
  1: { nombre: "Zona 1: frente al mirador", factor: 1.4 },
  2: { nombre: "Zona 2: intermedia", factor: 1.1 },
  3: { nombre: "Zona 3: fondo", factor: 0.9 }
};

const estados = {
  pagado: "Al dia",
  pendiente: "Pendiente",
  mora: "En demora",
  disponible: "Disponible"
};

// monedas en las que se pueden ver los valores (los datos siempre estan en pesos)
const monedas = {
  COP: { nombre: "Pesos", unidad: "peso", prefijo: "$ " },
  USD: { nombre: "Dolares", unidad: "dolar", prefijo: "US$ " },
  EUR: { nombre: "Euros", unidad: "euro", prefijo: "EUR " }
};

// plano: x, y, ancho y alto estan en unidades del dibujo (300 unidades cuadradas = 1 metro cuadrado)
// cada local tiene su posicion, su tamano en el dibujo y sus metros cuadrados reales
const locales = [
  { numero: 101, zona: 1, x: 86, y: 606, ancho: 98, alto: 81, metros: 26, estado: "pendiente", arrendatario: "Cafe Andino", telefono: "306 138 2408", inicio: "14/07/2026", meses: 12 },
  { numero: 102, zona: 1, x: 190, y: 606, ancho: 98, alto: 81, metros: 26, estado: "pagado", arrendatario: "Joyeria Luna", telefono: "302 664 7955", inicio: "02/10/2026", meses: 12 },
  { numero: 103, zona: 1, x: 294, y: 606, ancho: 101, alto: 81, metros: 27, estado: "pagado", arrendatario: "Moda Norte", telefono: "320 742 2013", inicio: "19/10/2026", meses: 36 },
  { numero: 104, zona: 1, x: 86, y: 693, ancho: 151, alto: 81, metros: 41, estado: "pagado", arrendatario: "Optica Vista", telefono: "307 147 3181", inicio: "10/07/2026", meses: 12 },
  { numero: 105, zona: 1, x: 243, y: 693, ancho: 151, alto: 81, metros: 41, estado: "pendiente", arrendatario: "Dulces Tentacion", telefono: "303 684 6054", inicio: "18/03/2026", meses: 12 },
  { numero: 106, zona: 1, x: 446, y: 606, ancho: 77, alto: 168, metros: 43, estado: "mora", arrendatario: "Tech Plaza", telefono: "318 754 4078", inicio: "12/02/2026", meses: 12 },
  { numero: 107, zona: 1, x: 529, y: 606, ancho: 102, alto: 168, metros: 57, estado: "mora", arrendatario: "Deportes Max", telefono: "301 733 4374", inicio: "16/09/2026", meses: 36 },
  { numero: 108, zona: 1, x: 637, y: 606, ancho: 77, alto: 168, metros: 43, estado: "pagado", arrendatario: "Libreria Pagina", telefono: "314 699 8424", inicio: "12/05/2026", meses: 12 },
  { numero: 109, zona: 1, x: 766, y: 606, ancho: 77, alto: 168, metros: 43, estado: "pagado", arrendatario: "Zapateria Paso", telefono: "307 183 5919", inicio: "17/08/2026", meses: 24 },
  { numero: 110, zona: 1, x: 849, y: 606, ancho: 102, alto: 168, metros: 57, estado: "pendiente", arrendatario: "Hogar y Mas", telefono: "309 723 2199", inicio: "04/09/2026", meses: 36 },
  { numero: 111, zona: 1, x: 957, y: 606, ancho: 77, alto: 168, metros: 43, estado: "pagado", arrendatario: "Flores del Valle", telefono: "310 255 9011", inicio: "14/01/2026", meses: 12 },
  { numero: 112, zona: 1, x: 1086, y: 606, ancho: 151, alto: 81, metros: 41, estado: "pendiente", arrendatario: "Muebles Roble", telefono: "318 908 6140", inicio: "11/06/2026", meses: 36 },
  { numero: 113, zona: 1, x: 1243, y: 606, ancho: 151, alto: 81, metros: 41, estado: "mora", arrendatario: "Gimnasio Fuerza", telefono: "314 170 2533", inicio: "09/08/2026", meses: 12 },
  { numero: 114, zona: 1, x: 1086, y: 693, ancho: 101, alto: 81, metros: 27, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 115, zona: 1, x: 1193, y: 693, ancho: 98, alto: 81, metros: 26, estado: "pagado", arrendatario: "Electro Hogar", telefono: "309 762 8301", inicio: "10/07/2026", meses: 24 },
  { numero: 116, zona: 1, x: 1297, y: 693, ancho: 98, alto: 81, metros: 26, estado: "pagado", arrendatario: "Papeleria Lapiz", telefono: "314 463 3753", inicio: "20/02/2026", meses: 36 },
  { numero: 201, zona: 2, x: 86, y: 346, ancho: 89, alto: 101, metros: 30, estado: "pagado", arrendatario: "Banco Mirador", telefono: "306 886 5709", inicio: "05/04/2026", meses: 36 },
  { numero: 202, zona: 2, x: 181, y: 346, ancho: 118, alto: 101, metros: 40, estado: "pagado", arrendatario: "Pet Shop Feliz", telefono: "315 182 3725", inicio: "15/07/2026", meses: 24 },
  { numero: 203, zona: 2, x: 305, y: 346, ancho: 89, alto: 101, metros: 30, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 204, zona: 2, x: 86, y: 453, ancho: 151, alto: 101, metros: 51, estado: "pagado", arrendatario: "Heladeria Polar", telefono: "313 984 5561", inicio: "23/07/2026", meses: 24 },
  { numero: 205, zona: 2, x: 243, y: 453, ancho: 151, alto: 101, metros: 51, estado: "pagado", arrendatario: "Cine Plaza", telefono: "307 254 2359", inicio: "06/03/2026", meses: 12 },
  { numero: 206, zona: 2, x: 446, y: 346, ancho: 131, alto: 101, metros: 44, estado: "pagado", arrendatario: "Perfumeria Aroma", telefono: "300 596 3987", inicio: "09/05/2026", meses: 12 },
  { numero: 207, zona: 2, x: 583, y: 346, ancho: 131, alto: 101, metros: 44, estado: "pagado", arrendatario: "Ropa Infantil Sol", telefono: "313 647 7049", inicio: "20/10/2026", meses: 24 },
  { numero: 208, zona: 2, x: 446, y: 453, ancho: 77, alto: 101, metros: 26, estado: "pagado", arrendatario: "Celulares Ya", telefono: "316 732 1884", inicio: "15/09/2026", meses: 36 },
  { numero: 209, zona: 2, x: 529, y: 453, ancho: 90, alto: 101, metros: 30, estado: "pagado", arrendatario: "Panaderia Trigo", telefono: "312 503 2696", inicio: "16/07/2026", meses: 12 },
  { numero: 210, zona: 2, x: 625, y: 453, ancho: 90, alto: 101, metros: 30, estado: "pagado", arrendatario: "Barberia Clasica", telefono: "302 313 8219", inicio: "06/02/2026", meses: 24 },
  { numero: 211, zona: 2, x: 766, y: 346, ancho: 90, alto: 101, metros: 30, estado: "mora", arrendatario: "Tienda Verde", telefono: "301 204 1003", inicio: "19/03/2026", meses: 12 },
  { numero: 212, zona: 2, x: 862, y: 346, ancho: 90, alto: 101, metros: 30, estado: "pagado", arrendatario: "Relojeria Tiempo", telefono: "319 126 2152", inicio: "28/04/2026", meses: 36 },
  { numero: 213, zona: 2, x: 958, y: 346, ancho: 77, alto: 101, metros: 26, estado: "pagado", arrendatario: "Videojuegos Nivel", telefono: "320 358 6691", inicio: "20/06/2026", meses: 36 },
  { numero: 214, zona: 2, x: 766, y: 453, ancho: 131, alto: 101, metros: 44, estado: "pagado", arrendatario: "Comidas Rapidas Sabor", telefono: "303 969 8996", inicio: "15/08/2026", meses: 36 },
  { numero: 215, zona: 2, x: 903, y: 453, ancho: 131, alto: 101, metros: 44, estado: "pagado", arrendatario: "Cosmeticos Bella", telefono: "302 247 2674", inicio: "24/06/2026", meses: 24 },
  { numero: 216, zona: 2, x: 1086, y: 346, ancho: 151, alto: 101, metros: 51, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 217, zona: 2, x: 1243, y: 346, ancho: 151, alto: 101, metros: 51, estado: "pendiente", arrendatario: "Arte y Marcos", telefono: "305 628 1378", inicio: "07/09/2026", meses: 24 },
  { numero: 218, zona: 2, x: 1086, y: 453, ancho: 89, alto: 101, metros: 30, estado: "pagado", arrendatario: "Lenceria Rosa", telefono: "317 127 9652", inicio: "10/02/2026", meses: 24 },
  { numero: 219, zona: 2, x: 1181, y: 453, ancho: 118, alto: 101, metros: 40, estado: "pendiente", arrendatario: "Musica Viva", telefono: "311 271 6827", inicio: "25/04/2026", meses: 24 },
  { numero: 220, zona: 2, x: 1305, y: 453, ancho: 89, alto: 101, metros: 30, estado: "pagado", arrendatario: "Bicicletas Ruta", telefono: "319 930 4197", inicio: "26/04/2026", meses: 36 },
  { numero: 301, zona: 3, x: 86, y: 46, ancho: 101, alto: 109, metros: 37, estado: "pagado", arrendatario: "Jugueteria Mundo", telefono: "306 630 9073", inicio: "12/01/2026", meses: 12 },
  { numero: 302, zona: 3, x: 193, y: 46, ancho: 98, alto: 109, metros: 36, estado: "pagado", arrendatario: "Salon Estilo", telefono: "315 365 4172", inicio: "23/10/2026", meses: 24 },
  { numero: 303, zona: 3, x: 297, y: 46, ancho: 98, alto: 109, metros: 36, estado: "pendiente", arrendatario: "Viajes Horizonte", telefono: "311 473 2319", inicio: "08/02/2026", meses: 12 },
  { numero: 304, zona: 3, x: 86, y: 161, ancho: 151, alto: 133, metros: 67, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 305, zona: 3, x: 243, y: 161, ancho: 151, alto: 133, metros: 67, estado: "pendiente", arrendatario: "Cafeteria Aurora", telefono: "306 445 4348", inicio: "16/10/2026", meses: 12 },
  { numero: 306, zona: 3, x: 446, y: 46, ancho: 131, alto: 121, metros: 53, estado: "pendiente", arrendatario: "Tecnologia Futuro", telefono: "320 452 2389", inicio: "27/02/2026", meses: 36 },
  { numero: 307, zona: 3, x: 583, y: 46, ancho: 131, alto: 121, metros: 53, estado: "pagado", arrendatario: "Calzado Norte", telefono: "315 282 8109", inicio: "26/06/2026", meses: 12 },
  { numero: 308, zona: 3, x: 446, y: 173, ancho: 105, alto: 121, metros: 42, estado: "pagado", arrendatario: "Bolsos Elegancia", telefono: "314 511 2391", inicio: "24/03/2026", meses: 12 },
  { numero: 309, zona: 3, x: 557, y: 173, ancho: 157, alto: 121, metros: 63, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 310, zona: 3, x: 766, y: 46, ancho: 157, alto: 121, metros: 63, estado: "pagado", arrendatario: "Fotografia Click", telefono: "300 254 8624", inicio: "26/03/2026", meses: 36 },
  { numero: 311, zona: 3, x: 929, y: 46, ancho: 105, alto: 121, metros: 42, estado: "pagado", arrendatario: "Sombreros Sol", telefono: "304 661 9983", inicio: "05/01/2026", meses: 12 },
  { numero: 312, zona: 3, x: 766, y: 173, ancho: 131, alto: 121, metros: 53, estado: "pagado", arrendatario: "Telas y Hilos", telefono: "316 867 3281", inicio: "14/04/2026", meses: 12 },
  { numero: 313, zona: 3, x: 903, y: 173, ancho: 131, alto: 121, metros: 53, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 314, zona: 3, x: 1086, y: 46, ancho: 151, alto: 133, metros: 67, estado: "pagado", arrendatario: "Yogurt Frio", telefono: "308 317 5799", inicio: "17/04/2026", meses: 24 },
  { numero: 315, zona: 3, x: 1243, y: 46, ancho: 151, alto: 133, metros: 67, estado: "pagado", arrendatario: "Sandwich Express", telefono: "317 529 3147", inicio: "02/06/2026", meses: 36 },
  { numero: 316, zona: 3, x: 1086, y: 185, ancho: 98, alto: 109, metros: 36, estado: "mora", arrendatario: "Boutique Aurora", telefono: "316 530 9219", inicio: "05/09/2026", meses: 12 },
  { numero: 317, zona: 3, x: 1190, y: 185, ancho: 98, alto: 109, metros: 36, estado: "disponible", arrendatario: "", telefono: "", inicio: "", meses: 0 },
  { numero: 318, zona: 3, x: 1294, y: 185, ancho: 101, alto: 109, metros: 37, estado: "pendiente", arrendatario: "Lavanderia Limpia", telefono: "316 119 8211", inicio: "25/03/2026", meses: 12 }
];

// el edificio, los pasillos y el mirador (el mirador es una D: lado recto contra el edificio y curva hacia afuera)
const edificio = { x: 40, y: 40, ancho: 1400, alto: 740 };

const pasillos = [
  { nombre: "Pasillo exterior izquierdo", x: 40, y: 40, ancho: 40, alto: 740, vertical: true },
  { nombre: "Pasillo lateral izquierdo", x: 400, y: 40, ancho: 40, alto: 740, vertical: true },
  { nombre: "Pasillo central", x: 720, y: 40, ancho: 40, alto: 740, vertical: true },
  { nombre: "Pasillo lateral derecho", x: 1040, y: 40, ancho: 40, alto: 740, vertical: true },
  { nombre: "Pasillo exterior derecho", x: 1400, y: 40, ancho: 40, alto: 740, vertical: true },
  { nombre: "Pasillo horizontal alto", x: 40, y: 300, ancho: 1400, alto: 40, vertical: false },
  { nombre: "Pasillo horizontal bajo", x: 40, y: 560, ancho: 1400, alto: 40, vertical: false }
];

// el mirador abarca todo el ancho del edificio, de un pasillo exterior al otro
const mirador = { x: 40, y: 780, ancho: 1400, profundidad: 260 };

// zona de mesas: una D mas pequena dentro del mirador, con espacio libre alrededor
const zonaMesas = { x: 80, y: 800, ancho: 1320, profundidad: 220 };

// un mini jardin frente a cada columna de locales (a 35 unidades de los locales, para poder caminar entre ellos)
const jardines = [
  { x: 110, y: 815, ancho: 260, alto: 40 },
  { x: 470, y: 815, ancho: 220, alto: 40 },
  { x: 790, y: 815, ancho: 220, alto: 40 },
  { x: 1110, y: 815, ancho: 260, alto: 40 }
];

// zona gris para sentarse: una franja debajo de cada jardin
const DISTANCIA_BANCA = 6;
const ALTO_BANCA = 16;

// cinco arboles centrados, cada uno con una zona gris alrededor para sentarse
const arboles = [
  { x: 540, y: 975, radio: 16 },
  { x: 640, y: 975, radio: 16 },
  { x: 740, y: 975, radio: 16 },
  { x: 840, y: 975, radio: 16 },
  { x: 940, y: 975, radio: 16 }
];
const MARGEN_SOMBRA_ARBOL = 10;

// vista completa del mapa y encuadre actual (para el zoom)
const ENCUADRE_COMPLETO = { x: 0, y: 0, ancho: 1480, alto: 1080 };
const ZOOM_MAXIMO = 8;

// estado del mapa
let localSeleccionado = null;
let encuadre = { x: ENCUADRE_COMPLETO.x, y: ENCUADRE_COMPLETO.y, ancho: ENCUADRE_COMPLETO.ancho, alto: ENCUADRE_COMPLETO.alto };
let monedaActual = "COP";
let tasasCambio = null;
let fechaTasas = "";


// MAPA - 2. CALCULOS

function formatearMoneda(numero) {
  return "$ " + numero.toLocaleString("es-CO");
}

// el arriendo depende de los metros y del factor de la zona
function calcularArriendo(local) {
  return Math.round(local.metros * TARIFA_METRO * zonas[local.zona].factor);
}

// cuenta los locales que ya tienen arrendatario
function contarArrendados() {
  return locales.filter(function (local) {
    return local.estado !== "disponible";
  }).length;
}

// arriendo mensual esperado de los locales que ya estan arrendados
function calcularIngresoMensual() {
  return locales
    .filter(function (local) {
      return local.estado !== "disponible";
    })
    .reduce(function (acumulado, local) {
      return acumulado + calcularArriendo(local);
    }, 0);
}

function buscarLocal(numero) {
  return locales.find(function (local) {
    return local.numero === numero;
  });
}

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

// deja el encuadre dentro de los limites del plano completo
function limitarEncuadre() {
  const maxX = ENCUADRE_COMPLETO.x + ENCUADRE_COMPLETO.ancho - encuadre.ancho;
  const maxY = ENCUADRE_COMPLETO.y + ENCUADRE_COMPLETO.alto - encuadre.alto;
  encuadre.x = Math.min(Math.max(encuadre.x, ENCUADRE_COMPLETO.x), maxX);
  encuadre.y = Math.min(Math.max(encuadre.y, ENCUADRE_COMPLETO.y), maxY);
}

// acerca (factor mayor a 1) o aleja (menor a 1) alrededor de un punto del mapa
// proporcionX y proporcionY van de 0 a 1 y dicen donde esta ese punto dentro de lo que se ve
function calcularZoom(factor, proporcionX, proporcionY) {
  const puntoX = encuadre.x + proporcionX * encuadre.ancho;
  const puntoY = encuadre.y + proporcionY * encuadre.alto;

  const nuevoAncho = Math.min(Math.max(encuadre.ancho / factor, ENCUADRE_COMPLETO.ancho / ZOOM_MAXIMO), ENCUADRE_COMPLETO.ancho);
  const nuevoAlto = nuevoAncho * (ENCUADRE_COMPLETO.alto / ENCUADRE_COMPLETO.ancho);

  encuadre.ancho = nuevoAncho;
  encuadre.alto = nuevoAlto;
  encuadre.x = puntoX - proporcionX * nuevoAncho;
  encuadre.y = puntoY - proporcionY * nuevoAlto;
  limitarEncuadre();
}

// mueve el encuadre una distancia dada en unidades del mapa
function calcularDesplazamiento(dx, dy) {
  encuadre.x -= dx;
  encuadre.y -= dy;
  limitarEncuadre();
}

function calcularVerTodo() {
  encuadre = { x: ENCUADRE_COMPLETO.x, y: ENCUADRE_COMPLETO.y, ancho: ENCUADRE_COMPLETO.ancho, alto: ENCUADRE_COMPLETO.alto };
}

// centra el encuadre en un punto, mostrando un cuarto del plano
function calcularCentrarEn(centroX, centroY) {
  encuadre.ancho = ENCUADRE_COMPLETO.ancho / 4;
  encuadre.alto = ENCUADRE_COMPLETO.alto / 4;
  encuadre.x = centroX - encuadre.ancho / 2;
  encuadre.y = centroY - encuadre.alto / 2;
  limitarEncuadre();
}
