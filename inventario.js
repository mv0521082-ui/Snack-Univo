"use strict";
let productos = [
    { id: 1, nombre: "Papas", categoria: "Snacks", precio: 1.25, stock: 10 },
    { id: 2, nombre: "Galletas", categoria: "Dulces", precio: 0.75, stock: 15 },
    { id: 3, nombre: "Chocolate", categoria: "Dulces", precio: 1.50, stock: 8 },
    { id: 4, nombre: "Refresco", categoria: "Bebidas", precio: 2.00, stock: 12 },
    { id: 5, nombre: "Agua", categoria: "Bebidas", precio: 0.50, stock: 20 },
    { id: 6, nombre: "Barra de cereal", categoria: "Snacks", precio: 0.90, stock: 6 }
];
const historial = [];
let productoSeleccionado = null;
let ingresosTotales = 0;
let unidadesVendidas = 0;
// Elementos HTML
const catalogo = document.getElementById("catalogo-productos");
const ingresosElemento = document.getElementById("ingresos-totales");
const unidadesElemento = document.getElementById("unidades-vendidas");
const nombreSeleccionado = document.getElementById("producto-seleccionado-nombre");
const precioSeleccionado = document.getElementById("producto-seleccionado-precio");
const stockSeleccionado = document.getElementById("producto-seleccionado-stock");
const cantidadInput = document.getElementById("cantidad-operacion");
const botonComprar = document.getElementById("boton-comprar");
const botonReponer = document.getElementById("boton-reponer");
const mensajeOperacion = document.getElementById("mensaje-operacion");
const tablaHistorial = document.getElementById("tabla-historial");
const buscador = document.getElementById("buscar-producto");
const filtroEstado = document.getElementById("filtro-estado");
const filtroMovimiento = document.getElementById("filtro-tipo-movimiento");
// Mostrar productos
function renderizarProductos() {
    catalogo.innerHTML = "";
    let lista = [...productos];
    const textoBusqueda = buscador.value.toLowerCase();
    const estado = filtroEstado.value;
    lista = lista.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));
    if (estado === "disponibles") {
        lista = lista.filter(p => p.stock > 0);
    }
    if (estado === "agotados") {
        lista = lista.filter(p => p.stock === 0);
    }
    lista.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-producto";
        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            ${producto.categoria ? `<p>Categoría: ${producto.categoria}</p>` : ""}
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <p>Stock: ${producto.stock}</p>
            <button type="button">Seleccionar</button>
        `;
        const boton = tarjeta.querySelector("button");
        boton.addEventListener("click", () => {
            productoSeleccionado = producto;
            actualizarSeleccionado();
        });
        catalogo.appendChild(tarjeta);
    });
}
function actualizarSeleccionado() {
    if (!productoSeleccionado)
        return;
    nombreSeleccionado.textContent = productoSeleccionado.nombre;
    precioSeleccionado.textContent = `$${productoSeleccionado.precio.toFixed(2)}`;
    stockSeleccionado.textContent = productoSeleccionado.stock.toString();
}
function actualizarResumen() {
    ingresosElemento.textContent = `$${ingresosTotales.toFixed(2)}`;
    unidadesElemento.textContent = unidadesVendidas.toString();
}
function registrarMovimiento(tipo, producto, cantidad) {
    const movimiento = {
        fecha: new Date().toLocaleString(),
        tipo,
        producto: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
        total: producto.precio * cantidad
    };
    historial.push(movimiento);
    renderizarHistorial();
}
function renderizarHistorial() {
    tablaHistorial.innerHTML = "";
    let movimientos = [...historial];
    const filtro = filtroMovimiento.value;
    if (filtro === "ventas") {
        movimientos = movimientos.filter(m => m.tipo === "Venta");
    }
    if (filtro === "reposiciones") {
        movimientos = movimientos.filter(m => m.tipo === "Reposición");
    }
    movimientos.forEach(movimiento => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${movimiento.fecha}</td>
            <td>${movimiento.tipo}</td>
            <td>${movimiento.producto}</td>
            <td>${movimiento.cantidad}</td>
            <td>$${movimiento.precioUnitario.toFixed(2)}</td>
            <td>$${movimiento.total.toFixed(2)}</td>
        `;
        tablaHistorial.appendChild(fila);
    });
}
// Comprar
botonComprar.addEventListener("click", () => {
    if (!productoSeleccionado) {
        mensajeOperacion.textContent = "Seleccione un producto.";
        return;
    }
    const cantidad = Number(cantidadInput.value);
    if (cantidad <= 0) {
        mensajeOperacion.textContent = "Cantidad inválida.";
        return;
    }
    if (cantidad > productoSeleccionado.stock) {
        mensajeOperacion.textContent = "Stock insuficiente.";
        return;
    }
    productoSeleccionado.stock -= cantidad;
    ingresosTotales += productoSeleccionado.precio * cantidad;
    unidadesVendidas += cantidad;
    registrarMovimiento("Venta", productoSeleccionado, cantidad);
    actualizarResumen();
    actualizarSeleccionado();
    renderizarProductos();
    mensajeOperacion.textContent = "Compra realizada correctamente.";
});
// Reponer
botonReponer.addEventListener("click", () => {
    if (!productoSeleccionado) {
        mensajeOperacion.textContent = "Seleccione un producto.";
        return;
    }
    const cantidad = Number(cantidadInput.value);
    if (cantidad <= 0) {
        mensajeOperacion.textContent = "Cantidad invalida.";
        return;
    }
    productoSeleccionado.stock += cantidad;
    registrarMovimiento("Reposición", productoSeleccionado, cantidad);
    actualizarSeleccionado();
    renderizarProductos();
    mensajeOperacion.textContent = "Existencias repuestas correctamente.";
});
// Eventos filtros
buscador.addEventListener("input", renderizarProductos);
filtroEstado.addEventListener("change", renderizarProductos);
filtroMovimiento.addEventListener("change", renderizarHistorial);
async function cargarProductosDesdeJSON() {
    try {
        const respuesta = await fetch("./inventario.Json");
        if (!respuesta.ok)
            return;
        const datos = await respuesta.json();
        if (Array.isArray(datos) && datos.length > 0) {
            productos = datos;
            renderizarProductos();
        }
    }
    catch {
        // Mantiene el arreglo inicial si no se puede leer el JSON
    }
}
// Inicialización
renderizarProductos();
actualizarResumen();
renderizarHistorial();
cargarProductosDesdeJSON();
