/**
 * Created by Alexeev on 22-Mar-15.
 */
var imagesArray = [];
var win = {};
var Application = ApplicationSingleton.getInstance();
Application.loadOptions();

$(function(){

    initRangeSlider();


    if(Application.getOption('radius')){
            $('#number').val(Application.getOption('radius'));
        $('input[type="range"]').val(Application.getOption('radius')).change();
    }
    if(Application.getOption('count')){
        $('#count').val(Application.getOption('count'));
    }


    if(Application.getOption('instaToken')){
        $("#checkBoxInstagram").prop('checked',true);
    }
    $("#checkBoxInstagram").click(function() {
        if(!Application.getOption('instaToken')){
            //win = window.open("https://instagram.com/oauth/authorize/?client_id=176df16d1d1a43a28932e19d3dee0612&redirect_uri=http://vraenchike.esy.es/thanks.html&response_type=token", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400");

            win = window.open("https://instagram.com/oauth/authorize/?client_id=e89c15f39bc34a039d2885ceac63f008&redirect_uri=http://drup.com/thanks.html&response_type=token", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400");

            win.onbeforeunload = function(){
              //  alert(1);
                try {
                    var tok = win.location.hash.split('=')[1];
                    if(tok){
                        Application.setOption('instaToken',tok);
                        $("#checkBoxInstagram").prop('checked',true);
                    }

                }catch (err){
                    console.log(err);
                }
            };
            return false;
        }

    });




    $("#findGirlsButton").on('click',function(){


        /*win = window.open("https://instagram.com/oauth/authorize/?client_id=d8e66baf0f344b47b504cde05aa94641&redirect_uri=http://oocom/thanks.html&response_type=token", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400");
        win.onbeforeunload = function(){
            alert(win.location.hash.split('=')[1]);
        };
       */

        if(!marker){
            alert("Please select your location");
            return;
        }



        Application.setOption('lng',marker.getPosition().lng());
        Application.setOption('lat',marker.getPosition().lat());
        Application.setOption('radius',parseInt($('#number').val()));
        Application.setOption('count',parseInt($('#count').val()));

        imagesArray=[];
        var imagesVK = [];
        var imagesInsta = [];

        var endedThreads = 0;
        $("#loadingModal").modal('show');
        if(Application.getOption('instaToken') && $("#checkBoxInstagram").is(":checked")){
            console.log('creating request');
            findPlaces(Application.getOption('lat'),
                Application.getOption('lng'),
                Application.getOption('instaToken'),function(data){
                    console.log("RECEIVE DATA!");
                    for(var i=0;i<data.length;i++){
                        var curMedia = data[i];
                        if(curMedia.meta.code!=200){
                            continue;
                        }

                        curMedia = curMedia.data;
                        curMedia.forEach(function (photo) {
                            console.log(photo);
                            if(photo.type=="image")
                            imagesInsta.push({
                                src:photo.images.standard_resolution.url,
                                thumbnail:photo.images.thumbnail.url,
                                thumbnail_w:/*photo.images.thumbnail.width*/150,
                                //instaId:photo.user.id,
                                w:photo.images.standard_resolution.width,
                                h:photo.images.standard_resolution.height,
                                title : (photo.caption ? photo.caption.text:"")+"<br><a target='_blank' href='https://ru.foursquare.com/explore?mode=url&q="+encodeURIComponent(photo.location.name)+"'>"+photo.location.name+"</a><br>"+(photo.caption ? moment.unix(parseInt(photo.caption.created_time)).format('MMMM Do YYYY, h:mm:ss a') :"")
                                    +"<br>"+(photo.caption ? moment.unix(parseInt(photo.caption.created_time)).fromNow() : ""),
                                lat:photo.location.latitude,
                                timestamp : photo.caption ?  parseInt(photo.caption.created_time) : 0,
                                lng:photo.location.longitude,
                                photolinkInstagram:photo.link
                            });
                        });
                    }

                    endedThreads++;
                })

        }else{
            endedThreads++;
        }






        if($("#checkBoxVK").is(":checked")){
            getPhotosVK(Application.getOption('lat'),Application.getOption('lng'),
                Application.getOption('count'),Application.getOption('radius'),
                function(data){

                    //easy ;)
                    imagesVK = data;
                    endedThreads++;
                });
        }else{
            endedThreads++;
        }

        var threadWatcher = setInterval(function(){
            if(endedThreads>=2) //vk + insta
            {
                console.log('all photo uploads!');

                if(imagesVK.length==0 && $("#checkBoxVK").is(":checked")){
                    sweetAlert("Oops...", "Vk images not load:( Try increase radius or chose other location!", "error");
                }

                var sorttype = $('#sorttype').find(":selected").val();
                if(sorttype=="s-date"){
                    imagesArray = imagesArray.concat(imagesVK).concat(imagesInsta);
                    imagesArray.sort(function(a,b){
                        return b.timestamp- a.timestamp;
                    });
                }else if(sorttype=="s-vk"){
                    imagesInsta.sort(function(a,b){
                        return b.timestamp- a.timestamp;
                    });
                    imagesArray = imagesArray.concat(imagesVK).concat(imagesInsta);
                }else{
                    imagesInsta.sort(function(a,b){
                        return b.timestamp- a.timestamp;
                    });
                    imagesArray = imagesArray.concat(imagesInsta).concat(imagesVK);
                }



                imagesVK = [];//delete free
                imagesInsta=[];

                console.log(imagesArray);



                try{
                    Application.loadToGammaGallery(imagesArray);

                }catch (e){console.log(e);}
                $("#loadingModal").modal('hide');
                clearInterval(threadWatcher);





            }
            console.log('current ended threads : '+endedThreads +" \\ 2");
        },500);



    });

    $('#linkVkButton').click(function() {
        if(gallery.currItem.vkid>0)
            $(this).attr("href", "http://vk.com/id"+ gallery.currItem.vkid);
        else
            return false;
    });

    $('#linkInstagram').click(function() {
        if(gallery.currItem.photolinkInstagram)
            $(this).attr("href", gallery.currItem.photolinkInstagram);
        else
            return false;
    });
    $('#linkGoogleMap').click(function() {
            $(this).attr("href", 'http://www.google.com/maps/place/'+gallery.currItem.lat+","+gallery.currItem.lng );

    });


});




var currentItemIndex = 0;
var gallery;


function showgalery(index){
     var pswpElement = document.querySelectorAll('.pswp')[0];



    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imagesArray, {
        index : index,
        loop:false,
        history:false
    });

    gallery.listen('afterChange', function() {
        if(!gallery.currItem){
            return;
        }
        console.log(gallery.currItem);
        var linkVkButton  = $("#linkVkButton");
        var  linkInstaButton = $("#linkInstagram");


        if(!gallery.currItem.vkid || gallery.currItem.vkid<=0){
          linkVkButton.hide();
        }else{
            linkVkButton.show();
        }

        if(!gallery.currItem.photolinkInstagram){
            linkInstaButton.hide();
        }else{
            linkInstaButton.show();
        }

    });
     gallery.init();
}
