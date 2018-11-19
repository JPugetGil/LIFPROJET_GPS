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
	geoData.map.dragging.disable();
	geoData.map.off("click");
	geoData.map.off("contextmenu");
	deleteOldMarkers(geoData);
	geoData.mode = "movepoint";
	console.log("mode : " + geoData.mode);
	document.getElementById("mapid").setAttribute("onmouseover", "this.style.cursor='pointer'");

	geoData.map.on("contextmenu", e => {
		deleteOldMarkers(geoData);
		if (geoData.focus !== undefined) {
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
		} else {
			alert("Vous devez avoir une trace sélectionnée pour pouvoir déplacer ses points.");
		}
	});

	/*let start;
	let draggable = false;
	geoData.map.on("mousedown", evt => {
		if (!draggable) {
			deleteOldMarkers(geoData);
			if (evt.originalEvent.button === 0) {
				start = evt.latlng;
			}
		}
	});
	geoData.map.on("mouseup", evt => {
		let points = pointsInSquare(geoData.paths[geoData.focus].features[0].geometry.coordinates, start, evt.latlng);
		if (points.length > 0) {
			let latlngs = [];
			points.forEach(point => {
				let latlng = [
					point.coordinates[1],
					point.coordinates[0],
					point.coordinates[2]
				];
				latlngs.push(latlng);
			});
			let polyline = L.polyline(latlngs, {color: "red"});
			polyline.addTo(geoData.map);
			let center = polyline.getCenter();
			let marker = L.marker(center, {
				draggable: true,
			})
			.on("dragend", evt => {
				draggable = false;
				let newCenter = evt.target._latlng;
				let offset = substractLatlng(newCenter, center);
				let realLatlngs = geoData.layers[geoData.focus].getLatLngs();
			    let	newLatlngs = deplaceLatlngs(polyline.getLatLngs(), offset);
				points.forEach( (point, i) => {
					realLatlngs.splice(point.index, 1, newLatlngs[i]);
				});
			    geoData.layers[geoData.focus].setLatLngs(realLatlngs);
				geoData.map.removeLayer(polyline);
			});
			geoData.tempMarkers.push(marker);
			marker.addTo(geoData.map);
			draggable = true;
		}
	});*/
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
		if (geoData.focus !== undefined) {
			var trace = geoData.paths[geoData.focus].features[0];
			trace.geometry.coordinates.push(Array(Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6)), 0)); //Pour l'instant, l'altitude des nouveaux points est à 0 par défaut
			let latlngs = geoData.layers[geoData.focus].getLatLngs();
			let latlng = L.latLng(Array(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)), 0));
			latlngs.push(latlng);
			geoData.layers[geoData.focus].setLatLngs(latlngs);
            
            
            if (trace.hasOwnProperty("properties")) {
                if (trace.properties.hasOwnProperty("coordTimes")) {
                    trace.properties.coordTimes.push(trace.properties.coordTimes[trace.properties.coordTimes.length -1]);
                }
                if (trace.properties.hasOwnProperty("heartRates")) {
                    trace.properties.heartRates.push(trace.properties.heartRates[trace.properties.heartRates.length -1]);
                }
            }
        } else {
			alert("Vous devez avoir une trace sélectionnée pour pouvoir y ajouter des points.");
		}
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
		if (geoData.focus !== undefined) {
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
		} else {
			alert("Vous devez avoir une trace sélectionnée pour pouvoir supprimer des points.");
		}
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
    let trace = geoData.paths[geoData.focus].features[0];
	trace.geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
    
     if (trace.hasOwnProperty("properties")) {
        if (trace.properties.hasOwnProperty("coordTimes")) {
            let coordTimes = trace.properties.coordTimes;
            coordTimes.splice(index, 1);
            trace.properties.coordTimes = coordTimes;
        }
        if (trace.properties.hasOwnProperty("heartRates")) {
            let heartRates = trace.properties.heartRates;
            heartRates.splice(index, 1);
            trace.properties.heartRates = heartRates;
        }
    }
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
	if (geoData.paths.length < 2){
		document.getElementById("link").removeAttribute("data-toggle", "modal");
		alert("Vous devez avoir plusieurs traces pour pouvoir utiliser la fonction Lier.");
	}
	else {
		document.getElementById("link").setAttribute("data-toggle", "modal");
		document.getElementById("t1").innerHTML = " ";
		document.getElementById("t2").innerHTML = " ";
		for(let i = 0; i<geoData.paths.length; i++){
			document.getElementById("t1").innerHTML += `<option value="${i}">${geoData.paths[i].file}</option>`;
			document.getElementById("t2").innerHTML += `<option value="${i}">${geoData.paths[i].file}</option>`;
		}
	}
}

function fusion(geoData, idTrace1, idTrace2, mode){
	let traceBorn = copyAttrPath(geoData, geoData.paths[idTrace1]);
	if (document.getElementById("traceName").value == ""){
		traceBorn.file = "Nouvelle Trace";
	}
	else{
		traceBorn.file = document.getElementById("traceName").value;
	}
	let definedCoordTimes = traceBorn.features[0].properties.hasOwnProperty("coordTimes");
	let definedHeartRates = traceBorn.features[0].properties.hasOwnProperty("heartRates");
	switch(mode) {
		case 'fd':
			traceBorn.features[0].geometry.coordinates = geoData.paths[idTrace1].features[0].geometry.coordinates.slice(0).concat(geoData.paths[idTrace2].features[0].geometry.coordinates.slice(0));
			if(definedCoordTimes){
				traceBorn.features[0].properties.coordTimes = geoData.paths[idTrace1].features[0].properties.coordTimes.slice(0).concat(geoData.paths[idTrace2].features[0].properties.coordTimes.slice(0));
			}
			if(definedHeartRates){
				traceBorn.features[0].properties.heartRates = geoData.paths[idTrace1].features[0].properties.heartRates.slice(0).concat(geoData.paths[idTrace2].features[0].properties.heartRates.slice(0));
			}
			break;
		case 'ff':
			traceBorn.features[0].geometry.coordinates = geoData.paths[idTrace1].features[0].geometry.coordinates.slice(0).concat(geoData.paths[idTrace2].features[0].geometry.coordinates.slice(0).reverse());
			if(definedCoordTimes){
				traceBorn.features[0].properties.coordTimes = geoData.paths[idTrace1].features[0].properties.coordTimes.slice(0).concat(geoData.paths[idTrace2].features[0].properties.coordTimes.slice(0).reverse());
			}
			if(definedHeartRates){
				traceBorn.features[0].properties.heartRates = geoData.paths[idTrace1].features[0].properties.heartRates.slice(0).concat(geoData.paths[idTrace2].features[0].properties.heartRates.slice(0).reverse());
			}
			break;
		case 'dd':
			traceBorn.features[0].geometry.coordinates = geoData.paths[idTrace1].features[0].geometry.coordinates.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].geometry.coordinates.slice(0));
			if(definedCoordTimes){
				traceBorn.features[0].properties.coordTimes = geoData.paths[idTrace1].features[0].properties.coordTimes.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].properties.coordTimes.slice(0));
			}
			if(definedHeartRates){
				traceBorn.features[0].properties.heartRates = geoData.paths[idTrace1].features[0].properties.heartRates.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].properties.heartRates.slice(0));
			}
			break;
		case 'df':
			traceBorn.features[0].geometry.coordinates = geoData.paths[idTrace1].features[0].geometry.coordinates.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].geometry.coordinates.slice(0).reverse());
			if(definedCoordTimes){
				traceBorn.features[0].properties.coordTimes = geoData.paths[idTrace1].features[0].properties.coordTimes.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].properties.coordTimes.slice(0).reverse());
			}
			if(definedHeartRates){
				traceBorn.features[0].properties.heartRates = geoData.paths[idTrace1].features[0].properties.heartRates.slice(0).reverse().concat(geoData.paths[idTrace2].features[0].properties.heartRates.slice(0).reverse());
			}
			break;
		default:
			break;
	}
	if(idTrace1 == idTrace2){
		document.getElementById("buttonLink").removeAttribute("data-dismiss", "modal");
		alert("Vous avez sélectionné 2 fois la même trace.");
	}
	else{
		document.getElementById("buttonLink").setAttribute("data-dismiss", "modal");
		deleteTrace(geoData, idTrace2, false);
		deleteTrace(geoData, idTrace1, false);
		geoData.paths[geoData.paths.length] = traceBorn;
		displayPath(geoData, geoData.paths.length-1);
		setListenersUpdate(geoData);
	}
}

function linkTrace(geoData){
	let idTrace1 = document.getElementById('t1').value;
	let idTrace2 = document.getElementById('t2').value;
	let radios1 = document.getElementsByName('firstTrace');
	let radios2 = document.getElementsByName('secondTrace');
	let val1 = " ";
	let val2 = " ";
	for(let i = 0; i < 2; i++){
 		if(radios1[i].checked){
 			val1 = radios1[i].value;
 		}
 		if(radios2[i].checked){
 			val2 = radios2[i].value;
 		}
	}
	let mode = val1 + val2;
	fusion(geoData, idTrace1, idTrace2, mode);
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
		if (geoData.focus !== undefined) {
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
		} else {
			alert("Vous devez avoir une trace sélectionnée pour pouvoir la couper.");
		}
	});
}

function cutIn2(geoData, index) {
	let coordinates = geoData.paths[geoData.focus].features[0].geometry.coordinates;
	let latlngs = geoData.layers[geoData.focus].getLatLngs();
    latlngs.splice(index, (coordinates.length - index));
    geoData.layers[geoData.focus].setLatLngs(latlngs);
	geoData.paths[geoData.focus].features[0].geometry = geoData.layers[geoData.focus].toGeoJSON().geometry;
	let indexNewPath = geoData.paths.length;
	geoData.paths[indexNewPath] = copyAttrPath(geoData, geoData.paths[geoData.focus]);
	geoData.paths[indexNewPath].features[0].geometry.coordinates = coordinates.slice(index);

	if(geoData.paths[indexNewPath].features[0].properties.hasOwnProperty("coordTimes")){
		geoData.paths[indexNewPath].features[0].properties.coordTimes = geoData.paths[geoData.focus].features[0].properties.coordTimes.slice(index);
        geoData.paths[geoData.focus].features[0].properties.coordTimes = geoData.paths[geoData.focus].features[0].properties.coordTimes.slice(0, index);
	}
	if(geoData.paths[indexNewPath].features[0].properties.hasOwnProperty("heartRates")){
		geoData.paths[indexNewPath].features[0].properties.heartRates = geoData.paths[geoData.focus].features[0].properties.heartRates.slice(index);
        geoData.paths[geoData.focus].features[0].properties.heartRates = geoData.paths[geoData.focus].features[0].properties.heartRates.slice(0, index);
    }

	displayPath(geoData, indexNewPath, false);
	setFocusClass(geoData);
	deleteOldMarkers(geoData);
	setListenersUpdate(geoData);
    console.log(geoData.paths);
}

function copyAttrPath(geoData, oldPath) {
	let newPath = {};
	newPath.features = [];
	newPath.features[0] = {};
	newPath.features[0].type = oldPath.features[0].type;
	newPath.features[0].geometry = {};
	newPath.features[0].geometry.type = oldPath.features[0].geometry.type;
	newPath.features[0].geometry.coordinates = [];
	newPath.features[0].properties = {};
	if(oldPath.features[0].properties.hasOwnProperty("time")){
		newPath.features[0].properties.time = oldPath.features[0].properties.time;
	}
	if(oldPath.features[0].properties.hasOwnProperty("coordTimes")){
		newPath.features[0].properties.coordTimes = [];
	}
	if(oldPath.features[0].properties.hasOwnProperty("heartRates")){
		newPath.features[0].properties.heartRates = [];
	}
	if(oldPath.features[0].properties.hasOwnProperty("name")){
		newPath.features[0].properties.name = oldPath.features[0].properties.name;
	}
	newPath.shown = oldPath.shown;
	newPath.file = oldPath.file + "(" + geoData.paths.length + ")";
	newPath.type = oldPath.type;

	return newPath;
}
