// JavaScript Document

// Global variable
let geoPaths = {
	map: undefined, // A leaflet map
	paths: [] // An array of geoJSON variable
};

// DYN GEN. //

// Used with the site first launch
// Return : none
function startPage() {
	jQuery.ajaxSetup({async : false});
	geoPaths.map = generationDynamique();
	addFileToPath("data/runinlyon_10km.gpx");
	JSONtoHTML(geoPaths.paths[0]);
	setListeners();
}

// Set up the listeners
// Return : none
function setListeners() {
	let saveButton = document.getElementById("saveButton");
	if (saveButton !== undefined) {
		saveButton.addEventListener("click", saveAndGet);
	}
}

// Add the content of a .gpx file into the global variable geoPaths.paths[]
// Param : file -> a .gpx file
// Return : none
function addFileToPath(file) {
	$.ajax(file).done(gpx => {
		let index = geoPaths.paths.length;
		var indexFile = file.lastIndexOf("/");
		var filename = file.substr(indexFile+1);
		geoPaths.paths[index] = toGeoJSON.gpx(gpx);
		geoPaths.paths[index].file = filename;
		drawPath(geoPaths.paths[index]);
		JSONtoHTML(geoPaths.paths[index]);
		generationGraphe(geoPaths.paths[index]);
		generationFileRow(geoPaths.paths[index], index);
	}).catch(console.log);
}

// Draw a path in the map from a geoJSON variable
// Param : geoJsonPath -> the path we want to draw, a geoJSON variable
// Return : none
function drawPath(geoJsonPath) {
	let geojsonMarkerOptions = {
		opacity: 0,
		fillOpacity: 0
	};
	L.geoJSON(geoJsonPath, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		}
	}).addTo(geoPaths.map);


	var tabLatitude = [];
	var tabLongitude = [];
	for (let i = 0; i < geoJsonPath.features[0].geometry.coordinates.length ; i++) {
		tabLatitude.push(geoJsonPath.features[0].geometry.coordinates[i][1]);
		tabLongitude.push(geoJsonPath.features[0].geometry.coordinates[i][0]);
	}
	var centreTraceLatitude = moyenneDunTableau(tabLatitude);
	var centreTraceLongitude = moyenneDunTableau(tabLongitude);
	var elevationCarte = plusGrandModule(tabLatitude, tabLongitude, centreTraceLatitude, centreTraceLongitude);
	geoPaths.map.setView([centreTraceLatitude, centreTraceLongitude],elevationCarte*21);
}

// Generate the map
// Return : the map
function generationDynamique(){
	
	var State = "index";
	
	generationIndex(); //Permet de générer la page index.html
	
	
	var mymap = L.map('mapid').setView([0,0], 0);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	return mymap;
}

// Fill an HTML table with the points of a geoJSON variable
// Param : To complete -> a geoJSON variable
// Return : none
function JSONtoHTML(trace){
	document.getElementById("tableauFichiers").style.height = '150px';
	document.getElementById("tableauFichiers").style.overflowY = 'auto';
	document.getElementById("tableauPoints").style.height = '400px';
	document.getElementById("tableauPoints").style.overflowY = 'auto';
	var tableContent = `<tbody>`;
	var headTableData = `<thead>
							  <tr>
								 <th scope="col">#</th>
								 <th scope="col">Latitude</th>
								 <th scope="col">Longitude</th>
								 <th scope="col">Altitude</th>
							  </tr>
						   </thead>`;
	
	//document.getElementById("tableData").innerHTML = headTableData;
	
	for (let i=0; i<trace.features[0].geometry.coordinates.length; i++){
		tableContent += `<tr>
							<th scope="row"> ${i+1}</th>
								<td>
									${trace.features[0].geometry.coordinates[i][0]}
								</td>
							<td>
								${trace.features[0].geometry.coordinates[i][1]}
							</td>
							<td>
								${trace.features[0].geometry.coordinates[i][2]}
							</td>
						  </tr>`;
	}
	tableContent += `</tbody>`;
	document.getElementById("tableData").innerHTML = headTableData + tableContent;
}

// Generate the main section (with the map)
// Return : none
function generationIndex(){
	State = "index";
	document.getElementById("planDeTravail").innerHTML =
		`<div class="col-lg-8">
				<div class="row">
					<div class="col-lg-11 bg-light">
						<div id="mapid" style="width: 100%; height: 500px"></div>
						<div id="graphe" class="row col-auto bg-light">
							<div class="c3" id="chart" style="height: 250px; width:98%; position :relative;">
							</div>
						</div>
					</div>
					<div class="col-lg-1 bg-light">
						<div class="form-group">
					      <input type="number" class="form-control" id="samplingFactor" placeholder="X">
					      <button type="button" id="reSample" alt="reSample" title="Rééchantillonner" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-divide"></i></button>
					    </div>
						<button type="button" alt="Annuler" title="Annuler" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-undo"></i></button>
						<button type="button" alt="Désannuler" title="Désannuler" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-redo"></i></button>
						<br>
						<button type="button" alt="Ajouter un point" title="Ajouter un point" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-plus"></i></button>
						<button type="button" alt="Supprimer un point" title="Supprimer un point" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-minus"></i></button>
						<br>
						<button type="button" alt="Lier" title="Lier" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-link"></i></button>
						<button type="button" alt="Délier" title="Délier" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-unlink"></i></button>
						<br>
						<br>
						<button type="button" alt="Imprimer" Title="Imprimer" onclick="window.print()" value="Imprimer" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-print"></i></button>
						<button id="saveButton" type="button" alt="Télécharger" title="Télécharger" class="btn btn-secondary btn-lg btn-block"><i class="fas fa-file-download"></i></button>
					</div>
				</div>

			</div>
			<div class="col-lg-4">
				<div id="tableauFichiers" style="margin-bottom:15px">
					<table class="table table-striped table-hover table-bordered">
					   <thead>
						  <tr>
							 <th scope="col">#</th>
							 <th scope="col">Nom du fichier</th>
							 <th scope="col">Distance <br />(en km)</th>
							 <th scope="col">Durée <br />(en h)</th>
							 <th scope="col"><i class="fas fa-trash"></i></th>
						  </tr>
					   </thead>
					   <tbody id="fileTable">
					   </tbody>
					</table>
				</div>
				<div id="tableauPoints">
					<table id="tableData" class="table table-striped table-hover table-bordered"></table>
				</div>
			</div>`;
}

// Generate the "Description" section
// Return : none
function generationDescription(){
	State = "description";
	document.getElementById("planDeTravail").innerHTML = 
		`<div class="col-lg-4">
				<h1>Description</h1>
				<p>Ce site web doit pouvoir proposer le chargement, la visualisation et l’édition de trace GPS au format GPX. Il se peut que les traces GPS soient erronées (à cause d’une perte de réseau, d’un GPS peu précis, etc.). Ce site doit être léger et très ergonomique pour simplifier au maximum l’utilisation. L'utilisateur doit pouvoir importer un fichier .gpx, afficher et modifier la trace du fichier de sorte à corriger les données dans le but de télécharger un nouveau fichier GPX contenant les données améliorées.</p>
				<h1>Fonctionnalités détaillées</h1>
				<p>Voici la liste des fonctionnalités demandée pour cette application :</p>
				<ol>
					<li>Une visualisation de la trace sur la carte avec choix du fond de carte,</li>
					<li>Une visualisation du dénivelé de la trace avec la possibilité de sélectionner les points également sur cette zone,</li>
					<li>Un mode de sélection des points efficaces, visuellement propre afin ensuite de n'appliquer les traitements que sur les points sélectionnés,</li>
					<li>Rééchantillonnage des points sélectionnés (plus ou moins de points),</li>
					<li>Annulation possible d'une opération,</li>
					<li>Insertion/Suppression de points ou groupe de points,</li>
					<li>Déplacement d’un point ou d’un groupe de points,</li>
					<li>Chargement, sauvegarde d'un fichier .gpx,</li>
					<li>Des outils qui garantissent un respect des temps et des altitudes de passage à chaque point,</li>
					<li>Afficher le tableau de points de la trace étudiée,</li>
					<li>Import/export de traces provenant de Strava (API Strava).</li>
				</ol>
			</div>
			
			<div class="col-lg-8">
				<img src="data/GPSX.jpg" class="img-fluid" alt="Responsive image">
			</div>`;
}

// Generate the "About us" section
// Return : none
function generationAboutUs(){
	State = "aboutus";
	document.getElementById("planDeTravail").innerHTML =
		`<div class="col-lg-8">
				<img src="data/Us.jpg" class="img-fluid" alt="Responsive image">
		 </div>
			
   		  <div class="col-lg-4">
			<h1>Notre histoire</h1>
				<p>Etudiants en informatique, nous avons aujourd'hui décidé de nous lier afin de créer ce site pour satisfaire toutes les contraintes données par notre client. "Improve my GPX" est un site totalement développé dans le cadre d'une UE de notre licence d'informatique (LIFPROJET).</p>
			  <h1>Répartition du travail</h1>
				<h2>Anthony SCRIVEN</h2>
				<p>Gestion de Git, Programmation HTML/CSS/JS</p>
				<h2>Thomas PEYROT</h2>
				<p>Design, Programmation CSS/JS, Recherche des librairies</p>
				<h2>Jérôme GIL</h2>
				<p>Design, Gestion du cahier des charges, Programmation HTML/CSS</p>
		  </div>`;
}

// Generate the upper left table rows
// Param : trace -> a geoJSON variable
// Param : index -> the index of trace in geoPaths.paths
// Return : none
function generationFileRow(trace, index) {
	let time = "Non défini";
	if (trace.features[0].properties.hasOwnProperty("coordTimes")) {
		var lastTime = trace.features[0].properties.coordTimes[trace.features[0].geometry.coordinates.length - 1];
		var firstTime = trace.features[0].properties.time;
		var date1 = new Date(lastTime);
		var date2 = new Date(firstTime);
		var date = date1 - date2;
		time = secondsToHours(date/1000);
	}
	var table = document.getElementById("fileTable").innerHTML +=
		`<tr id="row${index}">
			<th scope="row" id="cell${index}">${index + 1}</th>
			<td>${trace.file}</td>
			<td>${calculateDistance(trace)}</td>
			<td>${time}</td>
			<td><button class="btn btn-danger" type="button" onclick="deleteTrace(${index});">X</button></td>
		</tr>`;
}

// Upload a file into the page from data/
// Return : none
function upload(){
	if (State == "index"){
		console.log("Nous allons importer le fichier...");
	}
	else{
		generationDynamique();
		console.log("Maintenant que index est chargé, nous allons importer...");
	}
	document.getElementById('hiddenbutton').click();
}

// Used to upload
// Return : none
function hiddenUpload() {
	let path = document.getElementById("hiddenbutton").value;
	let length = path.length - 11;
	let realPath = "data/" + path.substr(12, length);
	addFileToPath(realPath);
}

// Generate the bottom graph from a geoJSON trace
// Param : trace -> a geoJSON variable
// Return : none
function generationGraphe(trace) {
	var abscisse = ['x'];
	var ordonnee = ['data1'];
	for (let i = 0; i < trace.features[0].geometry.coordinates.length ; i++) {
		abscisse.push(i);
		ordonnee.push(trace.features[0].geometry.coordinates[i][2]);
	}
	var chart = c3.generate({
		data: {
			x: 'x',
			columns: [
				abscisse,
				ordonnee
			]
		}
	});
}
// Delete a row in the trace table
// Param : id -> index of the row you want to delete
// Return : none
function deleteTrace(id) {
	if (confirm("Voulez vous vraiment supprimer ce fichier ?")) {
   		geoPaths.paths.splice(id, 1);
		document.getElementById("fileTable").deleteRow(id);
		for (let i = id + 1 ; i<geoPaths.paths.length; i++) {
			geoPaths.paths[i-1] = geoPaths.paths[i];
			document.getElementById("row" + i).id = "row" + i-1;
			document.getElementById("cell" + i).innerHTML = i-1;
			document.getElementById("cell" + i).id = "cell" + i-1;
		}
		geoPaths.paths.splice(geoPaths.paths.length, 1);
		//TO DO : Il faudra gérer la mise à jour de l'id des lignes lors du passage à la version asynchrone.
	}
}

// Open the help window
// Return : none
function help(){
	window.open('aide.html', "Aide pour le site Improve my GPX", 'width = 400, height = 800, left = 1000');
}

// Convert a time in seconds to a time in hours
// Param : sec -> time in seconds
// Return : a time in hours
function secondsToHours(sec) {

  var hrs = Math.floor(sec/3600);
  var min = Math.floor((sec%3600)/60);
  sec = sec % 60;

  if(sec<10) {
      sec = "0" + sec;
  }

  if(min<10) {
      min = "0" + min;
  }

  return hrs + ":" + min + ":" + sec;
}

// Convert a number in degrees to radians
// Param : degrees -> number in degrees
// Return : a number in radians
function Deg2Rad(degrees) {
	return degrees * (Math.PI/180);
}

// Calculate the distance between 2 points from the latitude and the longitude of these points
// Param : 2 points -> 2 tables with latitude, longitude and altitude
// Return : the distance between these 2 points
function DistanceBetween2Points(point1, point2) {
	return 6367445*Math.acos(Math.sin(Deg2Rad(point1[1]))*Math.sin(Deg2Rad(point2[1]))+Math.cos(Deg2Rad(point1[1]))*Math.cos(Deg2Rad(point2[1]))*Math.cos(Deg2Rad(point1[0])-Deg2Rad(point2[0])))/1000;
}

// Calculate the global distance of the trace
// Param : a trace
// Return : the global distance
function calculateDistance(trace) {
	var distance = 0;
	//console.log(DistanceBetween2Points(trace.features[0].geometry.coordinates[0],trace.features[0].geometry.coordinates[1]));;
	for(let i = 0; i<trace.features[0].geometry.coordinates.length-1; i++) {
		distance += DistanceBetween2Points(trace.features[0].geometry.coordinates[i],trace.features[0].geometry.coordinates[i+1]);
	}
	return distance.toFixed(2);
}

// Open a window enabling the user to download a .gpx file
// Return : none
function saveAndGet() {
	let geoJS = geoPaths.paths[0];
	let xml = geoJsonToXml(geoJS);
	
	let filename = "export.gpx";
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

// MAP FUNCTIONS //

// Return the mean of all numbers in an array
// Param : tab -> an array of numbers
// Return : number
function moyenneDunTableau(tab){
	var somme = 0.0;
	for (let i=0; i<tab.length; i++){
		somme += tab[i];
	}
	return (somme/tab.length);
}

// Return a zoom abling us to see all points given in parameters
// Param : tabLatitude -> all latitudes
// Param : tabLongitude -> all longitudes
// Param : moyenneLatitude -> mean of all latitudes
// Param : moyenneLongitude -> mean of all longitudes
// Return : a number corresponding to a zoom
function plusGrandModule(tabLatitude, tabLongitude, moyenneLatitude, moyenneLongitude){
	var module = 0;
	for(let i=0; i<tabLatitude.length; i++){
		if(Math.sqrt((tabLatitude[i]-moyenneLatitude)*(tabLatitude[i]-moyenneLongitude)+(tabLongitude[i]-moyenneLongitude)*(tabLongitude[i]-moyenneLongitude)) > module){
			module = Math.sqrt((tabLatitude[i]-moyenneLatitude)*(tabLatitude[i]-moyenneLongitude)+(tabLongitude[i]-moyenneLongitude)*(tabLongitude[i]-moyenneLongitude));
		}
	}
	return module;
}

// CONVERSION FUNCTIONS //

// Resample geoJSON coordinates
// Param : factor -> corresponding to the reduction's factor of the table data
// Param : fileNumber -> corresponding index in geoPaths.paths[] of the geoJSON variable
function reSample(factor, fileNumber){
	let length = geoPaths.paths[fileNumber].features[0].geometry.coordinates.length-1;
	for(i=0; i<length/factor;i++){
		var removedItems1 = geoPaths.paths[fileNumber].features[0].geometry.coordinates.splice(i+1,factor-1);
		var removedItems2 = geoPaths.paths[fileNumber].features[0].properties.coordTimes.splice(i+1,factor-1);
		if (geoPaths.paths[fileNumber].features[0].properties.heartRates !== undefined){
			var removedItems3 = geoPaths.paths[fileNumber].features[0].properties.heartRates.splice(i+1,factor-1);
		}
	}
}


// Make a string longer by copying its content nb times
// Param : text -> the string to copy
// Param : nb -> the number of times you want to copy
// Return : the result string
function repeatString(text, nb) {
	let repeated = text;
	for (let i = 0; i < nb-1; i++) {
		repeated += text;
	}
	return repeated;
}

// Convert a geoJSON variable into a text corresponding to its .gpx
// Param : geoJS -> the geoJSON variable
// Return : a string corresponding to a .gpx file
function geoJsonToXml(geoJS) {
	let feed = "\n";
	let tab = "\t";
	let xml = `<?xml version='1.0' encoding='UTF-8' standalone='yes'?>${feed}<gpx version='1.1'>`;
	
	if (geoJS.hasOwnProperty("features")) {
		geoJS = geoJS.features[0];
	}
	let hasProperties = geoJS.hasOwnProperty("properties");
	
	xml += `${feed}${tab}<trk>`;
	if (hasProperties) {
		if (geoJS.properties.hasOwnProperty("name")) {
			xml += `${feed}${repeatString(tab,2)}<name>${geoJS.properties.name}</name>`;
		}
	}
	
	xml += `${feed}${repeatString(tab,2)}<trkseg>`;
	
	let hasElevation = geoJS.geometry.coordinates[0].length > 2;
	let hasTime = false;
	let hasHeart = false;
	if (hasProperties) {
		hasTime = geoJS.properties.hasOwnProperty("coordTimes");
		hasHeart = geoJS.properties.hasOwnProperty("heartRates");
	}
	
	geoJS.geometry.coordinates.forEach( (current, index) => {
		xml += `${feed}${repeatString(tab,3)}<trkpt lat='${current[1]}' lon='${current[0]}'>`;
		if (hasElevation) {
			xml += `${feed}${repeatString(tab,4)}<ele>${current[2]}</ele>`;
		}
		if (hasTime) {
			let time = geoJS.properties.coordTimes[index];
			xml += `${feed}${repeatString(tab,4)}<time>${time}</time>`;
		}
		if (hasHeart) {
			let heartRate = geoJS.properties.heartRates[index];
			xml += `${feed}${repeatString(tab,4)}<extensions>`;
			xml += `${feed}${repeatString(tab,5)}<gpxtpx:TrackPointExtension>`;
			xml += `${feed}${repeatString(tab,6)}<gpxtpx:hr>${heartRate}</gpxtpx:hr>`;
			xml += `${feed}${repeatString(tab,5)}</gpxtpx:TrackPointExtension>`;
			xml += `${feed}${repeatString(tab,4)}</extensions>`;
		}
		xml += `${feed}${repeatString(tab,3)}</trkpt>`;
	});
	
	xml += `${feed}${repeatString(tab,2)}</trkseg>`;
	xml += `${feed}${tab}</trk>${feed}</gpx>`;
	
	return xml;
}

// Convert a .gpx file into a geoJSON variable
var toGeoJSON = (function() {
    'use strict';

    var removeSpace = /\s*/g,
        trimSpace = /^\s*|\s*$/g,
        splitSpace = /\s+/;
    // generate a short, numeric hash of a string
    function okhash(x) {
        if (!x || !x.length) return 0;
        for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
        } return h;
    }
    // all Y children of X
    function get(x, y) { return x.getElementsByTagName(y); }
    function attr(x, y) { return x.getAttribute(y); }
    function attrf(x, y) { return parseFloat(attr(x, y)); }
    // one Y child of X, if any, otherwise null
    function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
    function norm(el) { if (el.normalize) { el.normalize(); } return el; }
    // cast array x into numbers
    function numarray(x) {
        for (var j = 0, o = []; j < x.length; j++) { o[j] = parseFloat(x[j]); }
        return o;
    }
    // get the content of a text node, if any
    function nodeVal(x) {
        if (x) { norm(x); }
        return (x && x.textContent) || '';
    }
    // get the contents of multiple text nodes, if present
    function getMulti(x, ys) {
        var o = {}, n, k;
        for (k = 0; k < ys.length; k++) {
            n = get1(x, ys[k]);
            if (n) o[ys[k]] = nodeVal(n);
        }
        return o;
    }
    // add properties of Y to X, overwriting if present in both
    function extend(x, y) { for (var k in y) x[k] = y[k]; }
    // get one coordinate from a coordinate array, if any
    function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
    // get all coordinates from a coordinate array as [[],[]]
    function coord(v) {
        var coords = v.replace(trimSpace, '').split(splitSpace),
            o = [];
        for (var i = 0; i < coords.length; i++) {
            o.push(coord1(coords[i]));
        }
        return o;
    }
    function coordPair(x) {
        var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
            ele = get1(x, 'ele'),
            // handle namespaced attribute in browser
            heartRate = get1(x, 'gpxtpx:hr') || get1(x, 'hr'),
            time = get1(x, 'time'),
            e;
        if (ele) {
            e = parseFloat(nodeVal(ele));
            if (!isNaN(e)) {
                ll.push(e);
            }
        }
        return {
            coordinates: ll,
            time: time ? nodeVal(time) : null,
            heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
        };
    }

    // create a new feature collection parent object
    function fc() {
        return {
            type: 'FeatureCollection',
            features: []
        };
    }

    var serializer;
    if (typeof XMLSerializer !== 'undefined') {
        /* istanbul ignore next */
        serializer = new XMLSerializer();
    } else {
        var isNodeEnv = (typeof process === 'object' && !process.browser);
        var isTitaniumEnv = (typeof Titanium === 'object');
        if (typeof exports === 'object' && (isNodeEnv || isTitaniumEnv)) {
            serializer = new (require('xmldom').XMLSerializer)();
        } else {
            throw new Error('Unable to initialize serializer');
        }
    }
    function xml2str(str) {
        // IE9 will create a new XMLSerializer but it'll crash immediately.
        // This line is ignored because we don't run coverage tests in IE9
        /* istanbul ignore next */
        if (str.xml !== undefined) return str.xml;
        return serializer.serializeToString(str);
    }

    var t = {
        kml: function(doc) {

            var gj = fc(),
                // styleindex keeps track of hashed styles in order to match features
                styleIndex = {}, styleByHash = {},
                // stylemapindex keeps track of style maps to expose in properties
                styleMapIndex = {},
                // atomic geospatial types supported by KML - MultiGeometry is
                // handled separately
                geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track'],
                // all root placemarks in the file
                placemarks = get(doc, 'Placemark'),
                styles = get(doc, 'Style'),
                styleMaps = get(doc, 'StyleMap');

            for (var k = 0; k < styles.length; k++) {
                var hash = okhash(xml2str(styles[k])).toString(16);
                styleIndex['#' + attr(styles[k], 'id')] = hash;
                styleByHash[hash] = styles[k];
            }
            for (var l = 0; l < styleMaps.length; l++) {
                styleIndex['#' + attr(styleMaps[l], 'id')] = okhash(xml2str(styleMaps[l])).toString(16);
                var pairs = get(styleMaps[l], 'Pair');
                var pairsMap = {};
                for (var m = 0; m < pairs.length; m++) {
                    pairsMap[nodeVal(get1(pairs[m], 'key'))] = nodeVal(get1(pairs[m], 'styleUrl'));
                }
                styleMapIndex['#' + attr(styleMaps[l], 'id')] = pairsMap;

            }
            for (var j = 0; j < placemarks.length; j++) {
                gj.features = gj.features.concat(getPlacemark(placemarks[j]));
            }
            function kmlColor(v) {
                var color, opacity;
                v = v || '';
                if (v.substr(0, 1) === '#') { v = v.substr(1); }
                if (v.length === 6 || v.length === 3) { color = v; }
                if (v.length === 8) {
                    opacity = parseInt(v.substr(0, 2), 16) / 255;
                    color = '#' + v.substr(6, 2) +
                        v.substr(4, 2) +
                        v.substr(2, 2);
                }
                return [color, isNaN(opacity) ? undefined : opacity];
            }
            function gxCoord(v) { return numarray(v.split(' ')); }
            function gxCoords(root) {
                var elems = get(root, 'coord', 'gx'), coords = [], times = [];
                if (elems.length === 0) elems = get(root, 'gx:coord');
                for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));
                var timeElems = get(root, 'when');
                for (var j = 0; j < timeElems.length; j++) times.push(nodeVal(timeElems[j]));
                return {
                    coords: coords,
                    times: times
                };
            }
            function getGeometry(root) {
                var geomNode, geomNodes, i, j, k, geoms = [], coordTimes = [];
                if (get1(root, 'MultiGeometry')) { return getGeometry(get1(root, 'MultiGeometry')); }
                if (get1(root, 'MultiTrack')) { return getGeometry(get1(root, 'MultiTrack')); }
                if (get1(root, 'gx:MultiTrack')) { return getGeometry(get1(root, 'gx:MultiTrack')); }
                for (i = 0; i < geotypes.length; i++) {
                    geomNodes = get(root, geotypes[i]);
                    if (geomNodes) {
                        for (j = 0; j < geomNodes.length; j++) {
                            geomNode = geomNodes[j];
                            if (geotypes[i] === 'Point') {
                                geoms.push({
                                    type: 'Point',
                                    coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'LineString') {
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] === 'Polygon') {
                                var rings = get(geomNode, 'LinearRing'),
                                    coords = [];
                                for (k = 0; k < rings.length; k++) {
                                    coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
                                }
                                geoms.push({
                                    type: 'Polygon',
                                    coordinates: coords
                                });
                            } else if (geotypes[i] === 'Track' ||
                                geotypes[i] === 'gx:Track') {
                                var track = gxCoords(geomNode);
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: track.coords
                                });
                                if (track.times.length) coordTimes.push(track.times);
                            }
                        }
                    }
                }
                return {
                    geoms: geoms,
                    coordTimes: coordTimes
                };
            }
            function getPlacemark(root) {
                var geomsAndTimes = getGeometry(root), i, properties = {},
                    name = nodeVal(get1(root, 'name')),
                    address = nodeVal(get1(root, 'address')),
                    styleUrl = nodeVal(get1(root, 'styleUrl')),
                    description = nodeVal(get1(root, 'description')),
                    timeSpan = get1(root, 'TimeSpan'),
                    timeStamp = get1(root, 'TimeStamp'),
                    extendedData = get1(root, 'ExtendedData'),
                    lineStyle = get1(root, 'LineStyle'),
                    polyStyle = get1(root, 'PolyStyle'),
                    visibility = get1(root, 'visibility');

                if (!geomsAndTimes.geoms.length) return [];
                if (name) properties.name = name;
                if (address) properties.address = address;
                if (styleUrl) {
                    if (styleUrl[0] !== '#') {
                        styleUrl = '#' + styleUrl;
                    }

                    properties.styleUrl = styleUrl;
                    if (styleIndex[styleUrl]) {
                        properties.styleHash = styleIndex[styleUrl];
                    }
                    if (styleMapIndex[styleUrl]) {
                        properties.styleMapHash = styleMapIndex[styleUrl];
                        properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
                    }
                    // Try to populate the lineStyle or polyStyle since we got the style hash
                    var style = styleByHash[properties.styleHash];
                    if (style) {
                        if (!lineStyle) lineStyle = get1(style, 'LineStyle');
                        if (!polyStyle) polyStyle = get1(style, 'PolyStyle');
                        var iconStyle = get1(style, 'IconStyle');
                        if (iconStyle) {
                            var icon = get1(iconStyle, 'Icon');
                            if (icon) {
                                var href = nodeVal(get1(icon, 'href'));
                                if (href) properties.icon = href;
                            }
                        }
                    }
                }
                if (description) properties.description = description;
                if (timeSpan) {
                    var begin = nodeVal(get1(timeSpan, 'begin'));
                    var end = nodeVal(get1(timeSpan, 'end'));
                    properties.timespan = { begin: begin, end: end };
                }
                if (timeStamp) {
                    properties.timestamp = nodeVal(get1(timeStamp, 'when'));
                }
                if (lineStyle) {
                    var linestyles = kmlColor(nodeVal(get1(lineStyle, 'color'))),
                        color = linestyles[0],
                        opacity = linestyles[1],
                        width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                    if (color) properties.stroke = color;
                    if (!isNaN(opacity)) properties['stroke-opacity'] = opacity;
                    if (!isNaN(width)) properties['stroke-width'] = width;
                }
                if (polyStyle) {
                    var polystyles = kmlColor(nodeVal(get1(polyStyle, 'color'))),
                        pcolor = polystyles[0],
                        popacity = polystyles[1],
                        fill = nodeVal(get1(polyStyle, 'fill')),
                        outline = nodeVal(get1(polyStyle, 'outline'));
                    if (pcolor) properties.fill = pcolor;
                    if (!isNaN(popacity)) properties['fill-opacity'] = popacity;
                    if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0;
                    if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0;
                }
                if (extendedData) {
                    var datas = get(extendedData, 'Data'),
                        simpleDatas = get(extendedData, 'SimpleData');

                    for (i = 0; i < datas.length; i++) {
                        properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'));
                    }
                    for (i = 0; i < simpleDatas.length; i++) {
                        properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i]);
                    }
                }
                if (visibility) {
                    properties.visibility = nodeVal(visibility);
                }
                if (geomsAndTimes.coordTimes.length) {
                    properties.coordTimes = (geomsAndTimes.coordTimes.length === 1) ?
                        geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
                }
                var feature = {
                    type: 'Feature',
                    geometry: (geomsAndTimes.geoms.length === 1) ? geomsAndTimes.geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geomsAndTimes.geoms
                    },
                    properties: properties
                };
                if (attr(root, 'id')) feature.id = attr(root, 'id');
                return [feature];
            }
            return gj;
        },
        gpx: function(doc) {
            var i,
                tracks = get(doc, 'trk'),
                routes = get(doc, 'rte'),
                waypoints = get(doc, 'wpt'),
                // a feature collection
                gj = fc(),
                feature;
            for (i = 0; i < tracks.length; i++) {
                feature = getTrack(tracks[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < routes.length; i++) {
                feature = getRoute(routes[i]);
                if (feature) gj.features.push(feature);
            }
            for (i = 0; i < waypoints.length; i++) {
                gj.features.push(getPoint(waypoints[i]));
            }
            function initializeArray(arr, size) {
                for (var h = 0; h < size; h++) {
                    arr.push(null);
                }
                return arr;
            }
            function getPoints(node, pointname) {
                var pts = get(node, pointname),
                    line = [],
                    times = [],
                    heartRates = [],
                    l = pts.length;
                if (l < 2) return {};  // Invalid line in GeoJSON
                for (var i = 0; i < l; i++) {
                    var c = coordPair(pts[i]);
                    line.push(c.coordinates);
                    if (c.time) times.push(c.time);
                    if (c.heartRate || heartRates.length) {
                        if (!heartRates.length) initializeArray(heartRates, i);
                        heartRates.push(c.heartRate || null);
                    }
                }
                return {
                    line: line,
                    times: times,
                    heartRates: heartRates
                };
            }
            function getTrack(node) {
                var segments = get(node, 'trkseg'),
                    track = [],
                    times = [],
                    heartRates = [],
                    line;
                for (var i = 0; i < segments.length; i++) {
                    line = getPoints(segments[i], 'trkpt');
                    if (line) {
                        if (line.line) track.push(line.line);
                        if (line.times && line.times.length) times.push(line.times);
                        if (heartRates.length || (line.heartRates && line.heartRates.length)) {
                            if (!heartRates.length) {
                                for (var s = 0; s < i; s++) {
                                    heartRates.push(initializeArray([], track[s].length));
                                }
                            }
                            if (line.heartRates && line.heartRates.length) {
                                heartRates.push(line.heartRates);
                            } else {
                                //heartRates.push(initializeArray([], line.line.length || 0));
                                heartRates.push(initializeArray([], line.length || 0));
                            }
                        }
                    }
                }
                if (track.length === 0) return;
                var properties = getProperties(node);
                extend(properties, getLineStyle(get1(node, 'extensions')));
                if (times.length) properties.coordTimes = track.length === 1 ? times[0] : times;
                if (heartRates.length) properties.heartRates = track.length === 1 ? heartRates[0] : heartRates;
                return {
                    type: 'Feature',
                    properties: properties,
                    geometry: {
                        type: track.length === 1 ? 'LineString' : 'MultiLineString',
                        coordinates: track.length === 1 ? track[0] : track
                    }
                };
            }
            function getRoute(node) {
                var line = getPoints(node, 'rtept');
                if (!line.line) return;
                var prop = getProperties(node);
                extend(prop, getLineStyle(get1(node, 'extensions')));
                var routeObj = {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'LineString',
                        coordinates: line.line
                    }
                };
                return routeObj;
            }
            function getPoint(node) {
                var prop = getProperties(node);
                extend(prop, getMulti(node, ['sym']));
                return {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'Point',
                        coordinates: coordPair(node).coordinates
                    }
                };
            }
            function getLineStyle(extensions) {
                var style = {};
                if (extensions) {
                    var lineStyle = get1(extensions, 'line');
                    if (lineStyle) {
                        var color = nodeVal(get1(lineStyle, 'color')),
                            opacity = parseFloat(nodeVal(get1(lineStyle, 'opacity'))),
                            width = parseFloat(nodeVal(get1(lineStyle, 'width')));
                        if (color) style.stroke = color;
                        if (!isNaN(opacity)) style['stroke-opacity'] = opacity;
                        // GPX width is in mm, convert to px with 96 px per inch
                        if (!isNaN(width)) style['stroke-width'] = width * 96 / 25.4;
                    }
                }
                return style;
            }
            function getProperties(node) {
                var prop = getMulti(node, ['name', 'cmt', 'desc', 'type', 'time', 'keywords']),
                    links = get(node, 'link');
                if (links.length) prop.links = [];
                for (var i = 0, link; i < links.length; i++) {
                    link = { href: attr(links[i], 'href') };
                    extend(link, getMulti(links[i], ['text', 'type']));
                    prop.links.push(link);
                }
                return prop;
            }
            return gj;
        }
    };
    return t;
})();

// Launch after page is ready
$(startPage());
