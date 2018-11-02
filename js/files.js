// File to Page //

// Upload a file into the page from data/
// Return : none
function upload(geoData) {
	return function () {
		if (geoData.page == "index"){
	        console.log("Nous allons importer le fichier...");
	    }
	    else {
	        generateIndex(geoData);
	        console.log("Maintenant que index est chargé, nous allons importer...");
	    }
	   	document.getElementById('hiddenButton').click();
	}
}

// Used to upload
// Return : none
function hiddenUpload(geoData) {
	return function() {
	    let path = document.getElementById("hiddenButton").value;
	    let length = path.length - 11;
	    let realPath = "data/" + path.substr(12, length);
	    addPath(geoData, realPath)
			.then(geoData => displayPath(geoData, geoData.paths.length-1))
			.then(movePOV)
			/*.then(generateFilesTab)
			.then(generateGraph)
			.then(generatePoints)*/
			.then(setListenersUpdate)
	}
}

// Page to File //

// Open a window enabling the user to download a .gpx file
// Return : none
function giveUserGpx(geoData) {
	let geoJS = geoData.paths[geoData.focus];
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
