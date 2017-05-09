/* globals get_counter, get_events, get_news, L */

$(document).ready(function() {
    get_counter();
    get_events();
    get_news();

    L.mapbox.accessToken = 'pk.eyJ1IjoiY29temVyYWRkIiwiYSI6ImxjQjFHNFUifQ.ohrYy34a8ZIZejrPSMWIww';
    L.mapbox.map('map', 'comzeradd.jimaooe5',{
        zoomControl: false
    }).setView([38.01697, 23.73140], 15);

    setInterval(function() {
        get_counter();
    }, 100000);

    // fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });

    // Add current copyright year
    var current_year = '-' + new Date().getFullYear();
    $('#copy').text(current_year);
});
