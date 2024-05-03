window.onload = function() {
    var youtubeVideos = [
        {
            url: 'https://www.youtube.com/embed/x09D-9ZpF_o',
            title: 'Stars In The Starry Sky',
            description: 'Stars In The Starry Sky by Grouvex | 2023 - Grouvex Studio'
        },
        {
            url: 'https://www.youtube.com/embed/3tmd-ClpJxA',
            title: 'Título del Video 2',
            description: 'Descripción del Video 2'
        },
        // Añade más objetos de videos de YouTube aquí
    ];

    var carousel = document.getElementById('youtube-carousel');

    youtubeVideos.forEach(function(video) {
        var videoDiv = document.createElement('div');
        videoDiv.innerHTML = '<h2 class="post-title">' + video.title + '</h2>' +
                            '<p class="post-description">' + video.description + '</p>' +
                            '<iframe width="560" height="315" src="' + video.url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        carousel.appendChild(videoDiv);
    });

    // Código para el acordeón
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}
