# Plaza Mirador

Gestor de arriendos de locales de un centro comercial. Proyecto de **Herramientas de Programacion III (ET0056)**, Institucion Universitaria Pascual Bravo.

Integrantes: Andres Felipe Tavera Hoyos 

## Como abrirlo

Descomprimir y abrir `index.html` con doble clic (o con Live Server en Visual Studio Code). No necesita instalar nada. Para ver los valores en dolares o euros se necesita conexion a internet.

## Tabla de locales

La tabla de "Locales disponibles para arrendar" trabaja junto con el buscador y el filtro por plan (los dos se combinan):

- **Ordenar:** clic en el encabezado de Local, Metros cuadrados, Plan o Valor arriendo. Un segundo clic invierte el orden y una flecha indica la direccion (`ordenarLista` usa `sort`).
- **Paginacion:** 5 locales por pagina con botones Anterior y Siguiente (`obtenerPagina` usa `slice`).
- **Exportar a CSV:** descarga todos los locales que cumplen el filtro y la busqueda (no solo la pagina visible), en el orden elegido. El archivo usa punto y coma como separador para abrirlo directo en Excel (`crearCSV` y `descargarArchivo`).

## Paginas

- `index.html`: pagina principal con locales, tabla, formulario de agregar/editar, resumen y contacto.
- `mapa.html`: plano del centro comercial con 54 locales, pasillos y el mirador, con zoom y desplazamiento. Cada local tiene su posicion, su tamano en el dibujo y sus metros cuadrados. El mirador (zona de la gente) tiene forma de D: el lado recto toca el edificio y la curva sale hacia afuera. El mirador abarca todo el ancho del edificio y tiene una zona de mesas para sentarse, con un mini jardin frente a cada columna de locales, cinco arboles en el centro y zonas grises para sentarse (a distancia de los locales para poder caminar). Los locales mas cercanos al mirador casi todos estan arrendados; los del fondo tienen mas locales disponibles. Hay un pasillo central, dos pasillos laterales junto al mirador, dos pasillos exteriores (al lado de los locales de las columnas de los extremos) que bajan a conectarse con el mirador, y dos pasillos horizontales que los cruzan. El arriendo depende de los metros cuadrados y de la zona (cercania al mirador): zona 1 x1.4, zona 2 x1.1 y zona 3 x0.9.

## Estructura de carpetas

```
index.html        pagina principal
mapa.html         pagina del mapa
css/              estilos.css, mapa.css, api.css
img/              imagenes de los locales
js/
  modelo.js       datos, reglas, calculos y localStorage
  vista.js        todo lo que se dibuja en pantalla
  controlador.js  eventos y arranque
  mapa-*.js       lo mismo (modelo, vista, controlador) para el mapa
  servicios/
    api.js        consulta a la API de tasas de cambio
```

## API REST usada: ExchangeRate-API (endpoint abierto)

Sirve para mostrar el arriendo de cada local tambien en dolares o euros (selector "Ver valores en").

| Dato | Valor |
|---|---|
| URL base | `https://open.er-api.com/v6` |
| Endpoint | `/latest/USD` (direccion completa: `https://open.er-api.com/v6/latest/USD`) |
| Metodo HTTP | `GET` |
| Parametros | Ninguno. La moneda base va dentro de la ruta (`USD`). |
| Clave (API key) | No necesita. No hay ninguna clave en el repositorio. |
| Donde esta la llamada | `js/servicios/api.js`, funcion `obtenerTasasCambio()` |

Ejemplo de respuesta (resumido):

```json
{
  "result": "success",
  "base_code": "USD",
  "time_last_update_utc": "Thu, 26 Mar 2026 00:02:31 +0000",
  "time_next_update_utc": "Fri, 27 Mar 2026 00:02:31 +0000",
  "rates": {
    "COP": 3900.5,
    "EUR": 0.863827,
    "USD": 1
  }
}
```

Del JSON se usa `rates` (cuanto vale cada moneda por 1 dolar: `COP`, `USD`, `EUR`) y `time_last_update_utc` (fecha de las tasas). Para pasar de pesos a otra moneda: `pesos / rates.COP * rates[moneda]`.

### Como se usa en el codigo

- `obtenerTasasCambio()` usa `fetch` dentro de una funcion `async` con `await`, revisa `response.ok` y tiene `try/catch`.
- Las tasas se piden al abrir la pagina. Mientras llega la respuesta se muestra un indicador de carga ("Cargando las tasas de cambio...") y el selector de moneda queda bloqueado.
- Los valores empiezan en pesos. Al elegir dolares o euros en el selector se convierten todos los valores. Si la API fallo, el selector vuelve a pesos y muestra un mensaje amable en rojo; la pagina sigue funcionando.
- Los datos se transforman con metodos de arreglos: `map` calcula el arriendo en dolares de cada local y `reduce` suma el total (`calcularEquivalentePorLocal` y `calcularTotalEquivalente` en `modelo.js`).
- Los valores convertidos se muestran en las tarjetas, la tabla, el resumen y el detalle del mapa, no en la consola.

La tasa es de referencia y se actualiza una vez al dia. Los datos son de [ExchangeRate-API](https://www.exchangerate-api.com).

## Documentacion consultada

| Pagina | Para que sirvio |
|---|---|
| [Usando Fetch (MDN)](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch) | Hacer la peticion a la API con `fetch`. |
| [async function (MDN)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function) | Escribir la funcion `async` y usar `await`. |
| [Response.ok (MDN)](https://developer.mozilla.org/es/docs/Web/API/Response/ok) | Revisar si la API respondio bien antes de leer los datos. |
| [Array.prototype.sort (MDN)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) | Ordenar la tabla por columna. |
| [Blob (MDN)](https://developer.mozilla.org/es/docs/Web/API/Blob) | Crear el archivo CSV para descargarlo. |
| [Array.prototype.reduce (MDN)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) | Calcular totales (area, suma de arriendos y suma en dolares). |
| [Window.localStorage (MDN)](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage) | Guardar los locales y los registros para que sobrevivan al recargar. |
| [Open Access (ExchangeRate-API)](https://www.exchangerate-api.com/docs/free) | Direccion del endpoint abierto y formato de la respuesta. |

## Normas de codificacion del equipo

- Nombres en `camelCase` para variables y funciones; las funciones empiezan con un verbo (`calcularArriendo`, `pintarTabla`).
- Clases CSS con metodologia BEM (`bloque__elemento--modificador`); las del mapa empiezan con `mapa-`.
- Sangria de 2 espacios y punto y coma al final de cada instruccion.
- Comentarios en espanol, cortos, sobre lo que hace cada bloque.
- Solo `const` y `let` (nunca `var`) y comparaciones con `===`.
- Los datos escritos por el usuario se muestran con `textContent`, nunca con `innerHTML`.
- Los estilos van en el CSS: JavaScript solo cambia clases con `classList`.
- Sin codigo muerto ni `console.log` en la entrega.
- Capas separadas: el modelo no toca el DOM y la vista no guarda datos.
