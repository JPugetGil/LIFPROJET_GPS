// JavaScript Document


// Set up the listeners
// Return : none
function setListeners() {
	let saveButton = document.getElementById("saveButton");
	if (saveButton !== undefined) {
		saveButton.addEventListener("click", saveAndGet);
	}
}

// Set up the listeners for the file rows
// Return : none
function rowListeners() {
	Array.from(document.getElementById("fileTable").children).forEach((current, index) => {
		current.addEventListener("click", rowClick(current));
	});
}

function rowClick(row) {
	return function() {
		console.log("Hey");
	}
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


// CONVERSION FUNCTIONS //


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

// Launch after page is ready
$(startPage());
