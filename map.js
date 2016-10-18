const remote = require('electron').remote;
var dialog = remote.dialog;
var shapefile = require("shapefile");
var turf = require('turf');
var fs = require('fs');
var geojsonCoords = require('geojson-coords');
var fileName,name, fileNamesReal, fileFullPath, fligthName, height, colP, tem, jsonFile, selectedFiles, resultRaw, coordRaw, polygon, area;
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
            fileNamesReal = fileNames[0];
            fileFullPath = fileNamesReal.substring(0, fileNamesReal.lastIndexOf("\\") + 1);
            var nameT = fileNamesReal.replace(fileFullPath, "");
            name = nameT.replace(".shp", "");
            shapefile.open(fileNames[0])
                .then(source => source.read()
                    .then(function log(result) {
                        if (result.done) return;
                        resultRaw = result.value;
                        coordRaw = geojsonCoords(resultRaw);
                        area = turf.area(resultRaw) / 10000;
                        for (var i = 0; i < coordRaw.length; i++) {
                            arrs[i] = {
                                altitude: 0,
                                latitude: coordRaw[i][1],
                                longitude: coordRaw[i][0]
                            };
                        }

                        $('#fligthName').val(name);

                        height = $('#height').val();

                        //console.log(arrs);
                        console.log(fileFullPath);
                        polygon = turf.polygon([coordRaw], {
                            areaOfInterest: arrs,
                            name: fligthName,
                            locationName: fligthName,
                            params: {
                                droneType: "Inspire_1",
                                name: fligthName,
                                alt: parseInt(height),
                                hOverlap: 80,
                                vOverlap: 75
                            }
                        });

                        console.log(JSON.stringify(polygon, undefined, 2));
                        colP = turf.featureCollection(polygon);
                        tem = JSON.stringify(polygon, undefined, 2);


                        // fs.writeFile(jsonFile, tem, function(err) {
                        //     if (err) return console.log(err);
                        //     console.log('Hello World > helloworld.txt');
                        // });

                        return source.read().then(log);
                    }))
                .catch(error => console.error(error.stack));
        }
    });


});




$(document).ready(function() {

  $("#refreshWin").click(function() {
      remote.getCurrentWindow().reload();
  });

    $("#execute").click(function() {
      fligthName = $('#fligthName').val();
      jsonFile = fileFullPath + fligthName + ".geojson";
        if ((coordRaw.length < 21) && (area < 121)) {
            fs.writeFile(jsonFile, tem, function(err) {
                if (err) return console.log(err);
                console.log(jsonFile);
                document.getElementById("title").innerHTML = "Data Successfully Converted";
                document.getElementById("pathR").innerHTML = "Location";
                document.getElementById("path").innerHTML = jsonFile;
                document.getElementById("detail").innerHTML = "Detail";
                document.getElementById("area").innerHTML = "Total Vertex : "+coordRaw.length;
                document.getElementById("vertex").innerHTML = "Area : "+Math.round(area * 100) / 100+" Ha";
            });
        } else {
          document.getElementById("title").innerHTML = "Data Failed Convert";
          $("#pathR").remove();
          $("#path").remove();
          document.getElementById("detail").innerHTML = "Detail";
          document.getElementById("area").innerHTML = "Total Vertex : "+coordRaw.length;
          document.getElementById("vertex").innerHTML = "Area : "+Math.round(area * 100) / 100+" Ha";
        }
    });

    $("#formInput").submit(function(e) {
        e.preventDefault();
    });

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
