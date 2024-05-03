window.onload = function() {
  // Primera Seccion
    var youtubeVideos = [
        {
            url: 'https://www.youtube.com/embed/x09D-9ZpF_o',
            title: 'Stars In The Starry Sky',
            description: 'Stars In The Starry Sky by Grouvex',
            footer: '©2023 - Grouvex Studio'
        },
        {
            url: 'https://www.youtube.com/embed/mk7h9tN6aPQ',
            title: 'Gemini',
            description: 'Gemini by Grouvex',
            footer: '©2025 - Grouvex Studio'
        },
        {
            url: 'https://www.youtube.com/embed/C3s4POyHvXc',
            title: 'Aries',
            description: 'Aries by Grouvex',
            footer: '©2025 - Grouvex Studio'
        },
        {
            url: 'https://www.youtube.com/embed/kRGcSJ6qrxE',
            title: 'Taurus',
            description: 'taurus by Grouvex',
            footer: '©2025 - Grouvex Studio'
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
  // Segunda Seccion
    var youtubeVideos = [
        {
            url: 'https://www.youtube.com/embed/WluFCmb6PmA',
            title: '<a href="#TheErasTour">The Eras Tour</a>',
            description: '<a>The Eras Tour (</a><a href="https://www.taylorswift.com/">Taylor Swift</a><a>) - Grouvex Studio</a>',
            footer: '©2024 - Grouvex Studio'
        },
        // Añade más objetos de videos de YouTube aquí
    ];

    var carousel = document.getElementById('youtube-carousel1');

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
