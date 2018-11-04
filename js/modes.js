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
		//geoData.map.removeLayer(geoData.layers[geoData.focus]);
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
				//geoData.map.removeLayer(geoData.layers[geoData.focus]);
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
