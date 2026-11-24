import { obtenerCarrito, guardarCarrito } from "./storage.js";

let productosGlobales = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

async function cargarProductos() {
    try {
        const respuesta = await fetch("./js/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo de productos.");
        }

        productosGlobales = await respuesta.json();
        renderizarProductos(productosGlobales);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

function renderizarProductos(productos) {
    const contenedorProductos = document.getElementById("contenedor-productos");

    if (!contenedorProductos) {
        console.error("No se encontró el elemento #contenedor-productos en el HTML");
        return;
    }

    contenedorProductos.innerHTML = "";

    productos.forEach((prod) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const precioFormateado = prod.precio.toLocaleString("es-AR");

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="product-image">
            <div class="product-info">
                <span class="product-category">${prod.categoria}</span>
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
            </div>
            <div class="product-footer-card">
                <span class="product-price">$ ${precioFormateado}</span>
                <button class="btn-primary-cart" data-id="${prod.id}">🛒 Agregar al carrito</button>
            </div>
        `;

        contenedorProductos.appendChild(card);
    });

    activarBotonesCompra(contenedorProductos);
}

function activarBotonesCompra(contenedor) {
    contenedor.addEventListener("click", (e) => {
        const boton = e.target.closest(".btn-primary-cart");
        if (!boton) return;

        const idProducto = Number(boton.dataset.id);
        agregarAlCarrito(idProducto);
    });
}

function agregarAlCarrito(id) {
    const productoEncontrado = productosGlobales.find((prod) => prod.id === id);
    if (!productoEncontrado) return;

    const carrito = obtenerCarrito();
    const itemEnCarrito = carrito.find((item) => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...productoEncontrado, cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert(`¡"${productoEncontrado.nombre}" se agregó al carrito!`);
}