function setUpPopovers(geoData) {
	document.getElementById("moveMap").setAttribute("data-content", "OMG !");
	document.getElementById("movePoint").setAttribute("data-content", "OMG !");
	/*document.getElementById("undo").setAttribute("data-content", "OMG !");
	document.getElementById("redo").setAttribute("data-content", "OMG !");*/
	document.getElementById("addPoint").setAttribute("data-content", "OMG !");
	document.getElementById("deletePoint").setAttribute("data-content", "OMG !");
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
    activatePopover("deletePoint");
    activatePopover("movePoint");
    desactivatePopover("movePoint");
}
