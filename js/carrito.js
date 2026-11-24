import { obtenerCarrito, guardarCarrito } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
});

function obtenerRutaCarrito(ruta) {
    if (!ruta) return "";
    if (ruta.startsWith("http") || ruta.startsWith("../")) return ruta;
    if (ruta.startsWith("./")) return `.${ruta}`;
    return `../${ruta}`;
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("carrito-contenedor");
    const spanTotal = document.getElementById("carrito-total");
    const resumenCarrito = document.getElementById("carrito-resumen");
    const carrito = obtenerCarrito();

    if (!contenedorCarrito) return;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">Tu carrito está vacío.</p>
                <a href="../index.html" class="btn-primary">Ver productos</a>
            </div>
        `;
        if (resumenCarrito) resumenCarrito.style.display = "none";
        return;
    }

    if (resumenCarrito) resumenCarrito.style.display = "flex";
    contenedorCarrito.innerHTML = "";

    let totalGeneral = 0;

    carrito.forEach((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;

        const divItem = document.createElement("div");
        divItem.style.cssText = `
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        `;

        divItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <img
                    src="${obtenerRutaCarrito(producto.imagen)}"
                    alt="${producto.nombre}"
                    style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem;"
                >
                <div>
                    <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.4rem;">
                        ${producto.nombre}
                    </h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.6rem;">
                        Precio unitario: $ ${producto.precio.toLocaleString("es-AR")}
                    </p>
                    <div style="display: inline-flex; align-items: center; gap: 0.6rem; background-color: var(--bg-main); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.25rem 0.5rem;">
                        <button
                            class="btn-restar"
                            data-id="${producto.id}"
                            aria-label="Restar unidad"
                            style="background-color: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); width: 1.75rem; height: 1.75rem; border-radius: 0.35rem; cursor: pointer; font-weight: 700;"
                        >-</button>
                        <span style="color: var(--text-main); font-weight: 700; min-width: 1.5rem; text-align: center;">
                            ${producto.cantidad}
                        </span>
                        <button
                            class="btn-sumar"
                            data-id="${producto.id}"
                            aria-label="Sumar unidad"
                            style="background-color: var(--color-primary); color: var(--text-main); border: none; width: 1.75rem; height: 1.75rem; border-radius: 0.35rem; cursor: pointer; font-weight: 700;"
                        >+</button>
                    </div>
                </div>
            </div>
            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <span style="color: var(--text-main); font-size: 1.2rem; font-weight: 700;">
                    $ ${subtotal.toLocaleString("es-AR")}
                </span>
                <button
                    class="btn-eliminar"
                    data-id="${producto.id}"
                    style="background-color: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 0.85rem;"
                >
                    🗑️ Eliminar
                </button>
            </div>
        `;

        contenedorCarrito.appendChild(divItem);
    });

    if (spanTotal) {
        spanTotal.textContent = `$ ${totalGeneral.toLocaleString("es-AR")}`;
    }

    activarEventosCarrito();
}

function cambiarCantidad(idProducto, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find((prod) => prod.id === idProducto);
    if (!item) return;

    item.cantidad += delta;

    const carritoActualizado =
        item.cantidad <= 0
            ? carrito.filter((prod) => prod.id !== idProducto)
            : carrito;

    guardarCarrito(carritoActualizado);
    renderizarCarrito();
}

function activarEventosCarrito() {
    document.querySelectorAll(".btn-sumar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = Number(e.currentTarget.dataset.id);
            cambiarCantidad(id, 1);
        });
    });

    document.querySelectorAll(".btn-restar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = Number(e.currentTarget.dataset.id);
            cambiarCantidad(id, -1);
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = Number(e.currentTarget.dataset.id);
            const carritoActualizado = obtenerCarrito().filter((item) => item.id !== id);

            guardarCarrito(carritoActualizado);
            renderizarCarrito();
        });
    });
}