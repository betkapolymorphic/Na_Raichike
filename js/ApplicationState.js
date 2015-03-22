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