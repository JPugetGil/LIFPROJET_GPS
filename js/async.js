createGeoData()
.then(generateHTML)
.then(generateMap)
.then(movePOV)
.then(displayPath)
.then(generateFilesTab)
.then(generateGraph)
.then(generatePoints)
.then(setListeners)
.catch(console.log);