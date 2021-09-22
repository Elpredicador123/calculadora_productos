   
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Registro de SW exitoso', reg))
    .catch(err => console.warn('Error al tratar de registrar el sw', err))
}

console.log('conectado')

document.addEventListener("DOMContentLoaded", cargarDatos);

function cargarDatos(){
  url="datos.json"
  fetch(url)
  .then(respuesta => respuesta.json())
  .then(datos => {
    var fila = ""
    for (const dato of datos) {
      codigo = dato.codigo
      producto = dato.producto
      precio = formatearNumero(dato.precio)
      fila+=
      `
      <tr>
       <td scope="row">${codigo}</td>
       <td>${producto}</td>
       <td id="${codigo}_precio">${precio}
       </td>
       <td>
         <div class="form-group">
           <input type="number"
             class="form-control solo_numeros" oninput="setSubtotal(this)" name="gatorade" id="${codigo}" style="width: 75px;"  min="1" step="1">
         </div>
       </td>
       <td colspan="2" class="text-center" id="subtotal" data-set="${codigo}">$ 0</td>
     </tr>
     <tr>
      `;
    }
    fila+=
    `
    
    `;
  document.getElementById("datos").innerHTML = fila;
  })
    .catch(function(err) {
      console.log('Ha ocurrido un problema')
    });
}

function convertirNumero(cadena){
  return parseInt(cadena.replaceAll(" ", "").replaceAll('$', "").replaceAll(".", ""))
}
function formatearNumero(numero){
  valor = new Intl.NumberFormat("de-DE").format(numero)
  return `$ ${valor}`
}

function setSubtotal(evento){
  id  = evento.id
  cantidad = parseInt(evento.value)
  precio = convertirNumero(document.getElementById(`${id}_precio`).textContent)
  sub_total = (cantidad * precio) || 0
  document.querySelector(`[data-set="${id}"]`).textContent = formatearNumero(sub_total)
  SetTotal()
}

function SetTotal(){
  let total = 0
  array=document.querySelectorAll(`#subtotal`)
  array.forEach(element => {
    sub_total = convertirNumero(element.textContent) 
    total += sub_total
  });
  document.getElementById('total').textContent = formatearNumero(total)
}