createGeoData()
.then(generateIndex)
.then(generateMap)
.then(geoData => addPath(geoData, "data/runinlyon_10km.gpx"))
.then(movePOV)
.then(displayPath)
.then(generateFilesTab)
.then(generateGraph)
.then(generatePoints)
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
			markers: [],
			markersHistory: {
				markers: [],
				last: undefined
			},
			focus: undefined,
            page: undefined,
            mode: "movemap"
		};
		resolve(geoData);
		reject("Error when initializing the global variable");
	});
}

// Generate the main section (with the map)
// Return : none
function generateIndex(geoData) {
    geoData.page = "index";
	document.getElementById("planDeTravail").innerHTML =
		`<div class="col-lg-8 bg-light">
			<div class="row">
				<div class="col-lg-11">
					<div id="mapid" style="width: 100%; height: 500px"></div>
					<div id="graph" class="row col-auto bg-light">
						<div class="c3" id="chart" style="height: 250px; width:98%; position :relative;"></div>
					</div>
				</div>
				<div class="col-lg-1">
					<button type="button" id="moveMap" alt="DeplacerCarte" title="Déplacer Carte" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-arrows-alt"></i></button>
					<button type="button" id="movePoint" alt="DeplacerPoint" title="Déplacer Point" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-hand-pointer"></i></button>
					<button type="button" alt="Annuler" title="Annuler" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-undo"></i></button>
					<button type="button" alt="Désannuler" title="Désannuler" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-redo"></i></button>
					<button type="button" id="addPoint" alt="Ajouter un point" title="Ajouter un point" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-plus"></i></button>
					<button type="button" id="deletePoint" alt="Supprimer un point" title="Supprimer un point" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-minus"></i></button>
					<button type="button" id="link" alt="Lier" title="Lier" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-link"></i></button>
					<button type="button" id="unlink" alt="Délier" title="Délier" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-unlink"></i></button>

					<div class="form-group">
					    <input type="text" class="form-control" id="samplingFactor" placeholder="Insérez">
					    <button type="button" id="reSample" alt="reSample" title="Rééchantillonner" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-divide"></i></button>
					</div>

					<button type="button" alt="Imprimer" Title="Imprimer" onclick="window.print()" value="Imprimer" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-print"></i></button>
					<button id="saveButton" type="button" alt="Télécharger" title="Télécharger" class="btn btn-secondary btn-sm btn-block"><i class="fas fa-file-download"></i></button>
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
				<table id="tableData" class="table table-striped table-hover table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Longitude</th>
							<th scope="col">Latitude</th>
							<th scope="col">Altitude</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>`;
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
		geoData.focus = index;
        return geoData;
	})
}

// MAP FUNCTIONS //

function movePOV(geoData) {
	let lastIndex = geoData.paths.length -1;
	while (lastIndex >= 0 && !geoData.paths[lastIndex].shown) {
		lastIndex--;
	}
	if (lastIndex >= 0) {
		let path = geoData.paths[lastIndex];
		let tabLatitude = [];
		let tabLongitude = [];
		for (let i = 0; i < path.features[0].geometry.coordinates.length ; i++) {
			tabLatitude.push(path.features[0].geometry.coordinates[i][1]);
			tabLongitude.push(path.features[0].geometry.coordinates[i][0]);
		}
		let centreTraceLatitude = moyenneDunTableau(tabLatitude);
		let centreTraceLongitude = moyenneDunTableau(tabLongitude);
		let elevationCarte = plusGrandModule(tabLatitude, tabLongitude, centreTraceLatitude, centreTraceLongitude);
		geoData.map.setView([centreTraceLatitude, centreTraceLongitude],elevationCarte*21);
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
			generatePoints(geoData);
			geoData.map.removeLayer(geoData.markers[geoData.focus]);
			displayPath(geoData, geoData.focus);
			generateGraph(geoData);

		} else {
			let w = new Worker("js/resample.js", {type:'module'});
			w.onmessage = event => {
				geoData.paths[geoData.focus] = event.data;
				w.terminate();
				generatePoints(geoData);
				geoData.map.removeLayer(geoData.markers[geoData.focus]);
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

function displayPath(geoData, index) {
	let geojsonMarkerOptions = {
		opacity: 0,
		fillOpacity: 0
	};
	if (index === undefined) {
		geoData.paths.forEach( (current, index) => {
			let marker = L.geoJSON(current, {
				pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, geojsonMarkerOptions);
				}
			});
			geoData.markers[index] = marker;
			geoData.markersHistory[index] = [];
			if (current.shown) {
				geoData.map.addLayer(marker);
			}
		});
	} else {
		let marker = L.geoJSON(geoData.paths[index], {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions);
			}
		});
		geoData.markers[index] = marker;
		geoData.markersHistory[index] = [];
		if (geoData.paths[index].shown) {
			geoData.map.addLayer(marker);
		}
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
				<td><button id="suppr${index}" class="btn btn-danger" type="button" onclick="deleteTrace(${geoData},${index});">X</button></td>
			</tr>`;
	});

	if (geoData.focus !== undefined) {
		document.getElementById("row" + geoData.focus).classList.add("focus");
	}

	return geoData;
}

function generateGraph(geoData) {
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
}

function generatePoints(geoData) {
	let tableContent = "";
	let lastIndex = geoData.focus;
	if (lastIndex === undefined) {
		lastIndex = geoData.paths.length -1;
		while (lastIndex >= 0 && !geoData.paths[lastIndex].shown) {
			lastIndex--;
		}
	}
	if (lastIndex >= 0) {
		let trace = geoData.paths[lastIndex];
		for (let i=0; i < trace.features[0].geometry.coordinates.length; i++) {
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
	}
	document.querySelector("#tableData > tbody").innerHTML = tableContent;

	return geoData;
}

// Delete a row in the trace table
// Param : id -> index of the row you want to delete
// Return : none
function deleteTrace(geoData, id) {
	if (confirm("Voulez vous vraiment supprimer ce fichier ?")) {
		let wasShown = geoData.paths[id].shown;
   		geoData.map.removeLayer(geoData.markers[id]);
   		geoData.paths.splice(id, 1);
   		geoData.markers.splice(id, 1);
   		if (wasShown) {
   			generateGraph(geoData);
   		}
   		if (geoData.focus === id) {
   			geoData.focus = geoData.paths.length -1;
   			if (geoData.focus < 0) {
   				geoData.focus = undefined;
   			}
   			generatePoints(geoData);
	   		movePOV(geoData);
	   	} else {
	   		if (geoData.focus > id) {
	   			geoData.focus--;
	   		}
	   	}
	   	generateFilesTab(geoData);
   		setListenersUpdate(geoData);
	}
}


function setListeners(geoData) {

    document.getElementById("importButton").addEventListener("click", upload(geoData));
    document.getElementById("reSample").addEventListener("click", () => reSample(geoData,document.getElementById("samplingFactor").value));
    document.getElementById("hiddenButton").addEventListener("change", hiddenUpload(geoData));
    document.getElementById("saveButton").addEventListener("click", () => giveUserGpx(geoData));
    document.getElementById("moveMap").addEventListener("click", () => moveMapMode(geoData));
	document.getElementById("movePoint").addEventListener("click", () => movePointMode(geoData));
	document.getElementById("addPoint").addEventListener("click", () => addPointMode(geoData));
	document.getElementById("deletePoint").addEventListener("click", () => deletePointMode(geoData));
	document.getElementById("link").addEventListener("click", () => linkMode(geoData));
	document.getElementById("unlink").addEventListener("click", () => unlinkMode(geoData));

    return geoData;
}

function setListenersUpdate(geoData){
	Array.from(document.querySelectorAll("#fileTable button")).forEach( btn => btn.addEventListener("click", event => {
		let id = event.target.id;
		deleteTrace(geoData, parseInt(id.substr(5, id.length-5)));
    }));

	return geoData;
}

function moveMapMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.mode = "movemap";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='move'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function movePointMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.mode = "movepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='pointer'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.enable());
}

function addPointMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.mode = "addpoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.map.on("click", e => {
		var trace = geoData.paths[geoData.focus];
		var marker = L.marker(e.latlng).addTo(geoData.map);
		trace.markersAdded.push(marker);
		marker.index = geoData.paths[geoData.focus].features[0].geometry.coordinates.length;
		console.log(marker.index);
		marker.bindPopup("<b>Coucou, je suis un point ! </b><br>Mes coordonnées sont : <br>Latitude : " + e.latlng.lat.toFixed(6) + "<br>Longitude : " + e.latlng.lng.toFixed(6)).openPopup();
		trace.features[0].geometry.coordinates.push(Array(Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6)), 0)); //Pour l'instant, l'altitude des nouveaux points est à 0 par défaut
		generatePoints(geoData);
		generateFilesTab(geoData);
		geoData.map.removeLayer(geoData.markers[geoData.focus]);
		displayPath(geoData, geoData.focus);

		marker.on("dragend", f => {
			newLat = f.target.getLatLng().lat.toFixed(6);
			newLng = f.target.getLatLng().lng.toFixed(6);
			marker.bindPopup("<b>Héhé, je me suis déplacé ! </b><br>Mes nouvelles coordonnées sont : <br>Latitude : " + newLat + "<br>Longitude : " + newLng).openPopup();
			trace.features[0].geometry.coordinates[marker.index] = Array(newLng, newLat, 0);
			generatePoints(geoData);
			generateFilesTab(geoData);
			geoData.map.removeLayer(geoData.markers[geoData.focus]);
			displayPath(geoData, geoData.focus);
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
				generatePoints(geoData);
				generateFilesTab(geoData);
				geoData.map.removeLayer(geoData.markers[geoData.focus]);
				displayPath(geoData, geoData.focus);
			}
		});
	});
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function deletePointMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.mode = "deletepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='help'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function linkMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.mode = "link";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function unlinkMode(geoData) {
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.mode = "unlink";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.paths[geoData.focus].markersAdded.forEach(m => m.dragging.disable());
}

function createHistory(geoData, index) {
	geoData.pathsHistory[index].paths.push(geoData.paths[index]);
	geoData.markersHistory[index].markers.push(geoData.markers[index]);
}
