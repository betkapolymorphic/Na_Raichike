/**
 * Created by Alexeev on 22-Mar-15.
 */
var myCenter=new google.maps.LatLng(50.017504,36.225178);
var marker;
var map;

function initialize() {



    var mapProp = {
        center:myCenter,
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });


    if(!Application.getOption('lat') || !Application.getOption('lng')){
        initCurrentGeolocation();
    }else{
        if(!marker){
            marker = new google.maps.Marker();
        }
        marker.setPosition(new google.maps.LatLng(Application.getOption('lat')
            ,Application.getOption('lng')));
        marker.setMap(map);
    }

}


function placeMarker(location) {
    if(!marker){
        marker = new google.maps.Marker();
    }
    marker.setPosition(location);

    marker.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);

