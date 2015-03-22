/**
 * Created by Alexeev on 22-Mar-15.
 */
function getPhotosVK(lat,lng,count,radius,callbackfunc){
    var imageSizes = ['src','src_big','src_small','src_xbig','src_xxbig','src_xxxbig'];

    $.ajax({
        type: "GET",
        url:'https://api.vk.com/method/photos.search',
        dataType: 'jsonp',
        data:{"sort":0,
            'lat':lat,
            'long':lng,
            'count':count,
            'radius':radius
            ,'version':'5.29'},
        success:function(data){
            Application.saveOptions();


            console.log(data);
            data = data.response;

            //for(var i=data.length-1;i>=data.length-parseInt($('#count').val()) && i>=0;i--){
            var imagesArrayOut=[];

            for(var i=0;i<data.length;i++){
                for(var j=imageSizes.length-1;j>=0;j--){
                    if(data[i][imageSizes[j]]){
                        imagesArrayOut.push({
                            src:data[i][imageSizes[j]],
                            thumbnail:data[i][imageSizes[0]],
                            w:data[i].width,
                            h:data[i].height,
                            vkid:data[i].owner_id,
                            title : data[i]['text']+"<br>"+moment.unix(parseInt(data[i]['created'])).format('MMMM Do YYYY, h:mm:ss a')+"<br>"+moment.unix(parseInt(data[i]['created'])).fromNow(),
                            lat:data[i]['lat'],
                            lng:data[i]['long'],
                            timestamp:parseInt(data[i]['created'])
                        });
                        break;
                    }
                }

            }
            callbackfunc(imagesArrayOut);
        }

    });
}
