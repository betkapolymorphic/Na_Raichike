/**
 * Created by Alexeev on 22-Mar-15.
 */
var ApplicationSingleton = (function () {
    var instance;

    function createInstance() {
        var object = {};

        object.options = [];
        object.loadOptions = function(){
            var cookieStates = ['lat','lng','instaToken','count','radius'];
            cookieStates.forEach(function(d){
                object.options[d] = getCookie(d);
            });
        };
        object.saveOptions = function(){

            for (var k in Application.options){
                if (typeof Application.options[k] !== 'function') {
                    setCookie(k, Application.options[k],365);
                }
            }
        };
        object.getOption =function(name){
            return object.options[name];
        };
        object.setOption = function(name,val){
            object.options[name] = val;
        };

        object.loadToGalery = function(data)
        {
            var imageBlock = $("#images");
            imageBlock.children().remove();
            for(var i=0;i<data.length;i++){
                var curPhoto = data[i];
                imageBlock.append('<div style="cursor: pointer;" onclick="showgalery('+(i)+')" class="item" ><img src="'+curPhoto['thumbnail']+'"></div>');



            }
            imageBlock.flexImages({rowHeight: 140});
        };
        object.loadToGammaGallery = function(data,imagesLoadedCallback)
        {
            var imageBlock = $("#container");
            imageBlock.masonry('destroy');
          imageBlock.children().remove();
            var htmlToAppend ='';
            for(var i=0;i<data.length;i++) {
                var curPhoto = data[i];


                try {
                    htmlToAppend += '<div class="item" style="cursor: pointer;" class="item" onclick="showgalery(' + i + ')"><img width="' + curPhoto.thumbnail_w + '" src="' + curPhoto.thumbnail + '">   </div>';
                }catch (e){
                    console.log(e);
                }

            }
                var $container = $('#container').masonry({
                    itemSelector: '.item'
                });

            var $items = $(htmlToAppend);
            var firstEnterFlag = true;
            $items.hide();
            $container.append($items);


            var minimalLeft = 100500;
            var maxRight = 0;



            $items.imagesLoaded().progress( function( imgLoad, image ) {

                var $item = $( image.img ).parents('.item');
                // un-hide item
                $item.show();



                var left= $item.position().left;
                if(left<minimalLeft){
                    minimalLeft = left;
                }
                if(left+$item.width()>maxRight){
                    maxRight = left+$item.width();

                }



                $container.masonry( 'appended', $item );
               if(firstEnterFlag){
                   firstEnterFlag=false;
                   $('#container').masonry({
                       itemSelector: '.item'
                   });
               }
            });
            imagesLoadedCallback();

            /*
            var container = document.querySelector('#container');
            var imgLoad = imagesLoaded( container );
            imgLoad.on('always',function(){
                var msnry = new Masonry( container, {

                    itemSelector: '.item'

                });
                imagesLoadedCallback();
            });*/




        };

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();