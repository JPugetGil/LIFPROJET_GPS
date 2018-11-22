// Tutorial functions

function launchTutorial(geoData) {
    console.log("Début du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Stop le tutoriel";
    /*button.children[0].classList.remove("fa-toggle-off");
    button.children[0].classList.add("fa-toggle-on");*/
    button.children[0].classList.remove("fa-play");
    button.children[0].classList.add("fa-stop");

    createGeoData()
    .then(geoDataT => mapReplacements(geoData, geoDataT))
    .then(generateTiles)
    .then(geoDataT => addPath(geoDataT, "gpx/lac-blanc-via-lac-cornu-et-lac-noir.gpx"))
    .then(geoDataT => displayPath(geoDataT, 0))
    .then(movePOV)
    .then(geoDataT => {
        clone = button.cloneNode(true);
        clone.addEventListener("click", evt => stopTutorial(geoData, geoDataT));
        button.parentNode.replaceChild(clone, button);

        return geoDataT;
    })
    .then(replaceListeners)
    .then(tutorialSpecificities)
    .catch(console.error)
}

function stopTutorial(geoData, geoDataT) {
    console.log("Fin du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Lance un tutoriel";
    /*button.children[0].classList.remove("fa-toggle-on");
    button.children[0].classList.add("fa-toggle-off");*/
    button.children[0].classList.remove("fa-stop");
    button.children[0].classList.add("fa-play");

    tutorialSpecificitiesRemove();
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

function tutorialSpecificities(geoData) {
    let titles = [];
    Array.from($('[data-toggle="popover"]')).forEach(button => {
        titles.push(button.title);
    });

    $('[data-toggle="popover"]').popover("enable");
    Array.from($('[data-toggle="popover"]')).forEach( (button, i) => {
        button.title = titles[i];
    });

    return geoData;
}

function tutorialSpecificitiesRemove() {
    $('[data-toggle="popover"]').popover('hide');
    $('[data-toggle="popover"]').popover('disable');
}
