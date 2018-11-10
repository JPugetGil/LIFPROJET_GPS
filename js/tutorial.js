// Tutorial functions

function launchTutorial(geoData) {
    console.log("Début du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Stop le tutoriel";
    /*button.children[0].classList.remove("fa-toggle-off");
    button.children[0].classList.add("fa-toggle-on");*/
    button.children[0].classList.remove("fa-play");
    button.children[0].classList.add("fa-stop");

    /*createGeoData()
    .then(geoData => addPath(geoData, "data/lac-blanc-via-lac-cornu-et-lac-noir.gpx"))
    .then(geoData => displayPath(geoData,0))
    .then(movePOV)
    .then(console.log)
    .catch(console.error)*/

    clone = button.cloneNode(true);
    clone.addEventListener("click", evt => stopTutorial(geoData));
    button.parentNode.replaceChild(clone, button);
}

function stopTutorial(geoData) {
    console.log("Fin du tutoriel");
    let button = document.getElementById("tutorialButton");
    button.title = "Lance un tutoriel";
    /*button.children[0].classList.remove("fa-toggle-on");
    button.children[0].classList.add("fa-toggle-off");*/
    button.children[0].classList.remove("fa-stop");
    button.children[0].classList.add("fa-play");

    clone = button.cloneNode(true);
    clone.addEventListener("click", evt => launchTutorial(geoData));
    button.parentNode.replaceChild(clone, button);
}
/*
function emptyGeoData(geoData) {

    geoData.focus = undefined;
    geoData.layers.forEach(layer => {
        geoData.map.removeLayer(layer);
    });
}*/
