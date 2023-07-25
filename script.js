//Proyecto final Pagano

//consumo mi json local con fetch
const urlLocal = '../db.json'
let productos = []

fetch(urlLocal)
.then(response => response.json())
.then (data => {
       productos.push(...data)
       crearTarjetas(data)})
.catch(Err => contenedor.innerHTML = `<p> Error en la API </p>` )


let carritoJSON = JSON.parse (localStorage.getItem("carrito"))
let carrito = carritoJSON ? carritoJSON : []


//capturo el id de mi contenedor (div) de productos de mi html
let contenedor = document.getElementById("productos")

/* renderizarCarrito (carrito) */
renderizarCarrito (carrito)

//creo una funcion para crear tarjetas, en donde recorro el array de productos y creo una tarjeta por cada uno
function crearTarjetas(array) {
    contenedor.innerHTML = "" //Vaciamos pantalla
    array.forEach((producto) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "contenedorProducto"
    tarjeta.innerHTML = `
    <h3>${producto.nombre}</h3>
    <img class="imagen" src="../img/${producto.rutaImagen}">
    <h4>COD: ${producto.id}</h4>
    <div id=${producto.id} class="button">
    <div class="button-wrapper">
      <div class="text">$${producto.precio}</div>
        <span class="icon">
          <svg viewBox="0 0 16 16" class="bi bi-cart2" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
          </svg>
        </span>
      </div>
    </div>
    `
    contenedor.appendChild(tarjeta) //por cada elemento (producto) le agrego a contenedor un hijo.
    let botonCarrito = document.getElementById (`${producto.id}`)
    botonCarrito.addEventListener("click", agregarCarrito)
  })
}

//genero evento para filtrar productos con un input
let buscador = document.getElementById("buscador")
buscador.addEventListener("input",filtrar)

//funcion para filtrar
function filtrar() {
  let arrayFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.toLowerCase().includes(buscador.value.toLowerCase()) || producto.id.toLowerCase().includes(buscador.value.toLowerCase()))
  crearTarjetas(arrayFiltrado, contenedor)}


//funcion para agregar productos al carrito
function agregarCarrito (e) {
  let productoBuscado = productos.find(producto => producto.id === e.currentTarget.id)
  let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === productoBuscado.id)
 
      if (posicionProductoEnCarrito === -1) {
        carrito.push({
          id: productoBuscado.id,
          nombre: productoBuscado.nombre,
          precioUnitario: productoBuscado.precio,
          unidades: 1,
          subtotal: productoBuscado.precio,
          img: productoBuscado.rutaImagen,
        })
      } else {
        carrito[posicionProductoEnCarrito].unidades++
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].precioUnitario * carrito[posicionProductoEnCarrito].unidades
      }
      Toastify({
        text: "Producto agregado al Carrito",
        duration: 1800,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 80%, rgba(252,127,69,1) 99%)",
        },
      }).showToast()
      
      localStorage.setItem("carrito", JSON.stringify(carrito))
      renderizarCarrito(carrito)
}

//funcion para crear un codigo aleatorio
function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters.charAt(randomIndex)
  }
  
  return code;
}

const randomCode = generateRandomCode(8) // Genera un código aleatorio de longitud 10


/*Funcion para crear carrito*/
function renderizarCarrito() {
  let carritoFisico = document.getElementById("carrito")
  carritoFisico.innerHTML = ""
  carrito.forEach(producto => {
    carritoFisico.innerHTML += ` <div class="carritoFinal"> <img class="imagenCarrito" src="../img/${producto.img}"> ${producto.nombre} <span class="bold">Unidades:</span> ${producto.unidades} <span class="bold">Subtotal:</span> ${producto.subtotal}</div> `
  })
  const precioTotal = carrito.reduce((total, producto) => total + producto.subtotal, 0)
  carritoFisico.innerHTML += `<p class="PrecioTot" >Precio Total: ${precioTotal}</p>`
  carritoFisico.innerHTML += `<div class="center"><button id="finalizada" class="compra">Finalizar Compra</button> <button id="cancel" class="compra">cancelar</button></div>`
  
  let botones = document.querySelectorAll("#finalizada, #cancel")
  botones.forEach(boton => {
    boton.addEventListener("click", finalizarCompra)
  })

  function finalizarCompra(e) {
    let carritoFisico = document.getElementById("carrito")
    carritoFisico.innerHTML = ""

    if (e.target.id === "finalizada") {
      carritoFisico.innerHTML = `<p class=mensajeFinal>¡Muchas gracias por su compra!</p> <p>Su codigo de compra es: ${randomCode} </p>`
      sweetAlert ("success","Compra confirmada",)
    } else if (e.target.id === "cancel") {
      carritoFisico.innerHTML += `<p class=mensajeFinal> Ya puede seguir comprando </p>`
      sweetAlert ("error","¡Compra Cancelada!")
    }
    carrito = []
    localStorage.clear()
  }
}

//capturo el ID y creo el evento para mostrar y ocultar
let boton = document.getElementById("boton")
boton.addEventListener("click", mostrarOcultar) 

//funcion para mostrar y ocultar carrito
function mostrarOcultar () {
  let padreContenedor = document.getElementById("contenedorPadre")
  let carrito = document.getElementById("carrito")
  padreContenedor.classList.toggle("oculto")
  carrito.classList.toggle("oculto")
}

//funcion para llamar a sweet alert dependiendo si cancela o finaliza compra
function sweetAlert (icon,title,text,) {
Swal.fire({
  icon,
  title,
  text,
})}

