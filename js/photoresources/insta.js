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
        if(data.meta.code!=200){
            alert('can"t find images(insta) error code'+data.meta.code);
        }

        var endedThreads = 0;
        data = data.data;

        data.length=2;//TODO CLEAR THIS SHIT

        for(var i=0;i<data.length;i++){
            findPhotos(data[i].id,token,function(data){
                 console.log(data);
                outData.push(data);
                endedThreads++;

            });
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