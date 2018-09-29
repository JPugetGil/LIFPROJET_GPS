createGeoData()
/*.then(generateHTML)
.then(generateMap)
.then(movePOV)
.then(displayPath)
.then(generateFilesTab)
.then(generateGraph)
.then(generatePoints)
.then(setListeners)*/
.then(console.log)
.catch(console.log);

function createGeoData() {
	return new Promise((resolve, reject) => {
		let geoData = {
			map: undefined,
			paths: []
		};
		resolve(geoData);
		reject("Error when initializing the global variable");
	});
}