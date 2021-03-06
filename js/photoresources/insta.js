/**
 * Created by Alexeev on 22-Mar-15.
 * license : MITShmat
 */
function findPlaces(lat,lng,token,callbackfunc){


    var outData = [];//output data array


    var data={access_token:token,lat:lat,lng:lng};
    createRequest(function (data) {
        console.log('place finded');
        console.log(data);
        console.log('~~start find media~~');


        var endedThreads = 0;
        if(data.meta.code!=200){

            if(data.meta.code==400){
               swal("Oops...", "Please sign in instagram", "error");
                Application.setOption('instaToken','');
                Application.saveOptions();
            }else{
                alert('can"t find images(insta) error code'+data.meta.code);
            }

            data = [];
            endedThreads=0;

        }
        else {
            data = data.data;


            for (var i = 0; i < data.length; i++) {
                findPhotos(data[i].id, token, function (data) {
                    console.log(data);
                    outData.push(data);
                    endedThreads++;

                });
            }
        }




        //Wait when all thread end...
        var threadWatcher = setInterval(function(){
            if(endedThreads>=data.length)
            {
                console.log('all data received!');

                clearInterval(threadWatcher);
                callbackfunc(outData);

            }

            console.log('current ended threads : '+endedThreads);
        },500);



    },data,"locations/search");



}
function findPhotos(placeId,token,callback){
    console.log('create request place id='+placeId);
    var data={access_token:token};
    createRequest(callback,data,'locations/'+placeId+'/media/recent');
}

function createRequest(callback,data,methodlocation){
    $.ajax({
        url:"https://api.instagram.com/v1/"+methodlocation,
        type:"GET",
        data:data,
        dataType: 'jsonp',
        success:callback
    });
}