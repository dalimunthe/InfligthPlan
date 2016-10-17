const remote = require('electron').remote;
var dialog = remote.dialog;
var shapefile = require("shapefile");
var turf = require('turf');
var fs = require('fs');
var geojsonCoords = require('geojson-coords');
var fileName, selectedFiles, resultRaw, coordRaw, polygon;
var arrs = [];

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
                        resultRaw = result.value;
                        coordRaw = geojsonCoords(resultRaw);

                        for (var i = 0; i < coordRaw.length; i++) {
                            arrs[i] = {
                                altitude: 0,
                                latitude: coordRaw[i][1],
                                longitude: coordRaw[i][0]
                            };
                        }
                        console.log(arrs);
                        polygon = turf.polygon([coordRaw], {
                            areaOfInterest: arrs,
                            name: 'poly1',
                            locationName: "Setiabudi, Special Capital Region of Jakarta, ID",
                            params: {
                                droneType: "Inspire_1",
                                name: "sdsadasdasda",
                                alt: 99,
                                hOverlap: 60,
                                vOverlap: 70
                            }
                        });
                        console.log(JSON.stringify(polygon, undefined, 2));
                        var colP = turf.featureCollection(polygon);
                        var tem = JSON.stringify(polygon, undefined, 2);
                        fs.writeFile('helloworld.geojson', tem, function(err) {
                            if (err) return console.log(err);
                            console.log('Hello World > helloworld.txt');
                        });
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
