window.onload = function() {
    var instagramPosts = [
        {
            url: 'https://www.instagram.com/p/C2499CfILK_/',
            title: 'Spheres of Life',
            description: 'Grouvex Studio presents: Spheres of Life. New Release. Type: Album (7). Title: Spheres of Life. Artist(s): Grouvex. Date: 10/02/2024 Hour: 0:00 GTM'
        },
        {
            url: 'https://www.instagram.com/p/C1FuPH0Jbwf/',
            title: 'A New Universe',
            description: 'A new universe is approaching at the speed of light, from a place far, far away. Do you want it to come to us as soon as possible? What do you think the universe can bring with him? Is it a good thing or a bad thing?'
        },
        {
            url: 'https://www.instagram.com/p/C6BPR5kooq0/',
            title: '<a href="https://www.youtube.com/watch?v=WluFCmb6PmA">The Eras Tour</a>',
            description: 'The Eras Tour (<a href="https://www.taylorswift.com/">Taylor Swift</a><a>) - Grouvex Studio</a>'
        },
        // Añade más objetos de publicaciones de Instagram aquí
    ];

    var carousel = document.getElementById('instagram-carousel');

    instagramPosts.forEach(function(post) {
        var postDiv = document.createElement('div');
        postDiv.innerHTML = '<h2 class="post-title">' + post.title + '</h2>' +
                            '<a class="post-description">' + post.description + '</a>' +
                            '<blockquote class="instagram-media" data-instgrm-permalink="' + post.url + '" data-instgrm-version="13"></blockquote>';
        carousel.appendChild(postDiv);
    });

    var instaScript = document.createElement('script');
    instaScript.setAttribute('src', 'https://www.instagram.com/embed.js');
    document.getElementsByTagName('head')[0].appendChild(instaScript);
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
