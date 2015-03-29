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
        object.loadToGammaGallery = function(data)
        {
            var imageBlock = $("#container");
          imageBlock.children().remove();
            for(var i=0;i<data.length;i++) {
                var curPhoto = data[i];


                try {
                    var htmlToApped = ' <div class="container">';

                    htmlToApped += '<div class="item" style="cursor: pointer;" class="item" onclick="showgalery(' + i + ')"><img width="' + curPhoto.thumbnail_w + '" src="' + curPhoto.thumbnail + '">   </div>';

                    htmlToApped += '</div>';
                    imageBlock.append(htmlToApped);
                }catch (e){
                    console.log(e);
                }

            }
            var container = document.querySelector('#container');
            var msnry = new Masonry( container, {
                // options

                itemSelector: '.item',
                isFitWidth:true
            });



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