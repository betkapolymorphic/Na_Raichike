/**
 * Created by Alexeev on 22-Mar-15.
 */
var myCenter=new google.maps.LatLng(Application.getOption('lat')?Application.getOption('lat'): 50.017504,
    Application.getOption('lng')? Application.getOption('lng'):36.225178);
var marker;
var map;
var circle;
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
        setRadius(parseInt($("#number").val()));
    }


    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

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
        map.setCenter(new google.maps.LatLng(lat,lng));

        setRadius(parseInt($("#number").val()));
    }
}


function placeMarker(location) {
    if(!marker){
        marker = new google.maps.Marker();
    }
    marker.setPosition(location);

    marker.setMap(map);
    setRadius(parseInt($("#number").val()));
}
google.maps.event.addDomListener(window, 'load', initialize);



function CenterControl(controlDiv, map) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);


    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Current location';
    controlUI.appendChild(controlText);


    google.maps.event.addDomListener(controlUI, 'click', function() {
        initCurrentGeolocation();
    });

}
function setRadius(radius){

    if(!circle) {
        circle = new google.maps.Circle({
            map: map,
            radius: radius,    // 10 miles in metres
            fillColor: 'blue',
            draggable:true
        });
        circle.bindTo('center', marker, 'position');
        google.maps.event.addListener(circle, 'click', function(event) {
            placeMarker(event.latLng);
        });
    }
    else
        circle.setRadius(radius);

}