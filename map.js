const remote = require('electron').remote;
var dialog = remote.dialog;
var shapefile = require("shapefile");
var turf = require('turf');
var fs = require('fs');
var geojsonCoords = require('geojson-coords');
var fileName, selectedFiles;

/**
//  minimize
//  maximize
//  close
**/
(function() {



    function init() {
        document.getElementById("min-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        });

        document.getElementById("close-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.close();
        });
    }

    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            init();
        }
    };

})();


$("#addLayer").click(function() {
    dialog.showOpenDialog({
        title: 'Choose Shapefile',
        filters: [{
            name: 'Shapefiles',
            extensions: ['shp']
        }],
        properties: ['openFile']
    }, function(fileNames) {
        if (fileNames === undefined) {
            console.log("No file selected");
        } else {
            console.log(fileNames[0]);
            shapefile.open(fileNames[0])
                .then(source => source.read()
                    .then(function log(result) {
                        if (result.done) return;
                        console.log(result.value);
                        return source.read().then(log);
                    }))
                .catch(error => console.error(error.stack));
        }
    });





});


$(document).ready(function() {



    $('#min-btn,#max-btn,#close-btn').hover(
        function() {
            $(this).addClass('active');
        },
        function() {
            $(this).removeClass('active');
        }
    );

    $("#addLayer1").click(function() {
        alert(fileName);
    });
});
