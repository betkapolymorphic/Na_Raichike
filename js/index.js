/**
 * Created by Alexeev on 22-Mar-15.
 */
var imagesArray = [];
var win = {};
var Application = ApplicationSingleton.getInstance();

$(function(){

    initRangeSlider();

    Application.loadOptions();
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
            win = window.open("https://instagram.com/oauth/authorize/?client_id=d8e66baf0f344b47b504cde05aa94641&redirect_uri=http://drup.com/thanks.html&response_type=token", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400");
            win.onbeforeunload = function(){
                try {
                    var tok = win.location.hash.split('=')[1];
                    if(tok){
                        Application.setOption('instaToken',tok);
                        $("#checkBoxInstagram").prop('checked',true);
                    }

                }catch (err){}
            };
            return false;
        }

    });




    $("#findGirlsButton").on('click',function(){


        /*win = window.open("https://instagram.com/oauth/authorize/?client_id=d8e66baf0f344b47b504cde05aa94641&redirect_uri=http://drup.com/thanks.html&response_type=token", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400");
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
        if(Application.getOption('instaToken') && $("#checkBoxInstagram").is(":checked")){
            console.log('creating request');
            findPlaces(Application.getOption('lat'),
                Application.getOption('lng'),
                Application.getOption('instaToken'),function(data){
                    console.log("RECEIVE DATA!");
                    for(var i=0;i<data.length;i++){
                       // var curPhoto
                    }
                    console.log(data);
                })

        }

        return;
        /*$.get("https://api.vk.com/method/photos.search?",{"q":1,'lat':lat,'long':lng,
         'count':500,'radius':120,'version':'5.29'},
         function(data){
         alert(data);
         }
         );*/
        var imageSizes = ['src','src_big','src_small','src_xbig','src_xxbig','src_xxxbig'];

        $("#loadingModal").modal('show');

        if($("#checkBoxVK").is(":checked")){
            getPhotosVK(Application.getOption('lat'),Application.getOption('lng'),
                Application.getOption('count'),Application.getOption('radius'),
                function(data){

                    //easy ;)
                    imagesArray.concat(data);
                });
        }




    });

    $('#linkVkButton').click(function() {
        if(gallery.currItem.vkid>0)
            $(this).attr("href", "http://vk.com/id"+ gallery.currItem.vkid);
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



        if(gallery.currItem.vkid<=0){
            $("#linkVkButton").hide();
        }else{
            $("#linkVkButton").show();
        }

    });
     gallery.init();
}
