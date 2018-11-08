// Suppress temporary markers created by modes
// Param: geoData
// Return : None
function deleteOldMarkers(geoData) {
	geoData.tempMarkers.forEach(marker => {
		geoData.map.removeLayer(marker);
	});
	geoData.tempMarkers = [];
}

function moveMapMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "movemap";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='move'");
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
			geoData.tempMarkers.push(marker);
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
	generateGraph(geoData);
}

function addPointMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "addpoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.map.on("click", e => {
		var trace = geoData.paths[geoData.focus];
		trace.features[0].geometry.coordinates.push(Array(Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6)), 0)); //Pour l'instant, l'altitude des nouveaux points est à 0 par défaut
		let latlngs = geoData.layers[geoData.focus].getLatLngs();
		let latlng = Array(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)), 0);
		latlngs.push(latlng);
		geoData.layers[geoData.focus].setLatLngs(latlngs);
		//generateFilesTab(geoData);
		//geoData.map.removeLayer(geoData.layers[geoData.focus]);
		//displayPath(geoData, geoData.focus);
	});
}

function deletePointMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "deletepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='help'");

	geoData.map.on("contextmenu", e => {
		deleteOldMarkers(geoData);
		let interval = 0.001; // Coordinates interval, to decide the range of points we handle
		let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
		let points = pointsInInterval(coordinates, e.latlng.lat, e.latlng.lng, interval);
		points.forEach(point => {
			let markerIndex = geoData.tempMarkers.length;
			let marker = L.marker(L.latLng(point.coordinates[1], point.coordinates[0]), {
				index: point.index
			})
			.on('click', e => removePoint(geoData, markerIndex, e.target.options.index));
			geoData.tempMarkers.push(marker);
			marker.addTo(geoData.map);
		});
	});
}

function removePoint(geoData, markerIndex, index) {
	geoData.map.removeLayer(geoData.tempMarkers[markerIndex]);
	for (let i = markerIndex+1; i < geoData.tempMarkers.length; i++) {
		geoData.tempMarkers[i].options.index--;
	}
    let latlngs = geoData.layers[geoData.focus].getLatLngs();
    latlngs.splice(index, 1);
    geoData.layers[geoData.focus].setLatLngs(latlngs);
	geoData.paths[geoData.focus].features[0].geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
	//generateFilesTab(geoData);
	generateGraph(geoData);
}

function linkMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "link";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");

}

function unlinkMode(geoData) {
	geoData.map.dragging.enable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "unlink";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='crosshair'");
	geoData.map.on("contextmenu", e => {
		deleteOldMarkers(geoData);
		let interval = 0.001; // Coordinates interval, to decide the range of points we handle
		let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
		let points = pointsInInterval(coordinates, e.latlng.lat, e.latlng.lng, interval);
		points.forEach(point => {
			let marker = L.marker(L.latLng(point.coordinates[1], point.coordinates[0]), {
				index: point.index
			})
			.on('click', e => cutIn2(geoData, e.target.options.index));
			geoData.tempMarkers.push(marker);
			marker.addTo(geoData.map);
		});
	});
}

function cutIn2(geoData, index) {
	let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
	let latlngs = geoData.layers[geoData.focus].getLatLngs();
    latlngs.splice(index, (coordinates.length - index));
    geoData.layers[geoData.focus].setLatLngs(latlngs);
	geoData.paths[geoData.focus].features[0].geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
	let indexNewPath = geoData.paths.length;
	geoData.paths[indexNewPath] = copyPath(geoData, geoData.paths[geoData.focus]);
	geoData.paths[indexNewPath].features[0].geometry.coordinates = coordinates.slice(index);
	geoData.paths[indexNewPath].features[0].properties.coordTimes = geoData.paths[geoData.focus].features[0].properties.coordTimes.slice(index);
	geoData.paths[indexNewPath].features[0].properties.heartRates = geoData.paths[geoData.focus].features[0].properties.heartRates.slice(index);

	displayPath(geoData, indexNewPath, false);
	setFocusClass(geoData);
	deleteOldMarkers(geoData);
	setListenersUpdate(geoData);
}

function copyPath(geoData, oldPath) {
	let newPath = {};
	newPath.features = [];
	newPath.features[0] = {};
	newPath.features[0].type = oldPath.features[0].type;
	newPath.features[0].geometry = {};
	newPath.features[0].geometry.type = oldPath.features[0].geometry.type;
	newPath.features[0].geometry.coordinates = [];
	newPath.features[0].properties = {};
	newPath.features[0].properties.time = oldPath.features[0].properties.time;
	newPath.features[0].properties.coordTimes = [];
	newPath.features[0].properties.heartRates = [];
	newPath.features[0].properties.name = oldPath.features[0].properties.name
	newPath.shown = oldPath.shown;
	newPath.file = oldPath.file + "(" + geoData.paths.length + ")";
	newPath.type = oldPath.type;

	return newPath;
}
