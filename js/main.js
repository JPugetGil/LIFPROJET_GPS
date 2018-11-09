createGeoData()
.then(generateIndex)
.then(generateMap)
.then(generateTiles)
.then(geoData => addPath(geoData, "data/runinlyon_10km.gpx"))
.then(geoData => displayPath(geoData,0))
.then(movePOV)
//.then(generateFilesTab)
.then(generateGraph)
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
			tempMarkers: [],
			focus: undefined,
            mode: "movemap"
		};
		resolve(geoData);
		reject("Error when initializing the global variable");
	});
}

function generateIndex(geoData) {
	document.getElementById("mapid").setAttribute("style","height:"+ ($(document).height() * 5/6) +"px");
	document.getElementById("mapid").style.zIndex=0;
	document.getElementById("features").style.width= ($(document).width() * 1/30) +"px";
	document.getElementById("features").innerHTML = `<button type="button" id="moveMap" alt="DeplacerCarte" title="Déplacer Carte" class="btn btn-dark btn-xs btn-block"><i class="fas fa-arrows-alt"></i></button>
					<button type="button" id="movePoint" alt="DeplacerPoint" title="Déplacer Point" class="btn btn-dark btn-xs btn-block"><i class="fas fa-hand-pointer"></i></button>
					<button type="button" alt="Annuler" title="Annuler" class="btn btn-dark btn-xs btn-block"><i class="fas fa-undo"></i></button>
					<button type="button" alt="Désannuler" title="Désannuler" class="btn btn-dark btn-xs btn-block"><i class="fas fa-redo"></i></button>
					<button type="button" id="addPoint" alt="Ajouter un point" title="Ajouter un point" class="btn btn-dark btn-xs btn-block"><i class="fas fa-plus"></i></button>
					<button type="button" id="deletePoint" alt="Supprimer un point" title="Supprimer un point" class="btn btn-dark btn-xs btn-block"><i class="fas fa-minus"></i></button>
					<button type="button" id="link" alt="Lier" title="Lier" class="btn btn-dark btn-xs btn-block"><i class="fas fa-link"></i></button>
					<button type="button" id="unlink" alt="Délier" title="Délier" class="btn btn-dark btn-xs btn-block"><i class="fas fa-unlink"></i></button>
					<div class="form-group">
					    <input type="text" class="form-control" id="samplingFactor" placeholder="Insérez">
					    <button type="button" id="reSample" alt="reSample" title="Rééchantillonner" class="btn btn-dark btn-xs btn-block"><i class="fas fa-divide"></i></button>
					</div>

					<button type="button" alt="Imprimer" Title="Imprimer" onclick="window.print()" value="Imprimer" class="btn btn-dark btn-xs btn-block"><i class="fas fa-print"></i></button>
					<button id="saveButton" type="button" alt="Télécharger" title="Télécharger" class="btn btn-dark btn-xs btn-block"><i class="fas fa-file-download"></i></button>
				</div>`;
	document.getElementById("features").style.zIndex=1;
	document.getElementById("graph").setAttribute("style", "height:"+ ($(document).height() * 2/7) +"px");
	document.getElementById("graph").style.width= "100%";
	document.getElementById("graph").style.zIndex=2;
	document.getElementById("cvs").setAttribute("height", ($(document).height() * 2/7));
	document.getElementById("cvs").setAttribute("width", $(document).width() * 39/40);
	return geoData;
}

// Open the help window
// Return : none
function help(){
	window.open('html/aide.html', "Aide pour le site Improve my GPX", 'width = 400, height = 800, left = 1000');
}

function generateMap(geoData) {
	geoData.map = L.map('mapid').setView([0,0], 0);
	geoData.layersControl = L.control.layers(null, null, {position: "topleft"}).addTo(geoData.map);
	L.control.scale({imperial: false}).addTo(geoData.map);

	return geoData;
}

function generateTiles(geoData) {
	geoData.layersControl.addBaseLayer(L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(geoData.map), "Epurée");
	geoData.layersControl.addBaseLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}), "Détaillée");
	geoData.layersControl.addBaseLayer(L.tileLayer(' http://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png'), "OpenRiverboatMap");
	
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
		//geoData.markersColor = [blackMarker, blueMarker, redMarker, greenMarker, purpleMarker, yellowMarker];
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
			generateGraph(geoData);

		} else {
			let w = new Worker("js/resample.js", {type:'module'});
			w.onmessage = event => {
				geoData.paths[geoData.focus] = event.data;
				w.terminate();
				w = undefined;
				geoData.map.removeLayer(geoData.layers[geoData.focus]);
				displayPath(geoData, geoData.focus);

				generateGraph(geoData);
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

function displayPath(geoData, index, display = true) {
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
	geoData.layersControl.addOverlay(polyline, geoData.paths[index].file);
	if(display){
		geoData.map.addLayer(polyline);
		setFocusClass(geoData);
	}

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

	return geoData;
}

function generateGraph(geoData) {
	let w2 = new Worker("js/chart.js", {type:'module'});
	w2.onmessage = event => {
		w2.terminate();
		w2 = undefined;
		var line = new RGraph.Line({
            id: 'cvs',
            data: event.data[1],
            options: {
								backgroundGridDashed: true,
                linewidth: 2,
                hmargin: 5,
                textAccessible: true
            }
        }).draw();
	}
	w2.postMessage(geoData.paths);

	return geoData;
}

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
			resetFocus(geoData);
			setFocusClass(geoData);
	   		movePOV(geoData);
	   	} else if (geoData.focus > id) {
	   		geoData.focus--;
	   	}
		setListenersUpdate(geoData);
	}
}


function setListeners(geoData) {
	// General
	document.getElementById("workPlan").addEventListener("contextmenu", evt => evt.preventDefault());

	// Files import
    document.getElementById("importButton").addEventListener("click", () => upload(geoData));
	document.getElementById("hiddenButton").addEventListener("change", () => hiddenUpload(geoData));

	// Mode buttons
	document.getElementById("moveMap").addEventListener("click", () => moveMapMode(geoData));
	document.getElementById("movePoint").addEventListener("click", () => movePointMode(geoData));
	document.getElementById("reSample").addEventListener("click", () => reSample(geoData,document.getElementById("samplingFactor").value));
	document.getElementById("samplingFactor").addEventListener("keyup", e => keySample(geoData, e.keyCode));
	document.getElementById("saveButton").addEventListener("click", () => giveUserGpx(geoData));
	document.getElementById("addPoint").addEventListener("click", () => addPointMode(geoData));
	document.getElementById("deletePoint").addEventListener("click", () => deletePointMode(geoData));
	document.getElementById("link").addEventListener("click", () => linkMode(geoData));

    return geoData;
}

function setListenersUpdate(geoData) {
	document.querySelectorAll(".leaflet-control-layers-overlays > label > div > input").forEach(input => {
		input.addEventListener("change", evt => {
			if (evt.target.checked) {
				geoData.focus = getIndexFile(evt.target);
			} else {
				resetFocus(geoData);
			}
			setFocusClass(geoData);
			movePOV(geoData);
		});
	});
	document.querySelectorAll(".leaflet-control-layers-overlays > label > div > span").forEach(span => {
		span.addEventListener("contextmenu", evt => {
			evt.preventDefault();
			deleteTrace(geoData, getIndexFile(evt.target));
		});
	});

	document.getElementById("unlink").addEventListener("click", () => unlinkMode(geoData));

	return geoData;
}

function getIndexFile(element) {
	let index = undefined;
	let i = 0;
	let clickables = Array.from(document.querySelectorAll(".leaflet-control-layers-overlays > label > div > *"));
	while (index === undefined && i < clickables.length) {
		if (element._leaflet_id === clickables[i]._leaflet_id) {
			index = i % 2 === 0 ? i / 2 : (i-1) / 2;
		}
		i++;
	}

	return index;
}

// Change geoData.focus to the first checked file
// Param : geoData
function resetFocus(geoData) {
	geoData.focus = undefined;
	let i = 0;
	let inputs = document.querySelectorAll(".leaflet-control-layers-overlays > label > div > input");
	while (geoData.focus === undefined && i < geoData.paths.length) {
		if (inputs[i].checked) {
			geoData.focus = i;
		}
		i++;
	}
}

function setFocusClass(geoData) {
	let lines = document.querySelectorAll(".leaflet-control-layers-overlays > label");
	lines.forEach(input => {
		input.classList.remove('focus');
	});
	if (geoData.focus !== undefined) {
		lines[geoData.focus].classList.add("focus");
	}
}

function createHistory(geoData, index) {
	geoData.pathsHistory[index].paths.push(geoData.paths[index]);
	geoData.layersHistory[index].layers.push(geoData.layers[index]);
}
