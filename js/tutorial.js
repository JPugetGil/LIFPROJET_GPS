// Tutorial functions

function launchTutorial(geoData) {
    console.log("Début du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Stop le tutoriel";
    button.children[0].classList.remove("fa-play");
    button.children[0].classList.add("fa-stop");

    createGeoData()
    .then(setUpPopovers)
    .then(geoDataT => mapReplacements(geoData, geoDataT))
    .then(generateTiles)
    .then(geoDataT => addPath(geoDataT, "gpx/disneyland_paris.gpx"))
    .then(geoDataT => displayPath(geoDataT, 0))
    .then(movePOV)
    .then(geoDataT => {
        clone = button.cloneNode(true);
        clone.addEventListener("click", evt => stopTutorial(geoData, geoDataT));
        button.parentNode.replaceChild(clone, button);

        return geoDataT;
    })
    .then(replaceListeners)
    .then(teach)
    .catch(console.error)
}

function stopTutorial(geoData, geoDataT) {
    console.log("Fin du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Lance un tutoriel";
    button.children[0].classList.remove("fa-stop");
    button.children[0].classList.add("fa-play");

    resetPopovers();
    mapOriginals(geoData, geoDataT);
    replaceListeners(geoData);
    movePOV(geoData);
    setFocusClass(geoData);

    clone = button.cloneNode(true);
    clone.addEventListener("click", evt => launchTutorial(geoData));
    button.parentNode.replaceChild(clone, button);
}

function mapReplacements(geoData, geoDataT) {
    deleteOldMarkers(geoData);
    geoDataT.map = geoData.map;
    geoData.layers.forEach(layer => layer.remove());
    geoData.layersControl.remove();
    geoDataT.layersControl = L.control.layers(null, null, {position: "topleft"}).addTo(geoData.map);

    return geoDataT;
}

function mapOriginals(geoData, geoDataT) {
    deleteOldMarkers(geoDataT);
    geoDataT.layers.forEach(layer => layer.remove());
    geoDataT.layersControl.remove();
    geoData.layersControl.addTo(geoData.map);
    if (geoData.focus !== undefined) {
        geoData.layers[geoData.focus].addTo(geoData.map);
    }
}

function createClone(element) {
    element.parentNode.replaceChild(element.cloneNode(true), element);
}

function replaceListeners(geoData) {
    Array.from(document.querySelectorAll("#features button")).forEach(button => {
        createClone(button);
    });
    createClone(document.getElementById("samplingFactor"));
    setListeners(geoData);
    setListenersUpdate(geoData);

    return geoData;
}

function resetPopovers() {
    let titles = [];
    Array.from($('[data-toggle="popover"]')).forEach(button => {
        titles.push(button.title);
    });
    $('[data-toggle="popover"]').popover('hide');
    $('[data-toggle="popover"]').popover('disable');
    Array.from($('[data-toggle="popover"]')).forEach( (button, i) => {
        button.title = titles[i];
   	});
}
