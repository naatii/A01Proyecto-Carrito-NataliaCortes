const tabla = document.querySelector("#lista-carrito tbody");
const listaCursos = document.querySelector("#lista-cursos");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
let listaCursosSeleccionados = [];

// Cargar carrito desde LocalStorage cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarCarritoLocalStorage);

listaCursos.addEventListener("click", manejarClickCurso);
botonVaciarCarrito.addEventListener("click", vaciarCarrito);

function manejarClickCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = obtenerDatosCurso(e.target);
    agregarCarrito(cursoSeleccionado);
  }
}

function obtenerDatosCurso(elemento) {
  const cursoSeleccionado = elemento.closest(".card");
  const imgSrc = cursoSeleccionado.querySelector("img").src;
  const titulo = cursoSeleccionado.querySelector("h4").textContent;
  const precio = cursoSeleccionado.querySelector(
    ".precio .u-pull-right"
  ).textContent;
  const id = cursoSeleccionado.querySelector("a").getAttribute("data-id");

  return { id, imgSrc, titulo, precio, cantidad: 1 };
}

function agregarCarrito(cursoSeleccionado) {
  const cursoExistente = listaCursosSeleccionados.find(
    (curso) => curso.id === cursoSeleccionado.id
  );

  if (cursoExistente) {
    cursoExistente.cantidad++;
    actualizarCantidad(cursoExistente);
  } else {
    listaCursosSeleccionados.push(cursoSeleccionado);
    agregarCursoTabla(cursoSeleccionado);
  }
  guardarCarritoLocalStorage();
}

function agregarCursoTabla(curso) {
  const { imgSrc, titulo, precio, cantidad, id } = curso;

  const tr = document.createElement("tr");

  // Imagen
  const tdImg = document.createElement("td");
  const imagen = document.createElement("img");
  imagen.src = imgSrc;
  imagen.classList.add("imagen-curso", "u-full-width");
  tdImg.appendChild(imagen);

  // Título
  const tdTitulo = document.createElement("td");
  tdTitulo.textContent = titulo;

  // Precio
  const tdPrecio = document.createElement("td");
  tdPrecio.textContent = precio;

  // Cantidad
  const tdCantidad = document.createElement("td");
  tdCantidad.classList.add("cantidad");
  tdCantidad.textContent = cantidad;

  // Botón borrar
  const tdBorrar = document.createElement("td");
  const btnBorrar = document.createElement("a");
  btnBorrar.textContent = "x";
  btnBorrar.href = "#";
  btnBorrar.classList.add("borrar-curso");
  btnBorrar.setAttribute("data-id", id);
  btnBorrar.addEventListener("click", () => borrarCurso(id)); // Cambiado aquí
  tdBorrar.appendChild(btnBorrar);

  tr.appendChild(tdImg);
  tr.appendChild(tdTitulo);
  tr.appendChild(tdPrecio);
  tr.appendChild(tdCantidad);
  tr.appendChild(tdBorrar);

  tabla.appendChild(tr);
}

function actualizarCantidad(curso) {
  const filas = [...tabla.querySelectorAll("tr")];
  const fila = filas.find(
    (elementoFila) =>
      elementoFila.querySelector("td:nth-child(2)").textContent === curso.titulo
  );

  if (fila) {
    fila.querySelector(".cantidad").textContent = curso.cantidad;
  }
}

function borrarCurso(id) {
  listaCursosSeleccionados = listaCursosSeleccionados.filter(
    (curso) => curso.id !== id
  );

  const filas = [...tabla.querySelectorAll("tr")];
  const fila = filas.find(
    (elementoFila) =>
      elementoFila.querySelector(".borrar-curso").getAttribute("data-id") === id
  );
  if (fila) {
    fila.remove();
  }
  guardarCarritoLocalStorage();
}

function vaciarCarrito() {
  listaCursosSeleccionados = [];
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }
  eliminarCarritoLocalStorage(); // Actualizar el LocalStorage
}

function guardarCarritoLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(listaCursosSeleccionados));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    listaCursosSeleccionados = JSON.parse(carritoGuardado); // Cambiado aquí
    listaCursosSeleccionados.forEach((curso) => agregarCursoTabla(curso));
  }
}

function eliminarCarritoLocalStorage() {
  localStorage.removeItem("carrito");
}
