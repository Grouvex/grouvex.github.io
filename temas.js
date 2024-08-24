<!DOCTYPE html>
<html lang="es">
<script src="../jquery-3.5.1.min.js"></script>
 <script> 
    $(function(){
      $("#menu").load("../menu.html"); 
    });
    $(function(){
      $("#footer").load("footer.html"); 
    });
 </script>
<body>
<main>
  <select class="orden-button" id="ordenSelector" onchange="cambiarOrden()" style="margin:5px;margin-left:0px">
        <option value="" disabled selected>Order</option>
        <option value="ascT">⬇ to ⬆</option>
        <option value="desT">⬆ to ⬇</option>
    </select>
 <div class="cajetines">
   <script>
    // NO tocar
    function actualizarFechas(uT, elementoId) {if (uT <= Math.floor(Date.now() / 1000)){const f1 = new Date(uT * 1000).toUTCString();document.getElementById(elementoId).textContent = f1;
    } else {const fUT = Math.floor(Date.now() / 1000);const diferencia = uT - fUT;const segundos = diferencia % 60;const minutos = Math.floor((diferencia / 60) % 60);const h = Math.floor((diferencia / 3600) % 24);const d = Math.floor(diferencia / 86400);const m = Math.floor(d / 30.24);const a = Math.floor(d / 365.44);const f1 = `Start in: ${a} year, ${m} months, ${d}d, ${h}h, ${minutos}m y ${segundos}s.`;
    document.getElementById(elementoId).textContent = f1;}
    }
   </script>
    <a href="alpha_version.html" class="cajetin" data-ut="1703203200">   
      <img src="../port/Alpha_Version.jpg" alt="" style="width:300px">
      <p class="cajetin-fechas"><span id="f1_1"></span></p>
      <p class="cajetin-titulo">Alpha Version</p>
      <p class="cajetin-footer">©Grouvex Studios Recording, Maiki Dran</p>
      <script>const uT1 = 1703203200; actualizarFechas(uT1, "f1_1");</script>
     </a>
     <a href="a_parallel_universe.html" class="cajetin" data-ut="1703462400">   
      <img src="../port/A Parallel Universe.jpg" alt="" style="width:300px">
      <p class="cajetin-fechas"><span id="f1_2"></span></p>
      <p class="cajetin-titulo">A Parallel Universe</p>
      <p class="cajetin-footer">©Grouvex Studios Recording, Maiki Dran</p>
      <script>const uT2 = 1703462400; actualizarFechas(uT2, "f1_2");</script>
     </a>
     <a href="otra_pagina.html" class="cajetin" data-ut="1727568000">   
      <img src="../port/La Perla.jpg" alt="" style="width:300px">
      <p class="cajetin-fechas"><span id="f1_3"></span></p>
      <p class="cajetin-titulo">La Perla</p>
      <p class="cajetin-footer">©Grouvex Studios Recording, Maiki Dran</p>
      <script>const uT3 = 1727568000; actualizarFechas(uT3, "f1_3");</script>
     </a>
    </div>
 </main>
<script>
const marcasDeTiempo = [uT1, uT2, uT3];
// NO tocar
function cambiarOrden() {if (document.getElementById('ordenSelector').value == 'ascT'){marcasDeTiempo.sort((b, a) => b - a)}if (document.getElementById('ordenSelector').value == 'desT'){marcasDeTiempo.sort((a, b) => b - a)}const cajetinesContainer = document.querySelector('.cajetines');marcasDeTiempo.forEach((uT) => {const cajetin = document.querySelector(`[data-ut="${uT}"]`);cajetinesContainer.appendChild(cajetin); });}
</script>
</body>
<div id="footer"></div>
</html>
