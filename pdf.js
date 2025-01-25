function generarPDF() {
    const contenido = document.getElementById('contenido').innerHTML;
    const body = document.body;
    const bodyWidth = body.scrollWidth;
    const bodyHeight = body.scrollHeight;

    const ventana = window.open('', '', `width=${bodyWidth},height=${bodyHeight}`);
    ventana.document.write('<html><head><title>Convertir HTML a PDF</title>');
    ventana.document.write('<link rel="stylesheet" href="styles.css">');
    ventana.document.write('</head><body>');
    ventana.document.write(contenido);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.print();
    ventana.close();
}
