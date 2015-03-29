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
            ,'v':'5.29'},
        success:function(data){
            Application.saveOptions();



            data = data.response.items;
            console.log(data);
            //for(var i=data.length-1;i>=data.length-parseInt($('#count').val()) && i>=0;i--){
            var imagesArrayOut=[];
            var sizes=[140,200,300,700,1000,1300];
            for(var i=0;i<data.length;i++){

                        var sizeCounter = 0;
                        //finding photo size
                        var allSizes = [];
                        for (var k in data[i]){
                            if (data[i].hasOwnProperty(k)) {
                                if(k.indexOf("photo")!=-1){
                                    allSizes.push({'size':k.split('_')[1],
                                        'url':data[i][k]});
                                }
                            }
                        }
                        allSizes[allSizes.length-1]['size'] =data[i].width;
                        //
                        imagesArrayOut.push({
                            src:allSizes[allSizes.length-1]['url'],
                            thumbnail:allSizes[1]['url'],
                            thumbnail_w:150,
                            w:data[i].width,
                            h:data[i].height,
                            vkid:data[i].owner_id,
                            title : data[i]['text']+"<br>"+moment.unix(parseInt(data[i]['date'])).format('MMMM Do YYYY, h:mm:ss a')+"<br>"+moment.unix(parseInt(data[i]['date'])).fromNow(),
                            lat:data[i]['lat'],
                            long:data[i]['long'],
                            timestamp:parseInt(data[i]['date'])
                        });




            }
            callbackfunc(imagesArrayOut);
        }

    });
}
