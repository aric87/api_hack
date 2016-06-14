$(document).ready(function () {
    var lat = 41.68;
    var long = -70.2;

    function initialize() {
       var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            scrollwheel: false
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        google.maps.event.addListener(map, 'center_changed', function () {
                var coordinates = map.getCenter();
                lat = coordinates.k;
                long = coordinates.D;
                $('#images').fadeOut(600, function(){$('#images').html('')});
        });
        google.maps.event.addListener(map, 'idle', function(){
          getImages(lat,long);
        });
    };

    function getImages(lat,long) {
        var data = {
            method: "flickr.photos.search",
            has_geo: 1,
            lat:lat,
            lon:long,
            radius: 20,
            per_page: 50,
            sort: "interestingness-desc",
            api_key: "b09e1ad7c94edd9acf30df9400e22c38",
            format: "json",
            nojsoncallback: "1"
        };
    
        var result = $.ajax({
            url: "https://api.flickr.com/services/rest",
            data: data ,
            dataType: "json",
            type: "GET",
        })
        .done(function (result) {
            $.each(result.photos.photo, function (i, photo) {
                $('#images').append("<a class='anchor' href='https://www.flickr.com/photos/" + photo.owner + "/" + photo.id + "'><img src='https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg'></a>");
           });
           $('#images').fadeIn(1500);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR, error, errorThrown);
        });
    };
    
    google.maps.event.addDomListener(window, 'load', initialize);

    $('#images').on('mouseenter', 'img', function(){
      var largeImage = $(this).closest('a').clone();
      $('#copy').append(largeImage)
      $('#copy a').fadeIn(500);
    });
    $('#images').on('mouseout', 'img', function(){
        $('#copy a').fadeOut(300, function(){$(this).remove()});
    });
});
