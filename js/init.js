/**
 * Created by Alexeev on 22-Mar-15.
 */
function initRangeSlider(){
    var numberElement = $("#number");
    $('input[type="range"]').rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onInit: function() {},

        // Callback function
        onSlide: function(position, value) {
            numberElement.val(value);
        },

        // Callback function
        onSlideEnd: function(position, value) {
            numberElement.val(value);
        }
    });
}
function initCurrentGeolocation(){
    navigator.geolocation.getCurrentPosition(handle_geolocation_query);

    function handle_geolocation_query(position){
        var lng = position.coords.longitude;
        var lat = position.coords.latitude;
        if(!marker){
            marker = new google.maps.Marker();
        }
        marker.setPosition(new google.maps.LatLng(lat,lng));

        marker.setMap(map);

    }
}