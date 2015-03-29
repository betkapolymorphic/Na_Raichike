/**
 * Created by Alexeev on 22-Mar-15.
 */
function initRangeSlider(){
    var numberElement = $("#number");
    $('input[type="range"]').rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onInit: function() {},

        // Callback function
        onSlide: function(position, value) {
            numberElement.val(value);
           // eval('setRadius('+value+')');
            //setRadius(value);

        },

        // Callback function
        onSlideEnd: function(position, value) {
            numberElement.val(value);
            setRadius(value);
        }
    });
}
