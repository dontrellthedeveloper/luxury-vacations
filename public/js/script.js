/* ================================
|   |   |   Preloader
================================ */
$(window).on('load', function() {
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
});

/* ================================
|   |   |   Team
================================ */
$(function () {
    $("#team-members").owlCarousel({
        items: 2,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        nav: true,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });
});

/* ================================
|   |   |   Progress Bars
================================ */
$(function() {

    $("#progress-elements").waypoint(function() {

        $(".progress-bar").each(function() {

            $(this).animate({
                width: $(this).attr("aria-valuenow") + "%"
            }, 1000);
        });
        this.destroy();
    }, {
        offset: 'bottom-in-view'
    });
});


/* ================================
|   |   |   Services Tabs
================================ */

$(function () {

    $("#services-tabs").responsiveTabs({
        animation: 'slide'
    });

});



/* ================================
|   |   |   Portfolio
================================ */


$('.gallery-list-item').click(function () {
    let value = $(this).attr('data-filter');
    if(value === 'all') {
        $('.filter').show(300);
    }else {
        $('.filter').not('.' + value).hide(300);
        $('.filter').filter('.' + value).show(300);
    }
});

$('.gallery-list-item').click(function () {
    $(this).addClass('active-item').siblings()
        .removeClass('active-item');
});


/* ================================
|   |   |   Magnifier
================================ */

$(function () {

    $("#portfolio-wrapper").magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        }
    });

});
