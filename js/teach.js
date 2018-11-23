function setUpPopovers(geoData) {
    let movePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Une fois affiché, déplacer votre souris tout en restant appuyé sur un point pour le déplacer.`;
    let addPointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Ajoutez un point à la fin de la trace en cliquant à l'endroit souhaité.`;
    let deletePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Il vous suffit de cliquer ensuite sur un point affiché pour le supprimer.`;

	document.getElementById("moveMap").setAttribute("data-content", "OMG !");
	document.getElementById("movePoint").setAttribute("data-content", movePointDesc);
	/*document.getElementById("undo").setAttribute("data-content", "OMG !");
	document.getElementById("redo").setAttribute("data-content", "OMG !");*/
	document.getElementById("addPoint").setAttribute("data-content", addPointDesc);
	document.getElementById("deletePoint").setAttribute("data-content", deletePointDesc);
	document.getElementById("link").setAttribute("data-content", "OMG !");
	document.getElementById("unlink").setAttribute("data-content", "OMG !");
	document.getElementById("samplingFactor").setAttribute("data-content", "OMG !");
	document.getElementById("reSample").setAttribute("data-content", "OMG !");
	document.getElementById("print").setAttribute("data-content", "OMG !");
	document.getElementById("saveButton").setAttribute("data-content", "OMG !");
	document.getElementById("infos").setAttribute("data-content", "OMG !");

	return geoData;
}

function activatePopover(id) {
    let realId = '#' + id;
    $(realId).popover('show');
    $(realId).popover('disable');
}

function desactivatePopover(id) {
    let realId = '#' + id;
    $(realId).popover('hide');
    $(realId).popover('disable');
}

function teach() {
    let button = document.getElementById("tutorialButton");
    activatePopover("movePoint");
    button.addEventListener("movePoint", () => {
        desactivatePopover("movePoint");
        activatePopover("addPoint");
        button.addEventListener("addPoint", () => {
            desactivatePopover("addPoint");
            activatePopover("deletePoint");
            button.addEventListener("deletePoint", () => {
                desactivatePopover("deletePoint");
            });
        });
    });
}
