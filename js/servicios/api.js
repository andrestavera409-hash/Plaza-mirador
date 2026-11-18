// SERVICIO DE TASAS DE CAMBIO (ExchangeRate-API, endpoint abierto, no necesita clave)

// direccion base y endpoint: devuelve cuantas unidades de cada moneda vale 1 dolar
const URL_API_TASAS = "https://open.er-api.com/v6/latest/USD";

// pide las tasas de cambio; devuelve { tasas, actualizado }
// tasas es un objeto como { COP: 3900, EUR: 0.86, ... } (unidades de cada moneda por 1 dolar)
// si algo falla lanza un Error con un mensaje amable para mostrarle al usuario
async function obtenerTasasCambio() {
  try {
    const respuesta = await fetch(URL_API_TASAS);

    if (!respuesta.ok) {
      throw new Error("La API respondio con el estado " + respuesta.status);
    }

    const datos = await respuesta.json();

    if (datos.result !== "success" || typeof datos.rates.COP !== "number") {
      throw new Error("La API respondio con datos que no se esperaban");
    }

    return {
      tasas: datos.rates,
      actualizado: datos.time_last_update_utc
    };
  } catch (error) {
    throw new Error("No se pudo obtener la tasa de cambio. Revisa tu conexion e intenta de nuevo.");
  }
}
