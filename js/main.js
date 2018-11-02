createGeoData()
.then(generateIndex)
.then(generateMap)
.then(geoData => addPath(geoData, "data/runinlyon_10km.gpx"))
.then(geoData => displayPath(geoData,0))
.then(movePOV)
//.then(generateFilesTab)
//.then(generateGraph)
.then(setListeners)
.then(setListenersUpdate)
.then(console.log)
.catch(console.error);

function createGeoData() {
	return new Promise((resolve, reject) => {
		let geoData = {
			map: undefined,
			paths: [],
			pathsHistory: {
				paths: [],
				last: undefined
			},
			layers: [],
			layersHistory: {
				layers: [],
				last: undefined
			},
			markersColor: [],
			tempsMarkers: [],
			focus: undefined,
            page: undefined,
            mode: "movemap"
		};
		resolve(geoData);
		reject("Error when initializing the global variable");
	});
}

function generateIndex(geoData) {
	document.getElementById("mapid").setAttribute("style","height:"+ ($(document).height() * 5/6) +"px");
	document.getElementById("mapid").style.zIndex=0;
	document.getElementById("features").style.width= ($(document).width() * 1/25) +"px";
	document.getElementById("features").innerHTML = `<button type="button" id="moveMap" alt="DeplacerCarte" title="Déplacer Carte" class="btn btn-dark btn-sm btn-block"><i class="fas fa-arrows-alt"></i></button>
					<button type="button" id="movePoint" alt="DeplacerPoint" title="Déplacer Point" class="btn btn-dark btn-sm btn-block"><i class="fas fa-hand-pointer"></i></button>
					<button type="button" alt="Annuler" title="Annuler" class="btn btn-dark btn-sm btn-block"><i class="fas fa-undo"></i></button>
					<button type="button" alt="Désannuler" title="Désannuler" class="btn btn-dark btn-sm btn-block"><i class="fas fa-redo"></i></button>
					<button type="button" id="addPoint" alt="Ajouter un point" title="Ajouter un point" class="btn btn-dark btn-sm btn-block"><i class="fas fa-plus"></i></button>
					<button type="button" id="deletePoint" alt="Supprimer un point" title="Supprimer un point" class="btn btn-dark btn-sm btn-block"><i class="fas fa-minus"></i></button>
					<button type="button" id="link" alt="Lier" title="Lier" class="btn btn-dark btn-sm btn-block"><i class="fas fa-link"></i></button>
					<button type="button" id="unlink" alt="Délier" title="Délier" class="btn btn-dark btn-sm btn-block"><i class="fas fa-unlink"></i></button>
					<div class="form-group">
					    <input type="text" class="form-control" id="samplingFactor" placeholder="Insérez">
					    <button type="button" id="reSample" alt="reSample" title="Rééchantillonner" class="btn btn-dark btn-sm btn-block"><i class="fas fa-divide"></i></button>
					</div>

					<button type="button" alt="Imprimer" Title="Imprimer" onclick="window.print()" value="Imprimer" class="btn btn-dark btn-sm btn-block"><i class="fas fa-print"></i></button>
					<button id="saveButton" type="button" alt="Télécharger" title="Télécharger" class="btn btn-dark btn-sm btn-block"><i class="fas fa-file-download"></i></button>
				</div>`;
	document.getElementById("features").style.zIndex=1;
	return geoData;
}

// Open the help window
// Return : none
function help(){
	window.open('html/aide.html', "Aide pour le site Improve my GPX", 'width = 400, height = 800, left = 1000');
}

function generateMap(geoData) {
	geoData.map = L.map('mapid').setView([0,0], 0);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(geoData.map);
	geoData.layersControl = L.control.layers(null, null);
	L.control.scale({imperial: false}).addTo(geoData.map);
	L.control.mode({position: "topleft"}).addTo(geoData.map);

	return geoData;
}

function addPath(geoData, file) {
    return Promise.resolve($.ajax(file)).then(gpx => {
		let index = geoData.paths.length;
		let indexFile = file.lastIndexOf("/");
		let filename = file.substr(indexFile+1);
		geoData.paths[index] = toGeoJSON.gpx(gpx);
		geoData.paths[index].file = filename;
		geoData.paths[index].shown = true;
		geoData.paths[index].markersAdded = [];
		geoData.markersColor = [blackMarker, blueMarker, redMarker, greenMarker, purpleMarker, yellowMarker];
		geoData.focus = index;
        return geoData;
	});
}

// MAP FUNCTIONS //

function movePOV(geoData) {
	if (geoData.focus !== undefined) {
		geoData.map.fitBounds(geoData.layers[geoData.focus].getBounds());
	}

	return geoData;
}

// Param : geoData + number -> quantity of data to delete
// Return : nothing
function reSample(geoData, number){
	number = Number(number);
	if(Number.isInteger(number) && number > 0 && number < (geoData.paths[geoData.focus].features[0].geometry.coordinates.length-2)){
		if (typeof(Worker) === undefined) {
			let tolerence = 0.00001;
			let tabDistance = [];
			let totalDistance = calculateDistance(geoData.paths[geoData.focus]);
			while(number>0){
				tabDistance = [];
				for (let i=0; i<geoData.paths[geoData.focus].features[0].geometry.coordinates.length-2; i++){
					tabDistance.push(DistanceBetween2Points(geoData.paths[geoData.focus].features[0].geometry.coordinates[i],geoData.paths[geoData.focus].features[0].geometry.coordinates[i+1]));
				}
				if(tabDistance.min() < totalDistance*tolerence){
					geoData.paths[geoData.focus].features[0].geometry.coordinates.splice(tabDistance.indexOf(tabDistance.min()),1);
					number--;
				} else {
					tolerence += 0.0000002;
				}
			}
			geoData.map.removeLayer(geoData.layers[geoData.focus]);
			displayPath(geoData, geoData.focus);
			//generateGraph(geoData);

		} else {
			let w = new Worker("js/resample.js", {type:'module'});
			w.onmessage = event => {
				geoData.paths[geoData.focus] = event.data;
				w.terminate();
				geoData.map.removeLayer(geoData.layers[geoData.focus]);
				displayPath(geoData, geoData.focus);
				//generateGraph(geoData);
			}
			w.postMessage(number);
			w.postMessage(geoData.paths[geoData.focus]);
		}
	} else {
		alert("Veuillez mettre un nombre entier supérieur à 0, et compris entre 1 et " + (geoData.paths[geoData.focus].features[0].geometry.coordinates.length-3) + "! SVP.");
	}
}

function keySample(geoData, keyCode) {
	if (keyCode === 13) {
		reSample(geoData, document.getElementById("samplingFactor").value);
	}
}

function displayPath(geoData, index) {
	let latlngs = [];
	geoData.paths[index].features[0].geometry.coordinates.forEach(coord => {
		let point = [
			coord[1],
			coord[0],
			coord[2]
		];
		latlngs.push(point);
	});
	let polyline = L.polyline(latlngs);

	geoData.layers[index] = polyline;
	geoData.layersHistory[index] = [];
	geoData.layersControl.addBaseLayer(polyline, geoData.paths[index].file);
	geoData.layersControl.addTo(geoData.map);
	geoData.map.addLayer(polyline);

	return geoData;
}

function generateFilesTab(geoData) {
	document.getElementById("fileTable").innerHTML = "";
	geoData.paths.forEach( (current, index) => {
		let time = "Non défini";
		if (current.features[0].properties.hasOwnProperty("coordTimes")) {
			let lastTime = current.features[0].properties.coordTimes[current.features[0].geometry.coordinates.length - 1];
			let firstTime = current.features[0].properties.time;
			let date1 = new Date(lastTime);
			let date2 = new Date(firstTime);
			let date = date1 - date2;
			time = secondsToHours(date/1000);
		}

		document.getElementById("fileTable").innerHTML +=
			`<tr id="row${index}">
				<th scope="row" id="cell${index}">${index + 1}</th>
				<td>${current.file}</td>
				<td>${calculateDistance(current)}</td>
				<td>${time}</td>
				<td><button id="suppr${index}" class="btn btn-danger" type="button">X</button></td>
			</tr>`;
	});

	if (geoData.focus !== undefined) {
		document.getElementById("row" + geoData.focus).classList.add("focus");
	}

	return geoData;
}

/*function generateGraph(geoData) {
	let xs = {};
	let cols = [];
	geoData.paths.forEach(current => {
		if (current.shown) {
			let file = current.file;
			let x = "x" + file;
			xs[file] = x;

			let abscisse = [x];
			let ordonnee = [file];
			for (let i = 0; i < current.features[0].geometry.coordinates.length ; i++) {
				abscisse.push(i+1);
				ordonnee.push(current.features[0].geometry.coordinates[i][2]);
			}

			cols.push(abscisse);
			cols.push(ordonnee);
		}
	});
	c3.generate({
	    data: {
	        xs: xs,
	        columns: cols
	    }
	});

	return geoData;
}*/

// Delete a row in the trace table
// Param : id -> index of the row you want to delete
// Return : none
function deleteTrace(geoData, id) {
	if (confirm("Voulez vous vraiment supprimer ce fichier ?")) {
		geoData.layersControl.removeLayer(geoData.layers[id]);
		geoData.map.removeLayer(geoData.layers[id]);
		geoData.layers.splice(id, 1);
		geoData.paths.splice(id, 1);
		if (geoData.focus === id) {
   			geoData.focus = geoData.paths.length -1;
   			if (geoData.focus < 0) {
   				geoData.focus = undefined;
   			}
	   		movePOV(geoData);
	   	} else {
	   		if (geoData.focus > id) {
	   			geoData.focus--;
	   		}
	   	}
		setListenersUpdate(geoData);
		if (geoData.paths.length === 0) {
			geoData.layersControl.remove();
		}
	}
}


function setListeners(geoData) {
	// Files import
    document.getElementById("importButton").addEventListener("click", () => upload(geoData));
	document.getElementById("hiddenButton").addEventListener("change", () => hiddenUpload(geoData));

    /*document.getElementById("reSample").addEventListener("click", () => reSample(geoData,document.getElementById("samplingFactor").value));
    document.getElementById("samplingFactor").addEventListener("keyup", e => keySample(geoData, e.keyCode));
    document.getElementById("fileTable").addEventListener("click", e => changeFocus(geoData, e));
    document.getElementById("saveButton").addEventListener("click", () => giveUserGpx(geoData));
    document.getElementById("moveMap").addEventListener("click", () => moveMapMode(geoData));
	document.getElementById("movePoint").addEventListener("click", () => movePointMode(geoData));
	document.getElementById("addPoint").addEventListener("click", () => addPointMode(geoData));
	document.getElementById("deletePoint").addEventListener("click", () => deletePointMode(geoData));
	document.getElementById("link").addEventListener("click", () => linkMode(geoData));
	document.getElementById("unlink").addEventListener("click", () => unlinkMode(geoData));*/

    return geoData;
}

function setListenersUpdate(geoData) {
	// Files display
	for (let i = 0; i < geoData.paths.length; i++) {
		geoData.layersControl.getContainer().children[1][i].addEventListener("change", e => {
			changeFocus(geoData);
			movePOV(geoData);
		});
		geoData.layersControl.getContainer().children[1][i].nextElementSibling.addEventListener("contextmenu", e => {
			deleteTrace(geoData, getIndexFile(e.target));
			e.preventDefault();
		});
	}

	return geoData;
}

function getIndexFile(element) {
	let index = undefined;
	let parent = element.parentElement.parentElement.parentElement;
	let i = 0;
	while (index === undefined && i < parent.children.length) {
		if (parent.children[i].children[0].children[1]._leaflet_id === element._leaflet_id) {
			index = i;
		}
		i++;
	}
	return index;
}

// Suppress temporary markers created by modes
// Param: geoData
// Return : None
function deleteOldMarkers(geoData) {
	geoData.tempsMarkers.forEach(marker => {
		geoData.map.removeLayer(marker);
	});
	geoData.moveMarker = [];
}

function moveMapMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "movemap";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='move'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

// Mode where points can ba moved
// Param : geoData
// Return : None
function movePointMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "movepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='pointer'");

	geoData.map.on("contextmenu", e => {
		deleteOldMarkers(geoData);
		let interval = 0.001; // Coordinates interval, to decide the range of points we handle
		let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
		let points = pointsInInterval(coordinates, e.latlng.lat, e.latlng.lng, interval);
		points.forEach(point => {
			let marker = L.marker(L.latLng(point.coordinates[1], point.coordinates[0]), {
				draggable: true,
				index: point.index
			})
			.on('drag', e => dragHandler(e, geoData.layers[geoData.focus]))
			.on('dragend', e => dragEndHandler(geoData));
			geoData.tempsMarkers.push(marker);
			marker.addTo(geoData.map);
		});
	});
}

// Called during a point drag,
// Make polyline correspond with the point we are dragging
// Param : e => event triggered with dragging
// Return : polyline => a L.polyline object
function dragHandler(e, polyline) {
    let latlngs = polyline.getLatLngs();
    let	latlng = e.target.getLatLng();
    latlngs.splice(e.target.options.index, 1, latlng);
    polyline.setLatLngs(latlngs);
}

// Update geoData with map layers
// Param : geoData
// Return : None
function dragEndHandler(geoData) {
	geoData.paths[geoData.focus].features[0].geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
	//generateFilesTab(geoData);
	//generateGraph(geoData);
}

function addPointMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "addpoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.map.on("click", e => {
		var trace = geoData.paths[geoData.focus];
		var color = geoData.markersColor[geoData.focus % 6];
		var marker = L.marker(e.latlng, {icon : color}).addTo(geoData.map);
		marker.bindPopup("<b>Coucou, je suis un point ! </b><br>Mes coordonnées sont : <br>Latitude : " + e.latlng.lat.toFixed(6) + "<br>Longitude : " + e.latlng.lng.toFixed(6));
		//marker.setOpacity(0);
		trace.markersAdded.push(marker);
		marker.index = geoData.paths[geoData.focus].features[0].geometry.coordinates.length;
		console.log(marker.index);
		trace.features[0].geometry.coordinates.push(Array(Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6)), 0)); //Pour l'instant, l'altitude des nouveaux points est à 0 par défaut
		//generateFilesTab(geoData);
		geoData.map.removeLayer(geoData.layers[geoData.focus]);
		//displayPath(geoData, geoData.focus);

		marker.on("dragend", f => {
			newLat = f.target.getLatLng().lat.toFixed(6);
			newLng = f.target.getLatLng().lng.toFixed(6);
			marker.bindPopup("<b>Héhé, je me suis déplacé ! </b><br>Mes nouvelles coordonnées sont : <br>Latitude : " + newLat + "<br>Longitude : " + newLng);
			trace.features[0].geometry.coordinates[marker.index] = Array(newLng, newLat, 0);
			//generateFilesTab(geoData);
			geoData.map.removeLayer(geoData.layers[geoData.focus]);
			//displayPath(geoData, geoData.focus);
		});

		marker.on("click", () => {
			if(geoData.mode === "deletepoint"){
				geoData.map.removeLayer(marker);
				console.log("Je prends " + (trace.features[0].geometry.coordinates.length-marker.index-1));
				let nb = trace.features[0].geometry.coordinates.length-marker.index-1;
				trace.features[0].geometry.coordinates.splice(marker.index,1);
				trace.markersAdded.splice((marker.index-trace.features[0].geometry.coordinates.length-2), 1);
				for(let i = 0; i < nb ; i++) {
					trace.markersAdded[i].index--;
				}
				//generateFilesTab(geoData);
				geoData.map.removeLayer(geoData.layers[geoData.focus]);
				//displayPath(geoData, geoData.focus);
			}
		});
	});
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function deletePointMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "deletepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='help'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());

	geoData.map.on("contextmenu", e => {
		deleteOldMarkers(geoData);
		let interval = 0.001; // Coordinates interval, to decide the range of points we handle
		let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
		let points = pointsInInterval(coordinates, e.latlng.lat, e.latlng.lng, interval);
		points.forEach(point => {
			let markerIndex = geoData.tempsMarkers.length;
			let marker = L.marker(L.latLng(point.coordinates[1], point.coordinates[0]), {
				index: point.index
			})
			.on('click', e => removePoint(geoData, markerIndex, e.target.options.index));
			geoData.tempsMarkers.push(marker);
			marker.addTo(geoData.map);
		});
	});
}

function removePoint(geoData, markerIndex, index) {
	geoData.map.removeLayer(geoData.tempsMarkers[markerIndex]);
    let latlngs = geoData.layers[geoData.focus].getLatLngs();
    latlngs.splice(index, 1);
    geoData.layers[geoData.focus].setLatLngs(latlngs);
	geoData.paths[geoData.focus].features[0].geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
	//generateFilesTab(geoData);
	//generateGraph(geoData);
}

function linkMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "link";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function unlinkMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "unlink";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

// Change the focus to the file we clicked on
// Param : geoData
function changeFocus(geoData) {
	let i = 0;
	for (i; i < geoData.paths.length; i++) {
		if (geoData.layersControl.getContainer().children[1][i].checked) {
			geoData.focus = i;
			break;
		}
	}
	if (i === geoData.paths.length) {
		geoData.focus = undefined;
	}
}

function createHistory(geoData, index) {
	geoData.pathsHistory[index].paths.push(geoData.paths[index]);
	geoData.layersHistory[index].layers.push(geoData.layers[index]);
}
