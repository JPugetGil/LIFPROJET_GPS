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

    mapOriginals(geoData, geoDataT);
    replaceListeners(geoData);
    movePOV(geoData);
    setFocusClass(geoData);

    clone = button.cloneNode(true);
    clone.addEventListener("click", evt => launchTutorial(geoData));
    button.parentNode.replaceChild(clone, button);
}

function mapReplacements(geoData, geoDataT) {
    geoDataT.map = geoData.map;
    geoData.layersControl.remove();
    geoDataT.layersControl = L.control.layers(null, null, {position: "topleft"}).addTo(geoData.map);

    return geoDataT;
}

function mapOriginals(geoData, geoDataT) {
    geoDataT.layersControl.remove();
    geoData.layersControl.addTo(geoData.map);
}

function createClone(element) {
    element.parentNode.replaceChild(element.cloneNode(true), element);
}

function replaceListeners(geoData) {
    Array.from(document.querySelectorAll("#features button")).forEach(button => {
        createClone(button);
    });
    createClone(document.getElementById("samplingFactor"));
    return setListeners(geoData);
}
