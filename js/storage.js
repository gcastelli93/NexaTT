export const obtenerCarrito = () => {
    try {
        const datos = localStorage.getItem("carrito");
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error("Error al leer el carrito desde localStorage:", error);
        return [];
    }
};

export const guardarCarrito = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
};

export const actualizarContadorCarrito = () => {
    const carrito = obtenerCarrito();
    const cantidadTotal = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const badgeContador = document.getElementById("contador-carrito");

    if (!badgeContador) return;

    badgeContador.textContent = cantidadTotal;
    badgeContador.style.display = cantidadTotal === 0 ? "none" : "inline-block";
};

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
});