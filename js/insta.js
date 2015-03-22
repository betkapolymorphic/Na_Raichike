/**
 * Created by Alexeev on 22-Mar-15.
 * license : MITShmat
 */
function findPlaces(lat,lng){
    var data=[];
    createRequest(function (data) {

    },data,"locations/search");
}
function createRequest(callback,data,methodlocation){
    $.ajax({
        url:"https://api.instagram.com/v1/"+methodlocation,
        type:"GET",
        data:data,
        success:callback
    });
}