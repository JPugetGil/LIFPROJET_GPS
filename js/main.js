createGeoData()
.then(generateIndex)
.then(generateMap)
.then(generateTiles)
.then(geoData => addPath(geoData, "gpx/runinlyon_10km.gpx"))
.then(geoData => displayPath(geoData,0))
.then(movePOV)
.then(setGeneralListeners)
.then(setListeners)
.then(setListenersUpdate)
.then(geoData => {
	document.getElementById("moveMap").click();
  	$("#tutorialButton").tooltip();

	return geoData;
})
.then(console.log)
.catch(console.error);

function createGeoData() {
	return new Promise((resolve, reject) => {
		let isMobile = (function() {
		  var check = false;
		  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		  return check;
		})();
		let geoData = {
			mobile: isMobile,
			map: undefined,
			paths: [],
			layersControl: undefined,
			savedState: {
				paths: [],
				undo: false,
				upload: false
			},
			layers: [],
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
	if (geoData.isMobile){
		document.getElementById("features").style.width= ($(document).width() * 1/20) +"px";
	}	else {
		document.getElementById("features").style.width= ($(document).width() * 1/30) +"px";
	}
	document.getElementById("mapid").setAttribute("style","height:"+ ($(document).height() * 5/6) +"px");
	document.getElementById("mapid").style.zIndex=0;
	document.getElementById("features").innerHTML = document.getElementById("features").innerHTML = `<button type="button" id="moveMap" alt="Mode déplacement de carte" title="Mode déplacement de carte" class="btn btn-dark btn-xs btn-block modeButton" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-arrows-alt"></i></button>
					<button type="button" id="movePoint" alt="Mode déplacement de points" title="Mode déplacement de points" class="btn btn-dark btn-xs btn-block modeButton" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-hand-pointer"></i></button>
					<button type="button" id="addPoint" alt="Mode ajout de points" title="Mode ajout de points" class="btn btn-dark btn-xs btn-block modeButton" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-plus"></i></button>
					<button type="button" id="deletePoint" alt="Mode suppression de points" title="Mode suppression de points" class="btn btn-dark btn-xs btn-block modeButton" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-minus"></i></button>
					<button type="button" id="unlink" alt="Mode de coupe de traces" title="Mode de coupe de traces" class="btn btn-dark btn-xs btn-block modeButton" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-unlink"></i></button>
					<button type="button" id="link" alt="Lier des traces" title="Lier des traces" class="btn btn-dark btn-xs btn-block" data-target="#modalLink" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-link"></i></button>
					<button type="button" id="undo" alt="Annuler" title="Annuler" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-undo"></i></button>
					<button type="button" id="redo" alt="Réitérer" title="Réitérer" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-redo"></i></button>
					<div class="form-group">
					    <input type="text" title="Réduire le nombre de points" class="form-control" id="samplingFactor" placeholder="Insérez" data-toggle="popover" data-placement="left" data-html="true" data-content="">
					    <button type="button" id="reSample" alt="Réduire le nombre de points" title="Réduire le nombre de points" class="btn btn-dark btn-xs btn-block"><i class="fas fa-divide"></i></button>
					</div>
					<button id="infos" type="button" data-toggle="collapse" data-target="#traceInfos" alt="Informations sur la trace" title="Informations sur la trace" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-info-circle"></i></button>
					<button id="saveButton" type="button" alt="Téléchargement" title="Téléchargement" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-file-download"></i></button>
					<button id="print" type="button" alt="Imprimer" Title="Imprimer" value="Imprimer" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-html="true" data-content=""><i class="fas fa-print"></i></button>`;
	document.getElementById("features").style.zIndex=1;

	let titles = [];
	Array.from($('[data-toggle="popover"]')).forEach(button => {
    	titles.push(button.title);
	});
	$('[data-toggle="popover"]').popover();
	Array.from($('[data-toggle="popover"]')).forEach( (button, i) => {
   	 button.title = titles[i];
		});
	$('[data-toggle="popover"]').popover('disable');

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
	geoData.layersControl.addBaseLayer(L.tileLayer(' http://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png'), "Fluviale");

	return geoData;
}

function addPath(geoData, file, name = "") {
    return Promise.resolve($.ajax(file)).then(gpx => {
		let index = geoData.paths.length;
		let indexFile = file.lastIndexOf("/");
		let filename = file.substr(indexFile+1);
		if (typeof(gpx) === "object") {
			gpx = new XMLSerializer().serializeToString(gpx);
		}
		geoData.paths[index] = toGeoJSON.gpx((new DOMParser()).parseFromString(gpx, 'text/xml'));
		geoData.paths[index].file = (name === "" ? filename : name);
		geoData.paths[index].shown = true;
		geoData.focus = index;
		savePaths(geoData);
		geoData.savedState.upload = true;
		checkElevation(geoData);
		infoTrace(geoData);
        return geoData;
	});
}

function checkElevation(geoData){
	var listCoord;
	let compt;
	let tabPromises;
	let thereIsElevation;
	let point;
	var x;
	for(let j=0; j<geoData.paths.length; j++){
		tabPromises = [];
		thereIsElevation = true;
		point = 0;
		while(thereIsElevation && (point!==geoData.paths[j].features[0].geometry.coordinates.length-1)){
			if(geoData.paths[j].features[0].geometry.coordinates[point][2] == undefined)
				thereIsElevation = false;
			point++;
		}
		if(!thereIsElevation){
			listCoord = "";
			compt = 0;
			for (let i=0; i<geoData.paths[j].features[0].geometry.coordinates.length; i++){
				listCoord += geoData.paths[j].features[0].geometry.coordinates[i][1] + "," + geoData.paths[j].features[0].geometry.coordinates[i][0] + ",";
				if (((i===geoData.paths[j].features[0].geometry.coordinates.length-1) || (i%50===0) && (i!==0))){
					listCoord = listCoord.substring(0, listCoord.length-1);
					let link = "https://dev.virtualearth.net/REST/v1/Elevation/List?points="+listCoord+"&key=AuhAPaqRM0jgPmFRoNzjuOoB8te9aven3EH_L6sj2pFjDSxyvJ796hueyskwz4Aa";
					tabPromises.push($.getJSON(link, function(data) {}));
					listCoord = "";
				}
			}
			Promise.all(tabPromises).then(function(values) {
				values.forEach(function(element){
					element.resourceSets[0].resources[0].elevations.forEach(function(alt){
						geoData.paths[j].features[0].geometry.coordinates[compt].push(alt);
						compt++;
					});
				});
				return geoData;
			}).then(generateGraph);
		}

	}
	return geoData;
}

// MAP FUNCTIONS //

function movePOV(geoData) {
	if (geoData.focus !== undefined) {
		geoData.map.fitBounds(geoData.layers[geoData.focus].getBounds());
	}
	generateGraph(geoData);
	return geoData;
}

// Param : geoData + number -> quantity of data to delete
// Return : nothing
function reSample(geoData, number){
	number = Number(number);
	if(Number.isInteger(number) && number > 0 && number < (geoData.paths[geoData.focus].features[0].geometry.coordinates.length-2)){
		savePaths(geoData);
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
			document.getElementById("tutorialButton").dispatchEvent(new Event("samplingFactor"));
			generateGraph(geoData);
			infoTrace(geoData);

		} else {
			let w = new Worker("js/resample.js");
			w.onmessage = event => {
				geoData.paths[geoData.focus] = event.data;
				w.terminate();
				w = undefined;
				redisplayPath(geoData, geoData.focus);
				document.getElementById("tutorialButton").dispatchEvent(new Event("samplingFactor"));
				generateGraph(geoData);
				infoTrace(geoData);
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
	let polyline = getPolyline(geoData, index);

	geoData.layers[index] = polyline;
	geoData.layersControl.addOverlay(polyline, geoData.paths[index].file);
	if(display){
		geoData.map.addLayer(polyline);
		setFocusClass(geoData);
	}
	setListenersUpdate(geoData)

	return geoData;
}

function redisplayPath(geoData, index) {
	geoData.layersControl.removeLayer(geoData.layers[index]);
	geoData.map.removeLayer(geoData.layers[index]);

	displayPath(geoData, index);
}

function getPolyline(geoData, index) {
	let color;
	let mean = getElevationMean(geoData);
	if (mean<600){
		color = "#0000FF";
	} else if (mean >= 600 && mean <1200) {
		color = "#007FFF";
	} else if (mean >= 1200 && mean < 1800){
		color = "#00FFFF";
	} else if (mean >= 1800 && mean < 2400){
		color = "#00FF7F";
	} else if (mean >= 2400 && mean < 3000){
		color = "#00FF00";
	} else if (mean >= 3000 && mean < 3600){
		color = "#7FFF00";
	} else if (mean >= 3600 && mean < 4200){
		color = "#FFFF00";
	} else if (mean >= 4200 && mean < 4800){
		color = "#FF7F00";
	} else if (mean >= 4800 && mean < 5400) {
		color = "#FF0000";
	} else {
		color = "#000000";
	}

	let latlngs = [];
	geoData.paths[index].features[0].geometry.coordinates.forEach(coord => {
		let point = [
			coord[1],
			coord[0],
			coord[2]
		];
		latlngs.push(point);
	});
	return L.polyline(latlngs, {color: color});
}

function generateGraph(geoData) {
	if (document.getElementById("toHide").className === "collapse"){
			$('#toHide').collapse('toggle');
	}

	RGraph.reset(document.getElementById('cvs'));
	if (geoData.focus !== undefined) {
		let w2 = new Worker("js/chart.js");
		if (geoData.isMobile){
			document.getElementById("graph").setAttribute("style", "height:"+ ($(document).height() * 1/4) +"px; width: 100%; z-Index: 2; padding-left: 5%");
		} else {
			document.getElementById("graph").setAttribute("style", "height:"+ ($(document).height() * 2/7) +"px; width: 100%; z-Index: 2; padding-left: 5%");
		}

		w2.onmessage = event => {
			w2.terminate();
			w2 = undefined;
			document.getElementById("cvs").setAttribute("width", $(document).width() / 1.11);
			document.getElementById("cvs").setAttribute("height", $(document).height()/4);
			if (newMarker == undefined){
				var newMarker = new L.marker([-100,-10000]);
				var lay = new L.layerGroup([newMarker]).addTo(geoData.map);
			}

			document.getElementById("cvs").addEventListener("mouseout", () => {
				newMarker.setLatLng([-100,-10000]);
			});

			var line = new RGraph.Line({
	            id: 'cvs',
	            data: event.data[1],
	            options: {
									backgroundGridDashed: true,
									tooltips: function (event) {
										let x = geoData.paths[geoData.focus].features[0].geometry.coordinates[event][1];
										let y = geoData.paths[geoData.focus].features[0].geometry.coordinates[event][0];
										newMarker.setLatLng([x,y]);
										geoData.map.panTo(new L.LatLng(x,y));
									},
	                linewidth: 3,
								 	numxticks: event.data[0].length/10,
	                ylabels: true,
									unitsPost: 'm',
									crosshairs: true,
									crosshairsSnap: true,
	                textAccessible: true,
	            }
	        }).draw();
		}

		w2.postMessage(geoData.paths[geoData.focus]);
	}

	return geoData;
}

// Delete a row in the trace table
// Param : id -> index of the row you want to delete
// Return : none
function deleteTrace(geoData, id, conf = true) {
	if (!conf || confirm("Voulez vous vraiment supprimer ce fichier ?")) {
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

function setGeneralListeners(geoData) {
	// General
	document.getElementById("workPlan").addEventListener("contextmenu", evt => evt.preventDefault());
	document.getElementById("tutorialButton").addEventListener("click", evt => launchTutorial(geoData));

	return geoData;
}


function setListeners(geoData) {
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
	document.getElementById("buttonLink").addEventListener("click", () => linkTrace(geoData));
	document.getElementById("unlink").addEventListener("click", () => unlinkMode(geoData));
	document.getElementById("infos").addEventListener("click", () => {
		document.getElementById("tutorialButton").dispatchEvent(new Event("infos"));
		infoTrace(geoData);
	});
	document.getElementById("print").addEventListener("click", () => {
		document.getElementById("tutorialButton").dispatchEvent(new Event("print"));
		window.print();
	});

	document.getElementById("undo").addEventListener("click", () => undoMode(geoData));
	document.getElementById("redo").addEventListener("click", () => redoMode(geoData));

	Array.from(document.getElementsByClassName("modeButton")).forEach(button => {
		button.addEventListener('click', evt => setModeStyle(evt));
	});

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
