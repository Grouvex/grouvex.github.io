document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado. Precargando la siguiente página...");

    // Escuchar clics en todos los enlaces
    document.addEventListener("click", function (event) {
        const target = event.target;

        // Verificar si el clic fue en un enlace (<a>)
        if (target.tagName === "A") {
            const url = target.href; // Obtener la URL del enlace

            // Verificar si el enlace pertenece al dominio grouvex.com
            if (new URL(url).hostname === "grouvex.com") {
                event.preventDefault(); // Evitar la redirección inmediata

                console.log(`Precargando contenido de: ${url}`);

                // Precargar el contenido de la siguiente página
                fetch(url)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Error al cargar la página: ${response.statusText}`);
                        }
                        return response.text(); // Obtener el contenido HTML de la página
                    })
                    .then((html) => {
                        console.log(`Contenido de ${url} precargado correctamente.`);
                        // Aquí podrías hacer algo con el HTML precargado, como almacenarlo en una variable
                        // o inyectarlo en un elemento oculto en la página actual.

                        // Redirigir al usuario a la página correspondiente
                        console.log(`Redirigiendo a: ${url}`);
                        window.location.href = url;
                    })
                    .catch((error) => {
                        console.error("Error al precargar la página:", error);
                        alert("Hubo un error al cargar la página. Inténtalo de nuevo.");
                    });
            } else {
                console.log(`El enlace no pertenece al dominio grouvex.com. Redirección normal.`);
                // Si el enlace no es del dominio, permitir la redirección normal
            }
        }
    });
});
