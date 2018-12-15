function setUpPopovers(geoData) {
    let moveMapDesc = `Ce bouton vous permet de revenir dans un mode où vous ne pouvez pas modifier la trace.
        Idéal pour simplement explorer la carte.`;
    let movePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Une fois affiché, déplacer votre souris tout en restant appuyé sur un point pour le déplacer.`;
    let undoDesc = `Vous pouvez utiliser ce bouton pour annulez une action.`;
    let redoDesc = `Si vous avez annulé une action et souhaitez finalement y revenir,
        vous pouvez utiliser ce bouton.`;
    let addPointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Ajoutez un point à la fin de la trace en cliquant à l'endroit souhaité.`;
    let deletePointDesc = `Pour activer le mode, appuyez sur ce bouton.
        Faites un clic droit pour afficher les points près de votre souris.
        Il vous suffit de cliquer ensuite sur un point affiché pour le supprimer.`;
    let linkDesc = `Utilisez ce bouton pour lier ensemble deux traces.`;
    let unlinkDesc = `Utilisez ce bouton pour séparer une trace en deux.
        Faites un clic droit pour afficher les points près de votre souris.
        Vous pourrez ensuite cliquer sur un des points affichés pour séparer la trace à son niveau.`;
    let sampleDesc = `Cette fonctionnalité vous permet de rééchantilloner votre trace, c'est-à-dire réduire son nombre de points.
        Pour cela, inscrivez dans le champ le nombre de points que vous souhaitez enlever. Puis appuyez sur le bouton juste en dessous ou clickez sur Entrée.`;
    let printDesc = `Vous pouvez imprimer le visuel de la page grâce à ce bouton.`;
    let saveDesc = `Vous pouvez télécharger la trace sous forme de fichier '.gpx',
        toutes vos modifications seront présentes dans le nouveau fichier.`;
    let infosDesc = `Cliquez sur ce bouton pour afficher/désafficher des informations sur la trace.`;

	document.getElementById("moveMap").setAttribute("data-content", moveMapDesc);
	document.getElementById("movePoint").setAttribute("data-content", movePointDesc);
	document.getElementById("undo").setAttribute("data-content", undoDesc); 
	document.getElementById("redo").setAttribute("data-content", redoDesc); 
	document.getElementById("addPoint").setAttribute("data-content", addPointDesc);
	document.getElementById("deletePoint").setAttribute("data-content", deletePointDesc);
	document.getElementById("link").setAttribute("data-content", linkDesc);
	document.getElementById("unlink").setAttribute("data-content", unlinkDesc);
	document.getElementById("samplingFactor").setAttribute("data-content", sampleDesc);
	document.getElementById("print").setAttribute("data-content", printDesc);
	document.getElementById("saveButton").setAttribute("data-content", saveDesc);
	document.getElementById("infos").setAttribute("data-content", infosDesc);

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

function teachPart(id = "infos") {
    if (id !== "") {
        // Next id to activate
        let nextId;
        switch (id) {
            case "infos":
                nextId = "movePoint";
                break;
            case "movePoint":
                nextId = "addPoint";
                break;
            case "addPoint":
                nextId = "deletePoint";
                break;
            case "deletePoint":
                nextId = "unlink";
                break;
            case "unlink":
                nextId = "link";
                break;
            case "link":
                nextId = "samplingFactor";
                break;
            case "samplingFactor":
                nextId = "undo";
                break;
            case "undo":
                nextId = "redo";
                break;
            case "redo":
                nextId = "saveButton";
                break;
            case "saveButton":
                nextId = "print";
                break;
            case "print":
                nextId = "";
                break;
            default:
                nextId = "";
        }

        // Current execution
        activatePopover(id);
        document.getElementById("tutorialButton").addEventListener(id, () => {
            desactivatePopover(id);
            teachPart(nextId);
        });
    }
}

function teach(geoData) {
    teachPart();
    return geoData;
}
